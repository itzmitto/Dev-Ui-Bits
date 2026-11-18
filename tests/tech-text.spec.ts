import fs from 'node:fs/promises';
import { test,expect,type Page,type Locator } from '@playwright/test';
const route='/text-animations/tech-text';
const canvas=(page:Page)=>page.locator('.preview-device .tech-text canvas');
async function open(page:Page){await page.goto(route);await expect(canvas(page)).toHaveAttribute('data-glyphs',/"char":"D"/);}
async function still(page:Page){await page.getByRole('switch',{name:'Sweep',exact:true}).uncheck();await page.getByLabel('Specks',{exact:true}).fill('0');}
async function inkPoint(c:Locator,index=0){
 await c.scrollIntoViewIfNeeded();
 return c.evaluate((el:HTMLCanvasElement,index)=>{
  const glyphs=JSON.parse(el.dataset.glyphs!),g=glyphs[index],rect=el.getBoundingClientRect(),scale=el.width/rect.width;
  const ctx=el.getContext('2d')!,pixels=ctx.getImageData(0,0,el.width,el.height).data;
  for(let y=Math.floor(g.y+g.height*.35);y<g.y+g.height*.7;y++)for(let x=Math.floor(g.x+2);x<g.x+g.width-2;x++){
    const i=(Math.floor(y*scale)*el.width+Math.floor(x*scale))*4;
    if(pixels[i+3]>230&&pixels[i]>180)return {x:rect.x+x,y:rect.y+y,localX:x,localY:y};
  }
  throw new Error('No real filled glyph pixel found');
 },index);
}
async function hoverPoint(page:Page,c:Locator,point:{localX:number;localY:number}){await c.scrollIntoViewIfNeeded();const rect=(await c.boundingBox())!;await page.mouse.move(rect.x+point.localX,rect.y+point.localY);}
async function settle(c:Locator){let previous='';await expect.poll(async()=>{const next=await c.evaluate((el:HTMLCanvasElement)=>el.toDataURL());const stable=next===previous;previous=next;return stable;}).toBe(true);}
async function ink(c:Locator,index=0){return c.evaluate((el:HTMLCanvasElement,index)=>{
 const g=JSON.parse(el.dataset.glyphs!)[index],scale=el.width/el.getBoundingClientRect().width;
 const pixels=el.getContext('2d')!.getImageData(Math.round(g.x*scale),Math.round(g.y*scale),Math.round(g.width*scale),Math.round(g.height*scale)).data;
 let total=0;for(let i=3;i<pixels.length;i+=4)total+=pixels[i];return total;
},index);}

test('exact defaults, real pixels, font measurements, text, font family, spacing, alignment and colors update without replacing canvas',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await open(page);await still(page);
 const c=canvas(page);await expect(c).toHaveAttribute('aria-label','DevUI Bits');await expect(page.getByLabel('Font Weight',{exact:true})).toHaveValue('600');
 await expect(c).toHaveAttribute('data-font-size','150.000');const original=await ink(c);
 await c.evaluate(el=>el.setAttribute('data-instance','original'));
 await page.getByLabel('Font Size',{exact:true}).fill('100');await expect(c).toHaveAttribute('data-font-size','100.000');expect(await ink(c)).toBeLessThan(original*.6);
 await page.getByLabel('Text',{exact:true}).fill('Precision');await expect(c).toHaveAttribute('aria-label','Precision');await expect(c).toHaveAttribute('data-glyphs',/"char":"P"/);
 const before=await c.getAttribute('data-glyphs');await page.getByLabel('Font Family',{exact:true}).fill('monospace');await expect(c).not.toHaveAttribute('data-glyphs',before!);
 const spacing=await c.getAttribute('data-glyphs');await page.getByLabel('Letter Spacing',{exact:true}).fill('0.1');await expect(c).not.toHaveAttribute('data-glyphs',spacing!);
 await page.getByLabel('Alignment',{exact:true}).selectOption('left');await expect.poll(()=>c.evaluate(el=>JSON.parse((el as HTMLCanvasElement).dataset.glyphs!)[0].x)).toBeLessThan(45);
 await page.getByLabel('Text Color',{exact:true}).fill('#ff3344');await c.scrollIntoViewIfNeeded();await page.mouse.move(0,0);await expect.poll(()=>c.evaluate((el:HTMLCanvasElement)=>{const data=el.getContext('2d')!.getImageData(0,0,el.width,el.height).data;let count=0;for(let i=0;i<data.length;i+=4)if(data[i]>230&&data[i+1]<80&&data[i+3]>200)count++;return count;})).toBeGreaterThan(100);
 await page.getByRole('button',{name:'Inherit Text Color',exact:true}).click();await expect(page.getByRole('button',{name:'Inherit Text Color'})).toHaveAttribute('aria-pressed','true');
 await expect(c).toHaveAttribute('data-instance','original');expect(errors).toEqual([]);
});

