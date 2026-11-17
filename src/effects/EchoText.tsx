import { useEffect,useRef } from 'react';
import { num,str,type EffectProps } from './types';
import { bound,useTextAnimation } from './textRuntime';
import { textEase,useFittedText } from './textLayout';
import './EchoText.css';
export function mixEchoColor(a:string,b:string,t:number){const rgb=(hex:string)=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)||0);const x=rgb(a),y=rgb(b);return `rgb(${x.map((v,i)=>Math.round(v+(y[i]-v)*t)).join(',')})`;}
export function EchoText(p:EffectProps){
 const host=useRef<HTMLDivElement>(null),mark=useRef<HTMLDivElement>(null),latest=useRef(p);latest.current=p;const state=useRef({age:0,hover:false,px:0,py:0,scroll:0,burst:10,burstX:0,burstY:0,points:Array.from({length:25},()=>({x:0,y:0}))});
 const text=str(p,'text','Motion Echo'),count=Math.round(bound(p.echoes,12,1,24)),size=useFittedText(host,text,num(p,'fontSize',112),num(p,'fontWeight',800),str(p,'fontFamily',''),80+num(p,'offset',36)*2);
 const wake=useTextAnimation(host,(dt,time,reduced)=>{const q=latest.current,s=state.current;if(!q.paused){s.age+=dt;s.burst+=dt;}
  const offset=num(q,'offset',36),radius=num(q,'cursorRadius',320),live=q.mode!=='entrance'&&!reduced;
  let x=0,y=0;if(live){if(s.hover){x=Math.max(-1,Math.min(1,s.px/radius))*offset;y=Math.max(-1,Math.min(1,s.py/radius))*offset;}else if(q.trail==='auto'){x=Math.sin(time*.7)*offset;y=Math.sin(time*1.4)*offset*.45;}if(q.trail==='scroll'){x+=s.scroll*.08;y+=s.scroll*.22;}}
  if(!q.paused)s.scroll*=Math.exp(-dt*8);const alpha=reduced?1:1-Math.exp(-dt/Math.max(.01,num(q,'lag',.24)*.3));let previous={x,y};s.points.forEach((point,i)=>{const target=previous;point.x+=(target.x-point.x)*alpha;point.y+=(target.y-point.y)*alpha;previous=point;if(i>count)return;const layer=mark.current?.querySelector<HTMLElement>(`[data-echo="${i}"]`);if(!layer)return;const t=i/Math.max(1,count),entrance=q.mode==='pointer'||reduced?0:1-textEase(s.age/(num(q,'duration',900)/1000),str(q,'ease','ease-out'));let dx=(q.direction==='left'?-1:q.direction==='up'||q.direction==='down'?0:1)*offset*t*entrance,dy=(q.direction==='up'?-1:q.direction==='down'||q.direction==='diagonal'?1:0)*offset*t*entrance;
   if(s.burst<1.4&&i>0&&!reduced){const a=i*2.399,d=Math.sin(s.burst/1.4*Math.PI)*offset*t*2;dx+=Math.cos(a)*d+s.burstX*t*.1;dy+=Math.sin(a)*d+s.burstY*t*.1;}
   layer.style.transform=`translate(${point.x+dx}px,${point.y+dy}px) scale(${1+(num(q,'echoScale',1)-1)*t})`;layer.style.opacity=String(i===0?1:Math.pow(num(q,'fade',.72),i)*(.3+.7*Math.max(entrance,Math.min(1,Math.hypot(point.x-x,point.y-y)/2+(s.burst<1.4?1:0)))));
  });const unsettled=s.points.slice(0,count+1).some(point=>Math.abs(point.x-x)+Math.abs(point.y-y)>.02);return !q.paused&&(s.age<num(q,'duration',900)/1000||s.burst<1.4||q.trail==='auto'&&live||unsettled||Math.abs(s.scroll)>.01);
 });
 useEffect(()=>{const s=state.current;s.age=0;s.points=Array.from({length:25},()=>({x:0,y:0}));wake();},[p.text,p.mode,p.direction]);
 useEffect(()=>{if(p.trail!=='scroll')return;let last=scrollY,lastTime=performance.now();const onScroll=()=>{const now=performance.now(),s=state.current;s.scroll=Math.max(-160,Math.min(160,(scrollY-last)/Math.max(16,now-lastTime)*100));last=scrollY;lastTime=now;wake();};addEventListener('scroll',onScroll,{passive:true});return()=>removeEventListener('scroll',onScroll);},[p.trail]);
 const color=str(p,'color','#ffffff');return <div ref={host} className="echo-text" role="img" aria-label={text} style={{fontSize:size,fontWeight:num(p,'fontWeight',800),fontFamily:str(p,'fontFamily','')||'inherit'}} onPointerMove={e=>{const b=e.currentTarget.getBoundingClientRect();state.current.px=e.clientX-b.x-b.width/2;state.current.py=e.clientY-b.y-b.height/2;state.current.hover=Math.hypot(state.current.px,state.current.py)<num(p,'cursorRadius',320);wake();}} onPointerLeave={()=>{state.current.hover=false;wake();}} onClick={()=>{if(p.clickBurst){state.current.burst=0;state.current.burstX=state.current.px;state.current.burstY=state.current.py;wake();}}}>
 <div ref={mark} className="echo-wordmark" aria-hidden="true">{Array.from({length:count+1},(_,i)=>i).reverse().map(i=><span key={i} data-echo={i} style={{color:i?mixEchoColor(p.gradient?str(p,'nearColor','#7dd3fc'):color,str(p,'tint','#7dd3fc'),i/count):color,filter:i?`blur(${num(p,'blur',3)*i/count}px)`:undefined,WebkitTextStroke:i&&p.echoStyle==='outline'?'1px currentColor':undefined,WebkitTextFillColor:i&&p.echoStyle==='outline'?'transparent':undefined}}>{text}</span>)}</div>
 </div>;
}
