import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import type { Control, EffectProps } from './types';
type Props={schema:Control[];values:EffectProps;onChange:(p:EffectProps)=>void;onReset:()=>void;presets?:Record<string,EffectProps>};
export function Controls({schema,values,onChange,onReset,presets}:Props){
 const set=(key:string,value:string|number|boolean)=>onChange({...values,[key]:value});
 return <section className="customize" id="customize"><div className="section-bar"><h2><SlidersHorizontal size={15}/> Customize</h2><button onClick={onReset} className="text-button"><RotateCcw size={12}/> Reset</button></div><div className="controls-grid">
 {presets&&<label className="control-row"><span>Preset</span><select aria-label="Preset" defaultValue="" onChange={e=>{if(e.target.value)onChange({...values,...presets[e.target.value]});}}><option value="" disabled>Choose a preset</option>{Object.keys(presets).map(p=><option key={p}>{p}</option>)}</select></label>}
 {schema.map(control=><label key={control.key} className={`control-row control-${control.type}`}><span>{control.label}</span>
 {control.type==='color'?<div className="color-control"><input type="color" aria-label={control.label} value={String(values[control.key])} onChange={e=>set(control.key,e.target.value)}/><span>{String(values[control.key]).toUpperCase()}</span></div>:
 control.type==='toggle'?<input type="checkbox" role="switch" aria-label={control.label} checked={Boolean(values[control.key])} onChange={e=>set(control.key,e.target.checked)}/>:
 control.type==='select'?<select aria-label={control.label} value={String(values[control.key])} onChange={e=>set(control.key,e.target.value)}>{control.options?.map(o=><option key={o}>{o}</option>)}</select>:
 control.type==='text'?<input type="text" aria-label={control.label} value={String(values[control.key]??'')} onChange={e=>set(control.key,e.target.value)}/>:
 <div className="numeric-control"><input aria-label={control.label} type={control.type==='range'?'range':'number'} min={control.min} max={control.max} step={control.step??1} value={Number(values[control.key]??0)} style={control.type==='range'?{'--fill':`${(Number(values[control.key])-Number(control.min))/(Number(control.max)-Number(control.min))*100}%`} as React.CSSProperties:undefined} onChange={e=>{const n=Number(e.target.value);if(Number.isFinite(n))set(control.key,Math.min(control.max??Infinity,Math.max(control.min??-Infinity,n)));}}/><output>{String(values[control.key])}{control.key==='direction'?'°':''}</output></div>}
 </label>)}
 </div></section>;
}
