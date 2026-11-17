import { useEffect,useState,type RefObject } from 'react';
import { fontOf } from './textRuntime';
/** Measure the actual font once per typography/size change, never per frame. */
export function useFittedText(host:RefObject<HTMLElement|null>,text:string,size:number,weight:number,family='',padding=64){
 const [fitted,setFitted]=useState(size);
 useEffect(()=>{const root=host.current;if(!root)return;let live=true;const c=document.createElement('canvas').getContext('2d')!;
  const resize=()=>{if(!live)return;const b=root.getBoundingClientRect();c.font=`${weight} ${size}px ${fontOf(root,family)}`;const lines=text.split('\n'),w=Math.max(1,...lines.map(line=>c.measureText(line).width));setFitted(Math.max(8,size*Math.min(1,Math.max(8,b.width-padding)/w,Math.max(8,b.height-padding)/(size*1.2*lines.length))));};
  const observer=new ResizeObserver(resize);observer.observe(root);document.fonts?.addEventListener('loadingdone',resize);void document.fonts?.ready.then(resize);resize();return()=>{live=false;observer.disconnect();document.fonts?.removeEventListener('loadingdone',resize);};
 },[host,text,size,weight,family,padding]);return fitted;
}
export function staggerRanks(count:number,from:string){
 const values=Array.from({length:count},(_,i)=>i);
 if(from==='end')values.reverse();else if(from==='center')values.sort((a,b)=>Math.abs(a-(count-1)/2)-Math.abs(b-(count-1)/2));else if(from==='edges')values.sort((a,b)=>Math.min(a,count-1-a)-Math.min(b,count-1-b));else if(from==='random')values.sort((a,b)=>((Math.imul(a+1,1103515245)>>>0)%997)-((Math.imul(b+1,1103515245)>>>0)%997));
 return Array.from({length:count},(_,i)=>values.indexOf(i));
}
export function textEase(t:number,ease:string){t=Math.max(0,Math.min(1,t));if(ease==='linear')return t;if(ease==='ease-in-out')return .5-.5*Math.cos(t*Math.PI);if(ease==='snappy')return 1-Math.pow(1-t,5);return 1-Math.pow(1-t,3);}
