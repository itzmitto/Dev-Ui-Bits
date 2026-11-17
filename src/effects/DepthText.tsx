import { useRef,type CSSProperties } from 'react';
import { num,str,type EffectProps } from './types';
import { bound,easeOut,useTextAnimation } from './textRuntime';
import { useFittedText } from './textLayout';
import './DepthText.css';
export function DepthText(p:EffectProps){
 const host=useRef<HTMLDivElement>(null),stack=useRef<HTMLDivElement>(null),latest=useRef(p);latest.current=p;const s=useRef({x:0,y:0,px:0,py:0,hover:false,pressed:false,age:0,push:0,velocity:0});
 const text=str(p,'text','Elevate'),layers=Math.round(bound(p.layers,34,2,64)),depth=bound(p.depth,2.4,.1,6),size=useFittedText(host,text,num(p,'fontSize',112),num(p,'fontWeight',900),str(p,'fontFamily',''),100+Math.min(100,layers*depth*.5));
 const wake=useTextAnimation(host,(dt,time,reduced)=>{const q=latest.current,state=s.current;if(!q.paused)state.age+=dt;const tilt=num(q,'tilt',7.5),orbit=q.autoOrbit&&!state.hover&&!q.paused&&!reduced;
  const tx=state.hover&&q.pointerTracking?-state.py*tilt:orbit?Math.sin(time*num(q,'orbitSpeed',.35)*Math.PI*2)*tilt:tilt*.35,ty=state.hover&&q.pointerTracking?state.px*tilt:orbit?Math.cos(time*num(q,'orbitSpeed',.35)*Math.PI*2)*tilt:-tilt*.5;
  const alpha=reduced?1:1-Math.pow(1-bound(q.smoothing,.14,.01,1),dt*60);state.x+=(tx-state.x)*alpha;state.y+=(ty-state.y)*alpha;
  const target=reduced?0:state.hover?num(q,'hoverPush',.5)*(state.pressed?1:.7):0;const steps=Math.ceil(dt/.008);for(let i=0;i<steps;i++){state.velocity+=((target-state.push)*180-state.velocity*18)*dt/steps;state.push+=state.velocity*dt/steps;}
  const intro=reduced||q.intro===false?1:easeOut(state.age/1.2),compress=intro*(1-state.push*.8);if(stack.current){stack.current.style.transform=`translateY(${q.float&&!reduced&&!q.paused?Math.sin(time*.9)*7:0}px) rotateX(${state.x}deg) rotateY(${state.y}deg)`;stack.current.querySelectorAll<HTMLElement>('[data-layer]').forEach(layer=>{layer.style.transform=`translateZ(${-Number(layer.dataset.layer)*depth*compress}px)`;});}
  return !q.paused&&(orbit||!!q.float||state.age<1.2||Math.abs(state.x-tx)+Math.abs(state.y-ty)+Math.abs(target-state.push)>.002);
 });
 const style={fontSize:size,fontWeight:num(p,'fontWeight',900),fontFamily:str(p,'fontFamily','')||'inherit',perspective:num(p,'perspective',900)} as CSSProperties;
 return <div ref={host} className="depth-text" role="img" aria-label={text} style={style} onPointerMove={e=>{const b=e.currentTarget.getBoundingClientRect();s.current.px=(e.clientX-b.x)/b.width*2-1;s.current.py=(e.clientY-b.y)/b.height*2-1;wake();}} onPointerEnter={()=>{s.current.hover=true;wake();}} onPointerLeave={()=>{s.current.hover=false;s.current.pressed=false;wake();}} onPointerDown={()=>{s.current.pressed=true;wake();}} onPointerUp={()=>{s.current.pressed=false;wake();}} onPointerCancel={()=>{s.current.pressed=false;wake();}}>
 <div ref={stack} className="depth-stack" aria-hidden="true" style={{filter:p.shadow?'drop-shadow(0 20px 18px #0006)':undefined}}>{Array.from({length:layers},(_,i)=>i).reverse().map(i=><span key={i} data-layer={i} style={{zIndex:layers-i,color:i===0?str(p,'faceColor','#ffffff'):str(p,'depthColor','#7c3aed'),opacity:i&&p.gradientDepth?Math.pow(1-i/layers,.65):1,WebkitTextStroke:i&&p.outline?`1px ${str(p,'depthColor','#7c3aed')}`:undefined,WebkitTextFillColor:i&&p.outline?'transparent':undefined}}>{text}</span>)}</div>
 </div>;
}
