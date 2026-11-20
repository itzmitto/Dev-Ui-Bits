import { describe,it,expect } from 'vitest';
import { circularAngles } from './effects/CircularText';
import { mixEchoColor } from './effects/EchoText';
import { staggerRanks,textEase } from './effects/textLayout';
import { textBatchTwo } from './effects/textBatchTwo.config';
import {findComponent, registry} from './registry';
import {builtinFiles} from './builtinFiles';
import { validateSchema } from './storage';
describe('batch 2 independent typography engines',()=>{
 it('places filled rings evenly and natural rings according to measured advance',()=>{expect(circularAngles([10,30,10,30],80,true,0)).toEqual([0,90,180,270]);const natural=circularAngles([10,30,10],80,false,2);expect(natural[1]-natural[0]).toBeCloseTo(22/(160*Math.PI)*360);expect(circularAngles([],0,true,0)).toEqual([]);});
 it('produces deterministic, unique stagger ranks for all folding directions',()=>{for(const mode of ['start','center','end','edges','random']){const ranks=staggerRanks(13,mode);expect([...ranks].sort((a,b)=>a-b)).toEqual(Array.from({length:13},(_,i)=>i));expect(staggerRanks(13,mode)).toEqual(ranks);}expect(staggerRanks(5,'center')[2]).toBe(0);expect(staggerRanks(5,'end')).toEqual([4,3,2,1,0]);});
 it('clamps monotonic easing and interpolates real echo color channels',()=>{for(const ease of ['linear','ease-out','ease-in-out','snappy']){expect(textEase(-1,ease)).toBe(0);expect(textEase(2,ease)).toBe(1);for(let t=0;t<1;t+=.1)expect(textEase(t+.1,ease)).toBeGreaterThanOrEqual(textEase(t,ease));}expect(mixEchoColor('#000000','#ffffff',.5)).toBe('rgb(128,128,128)');});
 it('keeps one ready record per module and exports all transitive source files',()=>{for(const [name,entry] of Object.entries(textBatchTwo)){const slug=name.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase(),item=findComponent('text-animations',slug);if(item?.status!=='ready')throw new Error(slug);expect(registry.filter(c=>c.name===item.name)).toHaveLength(1);const files=builtinFiles(item,item.defaults);expect(files[`/effects/${name}.tsx`]).toContain(`export function ${name}`);expect(files[`/effects/${name}.css`]?.length).toBeGreaterThan(40);for(const helper of entry.helpers)expect(files[`/effects/${helper}`]?.length,helper).toBeGreaterThan(20);expect(item.dependencies).toEqual({'@fontsource/geist':'^5.3.0'});expect(()=>validateSchema(entry.schema,entry.defaults)).not.toThrow();for(const preset of Object.values(entry.presets)){expect(Object.keys(preset).sort()).toEqual(Object.keys(entry.defaults).sort());expect(()=>validateSchema(entry.schema,preset)).not.toThrow();}}});
});
