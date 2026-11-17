import { useEffect,useId,useMemo,useRef, type PointerEvent } from 'react';
import { num,str,type EffectProps } from './types';
import { bound,useTextAnimation } from './textRuntime';
import './TextLoop.css';

export function loopPath(shape:string,curve:number){
 if(shape==='circle'){const r=Math.min(215,110+curve);return `M ${600-r} 260 a ${r} ${r} 0 1 1 ${r*2} 0 a ${r} ${r} 0 1 1 ${-r*2} 0`;}
 const points=Array.from({length:241},(_,i)=>{
  const t=i/240;
  if(shape==='infinity')return [600+390*Math.sin(t*Math.PI*2),260+curve*Math.sin(t*Math.PI*4)];
  const x=-1200+t*3600;return [x,shape==='line'?260:shape==='arch'?340-curve*1.7*Math.sin((x/1200)*Math.PI):260+curve*Math.sin(x*Math.PI/300)];
 });return points.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
}
export function TextLoop(p:EffectProps){
 const host=useRef<HTMLDivElement>(null),paths=useRef<(SVGTextPathElement|null)[]>([]),route=useRef<SVGPathElement>(null),id=useId().replaceAll(':','');
 const motion=useRef({phase:0,velocity:0,boost:0,hover:false,drag:false,lastX:0,lastAngle:0,period:350});
 const shape=str(p,'shape','wave'),curve=bound(p.curviness,90,0,180),fontSize=bound(p.fontSize,46,12,140);
 const d=useMemo(()=>str(p,'path','')||loopPath(shape,curve),[p.path,shape,curve]);
 const phrase=`${str(p,'text','DevUI ✦ Bits')} ${str(p,'separator','✦')} `;
 const text=p.uppercase===false?phrase:phrase.toUpperCase();
 useEffect(()=>{
  const path=route.current;if(!path)return;const sample=document.createElement('canvas').getContext('2d')!;
  sample.font=`${num(p,'fontWeight',800)} ${fontSize}px ${getComputedStyle(host.current!).fontFamily}`;
  const width=sample.measureText(text).width+Array.from(text).length*num(p,'letterSpacing',2);
  const length=path.getTotalLength();motion.current.period=['circle','infinity'].includes(shape)?length/Math.max(1,Math.round(length/width)):Math.max(20,width);
 },[text,fontSize,p.fontWeight,p.letterSpacing,d,shape]);
 const wake=useTextAnimation(host,(dt,_time,reduced)=>{
  const state=motion.current,desired=(p.paused||state.hover&&p.pauseOnHover!==false?0:num(p,'speed',90))*(p.direction==='reverse'?-1:1);
  if(!state.drag&&!reduced){state.velocity+=(desired+state.boost-state.velocity)*(1-Math.exp(-dt*5));state.phase+=state.velocity*dt;state.boost*=Math.exp(-dt*4);}
  const phase=((state.phase%state.period)+state.period)%state.period;
  paths.current.forEach((node,index)=>node?.setAttribute('startOffset',String(index?phase-state.period*2:-phase-state.period)));
  return !p.paused&&(Math.abs(state.velocity)>.01||Math.abs(desired)>.01||Math.abs(state.boost)>.01);
 });
 useEffect(()=>{let previous=window.scrollY,when=performance.now();const onScroll=()=>{const now=performance.now(),dy=window.scrollY-previous;motion.current.boost=Math.max(-600,Math.min(600,dy/Math.max(16,now-when)*100*num(p,'scrollBoost',0)));previous=window.scrollY;when=now;wake();};window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll);},[p.scrollBoost]);
 const pointer=(event:PointerEvent)=>{const bounds=event.currentTarget.getBoundingClientRect();return{x:(event.clientX-bounds.x)*1200/bounds.width,angle:Math.atan2(event.clientY-bounds.y-bounds.height/2,event.clientX-bounds.x-bounds.width/2)};};
 const band=(cross:boolean)=>{const index=cross?1:0,color=cross?str(p,'crossColor','#bdadff'):str(p,'ribbonColor','#5227ff');return <g key={index} transform={`rotate(${num(p,'tilt',0)+(p.cross?(cross?1:-1)*num(p,'crossAngle',16)/2:0)} 600 260)`}>
  {p.ribbon!==false&&<use href={`#loop-${id}`} fill="none" stroke={color} strokeWidth={num(p,'ribbonWidth',86)} className={!cross&&p.cross?'loop-upper-band':''}/>}
  <text fill={p.outline?'none':cross&&p.ribbon!==false?'#15111c':str(p,'color','#ffffff')} stroke={p.outline?str(p,'color','#ffffff'):'none'} strokeWidth={num(p,'outlineWidth',1.5)} fontSize={fontSize} fontWeight={num(p,'fontWeight',800)} letterSpacing={num(p,'letterSpacing',2)} dominantBaseline="central"><textPath ref={el=>{paths.current[index]=el;}} href={`#loop-${id}`}>{text.repeat(50)}</textPath></text>
 </g>;};
 return <div ref={host} className="text-loop" role="img" aria-label={str(p,'text','DevUI ✦ Bits')} style={{cursor:p.draggable?'grab':'default',touchAction:p.draggable?'none':'pan-y'}}
 onPointerEnter={()=>{motion.current.hover=true;wake();}} onPointerLeave={()=>{motion.current.hover=false;wake();}}
 onPointerDown={event=>{if(!p.draggable||event.button!==0)return;event.currentTarget.setPointerCapture(event.pointerId);const pt=pointer(event);Object.assign(motion.current,{drag:true,lastX:pt.x,lastAngle:pt.angle});}}
 onPointerMove={event=>{const state=motion.current;if(!state.drag)return;const pt=pointer(event);let delta=pt.x-state.lastX;if(shape==='circle'){let angle=pt.angle-state.lastAngle;if(angle>Math.PI)angle-=Math.PI*2;if(angle< -Math.PI)angle+=Math.PI*2;delta=angle*(110+curve);}state.phase+=delta;state.velocity=delta*25;state.lastX=pt.x;state.lastAngle=pt.angle;wake();}}
 onPointerUp={event=>{motion.current.drag=false;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);wake();}} onPointerCancel={()=>{motion.current.drag=false;wake();}}>
 <svg viewBox="0 0 1200 520" aria-hidden="true" preserveAspectRatio="xMidYMid meet"><defs><path id={`loop-${id}`} d={d} ref={route}/><linearGradient id={`fade-${id}`}><stop offset="0" stopColor="white" stopOpacity={p.edgeFade?0:1}/><stop offset={`${num(p,'edgeFade',0)*25}%`} stopColor="white"/><stop offset={`${100-num(p,'edgeFade',0)*25}%`} stopColor="white"/><stop offset="100%" stopColor="white" stopOpacity={p.edgeFade?0:1}/></linearGradient><mask id={`mask-${id}`}><rect width="1200" height="520" fill={`url(#fade-${id})`}/></mask></defs><g mask={`url(#mask-${id})`}>{p.cross&&band(true)}{band(false)}</g></svg>
 </div>;
}
