import { useRef } from 'react';
import { num,str,type EffectProps } from './types';
import { CursorSurface,useCursorCanvas,rand,mixColor } from './cursorRuntime';
type Bloom={x:number;y:number;vx:number;vy:number;age:number;phase:number;radius:number};
/** Organic, multi-lobed pigment sprites are rasterized only when appearance changes.
 * Motion stretches/rotates the cloud, never blurs a full-size canvas every frame. */
export function ChromaHalo(p:EffectProps){
 const state=useRef({blooms:[] as Bloom[],carry:0,sprites:[] as HTMLCanvasElement[],key:''});
 const engine=useCursorCanvas(p,f=>{const s=state.current,duration=num(p,'trailDuration',1.2),size=num(p,'size',65),force=num(p,'force',1),drift=num(p,'drift',.6),quality=str(p,'quality','medium'),resolution=quality==='low'?96:quality==='medium'?144:192;
  const key=[p.color,p.blur,quality,size].join('|');if(s.key!==key){s.key=key;s.sprites=Array.from({length:8},(_,index)=>{const el=document.createElement('canvas');el.width=el.height=resolution;const c=el.getContext('2d')!,unit=resolution/144;c.scale(unit,unit);c.filter=`blur(${num(p,'blur',8)*48/Math.max(15,size)}px)`;for(let lobe=0;lobe<5;lobe++){const angle=lobe*Math.PI*.4+index*.8,x=72+Math.cos(angle)*(lobe?18:0),y=72+Math.sin(angle)*(lobe?12:0),r=lobe?34:42,tone=mixColor(str(p,'color','#aaa4ff'),'#f8c5f5',(.5+.5*Math.sin(index+lobe))*.22),gradient=c.createRadialGradient(x-r*.15,y,0,x,y,r);gradient.addColorStop(0,tone);gradient.addColorStop(.4,tone.replace('rgb(','rgba(').replace(')',',0.8)'));gradient.addColorStop(1,'transparent');c.globalAlpha=.6;c.fillStyle=gradient;c.fillRect(x-r*1.25,y-r*1.25,r*2.5,r*2.5);}return el;});}
  if(f.moved||f.burst){s.carry+=f.burst?5:Math.min(3,f.dt*35+f.speed*.0004);const count=f.reduced?1:Math.floor(s.carry);for(let i=0;i<count;i++)s.blooms.push({x:f.x-f.dx*i/Math.max(1,count),y:f.y-f.dy*i/Math.max(1,count),vx:f.dx*force*3,vy:f.dy*force*3,age:0,phase:rand(0,Math.PI*2),radius:size*(.7+rand(0,.4))*(1+f.speed*.0002*force)});s.carry-=Math.floor(s.carry);}
  const cap=quality==='low'?26:quality==='medium'?45:70;if(s.blooms.length>cap)s.blooms.splice(0,s.blooms.length-cap);
  for(const v of s.blooms){v.age+=f.dt;v.vx*=Math.exp(-f.dt*3);v.vy*=Math.exp(-f.dt*3);v.x+=(v.vx+Math.sin(v.phase+f.time)*drift*20)*f.dt;v.y+=(v.vy+Math.cos(v.phase-f.time)*drift*17)*f.dt;const life=Math.max(0,1-v.age/duration),r=v.radius*(1+v.age*drift*.7),angle=v.phase+Math.sin(f.time*drift+v.phase)*.3,c=f.ctx;c.save();c.translate(v.x,v.y);c.rotate(angle);c.scale(1+Math.min(.5,Math.hypot(v.vx,v.vy)*.002)+Math.sin(f.time+v.phase)*drift*.12,1+Math.cos(f.time+v.phase)*drift*.1);c.globalAlpha=Math.min(.8,num(p,'intensity',1.3)*num(p,'opacity',.9)*life*life*.65);c.drawImage(s.sprites[Math.floor(v.phase/Math.PI/2*8)%8],-r*1.4,-r*1.4,r*2.8,r*2.8);c.restore();}
  s.blooms=s.blooms.filter(v=>v.age<duration);engine.host.current?.setAttribute('data-particles',String(s.blooms.length));return s.blooms.length>0;
 });return <CursorSurface name="Chroma Halo" p={p} engine={engine}/>;
}
