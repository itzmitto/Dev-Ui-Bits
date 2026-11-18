import { useRef } from 'react';
import { num,str,type EffectProps } from './types';
import { CursorSurface,useCursorCanvas,mixColor } from './cursorRuntime';
type Knot={x:number;y:number;age:number};
type Pulse={x:number;y:number;age:number;seed:number};
/** Coherent oscillators keep lightning alive without reallocating a canvas per frame. */
export function arcOffset(index:number,strand:number,time:number,crackle:number){return Math.sin(index*2.37+strand*9.1+time*13*crackle)*.65+Math.sin(index*5.73-strand*3.1-time*23*crackle)*.35;}
export function ArcCursor(p:EffectProps){
 const state=useRef({knots:[] as Knot[],pulses:[] as Pulse[]});
 const engine=useCursorCanvas(p,f=>{const {ctx:c,dt,time,x,y}=f,s=state.current,length=num(p,'trailLength',.65),intensity=num(p,'arcIntensity',1),bend=num(p,'bend',12),crackle=num(p,'crackle',1.5),speed=num(p,'speed',1),strands=num(p,'strands',3),branches=num(p,'branching',.5),glow=num(p,'glow',1),thickness=num(p,'thickness',1.5);
  for(const knot of s.knots)knot.age+=dt;for(const pulse of s.pulses)pulse.age+=dt;s.knots=s.knots.filter(k=>k.age<length);s.pulses=s.pulses.filter(v=>v.age<.65);
  if(f.moved||f.active&&s.knots.length===0)s.knots.push({x,y,age:0});if(s.knots.length>150)s.knots.splice(0,s.knots.length-150);
  if(f.burst)s.pulses.push({x,y,age:0,seed:time});if(s.pulses.length>8)s.pulses.shift();
  c.lineCap='round';c.lineJoin='round';
  const stroke=(path:Path2D,color:string,alpha:number,width:number)=>{c.strokeStyle=color;c.globalAlpha=Math.min(1,alpha);c.lineWidth=width*3;c.shadowColor=color;c.shadowBlur=glow*14;c.stroke(path);c.shadowBlur=0;c.lineWidth=width;c.strokeStyle='#f5efff';c.globalAlpha=Math.min(1,alpha*.8);c.stroke(path);};
  for(let strand=0;strand<strands;strand++){
   for(let i=1;i<s.knots.length;i++){const a=s.knots[i-1],b=s.knots[i],life=1-b.age/length,dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;if(d>f.width*.5)continue;
    const offset=arcOffset(i,strand,time*speed,crackle)*bend*intensity*(.2+life*.8),path=new Path2D();path.moveTo(a.x,a.y);path.lineTo((a.x+b.x)/2-dy/d*offset,(a.y+b.y)/2+dx/d*offset);path.lineTo(b.x,b.y);
    const flicker=1-num(p,'flicker',.5)*(.5+.5*Math.sin(time*speed*39+strand*5+i*.17));stroke(path,mixColor(str(p,'accentColor','#ec6eff'),str(p,'color','#966bff'),life),life*intensity*flicker*.65,thickness*(.25+life*.75));
    if(i%7===strand%7&&branches>0){const branch=new Path2D(),spread=bend*(2+branches*4)*life;branch.moveTo(b.x,b.y);branch.lineTo(b.x-dy/d*spread*.5+offset,b.y+dx/d*spread*.5);branch.lineTo(b.x-dy/d*spread,b.y+dx/d*spread+offset);stroke(branch,str(p,'accentColor','#ec6eff'),life*branches*.45,thickness*.45);}
   }
  }
  for(const pulse of s.pulses){const life=1-pulse.age/.65,r=(18+pulse.age*220)*intensity;for(let ray=0;ray<10;ray++){const angle=ray*Math.PI/5+pulse.seed,path=new Path2D();path.moveTo(pulse.x,pulse.y);for(let j=1;j<=7;j++){const t=j/7,off=arcOffset(j,ray,time*speed,crackle)*bend*(1-t)*life;path.lineTo(pulse.x+Math.cos(angle)*r*t-Math.sin(angle)*off,pulse.y+Math.sin(angle)*r*t+Math.cos(angle)*off);}stroke(path,str(p,'accentColor','#ec6eff'),life*life*.85,thickness);}}
  c.globalAlpha=1;c.shadowBlur=0;engine.host.current?.setAttribute('data-particles',String(s.knots.length+s.pulses.length));return s.knots.length>0||s.pulses.length>0;
 });return <CursorSurface name="Arc Cursor" p={p} engine={engine}/>;
}
