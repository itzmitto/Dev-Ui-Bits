import { useEffect,useRef } from 'react';
import { num,str,type EffectProps } from './types';
import { bound,easeOut,fontOf,seeded,useTextAnimation } from './textRuntime';
import { rasterText,sizeCanvas } from './textCanvas';
import './ParticleText.css';
type Particle={homeX:number;homeY:number;x:number;y:number;vx:number;vy:number;startX:number;startY:number;delay:number;seed:number};
export function ParticleText(p:EffectProps){
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null),latest=useRef(p);latest.current=p;
 const data=useRef({particles:[] as Particle[],w:1,h:1,dpr:1,age:0,pointer:{x:-10000,y:-10000},glow:null as HTMLCanvasElement|null});
 const restart=()=>{const s=data.current,random=seeded(531),q=latest.current;s.age=0;for(const dot of s.particles){const angle=random()*Math.PI*2,distance=num(q,'scatter',190)*(.5+random());dot.startX=dot.homeX+Math.cos(angle)*distance;dot.startY=dot.homeY+Math.sin(angle)*distance;dot.x=dot.startX;dot.y=dot.startY;dot.vx=dot.vy=0;}};
 const wake=useTextAnimation(host,(dt,_time,reduced)=>{
  const s=data.current,c=canvas.current?.getContext('2d');if(!c)return false;const q=latest.current;if(!q.paused)s.age+=dt;
  c.setTransform(s.dpr,0,0,s.dpr,0,0);c.clearRect(0,0,s.w,s.h);
  const duration=bound(q.gatherDuration,1600,100,6000)/1000,stagger=num(q,'stagger',420)/1000,radius=num(q,'repelRadius',120),size=num(q,'particleSize',2.2);
  let moving=false;
  for(const dot of s.particles){
   const progress=reduced?1:easeOut((s.age-dot.delay*stagger)/duration);
   if(progress<1){
    if(q.intro==='rain'){dot.x=dot.homeX+Math.sin((1-progress)*5+dot.seed)*18*(1-progress);dot.y=dot.homeY-(1-progress)*(s.h+100);}
    else if(q.intro==='spiral'){const angle=(1-progress)*Math.PI*3+dot.seed,dist=(1-progress)*num(q,'scatter',190);dot.x=dot.homeX+Math.cos(angle)*dist;dot.y=dot.homeY+Math.sin(angle)*dist;}
    else if(q.intro==='scan'){const local=easeOut((s.age-dot.homeX/s.w*duration)/.35);dot.x=dot.homeX;dot.y=dot.homeY+(1-local)*num(q,'scatter',190);}
    else{dot.x=dot.startX+(dot.homeX-dot.startX)*progress;dot.y=dot.startY+(dot.homeY-dot.startY)*progress;}
    moving=true;
   }else if(!q.paused&&!reduced){
    const drift=num(q,'idleDrift',.8),tx=dot.homeX+Math.sin(s.age*.8+dot.seed)*drift,ty=dot.homeY+Math.cos(s.age*.7+dot.seed)*drift;
    const dx=dot.x-s.pointer.x,dy=dot.y-s.pointer.y,distance=Math.hypot(dx,dy);
    if(distance<radius&&distance>0){const force=(1-distance/radius)*num(q,'pointerRepel',42)*12;dot.vx+=dx/distance*force*dt;dot.vy+=dy/distance*force*dt;}
    const steps=Math.ceil(dt/.008);for(let i=0;i<steps;i++){const t=dt/steps;dot.vx+=((tx-dot.x)*85-dot.vx*12)*t;dot.vy+=((ty-dot.y)*85-dot.vy*12)*t;dot.x+=dot.vx*t;dot.y+=dot.vy*t;}
    moving ||= Math.abs(dot.vx)+Math.abs(dot.vy)>.05||drift>0;
   }else if(reduced){dot.x=dot.homeX;dot.y=dot.homeY;}
   const distance=Math.hypot(dot.x-dot.homeX,dot.y-dot.homeY),highlight=q.highlightMode==='gradient'?dot.homeX/s.w:Math.min(1,distance/30);
   c.globalAlpha=Math.max(.15,Math.min(1,progress*3));c.fillStyle=str(q,'color','#ffffff');
   if(q.glow!==false&&highlight>.2&&s.glow){c.globalAlpha=highlight*.35;c.drawImage(s.glow,dot.x-size*3,dot.y-size*3,size*6,size*6);c.globalAlpha=Math.max(.15,Math.min(1,progress*3));}
   const draw=()=>{if(q.shape==='square')c.fillRect(dot.x-size/2,dot.y-size/2,size,size);else if(q.shape==='line'){c.lineWidth=Math.max(.5,size*.55);c.strokeStyle=c.fillStyle;c.beginPath();c.moveTo(dot.x-1,dot.y+1);c.lineTo(dot.x+1+dot.vx*.025,dot.y-1+dot.vy*.025);c.stroke();}else{c.beginPath();c.arc(dot.x,dot.y,size/2,0,Math.PI*2);c.fill();}};
   draw();if(highlight>.01){c.globalAlpha*=highlight;c.fillStyle=str(q,'highlightColor','#ff5a36');draw();}
  }
  if(q.intro==='scan'&&s.age<duration+.4&&!reduced){c.strokeStyle=str(q,'highlightColor','#ff5a36');c.globalAlpha=.6;c.lineWidth=1;c.beginPath();c.moveTo(s.w*s.age/duration,0);c.lineTo(s.w*s.age/duration,s.h);c.stroke();}
  c.globalAlpha=1;if(canvas.current)canvas.current.dataset.particleCount=String(s.particles.length);
  return !q.paused&&(moving||s.age<duration+stagger);
 });
 useEffect(()=>{
  const root=host.current!,el=canvas.current!,s=data.current,mask=document.createElement('canvas');
  const resize=()=>{const q=latest.current,rect=root.getBoundingClientRect();s.w=rect.width;s.h=rect.height;s.dpr=sizeCanvas(el,s.w,s.h);
   const {ctx}=rasterText(mask,str(q,'text','Future Interfaces'),s.w,s.h,bound(q.fontSize,128,24,300),num(q,'fontWeight',800),fontOf(root,str(q,'fontFamily','')));
   const pixels=ctx.getImageData(0,0,mask.width,mask.height).data,step=Math.max(2,Math.round(num(q,'density',4))),random=seeded(231);s.particles=[];
   const targets:{x:number;y:number}[]=[];for(let y=0;y<mask.height;y+=step)for(let x=0;x<mask.width;x+=step)if(pixels[(y*mask.width+x)*4+3]>128)targets.push({x,y});
   for(let i=0;i<targets.length;i+=Math.max(1,targets.length/7000)){const {x,y}=targets[Math.floor(i)];s.particles.push({homeX:x,homeY:y,x,y,vx:0,vy:0,startX:x,startY:y,delay:random(),seed:random()*Math.PI*2});}
   restart();wake();};
  resize();const observer=new ResizeObserver(resize);observer.observe(root);document.fonts?.addEventListener('loadingdone',resize);void document.fonts?.ready.then(()=>{if(root.isConnected)resize();});
  return()=>{observer.disconnect();document.fonts?.removeEventListener('loadingdone',resize);s.particles=[];};
 },[p.text,p.fontSize,p.fontWeight,p.fontFamily,p.density]);
 useEffect(()=>{const glow=document.createElement('canvas');glow.width=glow.height=32;const c=glow.getContext('2d')!,g=c.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,str(p,'highlightColor','#ff5a36'));g.addColorStop(1,str(p,'highlightColor','#ff5a36')+'00');c.fillStyle=g;c.fillRect(0,0,32,32);data.current.glow=glow;wake();},[p.highlightColor]);
 useEffect(()=>{restart();wake();},[p.intro,p.scatter]);
 const burst=(x:number,y:number)=>{const q=latest.current;if(q.trigger==='click'){restart();wake();return;}if(q.clickBurst===false)return;for(const dot of data.current.particles){const dx=dot.x-x,dy=dot.y-y,d=Math.hypot(dx,dy)||1,f=Math.max(0,1-d/360)*num(q,'burstStrength',1)*1000;dot.vx+=dx/d*f;dot.vy+=dy/d*f;}wake();};
 return <div ref={host} className="particle-text" onPointerMove={event=>{const b=event.currentTarget.getBoundingClientRect();data.current.pointer={x:event.clientX-b.x,y:event.clientY-b.y};wake();}} onPointerLeave={()=>{data.current.pointer={x:-10000,y:-10000};wake();}} onPointerEnter={()=>{if(p.trigger==='hover'){restart();wake();}}} onClick={event=>{const b=event.currentTarget.getBoundingClientRect();burst(event.clientX-b.x,event.clientY-b.y);}}><canvas ref={canvas} role="img" aria-label={str(p,'text','Future Interfaces')} tabIndex={0} onKeyDown={event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();burst(data.current.w/2,data.current.h/2);}}}/></div>;
}
