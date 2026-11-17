// Local indicative frame-work probe, not a hardware-independent FPS guarantee.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,...process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{}});
const page=await browser.newPage({viewport:{width:1440,height:1000},colorScheme:'dark'});
const results=[],errors=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
await fs.mkdir('screenshots',{recursive:true});
async function measure(slug){return page.evaluate(slug=>new Promise(resolve=>{
 const root=document.querySelector(`.preview-device .${slug}`);let changes=0,draws=0;
 const observer=new MutationObserver(()=>changes++);observer.observe(root,{subtree:true,attributes:true,attributeFilter:['transform','style','startOffset','stroke-dashoffset']});
 const clear=CanvasRenderingContext2D.prototype.clearRect,draw=WebGLRenderingContext.prototype.drawArrays;
 CanvasRenderingContext2D.prototype.clearRect=function(...args){if(root.contains(this.canvas))draws++;return clear.apply(this,args);};
 WebGLRenderingContext.prototype.drawArrays=function(...args){if(root.contains(this.canvas))draws++;return draw.apply(this,args);};
 const start=performance.now();setTimeout(()=>{observer.disconnect();CanvasRenderingContext2D.prototype.clearRect=clear;WebGLRenderingContext.prototype.drawArrays=draw;const elapsed=(performance.now()-start)/1000,frames=draws||changes;resolve({frames,elapsedSeconds:Number(elapsed.toFixed(3)),framesPerSecond:Number((frames/elapsed).toFixed(1))});},1500);
}),slug);}
try{
 for(const slug of ['text-loop','masked-heading','particle-text','warp-text','depth-text','circular-text']){
  await page.goto(`${process.env.PLAYWRIGHT_BASE_URL||'http://127.0.0.1:5173'}/text-animations/${slug}`);
  await page.locator(`.preview-device .${slug}`).waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2500);
  const visible=await measure(slug);const renderer=slug==='warp-text'?await page.locator('.warp-text canvas').evaluate(canvas=>{const gl=canvas.getContext('webgl');if(!gl)return 'unavailable';const info=gl.getExtension('WEBGL_debug_renderer_info');return gl.getParameter(info?info.UNMASKED_RENDERER_WEBGL:gl.RENDERER);}):undefined;await page.screenshot({path:`screenshots/phase6-${slug}-production.png`});await page.getByRole('heading',{name:'Make it yours',exact:true}).scrollIntoViewIfNeeded();await page.waitForTimeout(150);const offscreen=await measure(slug);results.push({slug,visible,offscreen,...renderer?{renderer}:{}});
 }
 await fs.mkdir('artifacts',{recursive:true});await fs.writeFile('artifacts/phase6-performance.json',JSON.stringify({viewport:'1440x1000',browser:'local Chromium headless',note:'Counts actual connected-canvas draws or batches of SVG/DOM attribute changes. Indicative, no global FPS or memory guarantee.',errors,results},null,2));console.log(JSON.stringify(results));
}finally{await browser.close();}
