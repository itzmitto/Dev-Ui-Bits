import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH});
try{const page=await browser.newPage({viewport:{width:1440,height:1000}});for(const slug of ['crystalized-ball','electric-logo','dither-veil','glow-cursor','scroll-expand']){
 await page.goto('https://reactbits.dev/animations/'+slug);await page.locator('table').waitFor();await page.waitForTimeout(1500);const close=page.getByRole('button',{name:'Close announcement',exact:true});if(await close.isVisible()){await close.press('Enter');await page.waitForTimeout(1000);}
 if(slug==='glow-cursor'){await page.mouse.move(400,500);for(let i=0;i<25;i++){await page.mouse.move(420+i*20,500+Math.sin(i*.3)*110);await page.waitForTimeout(16);}await page.mouse.click(800,480);}
 if(slug==='scroll-expand'){await page.mouse.move(700,500);await page.mouse.wheel(0,400);await page.waitForTimeout(700);}
 if(slug==='crystalized-ball'){await page.mouse.move(850,540);await page.mouse.click(850,540);await page.waitForTimeout(250);}
 await page.screenshot({path:'screenshots/reference-'+slug+'-interaction.png'});
 const preset=page.getByRole('button',{name:'Preset',exact:true});if(await preset.count()){await preset.click();await fs.writeFile('artifacts/references/'+slug+'-menu.txt',await page.locator('body').ariaSnapshot());const buttons=page.getByRole('button');console.log(slug,(await buttons.allTextContents()).filter(x=>x.trim()));await page.keyboard.press('Escape');}
 }}finally{await browser.close();}