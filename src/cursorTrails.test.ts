import { describe,it,expect } from 'vitest';
import { cursorTrails } from './effects/cursorTrails.config';
import { arcOffset } from './effects/ArcCursor';
import { mixColor } from './effects/cursorRuntime';
import { registry,findComponent,builtinFiles } from './registry';
import { validateSchema } from './storage';
describe('original cursor effects',()=>{
 it('keeps lightning offsets bounded and coherent over time',()=>{for(let i=0;i<50;i++){const a=arcOffset(i,2,1,1.5);expect(Math.abs(a)).toBeLessThanOrEqual(1);expect(Math.abs(a-arcOffset(i,2,1.001,1.5))).toBeLessThan(.1);}});
 it('interpolates actual RGB endpoints and clamps interpolation',()=>{expect(mixColor('#000000','#ffffff',.5)).toBe('rgb(128,128,128)');expect(mixColor('#ff0000','#0000ff',2)).toBe('rgb(0,0,255)');});
 it('exports complete standalone files, schemas and full valid presets without duplicate records',()=>{for(const [source,entry] of Object.entries(cursorTrails)){const slug=source.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase(),item=findComponent('cursor-trails',slug);expect(item?.status).toBe('ready');if(item?.status!=='ready')throw Error(slug);expect(registry.filter(e=>e.id===slug)).toHaveLength(1);expect(()=>validateSchema(entry.schema,entry.defaults)).not.toThrow();expect(Object.keys(entry.presets).length).toBeGreaterThanOrEqual(2);for(const preset of Object.values(entry.presets)){expect(Object.keys(preset).sort()).toEqual(Object.keys(entry.defaults).sort());expect(()=>validateSchema(entry.schema,preset)).not.toThrow();}const files=builtinFiles(item,item.defaults);for(const [file,code]of Object.entries(files)){expect(code,file).toBeTruthy();for(const m of code.matchAll(/(?:from\s*|import\s*)['"]\.\/(.*?)['"]/g)){const local=file.slice(0,file.lastIndexOf('/')+1)+m[1];expect(Object.keys(files).some(n=>n===local||n===local+'.ts'||n===local+'.tsx'),`${file} imports ${local}`).toBe(true);}}expect(item.dependencies).toEqual({});}});
});
