import {describe,it,expect} from 'vitest';
import {readFileSync,readdirSync} from 'node:fs';
import {wrap,relative,coast,parseImages} from './effects/FlexCarousel.math';
import {flexImages} from './effects/flexImages';
import {flexDefaults,flexControls,flexPresets} from './effects/FlexCarousel.config';
import {findComponent, readyComponents, registry} from './registry';
import {builtinFiles} from './builtinFiles';
import type {FlexCarouselProps} from './effects/FlexCarousel';
import {flexVertex,flexFragment} from './effects/FlexCarousel.shader';
describe('owned Flex Carousel engine and delivery',()=>{
 it('wraps in both directions continuously, including repeated single-image slots',()=>{for(const x of [-100000,-101,-1,0,99,100001]){expect(wrap(x,100)).toBeGreaterThanOrEqual(0);expect(wrap(x,100)).toBeLessThan(100);expect(Math.abs(relative((x+.01)-x,100)-.01)).toBeLessThan(.00001);}expect(relative(99,100)).toBe(-1);});
 it('integrates time-based momentum consistently across frame rates',()=>{const one=coast(1000,1,.85);let sixty=1000;for(let i=0;i<60;i++)sixty=coast(sixty,1/60,.85);expect(sixty).toBeCloseTo(one,8);expect(coast(1000,.1,0)).toBeLessThan(coast(1000,.1,1));});
 it('accepts JSON image metadata, arrays and paths while rejecting unsafe links',()=>{expect(parseImages('[{"src":"/photo.png","href":"javascript:evil()"}]',flexImages)[0].href).toBeUndefined();expect(parseImages('/one.png, /two.png',flexImages)).toHaveLength(2);expect(parseImages('',flexImages)).toHaveLength(10);const api:FlexCarouselProps={images:flexImages};expect(parseImages(api.images,flexImages)).toHaveLength(10);expect(parseImages([{src:'data:image/png;base64,a',title:'A'}],flexImages)[0].title).toBe('A');});
 it('ships ten genuine PNGs with known dimensions and bounded storage',()=>{const files=readdirSync('public/images/flex-carousel').filter(x=>x.endsWith('.png'));expect(files).toHaveLength(10);let size=0;for(const file of files){const b=readFileSync('public/images/flex-carousel/'+file);expect([...b.subarray(0,8)]).toEqual([137,80,78,71,13,10,26,10]);expect(b.readUInt32BE(16)).toBe(900);expect(b.readUInt32BE(20)).toBe(1200);size+=b.length;}expect(size).toBeLessThan(8_000_000);});
 it('uses a unique record, complete presets and standalone transitive sources',()=>{for(const name of ['Circular Carousel','Depth Carousel','Bounce Cards','Drift Wall','Shape Waves','Aero Shards','Ghost Fibers','CRT Warp','Molten Metal'])expect(registry.find(x=>x.name===name)?.status).toBe('planned');expect(registry).toHaveLength(246);expect(readyComponents).toHaveLength(63);const c=findComponent('components','flex-carousel');expect(c?.status).toBe('ready');if(c?.status!=='ready')throw Error('Missing component');const files=builtinFiles(c,c.defaults);for(const key of ['FlexCarousel.math.ts','FlexCarousel.shader.ts','flexImages.ts','textRuntime.ts','animationCanvas.ts','textCanvas.ts'])expect(files['/effects/'+key]).toBeTruthy();for(const preset of Object.values(flexPresets))for(const control of flexControls)expect(control.key in preset).toBe(true);expect(Object.keys(flexDefaults)).toHaveLength(flexControls.length);});
 it('deforms geometry and samples chromatic refraction rather than masking opacity alone',()=>{expect(flexVertex).toContain('p.y-=signX*bend');expect(flexFragment).toContain('texture2D(image,st+split)');expect(flexFragment).toContain('st.x+=');});
});
