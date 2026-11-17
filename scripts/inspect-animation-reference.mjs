// Public rendered demo/props only. Never downloads component source or assets.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,...process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{}});
await fs.mkdir('artifacts/references',{recursive:true});await fs.mkdir('screenshots',{recursive:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:'dark'});
try{for(const slug of process.argv.slice(2)){
 const page=await context.newPage();
 await page.goto(`https://reactbits.dev/animations/${slug}`);await page.locator('table').waitFor({timeout:30000});await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(3200);const announcement=page.getByRole('button',{name:'Close announcement',exact:true});if(await announcement.isVisible()){await announcement.press('Enter');await page.locator('.announcement-modal-backdrop').waitFor({state:'hidden',timeout:4000}).catch(()=>{});}
 const data=await page.evaluate(()=>({title:document.querySelector('h1')?.textContent,props:Array.from(document.querySelectorAll('table tr')).map(row=>Array.from(row.querySelectorAll('td')).map(cell=>cell.textContent)),sliders:Array.from(document.querySelectorAll('[role=slider]')).map(e=>({label:e.getAttribute('aria-label'),value:e.getAttribute('aria-valuenow')})),inputs:Array.from(document.querySelectorAll('input[aria-label]')).map(e=>({label:e.getAttribute('aria-label'),value:e.value}))}));
 await page.mouse.move(800,350);await page.waitForTimeout(1200);await page.screenshot({path:`screenshots/reference-${slug}-1440.png`}); data.buttons=await page.getByRole('button').allTextContents();
 const preset=page.getByRole('button',{name:'Preset',exact:true});
 if(await preset.count()){try{
  const before=await page.getByRole('button').allTextContents();try{await preset.click({timeout:3000});}catch{await page.keyboard.press('Escape');const close=page.getByRole('button',{name:/close|dismiss/i});if(await close.count())await close.first().click({timeout:2500}).catch(()=>{});await preset.click({timeout:5000});}
  const after=await page.getByRole('button').allTextContents();data.presets=after.filter(label=>label.trim()&&!before.includes(label));
  if(data.presets.length){await page.getByRole('button',{name:data.presets.at(-1).trim(),exact:true}).last().click();await page.locator('h1').first().scrollIntoViewIfNeeded();await page.screenshot({path:`screenshots/reference-${slug}-preset-1440.png`});}
  else await page.keyboard.press('Escape');
 }catch(error){data.interactionIssue=error.message.split('\n')[0];}
 }
 await fs.writeFile(`artifacts/references/${slug}.json`,JSON.stringify(data,null,2));console.log(JSON.stringify(data));await page.close();
}}finally{await browser.close();}
