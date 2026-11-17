// Public rendered demo/props only. Never downloads component source or assets.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,...process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{}});
await fs.mkdir('artifacts/references',{recursive:true});await fs.mkdir('screenshots',{recursive:true});
for(const slug of process.argv.slice(2)){
 const page=await browser.newPage({viewport:{width:1440,height:1000},colorScheme:'dark'});
 await page.goto(`https://reactbits.dev/text-animations/${slug}`);await page.locator('table').waitFor({timeout:30000});await page.evaluate(()=>document.fonts.ready);
 const data=await page.evaluate(()=>({title:document.querySelector('h1')?.textContent,props:Array.from(document.querySelectorAll('table tr')).map(row=>Array.from(row.querySelectorAll('td')).map(cell=>cell.textContent)),sliders:Array.from(document.querySelectorAll('[role=slider]')).map(e=>({label:e.getAttribute('aria-label'),value:e.getAttribute('aria-valuenow')})),inputs:Array.from(document.querySelectorAll('input[aria-label]')).map(e=>({label:e.getAttribute('aria-label'),value:e.value}))}));
 await page.screenshot({path:`screenshots/reference-${slug}-1440.png`});
 const preset=page.getByRole('button',{name:'Preset',exact:true});
 if(await preset.count()){
  const before=await page.getByRole('button').allTextContents();await preset.click();
  const after=await page.getByRole('button').allTextContents();data.presets=after.filter(label=>label.trim()&&!before.includes(label));
  if(data.presets.length){await page.getByRole('button',{name:data.presets.at(-1).trim(),exact:true}).last().click();await page.locator('h1').scrollIntoViewIfNeeded();await page.screenshot({path:`screenshots/reference-${slug}-preset-1440.png`});}
  else await page.keyboard.press('Escape');
 }
 await fs.writeFile(`artifacts/references/${slug}.json`,JSON.stringify(data,null,2));console.log(JSON.stringify(data));await page.close();
}
await browser.close();
