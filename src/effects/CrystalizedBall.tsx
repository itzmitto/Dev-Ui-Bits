import { useEffect,useRef,useState } from 'react';
import { num,str,type EffectProps } from './types';
import { useTextAnimation } from './textRuntime';
import { useAnimationCanvas } from './animationCanvas';
import { ballSeeds,createBallRenderer,type BallFrame } from './CrystalizedBall.renderer';
import { drawBallFallback } from './CrystalizedBall.fallback';
import './CrystalizedBall.css';
export function CrystalizedBall(p:EffectProps){
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null),fallbackCanvas=useRef<HTMLCanvasElement>(null),latest=useRef(p);latest.current=p;
 const [fallback,setFallback]=useState(false);const seeds=useRef<Float32Array|null>(null);
 const state=useRef({time:0,dust:0,age:0,x:0,y:0,px:0,py:0,hover:0,inside:false,kick:0,renderer:null as ReturnType<typeof createBallRenderer>,lost:false});
 const wake=useTextAnimation(host,(dt,_time,reduced)=>{const s=state.current,q=latest.current,b=box.current;const animate=!q.paused&&!reduced;if(animate){s.time+=dt*num(q,'speed',1);s.dust+=dt*num(q,'dustSpeed',1);s.age+=dt;}const factor=reduced?1:1-Math.exp(-dt*7);s.x+=(s.px-s.x)*factor;s.y+=(s.py-s.y)*factor;s.hover+=((q.interactive!==false&&s.inside?num(q,'hoverStrength',.7):0)-s.hover)*factor;s.kick*=Math.exp(-dt*5);
 const f:BallFrame={width:b.width,height:b.height,time:s.time,dustTime:s.dust,size:num(q,'size',.7),color:str(q,'color','#f25bd0'),background:str(q,'background','#120f17'),strands:num(q,'strands',6),crackle:num(q,'crackle',.85),flares:num(q,'flares',.65),glow:num(q,'glow',.9),sparks:num(q,'sparks',.6),particleCount:num(q,'particleCount',15000),fill:num(q,'fill',.5),motion:['rise','fall','drift','orbit'].indexOf(str(q,'motion','rise')),round:q.particleShape==='round',depth:num(q,'depth',.6),sway:num(q,'sway',.5),twinkle:num(q,'twinkle',.5),haze:num(q,'haze',.7),pointerX:s.x,pointerY:s.y,hover:s.hover,intro:q.intro===false||reduced?1:Math.min(1,s.age/1.2),kick:reduced?0:s.kick,light:q.theme==='light'};
 if(s.renderer)s.renderer.draw(f);else if(fallbackCanvas.current){const el=fallbackCanvas.current;if(el.width!==canvas.current!.width||el.height!==canvas.current!.height){el.width=canvas.current!.width;el.height=canvas.current!.height;}seeds.current??=ballSeeds(2200);drawBallFallback(el,f,seeds.current);}
 return animate&&(num(q,'speed',1)>0||num(q,'dustSpeed',1)>0||f.intro<1)||Math.abs(s.x-s.px)+Math.abs(s.y-s.py)+s.kick>.001||Math.abs(s.hover-(q.interactive!==false&&s.inside?num(q,'hoverStrength',.7):0))>.001;
 });
 const box=useAnimationCanvas(host,canvas,wake,str(p,'quality','high'));
 useEffect(()=>{const el=canvas.current!,s=state.current;const initialize=()=>{s.renderer=createBallRenderer(el);setFallback(!s.renderer);s.lost=false;wake();};const lost=(e:Event)=>{e.preventDefault();s.renderer?.dispose();s.renderer=null;setFallback(true);wake();};const restored=()=>{s.renderer?.dispose();initialize();};el.addEventListener('webglcontextlost',lost);el.addEventListener('webglcontextrestored',restored);initialize();return()=>{el.removeEventListener('webglcontextlost',lost);el.removeEventListener('webglcontextrestored',restored);s.renderer?.dispose();s.renderer=null;};},[]);
 return <div ref={host} className="crystalized-ball" style={{background:str(p,'background','#120f17')}} onPointerMove={e=>{const b=e.currentTarget.getBoundingClientRect(),r=Math.min(b.width,b.height)*num(p,'size',.7)/2,s=state.current;s.px=(e.clientX-b.x-b.width/2)/r;s.py=-(e.clientY-b.y-b.height/2)/r;s.inside=true;wake();}} onPointerLeave={()=>{const s=state.current;s.inside=false;s.px=s.py=0;wake();}} onPointerDown={()=>{if(p.interactive!==false){state.current.kick=1;wake();}}}>
 <canvas ref={canvas} role="img" aria-label="Interactive glass sphere with electric rim and suspended luminous dust" hidden={fallback}/>{fallback&&<><canvas ref={fallbackCanvas} role="img" aria-label="Canvas fallback: electric sphere and animated dust"/><small className="ball-fallback">WebGL unavailable · reduced Canvas quality</small></>}
 </div>;
}
