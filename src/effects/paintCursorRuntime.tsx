import { useLayoutEffect, useEffect, useRef, type PointerEvent } from 'react';
import { useTextAnimation, bound } from './textRuntime';
import { useAnimationCanvas, canvasPoint } from './animationCanvas';
import { num, type EffectProps } from './types';
import './cursorTrails.css';
export type PaintFrame={ctx:CanvasRenderingContext2D;width:number;height:number;dt:number;time:number;reduced:boolean;x:number;y:number;dx:number;dy:number;speed:number;active:boolean;moved:boolean;burst:number;dark:boolean;entered:boolean};
/** Resolve the actual composited background, including transparent previews and theme changes. */
export function backgroundIsDark(node:HTMLElement){
 let r=0,g=0,b=0,remaining=1;
 for(let el:HTMLElement|null=node;el&&remaining>.001;el=el.parentElement){
  const color=getComputedStyle(el).backgroundColor.match(/[\d.]+/g);if(!color||color.length<3)continue;
  const alpha=color.length>3?Number(color[3]):1,weight=remaining*alpha;r+=Number(color[0])*weight;g+=Number(color[1])*weight;b+=Number(color[2])*weight;remaining*=1-alpha;
 }
 return (r+255*remaining)*.2126+(g+255*remaining)*.7152+(b+255*remaining)*.0722<145;
}
export function usePaintCursor(p:EffectProps,draw:(frame:PaintFrame)=>boolean){
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null),dark=useRef(true);
 const input=useRef({x:0,y:0,inside:false,burst:0,entered:false,ever:false,left:0});
 const state=useRef({x:0,y:0,initialized:false,time:0,autoTime:0,waiting:false});
 const wake=useTextAnimation(host,(step,_clock,reduced)=>{
  const node=host.current,el=canvas.current,c=el?.getContext('2d');if(!node||!el||!c||p.paused===true)return false;
  const s=state.current,i=input.current,dt=reduced?0:step;s.time+=dt;
  const active=p.interactive!==false&&i.inside,delay=bound(p.idleDelay,1.5,0,10),waiting=!active&&p.autoplay!==false&&i.ever&&(performance.now()-i.left)/1000<delay;
  const auto=!active&&!waiting&&p.autoplay!==false&&!reduced;
  if(auto)s.autoTime+=dt*bound(p.autoplaySpeed,1,0,4);
  const {width,height,dpr}=box.current;
  const target=active?i:auto?{x:width*(.5+.27*Math.sin(s.autoTime*.86)),y:height*(.5+.22*Math.sin(s.autoTime*1.37+.4))}:{x:s.initialized?s.x:width/2,y:s.initialized?s.y:height/2};
  const initialized=s.initialized,px=s.x,py=s.y;
  if(!initialized||i.entered||reduced){s.x=target.x;s.y=target.y;s.initialized=true;}else{const k=followAlpha(step,bound(p.followSpeed,.03,.001,.5));s.x+=(target.x-s.x)*k;s.y+=(target.y-s.y)*k;}
  const dx=initialized&&!i.entered?s.x-px:0,dy=initialized&&!i.entered?s.y-py:0;
  c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,width,height);c.globalAlpha=1;c.globalCompositeOperation='source-over';
  const burst=i.burst;i.burst=0;
  const alive=draw({ctx:c,width,height,dt,time:s.time,reduced,x:s.x,y:s.y,dx,dy,speed:Math.hypot(dx,dy)/Math.max(step,.001),active:active||auto,moved:(active||auto)&&Math.hypot(dx,dy)>.08,burst,dark:dark.current,entered:i.entered});i.entered=false;
  node.dataset.input=active?'pointer':auto?'autoplay':'idle';
  // A bounded timeout wakes autoplay after leave; no idle RAF spins through the delay.
  return !reduced&&((auto&&num(p,'autoplaySpeed',1)>0)||alive||((active||auto)&&Math.hypot(target.x-s.x,target.y-s.y)>.1));
 });
 const box=useAnimationCanvas(host,canvas,wake,String(p.quality??'high'));
 const idleTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const clearTimer=()=>{if(idleTimer.current!==null){clearTimeout(idleTimer.current);idleTimer.current=null;}};
 const schedule=()=>{clearTimer();const i=input.current;if(!i.inside&&i.ever&&p.autoplay!==false&&p.paused!==true){const remaining=Math.max(0,bound(p.idleDelay,1.5,0,10)*1000-(performance.now()-i.left));idleTimer.current=setTimeout(()=>wake(),remaining+20);}};
 useEffect(()=>{schedule();return clearTimer;},[p.autoplay,p.idleDelay,p.paused]);
 useLayoutEffect(()=>{const update=()=>{if(host.current)dark.current=backgroundIsDark(host.current);wake();};update();const observer=new MutationObserver(update);observer.observe(document.documentElement,{attributes:true,attributeFilter:['class','style','data-theme']});return()=>observer.disconnect();},[p.background]);
 const point=(e:PointerEvent<HTMLDivElement>)=>{if(p.interactive===false||p.paused===true)return;clearTimer();const i=input.current;const entered=!i.inside;Object.assign(i,canvasPoint(e.currentTarget,e.clientX,e.clientY),{inside:true,ever:true,entered:i.entered||entered});wake();};
 const leave=()=>{const i=input.current;i.inside=false;i.left=performance.now();schedule();wake();};
 const handlers={onPointerEnter:point,onPointerMove:point,onPointerDown:(e:PointerEvent<HTMLDivElement>)=>{point(e);if(p.interactive===false||p.paused===true)return;input.current.burst++;if(e.pointerType!=='mouse')e.currentTarget.setPointerCapture(e.pointerId);wake();},onPointerUp:(e:PointerEvent<HTMLDivElement>)=>{if(e.pointerType!=='mouse'){if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);leave();}},onPointerLeave:leave,onPointerCancel:leave};
 return{host,canvas,handlers};
}
export function PaintSurface({p,name,engine}:{p:EffectProps;name:string;engine:ReturnType<typeof usePaintCursor>}){return <div ref={engine.host} className="cursor-surface" data-cursor={name} style={{background:String(p.background??'#120f17'),touchAction:'none'}} {...engine.handlers}><canvas ref={engine.canvas} role="img" aria-label={`${name} interactive cursor canvas`}/><span className="cursor-hint">Move to explore · tap or click to interact</span></div>;}
export const followAlpha=(dt:number,seconds:number)=>1-Math.exp(-Math.max(0,dt)/Math.max(.001,seconds));
export const fadeInk=(age:number,lifetime:number)=>Math.pow(Math.max(0,1-age/Math.max(.01,lifetime)),1.4);
export const clamp01=(n:number)=>Math.max(0,Math.min(1,n));
export const value=(p:EffectProps,key:string,fallback:number,min:number,max:number)=>bound(p[key],fallback,min,max);
