import { useRef } from 'react';
import { num,str,type EffectProps } from './types';
import { CursorSurface,useCursorCanvas,rand } from './cursorRuntime';
type Paper={x:number;y:number;vx:number;vy:number;angle:number;phase:number;spin:number;size:number;age:number;color:number;shape:number};
export function CelebrationCursor(p:EffectProps){
 const papers=useRef<Paper[]>([]),emission=useRef(0);
 const engine=useCursorCanvas(p,f=>{const {ctx:c,dt,time}=f,colors=[str(p,'color','#a78bfa'),str(p,'secondColor','#f472b6'),str(p,'thirdColor','#fbbf24')],life=num(p,'lifetime',3.2),size=num(p,'size',12),variance=num(p,'sizeVariance',.4);
  const spawn=(count:number,burst:boolean)=>{for(let i=0;i<count;i++){const angle=burst?(-Math.PI/2+rand(-1,1)*num(p,'burstSpread',Math.PI)):rand(-Math.PI,0),force=burst?num(p,'burstForce',350):num(p,'spread',90);papers.current.push({x:f.x,y:f.y,vx:Math.cos(angle)*rand(force*.25,force)+(burst?0:f.dx*8),vy:Math.sin(angle)*rand(force*.3,force),angle:rand(0,Math.PI*2),phase:rand(0,Math.PI*2),spin:rand(-1,1),size:size*(1+rand(-variance,variance)),age:0,color:Math.floor(rand(0,3)),shape:Math.floor(rand(0,3))});}};
  if(f.moved){emission.current+=num(p,'density',30)*Math.min(.06,Math.hypot(f.dx,f.dy)/160+dt);const count=Math.min(18,Math.floor(emission.current));spawn(f.reduced?Math.min(3,count):count,false);emission.current-=count;}
  if(f.burst)spawn(f.reduced?8:num(p,'burstCount',90),true);
  if(papers.current.length>1000)papers.current.splice(0,papers.current.length-1000);
  for(const v of papers.current){v.age+=dt;const flutter=Math.sin(v.phase+time*7)*num(p,'flutter',1),drag=Math.exp(-num(p,'drag',.65)*dt);v.vx=(v.vx+(num(p,'wind',15)+Math.sin(time*3+v.phase)*num(p,'turbulence',30)+flutter*30)*dt)*drag;v.vy=(v.vy+num(p,'gravity',230)*dt)*drag;v.x+=v.vx*dt;v.y+=v.vy*dt;v.angle+=v.spin*num(p,'spin',5)*dt;
   c.save();c.translate(v.x,v.y);c.rotate(v.angle);c.scale(1,Math.max(.08,Math.abs(Math.cos(v.phase+time*num(p,'flutter',1)*4))));c.globalAlpha=num(p,'opacity',.95)*Math.min(1,(life-v.age)/.6);c.fillStyle=colors[v.color];const shape=str(p,'shape','mixed'),kind=shape==='mixed'?v.shape:shape==='circles'?1:shape==='ribbons'?2:0;c.beginPath();if(kind===1)c.ellipse(0,0,v.size*.45,v.size*.45,0,0,Math.PI*2);else c.rect(-v.size*.5,-v.size*(kind===2?.15:.3),v.size,v.size*(kind===2?.3:.6));c.fill();c.restore();}
  papers.current=papers.current.filter(v=>v.age<life&&v.y<f.height+100);engine.host.current?.setAttribute('data-particles',String(papers.current.length));return papers.current.length>0;
 });return <CursorSurface name="Celebration Cursor" p={p} engine={engine}/>;
}
