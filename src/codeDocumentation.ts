import type {Control,EffectProps,FileMap} from './types';
export const managers=['npm','pnpm','yarn','bun'] as const;
export type PackageManager=typeof managers[number];
export type Documentation={name:string;description:string;schema:Control[];values:EffectProps;defaults:EffectProps;dependencies:Record<string,string>;files:FileMap;primaryFile:string;usageFile:string;language:string;styling:string};
export function installation(doc:Documentation,manager:PackageManager='npm'){
 const dependencies=Object.entries(doc.dependencies).map(([name,version])=>`'${name}@${version}'`).join(' ');
 const command=dependencies?`${manager} ${manager==='npm'?'install':'add'} ${dependencies}`:null;
 const paths=Object.keys(doc.files).filter(p=>p!==doc.usageFile).map(path=>`src${path}`);
 return {command,paths,text:[`# ${doc.name} — existing React ${doc.language} project`,command??'# No extra dependencies beyond React and react-dom.',...(doc.files['/effects/flexImages.ts']?['# The ten original demo PNGs are embedded in effects/flexImages.ts. No image CDN or public asset folder is required for these defaults.']:[]),'# Copy the provided files into src, preserving their paths:',...paths.map(path=>`# ${path}`),`# Use src${doc.usageFile} as the usage example, including its CSS imports.`].join('\n')};
}
export function allFiles(files:FileMap){return Object.entries(files).map(([path,code])=>`### src${path}\n\`\`\`${path.split('.').pop()}\n${code}\n\`\`\``).join('\n\n');}
export function aiContext(doc:Documentation,manager:PackageManager='npm'){return [`# DevUI Bits — ${doc.name}`,doc.description,'Use the self-contained files below. Preserve local import paths. No DevUI package or shadcn registry is required.','## Properties (current values)',JSON.stringify(doc.values,null,2),'## Property schema',JSON.stringify(doc.schema,null,2),'## Default values',JSON.stringify(doc.defaults,null,2),'## Dependencies',JSON.stringify({react:'^19.0.0','react-dom':'^19.0.0',...doc.dependencies},null,2),'## Install',installation(doc,manager).text,'## Usage',doc.files[doc.usageFile],'## Source files',allFiles(doc.files)].join('\n\n');}
/** Native clipboard first; fallback keeps Copy usable in older local browser contexts. */
export async function copyText(text:string){if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(text);return;}catch{/* Try the selection API below. */}}const previous=document.activeElement as HTMLElement|null,field=document.createElement('textarea');field.value=text;field.style.cssText='position:fixed;left:-10000px;top:0';document.body.append(field);field.select();try{if(!document.execCommand('copy'))throw Error('Clipboard unavailable. Select and copy the code manually.');}finally{field.remove();previous?.focus();}}
