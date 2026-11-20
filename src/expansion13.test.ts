import {describe,it,expect} from 'vitest';
import {expansion13} from './effects/expansion13.config';
import {registry,findComponent} from './registry';
import {builtinFiles} from './builtinFiles';
import {validateSchema} from './storage';
import {categorySlug} from './types';
describe('phase 13 independent component delivery',()=>{
 it('reuses existing records and validates every new schema/preset',()=>{expect(registry).toHaveLength(246);for(const [source,e]of Object.entries(expansion13)){const records=registry.filter(c=>c.name===e.name);expect(records).toHaveLength(1);const c=records[0];expect(c.status).toBe('ready');expect(c).toBe(findComponent(categorySlug(e.category),c.slug));expect(()=>validateSchema(e.schema,e.defaults)).not.toThrow();for(const preset of Object.values(e.presets))expect(()=>validateSchema(e.schema,preset)).not.toThrow();if(c.status==='ready')expect(c.source).toBe(source);}});
 it('exports real modules and every transitive local import',()=>{for(const entry of Object.values(expansion13)){const c=registry.find(c=>c.name===entry.name);if(c?.status!=='ready')throw Error(entry.name);const files=builtinFiles(c,c.defaults);expect(files['/effects/'+c.source+'.tsx']).toContain('export function '+c.exportName);for(const [path,code]of Object.entries(files)){expect(code,path).toBeTruthy();for(const match of code.matchAll(/(?:from\s*|import\s*)['"]\.\/([^'"]+)['"]/g)){const name=path.slice(0,path.lastIndexOf('/')+1)+match[1];expect([name,name+'.ts',name+'.tsx',name+'.css'].some(n=>n in files),path+' imports '+name).toBe(true);}}}});
});
