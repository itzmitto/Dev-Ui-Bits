import { useRef } from 'react';
import { str,type EffectProps } from './types';
import { mixColor } from './cursorRuntime';
import { rgba } from './animationCanvas';
import { usePaintCursor, PaintSurface, value,clamp01 } from './paintCursorRuntime';
type Knot={x:number;y:number;age:number;distance:number};
type Pulse={x:number;y:number;age:number;seed:number};
type Vertex={x:number;y:number;life:number;width:number};
/** Continuous spatial oscillators: the same filament bends through neighbouring samples. */
export function arcOffset(distance:number,strand:number,time:number,crackle:number){return Math.sin(distance*.055+strand*2.3-time*7)*.5+Math.sin(distance*.13-strand*1.7+time*11)*.28+Math.sin(distance*.63+strand*4.1-time*37)*.22*crackle/3;}
const hash=(n:number)=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s);};
export function ArcCursor(p:EffectProps){
 const state=useRef({knots:[] as Knot[],pulses:[] as Pulse[],distance:0,clock:0,still:10});
 const engine=usePaintCursor(p,f=>{
  const s=state.current,c=f.ctx,length=value(p,'trailLength',.55,.05,3),intensity=value(p,'arcIntensity',1,0,3),bend=value(p,'bend',10,0,60),crackle=value(p,'crackle',1.5,0,3),glow=value(p,'glow',1,0,3),thickness=value(p,'thickness',1.5,.1,6),strands=Math.round(value(p,'strands',3,1,6)),branches=value(p,'branching',.5,0,1),charge=value(p,'charge',.5,0,1);
  const mode=str(p,'mode','auto'),light=mode==='glow'||mode==='auto'&&f.dark,primary=str(p,'color','#5227ff'),accent=str(p,'accentColor','#e0409a');
  engine.host.current?.setAttribute('data-render-mode',light?'glow':'ink');
  s.clock+=f.dt*value(p,'speed',1,0,4);s.still=f.moved?0:s.still+f.dt;
  for(const k of s.knots)k.age+=f.dt;for(const v of s.pulses)v.age+=f.dt;
  s.knots=s.knots.filter(k=>k.age<length);s.pulses=s.pulses.filter(v=>v.age<.55);
  if(f.entered)s.knots=[];
  if(f.moved){s.distance+=Math.hypot(f.dx,f.dy);s.knots.push({x:f.x,y:f.y,age:0,distance:s.distance});}
  if(s.knots.length>160)s.knots.splice(0,s.knots.length-160);
  if(f.burst&&p.discharge!==false&&!f.reduced)s.pulses.push({x:f.x,y:f.y,age:0,seed:f.time*13});if(s.pulses.length>8)s.pulses.shift();
  c.lineCap='round';c.lineJoin='round';c.globalCompositeOperation=light?'lighter':'source-over';
  const draw=(vertices:Vertex[],color:string,alpha:number,hot=true)=>{
   if(vertices.length<2||intensity===0)return;
   const path=new Path2D();path.moveTo(vertices[0].x,vertices[0].y);for(let i=1;i<vertices.length;i++)path.lineTo(vertices[i].x,vertices[i].y);
   // One continuous bloom per strand; varying subpixel cores are drawn separately.
   c.strokeStyle=light?mixColor(color,'#c4afff',.3):color;c.globalAlpha=clamp01(alpha*intensity*(light?.16:.08)*glow);c.lineWidth=thickness*(light?6:3);c.shadowColor=color;c.shadowBlur=light?glow*22:glow*3;c.stroke(path);c.shadowBlur=0;
   for(let i=1;i<vertices.length;i++){const a=vertices[i-1],b=vertices[i],life=Math.min(a.life,b.life);c.globalAlpha=clamp01(alpha*life*intensity);c.strokeStyle=color;c.lineWidth=thickness*b.width*(light?1.5:1);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();if(light&&hot){c.strokeStyle=mixColor('#ffffff',accent,.12);c.lineWidth=Math.max(.25,thickness*b.width*.85);c.globalAlpha=clamp01(alpha*Math.sqrt(life)*intensity*.95);c.stroke();}}
  };
  if(light&&glow>0&&intensity>0&&s.knots.length){const tip=s.knots[s.knots.length-1],life=clamp01(1-tip.age/length),radius=12+glow*20,halo=c.createRadialGradient(tip.x,tip.y,0,tip.x,tip.y,radius);halo.addColorStop(0,rgba(primary,.35));halo.addColorStop(.22,rgba(primary,.16));halo.addColorStop(1,rgba(primary,0));c.globalAlpha=clamp01(life*intensity*glow);c.fillStyle=halo;c.fillRect(tip.x-radius,tip.y-radius,radius*2,radius*2);}
  for(let strand=0;strand<strands;strand++){
   const vertices:Vertex[]=[];
   for(let i=1;i<s.knots.length;i++){
    const a=s.knots[i-1],b=s.knots[i],prev=s.knots[Math.max(0,i-2)],next=s.knots[Math.min(s.knots.length-1,i+1)],distance=Math.hypot(b.x-a.x,b.y-a.y),count=Math.max(1,Math.ceil(distance/4));if(distance>Math.max(f.width,f.height)*.8)continue;
    for(let j=0;j<count;j++){const t=j/count,t2=t*t,t3=t2*t,px=.5*((2*a.x)+(-prev.x+b.x)*t+(2*prev.x-5*a.x+4*b.x-next.x)*t2+(-prev.x+3*a.x-3*b.x+next.x)*t3),py=.5*((2*a.y)+(-prev.y+b.y)*t+(2*prev.y-5*a.y+4*b.y-next.y)*t2+(-prev.y+3*a.y-3*b.y+next.y)*t3),life=clamp01(1-(a.age+(b.age-a.age)*t)/length),d=a.distance+(b.distance-a.distance)*t,dx=b.x-a.x,dy=b.y-a.y,n=Math.hypot(dx,dy)||1;
     const envelope=Math.sin(Math.PI*clamp01(life))*.6+.2,off=arcOffset(d,strand,s.clock,f.reduced?0:crackle)*bend*envelope+Math.sin(d*.025+s.clock*4+strand*2)*bend*.18;
     vertices.push({x:px-dy/n*off,y:py+dx/n*off,life:Math.pow(life,.65),width:(.25+.55*life)*(strand===0?1:.55)*(.75+.25*Math.sin(d*.07+strand))});
    }
   }
   if(s.knots.length){const last=s.knots[s.knots.length-1];vertices.push({x:last.x,y:last.y,life:clamp01(1-last.age/length),width:strand===0?.8:.4});}
   const brightness=1-(f.reduced?0:value(p,'flicker',.5,0,1))*(.25+.25*Math.sin(s.clock*41+strand*2.7));
   draw(vertices,strand===0?primary:mixColor(primary,accent,.3+strand*.12),brightness*(strand===0?1:.6));
   if(branches>0&&!f.reduced)for(let i=8;i<vertices.length-4;i+=17){const v=vertices[i],b=vertices[i+2],bucket=Math.floor(s.clock*9),h=hash(i+strand*53+bucket*7);if(h>branches*.7)continue;const dx=b.x-v.x,dy=b.y-v.y,n=Math.hypot(dx,dy)||1,side=h>.2?1:-1,reach=(8+hash(i+bucket)*28)*v.life;
    const fork:Vertex[]=[];for(let j=0;j<=7;j++){const t=j/7,wave=arcOffset(j*5,i,s.clock,crackle)*reach*.25;fork.push({x:v.x+dx/n*reach*t*.6-dy/n*(reach*t*side+wave),y:v.y+dy/n*reach*t*.6+dx/n*(reach*t*side+wave),life:v.life*(1-t),width:.35*(1-t)+.1});}draw(fork,accent,branches*.65,false);
   }
  }
  if(charge>0&&f.active&&s.still<.7&&!f.reduced){for(let j=0;j<3;j++){const h=hash(Math.floor(s.clock*16)+j*19),angle=h*Math.PI*2,r=(4+h*12)*charge;draw([{x:f.x,y:f.y,life:1,width:.3},{x:f.x+Math.cos(angle)*r*.5,y:f.y+Math.sin(angle+.4)*r*.5,life:.8,width:.25},{x:f.x+Math.cos(angle)*r,y:f.y+Math.sin(angle)*r,life:.05,width:.1}],accent,charge*.6);}}
  for(const pulse of s.pulses){const life=clamp01(1-pulse.age/.55),radius=(14+80*(1-Math.exp(-pulse.age*15)))*( .6+charge);for(let ray=0;ray<7;ray++){const angle=ray*Math.PI*2/7+hash(ray+pulse.seed)*.7,vertices:Vertex[]=[];for(let j=0;j<=12;j++){const t=j/12,off=arcOffset(j*5,ray,pulse.seed,crackle)*12*Math.sin(t*Math.PI);vertices.push({x:pulse.x+Math.cos(angle)*radius*t-Math.sin(angle)*off,y:pulse.y+Math.sin(angle)*radius*t+Math.cos(angle)*off,life:life*life*(1-t*.6),width:.8*(1-t)+.1});}draw(vertices,ray%2?accent:primary,life);if(branches>0){const v=vertices[6];draw([v,{x:v.x+Math.cos(angle+.8)*radius*.25,y:v.y+Math.sin(angle+.8)*radius*.25,life:life*.2,width:.2}],accent,life*branches);}}}
  c.globalAlpha=1;c.shadowBlur=0;c.globalCompositeOperation='source-over';engine.host.current?.setAttribute('data-particles',String(s.knots.length+s.pulses.length));return s.knots.length>0||s.pulses.length>0||f.active&&charge>0&&s.still<.7;
 });return <PaintSurface name="Arc Cursor" p={p} engine={engine}/>;
}
