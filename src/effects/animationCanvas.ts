import { useEffect, useRef, type RefObject } from 'react';
import { sizeCanvas } from './textCanvas';
/** Resize once per geometry change; drawing stays outside React. */
export function useAnimationCanvas(host:RefObject<HTMLElement|null>,canvas:RefObject<HTMLCanvasElement|null>,wake:()=>void,quality='high'){
 const box=useRef({width:1,height:1,dpr:1});
 useEffect(()=>{const node=host.current!,el=canvas.current!;const resize=()=>{const width=Math.max(1,node.clientWidth),height=Math.max(1,node.clientHeight),cap=quality==='low'?1:quality==='medium'?1.5:2;sizeCanvas(el,width,height,Math.min(devicePixelRatio||1,cap));box.current={width,height,dpr:el.width/width};wake();};const observer=new ResizeObserver(resize);observer.observe(node);resize();return()=>observer.disconnect();},[host,canvas,quality]);
 return box;
}
export const rgb=(hex:string)=>{const h=/^#[0-9a-f]{6}$/i.test(hex)?hex:'#a78bfa';return [parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255] as const;};
export const rgba=(hex:string,alpha:number)=>{const c=rgb(hex);return `rgba(${c.map(x=>Math.round(x*255)).join(',')},${Math.max(0,Math.min(1,alpha))})`;};
