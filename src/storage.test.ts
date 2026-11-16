import 'fake-indexeddb/auto';
import { describe,it,expect } from 'vitest';
import { readComponents,writeComponent,removeComponent,validateImport,validateSchema } from './storage';
import { starterFiles } from './templates';
import type { CustomComponent } from './types';
import { zipFiles } from './export';
const component:CustomComponent={id:'test',slug:'test',name:'Test',category:'Components',description:'Test component',language:'tsx',styling:'css',dependencies:{},defaults:{text:'Hello'},schema:[{key:'text',label:'Text',type:'text'}],files:starterFiles('tsx','css','Animated card'),createdAt:1,updatedAt:1};
describe('local component lifecycle',()=>{
 it('persists edits, reloads, and removes an IndexedDB record',async()=>{await writeComponent(component);expect(await readComponents()).toEqual([component]);await writeComponent({...component,name:'Edited'});expect((await readComponents())[0].name).toBe('Edited');await removeComponent(component.id);expect(await readComponents()).toEqual([]);});
 it('imports a backup with fresh IDs to avoid overwriting local work',()=>{const c=validateImport({version:1,components:[component]})[0];expect(c.name).toBe('Test');expect(c.id).not.toBe(component.id);expect(c.files['/Component.tsx']).toContain('export default');});
 it('rejects corrupt backups and invalid control definitions',()=>{expect(()=>validateImport({version:2,components:[component]})).toThrow();expect(()=>validateImport({version:1,components:[{...component,files:{'/../bad.ts':'x'}}]})).toThrow();expect(()=>validateSchema([{key:'missing',type:'range',label:'Bad'}],{})).toThrow();expect(()=>validateSchema([{key:'speed',type:'range',label:'Speed',min:1,max:0,step:1}],{speed:.5})).toThrow();});
 it('creates a ZIP with a central directory and all files',()=>{const bytes=zipFiles({'/App.tsx':'hello','/styles.css':'world'});const view=new DataView(bytes.buffer);expect(view.getUint32(0,true)).toBe(0x04034b50);expect(view.getUint32(bytes.length-22,true)).toBe(0x06054b50);expect(view.getUint16(bytes.length-14,true)).toBe(2);});
});
