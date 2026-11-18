// Public rendered UI only: no source, stylesheet, network, registry or shader extraction.
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const reference=process.argv.includes('--reference'),base=process.env.PLAYWRIGHT_BASE_URL||'http://127.0.0.1:4175',out='artifacts/phase10';
await fs.mkdir(out,{recursive:true});const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined});
const records=[];
try{const page=await browser.newPage({viewport:{width:1440,height:1200}});page.setDefaultTimeout(15000);const screenshots=await page.context().newCDPSession(page);
 for(const slug of (process.argv.includes('--arc-only')?['arc-cursor']:process.argv.includes('--pigment-only')?['pigment-trail']:['arc-cursor','pigment-trail'])){
  await page.goto(reference?'https://pro.reactbits.dev/docs/components/'+slug:base+'/cursor-trails/'+slug,{waitUntil:'domcontentloaded'});
  if(reference){for(const [label,color]of [[slug==='arc-cursor'?'Arc color':'Ink A color','#5227ff'],[slug==='arc-cursor'?'Accent color':'Ink B color','#e0409a']]){const button=page.getByRole('button',{name:label,exact:true});if(await button.count()){await button.click();await page.getByLabel('Hex color',{exact:true}).fill(color);await page.getByLabel('Hex color',{exact:true}).press('Enter');await page.getByRole('heading',{name:slug==='arc-cursor'?'Arc Cursor':'Pigment Trail',exact:true}).click();}}}
  const el=page.locator(reference?'iframe[title="Preview"]':'.cursor-surface');await el.waitFor();await el.scrollIntoViewIfNeeded();await page.waitForTimeout(900);
  if(reference)await fs.writeFile(`${out}/${slug}-visible-public-properties.txt`,await page.locator('main').innerText());
  const capture=async name=>{const bounds=await el.boundingBox(),start=Date.now();const shot=await screenshots.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await fs.writeFile(`${out}/${slug}-${reference?'reference':'rebuilt'}-${name}.png`,Buffer.from(shot.data,'base64'));records.push({slug,capture:name,bounds,captureMs:Date.now()-start});};
  await capture('autoplay');
  await page.getByLabel('Autoplay',{exact:true}).uncheck();
  for(const background of ['dark','light']){
   if(reference){await page.getByRole('button',{name:'Background color',exact:true}).click();await page.getByLabel('Hex color',{exact:true}).fill(background==='light'?'#ffffff':'#120f17');await page.getByLabel('Hex color',{exact:true}).press('Enter');await page.getByRole('heading',{name:slug==='arc-cursor'?'Arc Cursor':'Pigment Trail',exact:true}).click();}
   else await page.getByLabel('Background',{exact:true}).fill(background==='light'?'#ffffff':'#120f17');
   for(const pattern of ['slow','fast','circle','zigzag','short']){
    await page.getByRole('button',{name:reference?'Refresh preview':'Restart animation',exact:true}).click();await el.scrollIntoViewIfNeeded();await page.waitForTimeout(120);const r=await el.boundingBox();records.push({slug,background,pattern,box:r});await page.mouse.move(10,65);await page.waitForTimeout(slug==='arc-cursor'?650:600);
    let pending;const count=pattern==='fast'?16:pattern==='short'?25:50;const started=Date.now();for(let i=0;i<count;i++){const t=i/(count-1);let x=.2+.6*t,y=.5;
     if(pattern==='circle'){x=.5+.2*Math.cos(t*Math.PI*2);y=.5+.28*Math.sin(t*Math.PI*2);}if(pattern==='zigzag')y=.5+.2*Math.sin(t*Math.PI*6);if(pattern==='short'){x=.5+.07*Math.sin(t*Math.PI*8);y=.5+.05*Math.cos(t*Math.PI*8);}
     await page.mouse.move(r.x+r.width*x,r.y+r.height*y);await page.waitForTimeout(pattern==='slow'?25:pattern==='fast'?2:12);if(i===Math.floor(count*.65))pending=capture(background+'-'+pattern);
    }
    if(pending)await pending;records.push({slug,background,pattern,durationMs:Date.now()-started});
    if(pattern==='slow'){await page.waitForTimeout(300);await capture(background+'-stop300');await page.waitForTimeout(850);await capture(background+'-stop1150');}
   }
   await el.scrollIntoViewIfNeeded();const b=await el.boundingBox();await page.mouse.move(b.x+b.width*.5,b.y+b.height*.5);for(let i=0;i<3;i++){await page.mouse.click(b.x+b.width*.5,b.y+b.height*.5);await page.waitForTimeout(40);}await capture(background+'-click');await page.mouse.move(10,65);await page.waitForTimeout(850);await capture(background+'-leave');
  }
  const pause=page.getByRole('switch',{name:'Paused',exact:true}).or(page.getByLabel('Paused',{exact:true}));await pause.first().check();await el.scrollIntoViewIfNeeded();await capture('pause');await pause.first().uncheck();
 }
 await fs.writeFile(`${out}/${reference?'reference':'rebuilt'}${process.argv.includes('--arc-only')?'-arc':process.argv.includes('--pigment-only')?'-pigment':''}-paths.json`,JSON.stringify(records,null,2));
}finally{await browser.close();}