test('letter reveal traces a dashed silhouette, changes to solid and area reveal blends an actual region',async({page})=>{
 await open(page);await still(page);const c=canvas(page),point=await inkPoint(c),full=await ink(c);
 await hoverPoint(page,c,point);await expect(c).toHaveAttribute('data-active-letter','D');
 await expect.poll(()=>ink(c)).toBeLessThan(full*.35);
 await settle(c);const dashed=await ink(c);await page.getByLabel('Line Style',{exact:true}).selectOption('solid');await hoverPoint(page,c,point);
 await settle(c);expect(await ink(c)).toBeGreaterThan(dashed*1.1);
 await page.getByLabel('Reveal Mode',{exact:true}).selectOption('off');await hoverPoint(page,c,point);await expect.poll(()=>ink(c)).toBeGreaterThan(full*.97);
 await page.getByLabel('Reveal Mode',{exact:true}).selectOption('area');await page.getByLabel('Reach',{exact:true}).fill('40');await page.getByLabel('Softness',{exact:true}).fill('0.7');await hoverPoint(page,c,point);
 await expect.poll(()=>ink(c)).toBeLessThan(full*.95);expect(await ink(c)).toBeGreaterThan(full*.35);
 await page.screenshot({path:'screenshots/phase5-tech-area.png'});
});

test('drag capture moves a real letter, release springs home, click kick and disabled switches behave correctly',async({page})=>{
 await open(page);await still(page);await page.getByLabel('Reveal Mode',{exact:true}).selectOption('off');
 await page.getByRole('switch',{name:'Selection',exact:true}).uncheck();await page.getByRole('switch',{name:'Labels',exact:true}).uncheck();
 const c=canvas(page),point=await inkPoint(c),full=await ink(c);
 await hoverPoint(page,c,point);await page.mouse.down();await page.mouse.move(point.x+70,point.y-85,{steps:8});await expect(c).toHaveAttribute('data-dragging','true');
 expect(await ink(c)).toBeLessThan(full*.6);await page.screenshot({path:'screenshots/phase5-tech-drag.png'});
 await page.mouse.up();await page.mouse.move(10,10);await expect(c).toHaveAttribute('data-dragging','false');await expect.poll(()=>ink(c),{timeout:8000}).toBeGreaterThan(full*.99);
 const home=await inkPoint(c);await page.mouse.click(home.x,home.y);await expect.poll(()=>ink(c)).toBeLessThan(full*.95);await page.mouse.move(10,10);await expect.poll(()=>ink(c),{timeout:8000}).toBeGreaterThan(full*.99);
 await page.getByRole('switch',{name:'Click Kick',exact:true}).uncheck();await page.getByRole('switch',{name:'Draggable',exact:true}).uncheck();
 await page.mouse.move(home.x,home.y);await page.mouse.down();await page.mouse.move(home.x+70,home.y-80);await page.mouse.up();expect(await ink(c)).toBeGreaterThan(full*.99);await expect(c).toHaveAttribute('data-dragging','false');
});

test('presets apply complete settings and Reset restores the precise defaults',async({page})=>{
 await open(page);
 for(const name of ['Vector','Blueprint','Minimal','Interactive']){
  await page.getByLabel('Preset',{exact:true}).selectOption(name);await expect(page.getByLabel('Preset',{exact:true})).toHaveValue(name);
  if(name==='Blueprint'){await expect(page.getByLabel('Accent Color',{exact:true})).toHaveValue('#60a5fa');await expect(page.getByRole('switch',{name:'Guides',exact:true})).toBeChecked();}
  if(name==='Minimal'){await expect(page.getByLabel('Specks',{exact:true})).toHaveValue('0');await expect(page.getByRole('switch',{name:'Labels',exact:true})).not.toBeChecked();await expect(page.getByRole('switch',{name:'Guides',exact:true})).not.toBeChecked();}
  if(name==='Interactive'){await expect(page.getByLabel('Bounce',{exact:true})).toHaveValue('0.75');await expect(page.getByRole('switch',{name:'Draggable',exact:true})).toBeChecked();}
 }
 await page.getByRole('button',{name:'Reset',exact:true}).click();await expect(page.getByLabel('Text',{exact:true})).toHaveValue('DevUI Bits');await expect(page.getByLabel('Font Size',{exact:true})).toHaveValue('150');await expect(page.getByLabel('Bounce',{exact:true})).toHaveValue('0.4');await expect(page.getByLabel('Specks',{exact:true})).toHaveValue('15');await expect(page.getByRole('button',{name:'Inherit Accent Color'})).toHaveAttribute('aria-pressed','true');
});

