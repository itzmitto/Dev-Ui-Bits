import { test,expect } from '@playwright/test';
const entries=[['text-loop','TextLoop'],['masked-heading','MaskedHeading'],['particle-text','ParticleText'],['split-flap-text','SplitFlapText'],['warp-text','WarpText']] as const;
for(const [slug,source] of entries){
 test(`${slug}: real animation, controls, presets, reset, restart and complete source editor`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`/text-animations/${slug}`);
  await expect(page.locator('.component-link.active')).toHaveAttribute('data-status','ready');await expect(page.getByTestId('preview-device')).toBeVisible();
  const stage=page.locator('.preview-device');await expect(stage.locator('canvas,svg,.flap-tile').first()).toBeVisible();
  if(slug==='text-loop'){const target=stage.locator('textPath').first();const before=await target.getAttribute('startOffset');await expect.poll(()=>target.getAttribute('startOffset')).not.toBe(before);await page.getByLabel('Shape',{exact:true}).selectOption('circle');await expect(stage.locator('defs path')).toHaveAttribute('d',/ a /);}
  if(slug==='particle-text'){await expect.poll(()=>stage.locator('canvas').getAttribute('data-particle-count')).not.toBe('0');const before=await stage.locator('canvas').evaluate((c:HTMLCanvasElement)=>c.toDataURL());await expect.poll(()=>stage.locator('canvas').evaluate((c:HTMLCanvasElement)=>c.toDataURL())).not.toBe(before);}
  if(slug==='split-flap-text'){await expect(stage.locator('.flap-tile')).toHaveCount(12);const upper=stage.locator('.flap-falling-top').first();const before=await upper.getAttribute('style');await expect.poll(()=>upper.getAttribute('style')).not.toBe(before);await page.getByLabel('Single Text Override',{exact:true}).fill('DEVUI READY');await expect(stage.locator('.split-flap-text')).toHaveAttribute('aria-label','DEVUI READY');}
  if(slug==='warp-text'){await expect(stage.locator('.warp-fallback')).toHaveCount(0);const before=await stage.locator('canvas').evaluate((c:HTMLCanvasElement)=>c.toDataURL());await stage.locator('canvas').click();await expect.poll(()=>stage.locator('canvas').evaluate((c:HTMLCanvasElement)=>c.toDataURL())).not.toBe(before);}
  if(slug==='masked-heading'){const c=stage.locator('canvas');await expect.poll(()=>c.evaluate((c:HTMLCanvasElement)=>Array.from(c.getContext('2d')!.getImageData(0,0,c.width,c.height).data).filter((v,i)=>i%4===3&&v>0).length)).toBeGreaterThan(100);}
  const textInput=page.getByLabel(slug==='split-flap-text'?'Single Text Override':'Text',{exact:true});await textInput.fill('DevUI test');
  await expect(stage.locator('[role=img]').first()).toHaveAttribute('aria-label',slug==='split-flap-text'?'DEVUI TEST':'DevUI test');
  const preset=page.getByLabel('Preset',{exact:true}),options=await preset.locator('option').allTextContents();for(const name of options.slice(1)){await preset.selectOption(name);await expect(preset).toHaveValue(name);}
  await page.getByRole('button',{name:'Reset',exact:true}).click();await page.getByRole('button',{name:'Restart animation',exact:true}).click();await expect(stage.locator('canvas,svg,.flap-tile').first()).toBeVisible();
  await page.getByRole('tab',{name:'Code',exact:true}).click();await expect(page.getByRole('button',{name:`${source}.tsx`,exact:true})).toBeVisible();await expect(page.getByRole('button',{name:`${source}.css`,exact:true})).toBeVisible();
  await page.getByRole('tab',{name:'Editor',exact:true}).click();const frame=page.frameLocator('iframe[title="Sandpack Preview"]');await expect(frame.locator(`.${slug} canvas,.${slug} svg,.${slug} .flap-tile`).first()).toBeVisible({timeout:45000});await expect(frame.locator('.warp-fallback')).toHaveCount(0);await expect(page.locator('.sp-error-message')).toHaveCount(0);
  await page.getByRole('tab',{name:'Preview',exact:true}).click();await page.reload();await expect(stage.locator('canvas,svg,.flap-tile').first()).toBeVisible();expect(errors).toEqual([]);
 });
}
for(const [width,height] of [[375,812],[430,932],[768,1024],[1366,768],[1440,900],[1920,1080],[2560,1440],[3440,1440]]){
 test(`batch one responsive ${width}: all five effects, themes and no overflow`,async({page})=>{
  await page.setViewportSize({width,height});
  for(const [slug] of entries){await page.goto(`/text-animations/${slug}`);const stage=page.getByTestId('preview-device');await expect(stage.locator('canvas,svg,.flap-tile').first()).toBeVisible();await page.waitForTimeout(400);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);const box=(await stage.boundingBox())!;expect(box.width).toBeLessThanOrEqual(width);await page.screenshot({path:`screenshots/phase6-${slug}-${width}-dark.png`});await page.getByRole('button',{name:'Switch to light theme'}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.getByRole('button',{name:'Switch to dark theme'}).click();}
 });
}
test('batch one reduced motion remains readable and repeated unmounting stays clean',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(let i=0;i<2;i++)for(const [slug] of entries){await page.goto(`/text-animations/${slug}`);await expect(page.getByTestId('preview-device').locator('[data-motion]').first()).toHaveAttribute('data-motion','reduced');}
 expect(errors).toEqual([]);
});
