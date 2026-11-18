import {describe,it,expect} from 'vitest';
import {paperNoise,brushPressure,pigmentMix} from './effects/pigmentBrush';
import {fadeInk,followAlpha} from './effects/paintCursorRuntime';
import {registry,findComponent,builtinFiles} from './registry';
import {cursorTrails} from './effects/cursorTrails.config';
describe('Arc / Pigment rebuild',()=>{
 it('retains all existing records and routes',()=>{expect(registry).toHaveLength(246);expect(registry.filter(c=>c.status==='ready')).toHaveLength(58);for(const slug of ['arc-cursor','pigment-trail'])expect(registry.filter(c=>c.id===slug)).toHaveLength(1);});
 it('uses coherent seeded paper noise rather than per-frame randomness',()=>{for(let i=0;i<40;i++){const n=paperNoise(i*.13,2.7);expect(n).toBeGreaterThanOrEqual(0);expect(n).toBeLessThanOrEqual(1);expect(n).toBe(paperNoise(i*.13,2.7));expect(Math.abs(n-paperNoise(i*.13+.001,2.7))).toBeLessThan(.002);}});
 it('narrows fast brush strokes and safely bounds pressure',()=>{expect(brushPressure(0)).toBe(1.1);expect(brushPressure(2000)).toBeLessThan(brushPressure(100));expect(brushPressure(-100)).toBe(brushPressure(0));expect(brushPressure(1e9)).toBeGreaterThanOrEqual(.5);});
 it('smoothly follows in seconds independently of frame subdivisions',()=>{expect(followAlpha(1/60,.03)).toBeGreaterThan(followAlpha(1/60,.3));expect(1-Math.pow(1-followAlpha(1/120,.06),2)).toBeCloseTo(followAlpha(1/60,.06),10);expect(followAlpha(0,.03)).toBe(0);});
 it('mixes by travelled distance and expires each deposited sample',()=>{expect(pigmentMix(0,700)).toBe(0);expect(pigmentMix(350,700)).toBe(1);expect(pigmentMix(700,700)).toBe(0);expect(pigmentMix(10,0)).toBe(0);expect(fadeInk(0,3.5)).toBe(1);expect(fadeInk(3.5,3.5)).toBe(0);expect(fadeInk(8,3.5)).toBe(0);expect(fadeInk(2,3.5)).toBeLessThan(fadeInk(1,3.5));});
 it('ships the real atlas and scoped lifecycle helper to isolated code examples',()=>{for(const [slug,key]of [['arc-cursor','ArcCursor'],['pigment-trail','PigmentTrail']]){const item=findComponent('cursor-trails',slug);if(item?.status!=='ready')throw Error(slug);const files=builtinFiles(item,item.defaults);expect(files['/effects/paintCursorRuntime.tsx']).toContain('idleTimer');if(key==='PigmentTrail')expect(files['/effects/pigmentBrush.ts']).toContain('createBrushAtlas');expect(cursorTrails[key].defaults).toHaveProperty('mode','auto');for(const prop of ['autoplaySpeed','idleDelay','paused'])expect(cursorTrails[key].schema.some(c=>c.key===prop)).toBe(true);}});
});
