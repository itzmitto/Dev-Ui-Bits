import { openDB } from 'idb';
import { create } from 'zustand';
import { categories, type Control, type CustomComponent, type EffectProps } from './types';
const database=()=>openDB('devui-bits',1,{upgrade(db){db.createObjectStore('components',{keyPath:'id'});}});
export async function readComponents():Promise<CustomComponent[]>{const db=await database();try{return await db.getAll('components');}finally{db.close();}}
export async function writeComponent(component:CustomComponent){const db=await database();try{await db.put('components',component);}finally{db.close();}}
export async function removeComponent(id:string){const db=await database();try{await db.delete('components',id);}finally{db.close();}}
export function validateProperties(value:unknown):EffectProps{
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Default properties must be a JSON object.');
 for(const [key,v] of Object.entries(value)){if(!/^[a-zA-Z][\w]*$/.test(key)||!['string','number','boolean'].includes(typeof v)||typeof v==='number'&&!Number.isFinite(v))throw new Error('Properties need simple names and string, number, or boolean values.');}
 return value as EffectProps;
}
export function validateSchema(value:unknown,defaults:EffectProps):Control[]{
 if(!Array.isArray(value)||value.length>30)throw new Error('The controls schema must be an array of up to 30 controls.');
 const keys=new Set<string>();
 for(const item of value){
  if(!item||typeof item!=='object'||typeof item.key!=='string'||typeof item.label!=='string'||!['range','angle','number','text','color','select','toggle'].includes(item.type)||!(item.key in defaults)||keys.has(item.key))throw new Error('Each control needs a unique property key, label, supported type, and default value.');
  if(item.group!==undefined&&typeof item.group!=='string')throw new Error('Control groups must be text labels.');
  if(item.inherit!==undefined&&typeof item.inherit!=='boolean')throw new Error('Color inheritance must be a boolean.');
  keys.add(item.key);
  if(item.type==='range'||item.type==='angle'||item.type==='number'){if(typeof defaults[item.key]!=='number'||!Number.isFinite(item.min)||!Number.isFinite(item.max)||item.min>=item.max||!Number.isFinite(item.step)||item.step<=0)throw new Error('Numeric controls need numeric defaults and finite min, max, and positive step values.');}
  else if(item.type==='toggle'&&typeof defaults[item.key]!=='boolean')throw new Error('Toggle properties must be booleans.');
  else if(item.type==='color'&&!(item.inherit===true&&defaults[item.key]==='currentColor')&&(!/^#[0-9a-f]{6}$/i.test(String(defaults[item.key]))))throw new Error('Colors must use six-digit hex values.');
  else if(item.type==='select'&&(!Array.isArray(item.options)||!item.options.every((o:unknown)=>typeof o==='string')||!item.options.includes(defaults[item.key])))throw new Error('Select controls need string options including the default.');
 }
 return value as Control[];
}
export function validateImport(data:unknown):CustomComponent[]{
 if(!data||typeof data!=='object'||!('version' in data)||data.version!==1||!('components' in data)||!Array.isArray(data.components)||data.components.length>100)throw new Error('Use a DevUI Bits version 1 export.');
 return data.components.map((c:CustomComponent)=>{
  if(!c||typeof c.name!=='string'||!c.name.trim()||c.name.length>80||!categories.includes(c.category)||typeof c.description!=='string'||!['tsx','jsx'].includes(c.language)||!['css','tailwind'].includes(c.styling))throw new Error('Invalid component metadata.');
  if(!c.files||typeof c.files!=='object'||Object.keys(c.files).length>30||!Object.entries(c.files).every(([k,v])=>/^\/[\w./-]+\.(tsx?|jsx?|css|json)$/.test(k)&&!k.includes('..')&&typeof v==='string')||!c.files[`/Component.${c.language}`])throw new Error('Invalid component files.');
  const dependencies=validateDependencies(c.dependencies??{});
  const defaults=validateProperties(c.defaults);const schema=validateSchema(c.schema,defaults);
  const id=crypto.randomUUID();return {...c,id,slug:`${slugify(c.name)}-${id.slice(0,8)}`,defaults,schema,dependencies,createdAt:Date.now(),updatedAt:Date.now()};
 });
}
export function validateDependencies(value:unknown):Record<string,string>{
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.entries(value).length>20||!Object.entries(value).every(([key,v])=>/^(@[a-z0-9-]+\/)?[a-z0-9][a-z0-9._-]*$/.test(key)&&typeof v==='string'&&/^[a-z0-9.^~*|>=< -]+$/i.test(v)&&v.length<80))throw new Error('Dependencies must be an object of npm package names and version ranges.');
 return value as Record<string,string>;
}
export const slugify=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'component';
type LibraryState={custom:CustomComponent[];loaded:boolean;storageError:string;load:()=>Promise<void>;save:(c:CustomComponent)=>Promise<void>;remove:(id:string)=>Promise<void>;importAll:(c:CustomComponent[])=>Promise<void>};
export const useLibrary=create<LibraryState>((set,get)=>({custom:[],loaded:false,storageError:'',load:async()=>{try{set({custom:await readComponents(),loaded:true});}catch{set({loaded:true,storageError:'Local storage is unavailable. Enable IndexedDB to save components.'});}},save:async c=>{await writeComponent(c);set({custom:[...get().custom.filter(x=>x.id!==c.id),c]});},remove:async id=>{await removeComponent(id);set({custom:get().custom.filter(x=>x.id!==id)});},importAll:async components=>{const db=await database();try{const tx=db.transaction('components','readwrite');await Promise.all(components.map(c=>tx.store.put(c)));await tx.done;set({custom:await readComponents()});}finally{db.close();}}}));
