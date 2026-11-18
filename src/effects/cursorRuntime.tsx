import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { useTextAnimation, bound } from './textRuntime';
import { useAnimationCanvas, canvasPoint, rgb } from './animationCanvas';
import type { EffectProps } from './types';
import './cursorTrails.css';
export type CursorFrame={ctx:CanvasRenderingContext2D;width:number;height:number;dt:number;time:number;reduced:boolean;x:number;y:number;dx:number;dy:number;speed:number;active:boolean;moved:boolean;burst:number};
export type CursorDraw=(frame:CursorFrame)=>boolean;
/** Input/lifecycle only. Every effect owns its own simulation and renderer. */
export function useCursorCanvas(p:EffectProps,draw:CursorDraw){
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 const input=useRef({x:0,y:0,inside:false,burst:0,initialized:false});
 const follower=useRef({x:0,y:0,initialized:false,time:0});
 const wake=useTextAnimation(host,(step,_time,reduced)=>{
  const node=host.current,el=canvas.current,ctx=el?.getContext('2d');if(!node||!el||!ctx)return false;
  if(p.paused===true){input.current.burst=0;return false;}
  const dt=reduced?0:step,state=follower.current;state.time+=dt;
  const {width,height,dpr}=box.current;const active=p.interactive!==false&&input.current.inside;
  const auto=!active&&p.autoplay===true&&!reduced;
  const target=active?input.current:auto?{x:width*(.5+.28*Math.sin(state.time*.86)),y:height*(.5+.22*Math.sin(state.time*1.37))}:{x:state.initialized?state.x:width/2,y:state.initialized?state.y:height/2};
  const prevX=state.x,prevY=state.y;
  if(!state.initialized||reduced){state.x=target.x;state.y=target.y;state.initialized=true;}
  else {const smoothing=bound(p.followSpeed,.035,.001,.5),alpha=1-Math.exp(-step/smoothing);state.x+=(target.x-state.x)*alpha;state.y+=(target.y-state.y)*alpha;}
  const dx=state.x-prevX,dy=state.y-prevY,speed=Math.min(2200,Math.hypot(dx,dy)/Math.max(step,.001));
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
  const burst=input.current.burst;input.current.burst=0;
  const alive=draw({ctx,width,height,dt,time:state.time,reduced,x:state.x,y:state.y,dx,dy,speed,active:active||auto,moved:(active||auto)&&Math.hypot(dx,dy)>.12,burst});
  node.dataset.input=active?'pointer':auto?'autoplay':'idle';
  return !reduced&&(auto||alive||((active||auto)&&Math.hypot(target.x-state.x,target.y-state.y)>.15));
 });
 const box=useAnimationCanvas(host,canvas,wake,String(p.quality??'high'));
 const point=(event:ReactPointerEvent<HTMLDivElement>)=>{if(p.interactive===false||p.paused===true)return;const pos=canvasPoint(event.currentTarget,event.clientX,event.clientY);Object.assign(input.current,pos,{inside:true,initialized:true});wake();};
 const handlers={onPointerEnter:point,onPointerMove:point,onPointerDown:(event:ReactPointerEvent<HTMLDivElement>)=>{point(event);if(p.interactive===false||p.paused===true)return;input.current.burst++;if(event.pointerType!=='mouse')event.currentTarget.setPointerCapture(event.pointerId);wake();},onPointerUp:(event:ReactPointerEvent<HTMLDivElement>)=>{if(event.pointerType!=='mouse'){input.current.inside=false;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);wake();}},onPointerLeave:()=>{input.current.inside=false;wake();},onPointerCancel:()=>{input.current.inside=false;wake();}};
 return {host,canvas,handlers};
}
export function CursorSurface({p,name,engine}:{p:EffectProps;name:string;engine:ReturnType<typeof useCursorCanvas>}){return <div ref={engine.host} className="cursor-surface" data-cursor={name} style={{background:String(p.background??'#120f17')}} {...engine.handlers}><canvas ref={engine.canvas} role="img" aria-label={`${name} interactive cursor canvas`}/><span className="cursor-hint">Move to explore · tap or click to interact</span></div>;}
export function mixColor(a:string,b:string,t:number){const x=rgb(a),y=rgb(b),v=Math.max(0,Math.min(1,t));return `rgb(${x.map((c,i)=>Math.round((c+(y[i]-c)*v)*255)).join(',')})`;}
export const rand=(a:number,b:number)=>a+Math.random()*(b-a);
