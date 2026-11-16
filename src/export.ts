import type { FileMap } from './types';
export function download(name:string,body:BlobPart,type='application/json'){
 const url=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function exportJSON(components:unknown[]){download('devui-bits-components.json',JSON.stringify({version:1,components},null,2));}
// Small uncompressed ZIP writer: exported projects need no remote export service.
export function zipFiles(files:FileMap):Uint8Array{
 const encoder=new TextEncoder(),entries:{name:Uint8Array;data:Uint8Array;crc:number;offset:number}[]=[];let offset=0;
 const crc32=(data:Uint8Array)=>{let c=0xffffffff;for(const byte of data){c^=byte;for(let i=0;i<8;i++)c=(c>>>1)^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;};
 const chunks:Uint8Array[]=[];
 for(const [path,body] of Object.entries(files)){
  const name=encoder.encode(path.replace(/^\//,'')),data=encoder.encode(body),crc=crc32(data),header=new Uint8Array(30+name.length),v=new DataView(header.buffer);
  v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint32(14,crc,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,name.length,true);header.set(name,30);
  entries.push({name,data,crc,offset});chunks.push(header,data);offset+=header.length+data.length;
 }
 const centralOffset=offset;
 for(const e of entries){const h=new Uint8Array(46+e.name.length),v=new DataView(h.buffer);v.setUint32(0,0x02014b50,true);v.setUint16(4,20,true);v.setUint16(6,20,true);v.setUint32(16,e.crc,true);v.setUint32(20,e.data.length,true);v.setUint32(24,e.data.length,true);v.setUint16(28,e.name.length,true);v.setUint32(42,e.offset,true);h.set(e.name,46);chunks.push(h);offset+=h.length;}
 const end=new Uint8Array(22),v=new DataView(end.buffer);v.setUint32(0,0x06054b50,true);v.setUint16(8,entries.length,true);v.setUint16(10,entries.length,true);v.setUint32(12,offset-centralOffset,true);v.setUint32(16,centralOffset,true);chunks.push(end);
 const out=new Uint8Array(offset+22);let cursor=0;for(const chunk of chunks){out.set(chunk,cursor);cursor+=chunk.length;}return out;
}
export function exportProject(files:FileMap,name:string,dependencies:Record<string,string>={},tailwind=false){
 const appFile=files['/App.tsx']?'App.tsx':'App.jsx';
 const all={...files,'/main.tsx':`import React from 'react';\nimport {createRoot} from 'react-dom/client';\nimport App from './${appFile}';\ncreateRoot(document.getElementById('root')!).render(<App/>);`, '/index.html':`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">${tailwind?'<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>':''}</head><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>`, '/package.json':JSON.stringify({name:'devui-component',version:'1.0.0',private:true,type:'module',scripts:{dev:'vite',build:'vite build'},dependencies:{react:'^19.0.0','react-dom':'^19.0.0',...dependencies},devDependencies:{vite:'^8.3.8','@vitejs/plugin-react':'^6.3.0',typescript:'~5.9.3','@types/react':'^19.0.0','@types/react-dom':'^19.0.0'}},null,2),'/vite.config.ts':"import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({plugins:[react()]});",'/tsconfig.json':JSON.stringify({compilerOptions:{target:'ES2022',module:'ESNext',moduleResolution:'Bundler',jsx:'react-jsx',strict:true,noEmit:true,skipLibCheck:true,allowImportingTsExtensions:true},include:['**/*.ts','**/*.tsx']},null,2),'/README.md':'# '+name+'\n\nExported from DevUI Bits.\n\nnpm install\nnpm run dev\n'};
 const zip=zipFiles(all);download(`${name.toLowerCase().replaceAll(' ','-')}.zip`,zip.buffer as ArrayBuffer,'application/zip');
}
