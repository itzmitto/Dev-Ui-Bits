import { useEffect,useRef,useState } from 'react';
import { num,str,type EffectProps } from './types';
import { bound,fontOf,useTextAnimation } from './textRuntime';
import { rasterText,sizeCanvas } from './textCanvas';
import { createWarpRenderer } from './WarpText.renderer';
import './WarpText.css';
import './textDisplay.css';
export function WarpText(p:EffectProps){
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null),latest=useRef(p);latest.current=p;const [fallback,setFallback]=useState(false);
 const uploadRef=useRef(()=>{});
 const state=useRef({w:1,h:1,age:0,time:0,pointer:{x:.5,y:.5},smooth:{x:.5,y:.5},inside:false,click:{x:.5,y:.5,time:-100},renderer:null as ReturnType<typeof createWarpRenderer>,lost:false});
 const wake=useTextAnimation(host,(dt,_time,reduced)=>{
  const s=state.current,q=latest.current;if(!s.renderer||s.lost)return false;if(!q.paused){s.age+=dt;s.time+=dt*num(q,'speed',.55);}
  const factor=reduced?1:1-Math.exp(-dt*10);s.smooth.x+=(s.pointer.x-s.smooth.x)*factor;s.smooth.y+=(s.pointer.y-s.smooth.y)*factor;
  const idle=s.inside?1:num(q,'idleDrift',.2),intro=q.intro===false||reduced?0:Math.max(0,1-s.age/1.4);
  s.renderer.draw({width:s.w,height:s.h,pointerX:s.inside?s.smooth.x:.5+Math.sin(s.time*.6)*.22,pointerY:s.inside?s.smooth.y:.5+Math.cos(s.time*.4)*.13,time:reduced?0:s.time,ambient:reduced?0:num(q,'warpStrength',.08),scale:num(q,'warpScale',1.7),strength:num(q,'pointerStrength',.38)*idle,radius:num(q,'pointerInfluence',.42),lens:['bulge','pinch','swirl'].indexOf(str(q,'lens','bulge')),chromatic:num(q,'chromatic',0),refraction:num(q,'refraction',.018),ripple:q.ripple!==false&&!reduced,intro,clickX:s.click.x,clickY:s.click.y,clickAge:reduced?100:s.age-s.click.time});
  return !q.paused&&(num(q,'speed',.55)>0||intro>0||s.age-s.click.time<3||Math.abs(s.smooth.x-s.pointer.x)+Math.abs(s.smooth.y-s.pointer.y)>.001);
 });
 useEffect(()=>{
  const node=host.current!,el=canvas.current!,s=state.current,texture=document.createElement('canvas');let disposed=false;
  const upload=()=>{const q=latest.current;s.w=node.clientWidth;s.h=node.clientHeight;sizeCanvas(el,s.w,s.h);rasterText(texture,str(q,'text','Bend the moment').replaceAll('\\n','\n'),s.w,s.h,bound(q.fontSize,144,24,300),num(q,'fontWeight',800),fontOf(node,str(q,'fontFamily','')),num(q,'letterSpacing',-.06),num(q,'lineHeight',.9));const c=texture.getContext('2d')!;c.globalCompositeOperation='source-in';c.fillStyle=str(q,'color','#ffffff');c.fillRect(0,0,s.w,s.h);c.globalCompositeOperation='source-over';s.renderer?.upload(texture);wake();};
  uploadRef.current=upload;
  const initialize=()=>{try{s.renderer=createWarpRenderer(el);if(!s.renderer){setFallback(true);return;}s.lost=false;setFallback(false);upload();}catch{setFallback(true);}};
  const lost=(event:Event)=>{event.preventDefault();s.lost=true;};const restored=()=>{if(!disposed)initialize();};
  el.addEventListener('webglcontextlost',lost);el.addEventListener('webglcontextrestored',restored);initialize();
  const observer=new ResizeObserver(upload);observer.observe(node);document.fonts?.addEventListener('loadingdone',upload);void document.fonts?.ready.then(()=>{if(!disposed)upload();});
  return()=>{disposed=true;observer.disconnect();document.fonts?.removeEventListener('loadingdone',upload);el.removeEventListener('webglcontextlost',lost);el.removeEventListener('webglcontextrestored',restored);s.renderer?.dispose();s.renderer=null;};
 },[]);
 useEffect(()=>{uploadRef.current();},[p.text,p.fontSize,p.fontWeight,p.fontFamily,p.letterSpacing,p.lineHeight,p.color]);
 return <div className="warp-text" ref={host} onPointerMove={event=>{const b=event.currentTarget.getBoundingClientRect();state.current.inside=true;state.current.pointer={x:(event.clientX-b.x)/b.width,y:(event.clientY-b.y)/b.height};wake();}} onPointerLeave={()=>{state.current.inside=false;wake();}} onClick={event=>{if(p.clickRipple===false)return;const b=event.currentTarget.getBoundingClientRect();state.current.click={x:(event.clientX-b.x)/b.width,y:(event.clientY-b.y)/b.height,time:state.current.age};wake();}}>
 <canvas ref={canvas} role="img" aria-label={str(p,'text','Bend the moment')}/>{fallback&&<div className="warp-fallback"><strong>{str(p,'text','Bend the moment')}</strong><small>WebGL is unavailable. Showing accessible text.</small></div>}
 </div>;
}