test('type, assemble and metrics have distinct intros and Restart plays the selected intro again',async({page})=>{
 await open(page);await still(page);await page.getByLabel('Intro Duration',{exact:true}).fill('3');const captures:string[]=[];
 for(const intro of ['type','assemble','metrics']){
  await page.getByLabel('Intro Type',{exact:true}).selectOption(intro);await expect(canvas(page)).toHaveAttribute('data-intro',intro);
  await expect.poll(()=>canvas(page).evaluate(el=>Number((el as HTMLCanvasElement).dataset.introProgress))).toBeGreaterThan(.18);
  captures.push(await canvas(page).evaluate((el:HTMLCanvasElement)=>el.toDataURL()));await page.screenshot({path:`screenshots/phase5-tech-intro-${intro}.png`});
  await expect(canvas(page)).toHaveAttribute('data-intro-progress','1.000',{timeout:8000});
  await page.getByRole('button',{name:'Restart animation',exact:true}).click();await expect.poll(()=>canvas(page).evaluate(el=>Number((el as HTMLCanvasElement).dataset.introProgress))).toBeLessThan(.5);
 }
 expect(new Set(captures).size).toBe(3);
});

test('keyboard selection works and reduced motion settles while preserving pointer interactions',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await open(page);const c=canvas(page);
 const initial=await c.evaluate((el:HTMLCanvasElement)=>el.toDataURL());await page.waitForTimeout(250);expect(await c.evaluate((el:HTMLCanvasElement)=>el.toDataURL())).toBe(initial);
 await c.focus();await page.keyboard.press('ArrowRight');await expect(c).toHaveAttribute('data-active-letter','D');await page.keyboard.press('ArrowRight');await expect(c).toHaveAttribute('data-active-letter','e');await page.keyboard.press('Enter');
 await page.getByLabel('Intro Type',{exact:true}).selectOption('assemble');await expect(c).toHaveAttribute('data-intro-progress','1.000');
});

test('animation loop pauses outside view and when idle, while the active sweep runs smoothly',async({page})=>{
 await page.addInitScript(()=>{
  const original=CanvasRenderingContext2D.prototype.clearRect;
  Object.assign(window,{techDraws:0});
  CanvasRenderingContext2D.prototype.clearRect=function(...args){if(this.canvas instanceof HTMLCanvasElement&&this.canvas.matches('.tech-text canvas')){const w=window as unknown as {techDraws:number};w.techDraws++;}return original.apply(this,args);};
 });
 await open(page);await canvas(page).scrollIntoViewIfNeeded();await page.mouse.move(0,0);
 const frames=()=>page.evaluate(()=>(window as unknown as {techDraws:number}).techDraws);
 const start=await frames(),time=Date.now();await page.waitForTimeout(1000);const fps=(await frames()-start)*1000/(Date.now()-time);expect(fps).toBeGreaterThan(20);
 await page.getByRole('heading',{name:'Properties',exact:true}).scrollIntoViewIfNeeded();await page.waitForTimeout(250);const hidden=await frames();await page.waitForTimeout(300);expect(await frames()).toBe(hidden);
 await still(page);await canvas(page).scrollIntoViewIfNeeded();await page.mouse.move(0,0);await settle(canvas(page));const idle=await frames();await page.waitForTimeout(300);expect(await frames()).toBe(idle);
 await fs.mkdir('artifacts',{recursive:true});await fs.writeFile('artifacts/tech-text-performance.json',JSON.stringify({sample:'Chromium headless, 1536×1024, default sweep',fps,hiddenDraws:0,idleDraws:0},null,2));
 for(let index=0;index<4;index++){await page.goto('/text-animations/blur-text');await open(page);}await expect(canvas(page)).toHaveCount(1);
});

