import { useMemo, useState } from 'react';
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview, useSandpack, SandpackConsole } from '@codesandbox/sandpack-react';
import { Copy, Download, Plus, RotateCcw, Save } from 'lucide-react';
import { exportProject } from './export';
import { useTheme } from './theme';
import { sandboxAssetFiles } from './sandboxAssets';
import type { EffectProps, FileMap } from './types';

const darkTheme={colors:{surface1:'#15111c',surface2:'#211b29',surface3:'#32283f',clickable:'#9f94ad',base:'#dcd6e5',disabled:'#62596e',hover:'#ffffff',accent:'#c391ff',error:'#fb7185',errorSurface:'#381f2e'},syntax:{plain:'#ddd5e6',comment:'#72657f',keyword:'#c084fc',tag:'#d8b4fe',punctuation:'#a89cb6',definition:'#93c5fd',property:'#c4b5fd',static:'#86efac',string:'#a5d6a7'},font:{body:'Geist, sans-serif',mono:'ui-monospace, SFMono-Regular, monospace',size:'12px',lineHeight:'1.8'}};
const lightTheme={...darkTheme,colors:{surface1:'#ffffff',surface2:'#f4f1f7',surface3:'#e7e1ed',clickable:'#695f75',base:'#292133',disabled:'#95899f',hover:'#120f17',accent:'#7e22ce',error:'#be123c',errorSurface:'#fff1f2'},syntax:{plain:'#292133',comment:'#82758e',keyword:'#7e22ce',tag:'#6d28d9',punctuation:'#6f607d',definition:'#1d4ed8',property:'#6d28d9',static:'#047857',string:'#15803d'}};
type EditorProps={files:FileMap;name:string;dependencies?:Record<string,string>;tailwind?:boolean;readOnly?:boolean;previewOnly?:boolean;onSave?:(files:FileMap)=>Promise<void>;notify?:(s:string)=>void};
function Diagnostics({dependencies}:Pick<EditorProps,'dependencies'>){
 const {sandpack}=useSandpack();
 const error=sandpack.error;
 return <><div className="workspace-dependencies" aria-label="Workspace dependencies"><span>Dependencies</span>{Object.entries({react:'^19.0.0','react-dom':'^19.0.0',...dependencies}).map(([name,version])=><code key={name}>{name} <span>{version}</span></code>)}<span className="workspace-compile-status" role="status">{error?'Needs a fix':sandpack.status==='running'?'Compiling…':'Browser React sandbox'}</span></div>{error&&<div className="workspace-error" role="alert"><strong>Compilation failed</strong><button onClick={()=>{if(error.path&&sandpack.files[error.path])sandpack.openFile(error.path);}}>{error.path||sandpack.activeFile}{error.line?`:${error.line}`:''}{error.column?`:${error.column}`:''}</button><p>{error.message.includes('read only property')?'The compiler could not parse this file. Check the syntax in the file above, then edit it or reset the workspace.':error.message}</p></div>}</>;
}
function Toolbar({files:initialFiles,name,dependencies,tailwind,onSave,notify}:EditorProps){
 const {sandpack}=useSandpack(),[fileName,setFileName]=useState(''),[adding,setAdding]=useState(false),[saving,setSaving]=useState(false),[consoleOpen,setConsoleOpen]=useState(false);
 const files=()=>Object.fromEntries(Object.entries(sandpack.files).filter(([k])=>!['/package.json','/index.tsx','/index.js','/public/index.html','/tsconfig.json'].includes(k)&&!(k==='/App.tsx'&&!initialFiles[k])).map(([k,v])=>[k,v.code]));
 return <><div className="editor-toolbar"><span className="editor-status"><i/> LIVE WORKSPACE</span><div className="editor-actions"><button className="text-button" onClick={()=>setAdding(!adding)}><Plus size={13}/> File</button><button className="text-button" onClick={()=>{sandpack.resetAllFiles();notify?.('Workspace reset');}}><RotateCcw size={13}/> Reset</button><button className="text-button" onClick={async()=>{try{await navigator.clipboard.writeText(sandpack.files[sandpack.activeFile].code);notify?.('Active file copied');}catch{notify?.('Clipboard unavailable. Select the code to copy it.');}}}><Copy size={13}/> Copy</button><button className="text-button" onClick={()=>exportProject(files(),name,dependencies,tailwind)}><Download size={13}/> Export ZIP</button>{onSave&&<button className="primary-button" disabled={saving} onClick={async()=>{setSaving(true);try{await onSave(files());}catch(e){notify?.(e instanceof Error?e.message:'Could not save.');}finally{setSaving(false);}}}><Save size={13}/>{saving?'Saving…':'Save component'}</button>}</div></div>
 {adding&&<form className="add-file" onSubmit={e=>{e.preventDefault();const path='/'+fileName.replace(/^\//,'');if(!/^\/[\w/-]+\.(tsx?|jsx?|css|json)$/.test(path)||path.includes('..')||sandpack.files[path]){notify?.('Choose a new filename such as utils.ts or theme.css.');return;}sandpack.addFile(path,'');sandpack.openFile(path);setAdding(false);setFileName('');}}><input autoFocus placeholder="utils.ts" aria-label="New file name" value={fileName} onChange={e=>setFileName(e.target.value)}/><button>Add file</button></form>}
 <Diagnostics dependencies={dependencies}/><SandpackLayout><SandpackCodeEditor showLineNumbers showTabs closableTabs wrapContent={false} style={{height:450}}/><SandpackPreview showOpenInCodeSandbox={false} showRefreshButton style={{height:450}}/></SandpackLayout>
 <button className="console-toggle text-button" onClick={()=>setConsoleOpen(!consoleOpen)}>{consoleOpen?'Hide':'Show'} compiler console</button>{consoleOpen&&<SandpackConsole showHeader style={{height:180}}/>}</>;
}
export default function Editor(props:EditorProps){
 const { theme } = useTheme();
 const editorTheme = theme === 'dark' ? darkTheme : lightTheme;
 // Sandpack resets its draft when files/customSetup receive new identities.
 // Compare the input contents so theme switches and notification renders never
 // overwrite edits or files added inside the sandbox.
 const fileKey = JSON.stringify(props.files), dependencyKey = JSON.stringify(props.dependencies ?? {});
 const sandboxFiles = useMemo(() => {
   const originals = JSON.parse(fileKey) as FileMap;
   const source = props.readOnly ? originals : sandboxAssetFiles(originals);
   const appPath = source['/App.jsx'] ? '/App.jsx' : '/App.tsx';
   const entry = `import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from '.${appPath}';\ncreateRoot(document.getElementById('root')!).render(<App />);`;
   return { ...source, '/index.tsx': { code: entry, hidden: true } };
 }, [fileKey, props.readOnly]);
 const customSetup = useMemo(() => ({ dependencies: { react:'^19.0.0', 'react-dom':'^19.0.0', ...JSON.parse(dependencyKey) as Record<string,string> } }), [dependencyKey]);
 const options = useMemo(() => {
   const files = JSON.parse(fileKey) as FileMap;
   return {
     activeFile: props.readOnly ? Object.keys(files).find(path => (path.startsWith('/effects/') && path.endsWith('.tsx')) || path.startsWith('/Component.')) : '/Component.tsx' in files ? '/Component.tsx' : '/Component.jsx' in files ? '/Component.jsx' : '/App.tsx',
     visibleFiles: Object.keys(files),
     externalResources: props.tailwind ? ['https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4'] : [],
     recompileMode: 'delayed' as const, recompileDelay: 500,
   };
 }, [fileKey, props.readOnly, props.tailwind]);
 return <div className="code-workspace"><SandpackProvider theme={editorTheme} template="react-ts" files={sandboxFiles} customSetup={customSetup} options={options}>
 {props.previewOnly?<SandpackPreview showOpenInCodeSandbox={false} showRefreshButton style={{height:440}}/>:props.readOnly?<SandpackCodeEditor showLineNumbers showTabs readOnly style={{height:430}}/>:<Toolbar {...props}/>}</SandpackProvider>{!props.readOnly&&<p className="editor-footnote">Runs in an isolated Sandpack iframe. The editor needs an internet connection to compile packages.</p>}</div>;
}
export function customPreviewFiles(files:FileMap,language:'tsx'|'jsx',values:EffectProps):FileMap{
 return {...files,[`/App.${language}`]:`import Component from './Component.${language}';\nimport './styles.css';\nexport default function App() { return <Component {...${JSON.stringify(values,null,2)}} />; }`};
}
