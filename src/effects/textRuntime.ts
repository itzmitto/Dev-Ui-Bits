import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
export type TextFrame = (dt:number,time:number,reduced:boolean)=>boolean;
/** One visibility-aware animation clock. Effects own their state and rendering. */
export function useTextAnimation(host:RefObject<HTMLElement|SVGSVGElement|null>,render:TextFrame){
 const latest=useRef(render),wakeRef=useRef(()=>{});latest.current=render;
 useEffect(()=>{
  const node=host.current;if(!node)return;
  let frame=0,last=0,time=0,visible=true,dead=false;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const wake=()=>{if(dead)return;const motion=!visible||document.hidden?'paused':media.matches?'reduced':'running';if(node.dataset.motion!==motion)node.dataset.motion=motion;if(!visible||document.hidden){cancelAnimationFrame(frame);frame=0;last=0;}else if(!frame)frame=requestAnimationFrame(tick);};
  const tick=(now:number)=>{frame=0;if(dead||!visible||document.hidden)return;const motion=media.matches?'reduced':'running';if(node.dataset.motion!==motion)node.dataset.motion=motion;const dt=last?Math.min(.04,(now-last)/1000):1/60;last=now;if(!media.matches)time+=dt;if(latest.current(dt,time,media.matches)&&!media.matches)wake();else last=0;};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;wake();});observer.observe(node);
  document.addEventListener('visibilitychange',wake);media.addEventListener('change',wake);wakeRef.current=wake;wake();
  return()=>{dead=true;wakeRef.current=()=>{};cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',wake);media.removeEventListener('change',wake);};
 },[host]);
 useLayoutEffect(()=>{wakeRef.current();});
 return ()=>wakeRef.current();
}
export const bound=(value:unknown,fallback:number,min:number,max:number)=>Math.max(min,Math.min(max,typeof value==='number'&&Number.isFinite(value)?value:fallback));
export function seeded(seed:number){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
export const easeOut=(x:number)=>1-Math.pow(1-Math.max(0,Math.min(1,x)),3);
export function fontOf(host:Element,family:string){return family&&family!=='inherit'?family:getComputedStyle(host).fontFamily;}
