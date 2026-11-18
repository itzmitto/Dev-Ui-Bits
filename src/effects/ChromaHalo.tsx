import { useRef } from 'react';
import { num,str,type EffectProps } from './types';
import { CursorSurface,useCursorCanvas,rand,mixColor } from './cursorRuntime';
type Bloom={x:number;y:number;vx:number;vy:number;age:number;phase:number;radius:number};
export function ChromaHalo(p:EffectProps){
 const state=useRef({blooms:[] as Bloom[],carry:0,layer:null as HTMLCanvasElement|null});
 const engine=useCursorCanvas(p,f=>{const s=state.current,duration=num(p,'trailDuration',1.2),size=num(p,'size',65),force=num(p,'force',1),drift=num(p,'drift',.6),quality=str(p,'quality','medium'),scale=quality==='low'?.35:quality==='medium'?.55:.8;
  if(!s.layer)s.layer=document.createElement('canvas');const w=Math.ceil(f.width*scale),h=Math.ceil(f.height*scale);if(s.layer.width!==w||s.layer.height!==h){s.layer.width=w;s.layer.height=h;}const c=s.layer.getContext('2d')!;c.setTransform(scale,0,0,scale,0,0);c.clearRect(0,0,f.width,f.height);
  if(f.moved||f.burst){s.carry+=f.burst?5:Math.min(3,f.dt*35+f.speed*.0004);const count=f.reduced?1:Math.floor(s.carry);for(let i=0;i<count;i++)s.blooms.push({x:f.x-f.dx*i/Math.max(1,count),y:f.y-f.dy*i/Math.max(1,count),vx:f.dx*force*3,vy:f.dy*force*3,age:0,phase:rand(0,Math.PI*2),radius:size*(.7+rand(0,.4))*(1+f.speed*.0002*force)});s.carry-=Math.floor(s.carry);}
  const cap=quality==='low'?26:quality==='medium'?45:70;if(s.blooms.length>cap)s.blooms.splice(0,s.blooms.length-cap);
  for(const v of s.blooms){v.age+=f.dt;v.vx*=Math.exp(-f.dt*3);v.vy*=Math.exp(-f.dt*3);v.x+=(v.vx+Math.sin(v.phase+f.time)*drift*20)*f.dt;v.y+=(v.vy+Math.cos(v.phase-f.time)*drift*17)*f.dt;const life=Math.max(0,1-v.age/duration),r=v.radius*(1+v.age*drift*.7),angle=Math.atan2(v.vy,v.vx),color=mixColor(str(p,'color','#a6a1ff'),'#f8c5f5',(.5+.5*Math.sin(v.phase))*.25);c.save();c.translate(v.x,v.y);c.rotate(angle);c.scale(1+Math.min(.5,Math.hypot(v.vx,v.vy)*.002),1);const gradient=c.createRadialGradient(-r*.2,0,r*.05,0,0,r);gradient.addColorStop(0,color);gradient.addColorStop(.55,color);gradient.addColorStop(1,'transparent');c.fillStyle=gradient;c.globalAlpha=Math.min(.65,num(p,'intensity',1)*num(p,'opacity',.8)*life*life*.5);c.beginPath();for(let j=0;j<=32;j++){const a=j/32*Math.PI*2,rr=r*(1+.13*Math.sin(a*3+v.phase+f.time*drift)+.08*Math.cos(a*5-v.phase));if(!j)c.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);else c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();c.fill();c.restore();}
  s.blooms=s.blooms.filter(v=>v.age<duration);f.ctx.filter=`blur(${num(p,'blur',8)}px)`;f.ctx.drawImage(s.layer,0,0,f.width,f.height);f.ctx.filter='none';engine.host.current?.setAttribute('data-particles',String(s.blooms.length));return s.blooms.length>0;
 });return <CursorSurface name="Chroma Halo" p={p} engine={engine}/>;
}