test('real TypeScript, CSS and helpers compile in Sandpack and edits stay isolated from the source',async({page})=>{
 await open(page);await page.getByRole('tab',{name:'Code',exact:true}).click();
 for(const name of ['TechText.tsx','TechText.engine.ts','TechText.geometry.ts','TechText.types.ts','TechText.css'])await expect(page.getByRole('button',{name,exact:true})).toBeVisible();
 await page.getByRole('button',{name:'TechText.engine.ts',exact:true}).click();await expect(page.locator('.code-documentation .code-viewer').last()).toContainText('class TechTextEngine');
 await page.getByRole('tab',{name:'Editor',exact:true}).click();
 const frame=page.frameLocator('iframe[title="Sandpack Preview"]');await expect(frame.locator('.tech-text canvas')).toHaveAttribute('aria-label','DevUI Bits',{timeout:45000});
 await expect(page.getByText('Dependencies',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'TechText.tsx',exact:true}).click();const editor=page.locator('.cm-content[contenteditable=true]').first();await editor.click();await page.keyboard.press('ControlOrMeta+a');await page.keyboard.insertText('export function TechText(){return <h1>Isolated edit</h1>}');
 await expect(frame.getByRole('heading',{name:'Isolated edit'})).toBeVisible({timeout:20000});
 await editor.click();await page.keyboard.press('ControlOrMeta+a');await page.keyboard.insertText('export function TechText( {');await expect(page.locator('.sp-error-message').first()).toBeVisible({timeout:20000});
 await page.getByRole('button',{name:'Reset',exact:true}).click();await expect(frame.locator('.tech-text canvas')).toHaveAttribute('aria-label','DevUI Bits',{timeout:20000});
 await page.getByRole('tab',{name:'Preview',exact:true}).click();await expect(canvas(page)).toHaveAttribute('aria-label','DevUI Bits');await page.reload();await expect(canvas(page)).toHaveAttribute('aria-label','DevUI Bits');
});

for(const [width,height] of [[375,812],[768,1024],[1440,900],[1920,1080],[2560,1440]])for(const theme of ['dark','light']){
 test(`Tech Text fits ${width}px ${theme}, viewport controls, fullscreen, theme and deep refresh`,async({page})=>{
  await page.setViewportSize({width,height});await page.addInitScript(theme=>localStorage.setItem('devui-theme',theme),theme);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await open(page);await still(page);
  const c=canvas(page);await page.evaluate(()=>document.fonts.ready);await expect(page.locator('.component-link.active')).toHaveAttribute('data-status','ready');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const fit=await c.evaluate((el:HTMLCanvasElement)=>{const rect=el.getBoundingClientRect(),glyphs=JSON.parse(el.dataset.glyphs!);return glyphs.every((g:{x:number;y:number;width:number;height:number})=>g.x>=0&&g.y>=0&&g.x+g.width<=rect.width&&g.y+g.height<=rect.height);});expect(fit).toBe(true);
  const point=await inkPoint(c);await hoverPoint(page,c,point);await expect(c).toHaveAttribute('data-active-letter','D');await page.waitForTimeout(250);await page.screenshot({path:`screenshots/phase5-tech-${width}-${theme}.png`});
  await page.getByRole('button',{name:'Mobile viewport',exact:true}).click();await expect.poll(async()=>(await page.getByTestId('preview-device').boundingBox())!.width).toBeLessThanOrEqual(375);
  await page.getByRole('button',{name:'Tablet viewport',exact:true}).click();await expect.poll(async()=>(await page.getByTestId('preview-device').boundingBox())!.width).toBeLessThanOrEqual(768);
  await page.getByRole('button',{name:'Fullscreen preview',exact:true}).click();await expect(page.locator('.fullscreen-preview')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('.fullscreen-preview')).toHaveCount(0);
  await page.getByRole('button',{name:`Switch to ${theme==='dark'?'light':'dark'} theme`}).click();await expect(c).toHaveAttribute('aria-label','DevUI Bits');await page.reload();await expect(c).toHaveAttribute('aria-label','DevUI Bits');expect(errors).toEqual([]);
 });
}


test.describe('HiDPI touch preview',()=>{
 test.use({viewport:{width:375,height:812},deviceScaleFactor:3,isMobile:true,hasTouch:true});
 test('caps DPR and responds to a real touch tap',async({page})=>{
  await open(page);await still(page);await page.getByLabel('Reveal Mode',{exact:true}).selectOption('off');await page.getByRole('switch',{name:'Selection',exact:true}).uncheck();await page.getByRole('switch',{name:'Labels',exact:true}).uncheck();
  const c=canvas(page),point=await inkPoint(c),initial=await ink(c);
  const ratio=await c.evaluate((el:HTMLCanvasElement)=>el.width/el.getBoundingClientRect().width);expect(ratio).toBeCloseTo(2,1);
  await page.touchscreen.tap(point.x,point.y);await expect.poll(()=>ink(c)).toBeLessThan(initial*.95);await expect(c).toHaveAttribute('data-dragging','false');
 });
});
