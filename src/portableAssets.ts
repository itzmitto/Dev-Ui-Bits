import type {FileMap} from './types';
const cache=new Map<string,Promise<string>>();
/** Only called for source documentation/editor/copy. PNG bytes become portable
 * data URLs, so the isolated iframe and exported files require no parent origin. */
export async function materializeAssets(files:FileMap):Promise<FileMap>{
 const path='/effects/flexImages.ts',source=files[path];if(!source)return files;
 const paths=[...new Set(source.match(/\/images\/flex-carousel\/[\w-]+\.png/g)||[])];
 const values=await Promise.all(paths.map(async url=>{
  let pending=cache.get(url);if(!pending){pending=fetch(url).then(async response=>{if(!response.ok)throw Error(`Image unavailable: ${url}`);const bytes=new Uint8Array(await response.arrayBuffer());if(bytes[0]!==137||bytes[1]!==80||bytes[2]!==78||bytes[3]!==71)throw Error(`Invalid PNG: ${url}`);let binary='';for(let i=0;i<bytes.length;i+=16384)binary+=String.fromCharCode(...bytes.subarray(i,i+16384));return 'data:image/png;base64,'+btoa(binary);});cache.set(url,pending);pending.catch(()=>cache.delete(url));}return [url,await pending] as const;
 }));
 let portable=source.replace('Copy public/images/flex-carousel when using these defaults.','PNG bytes are embedded for standalone use; no public image folder is required.');for(const [url,data]of values)portable=portable.replaceAll(url,data);
 return {...files,[path]:portable};
}
