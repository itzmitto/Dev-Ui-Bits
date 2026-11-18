import { useRef } from 'react';
import { num,str,type EffectProps } from './types';
import { seeded } from './textRuntime';
import { CursorSurface,useCursorCanvas,mixColor,rand } from './cursorRuntime';
type Ink={x:number;y:number;width:number;age:number;distance:number;seed:number;group:number};
type Drop={x:number;y:number;vx:number;vy:number;size:number;age:number;seed:number};
/** Spatially coherent brush-edge noise; fixed seeds keep grain attached to the paint. */
export const brushEdge=(distance:number,seed:number)=>Math.sin(distance*.13+seed)*.6+Math.sin(distance*.39-seed*2)*.4;
export function PigmentTrail(p:EffectProps){
 const state=useRef({points:[] as Ink[],drops:[] as Drop[],distance:0,group:0,active:false,grainPattern:null as CanvasPattern|null});
 const engine=useCursorCanvas({...p,followSpeed:num(p,'followSpeed',.06)},f=>{const s=state.current,c=f.ctx,size=num(p,'brushSize',15),fade=num(p,'fadeDuration',3.5),bleed=num(p,'bleed',.5),bloom=num(p,'bloom',.9),rough=num(p,'roughness',.3),grain=num(p,'grain',.35),intensity=num(p,'intensity',1),edge=num(p,'edgeSoftness',.6),cycle=num(p,'colorCycle',700);
  if(f.active&&!s.active)s.group++;s.active=f.active;
  if(f.moved){const distance=Math.hypot(f.dx,f.dy),steps=Math.min(30,Math.max(1,Math.ceil(distance/Math.max(2,size*.3))));for(let i=0;i<steps;i++){s.distance+=distance/steps;s.points.push({x:f.x-f.dx*(1-(i+1)/steps),y:f.y-f.dy*(1-(i+1)/steps),width:size*(.75+.4/(1+f.speed*.003)),age:0,distance:s.distance,seed:s.group*.97,group:s.group});}}
  if(f.burst&&p.splash!==false){const n=f.reduced?4:22;for(let i=0;i<n;i++){const a=rand(0,Math.PI*2),v=rand(15,120);s.drops.push({x:f.x,y:f.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,size:size*rand(.15,.65),age:0,seed:rand(0,50)});}}
  if(s.points.length>650)s.points.splice(0,s.points.length-650);if(s.drops.length>180)s.drops.splice(0,s.drops.length-180);
  const ink=(distance:number)=>mixColor(str(p,'color','#8c5cff'),str(p,'secondColor','#ee8adf'),cycle>0?.5+.5*Math.sin(distance/cycle*Math.PI*2):0);
  const width=(v:Ink)=>v.width*(1+bleed*(1-Math.exp(-v.age/Math.max(.02,bloom))))*(1+brushEdge(v.distance,v.seed)*rough*.32);
  for(const v of s.points)v.age+=f.dt;
  if(!s.grainPattern){const noise=document.createElement('canvas');noise.width=noise.height=128;const g=noise.getContext('2d')!,image=g.createImageData(128,128),random=seeded(731);for(let row=0;row<128;row++)for(let col=0;col<128;col++){const i=(row*128+col)*4;image.data[i+3]=random()>.6?Math.floor(random()*180):0;}g.putImageData(image,0,0);s.grainPattern=c.createPattern(noise,'repeat');}
  const groups=new Map<number,Ink[]>();for(const v of s.points){const group=groups.get(v.group)??[];group.push(v);groups.set(v.group,group);}
  for(const points of groups.values()){if(points.length<2)continue;const first=points[0],last=points[points.length-1],left:{x:number;y:number}[]=[],right:{x:number;y:number}[]=[];
   for(let i=0;i<points.length;i++){const v=points[i],a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,w=width(v),asym=brushEdge(v.distance+19,v.seed)*rough*w*.12;left.push({x:v.x+nx*(w+asym),y:v.y+ny*(w+asym)});right.push({x:v.x-nx*(w-asym),y:v.y-ny*(w-asym)});}
   const path=new Path2D();path.moveTo(left[0].x,left[0].y);for(let i=1;i<left.length;i++){const a=left[i-1],b=left[i];path.quadraticCurveTo(a.x,a.y,(a.x+b.x)/2,(a.y+b.y)/2);}const tail=points[Math.max(0,points.length-2)],endDx=last.x-tail.x,endDy=last.y-tail.y,endD=Math.hypot(endDx,endDy)||1,endW=width(last);path.quadraticCurveTo(last.x+endDx/endD*endW*1.5,last.y+endDy/endD*endW*1.5,right[right.length-1].x,right[right.length-1].y);
   for(let i=right.length-2;i>=0;i--){const a=right[i+1],b=right[i];path.quadraticCurveTo(a.x,a.y,(a.x+b.x)/2,(a.y+b.y)/2);}const next=points[1],dx=next.x-first.x,dy=next.y-first.y,d=Math.hypot(dx,dy)||1;path.quadraticCurveTo(first.x-dx/d*width(first)*1.5,first.y-dy/d*width(first)*1.5,left[0].x,left[0].y);path.closePath();
   const gradient=c.createLinearGradient(first.x,first.y,last.x+.01,last.y+.01);for(let i=0;i<=12;i++){const t=i/12,v=points[Math.min(points.length-1,Math.round(t*(points.length-1)))],alpha=Math.min(.9,Math.pow(Math.max(0,1-v.age/fade),1.3)*intensity*.85);gradient.addColorStop(t,ink(v.distance).replace('rgb(','rgba(').replace(')',','+alpha+')'));}
   c.globalAlpha=1;c.fillStyle=gradient;c.filter=`blur(${edge*2}px)`;c.fill(path);c.filter='none';c.fill(path);
   if(grain>0&&s.grainPattern){c.save();c.clip(path);c.globalCompositeOperation='destination-out';c.globalAlpha=grain*.65;c.fillStyle=s.grainPattern;c.fillRect(0,0,f.width,f.height);c.restore();}
  }
  for(const v of s.drops){v.age+=f.dt;v.x+=v.vx*f.dt;v.y+=v.vy*f.dt;v.vx*=Math.exp(-f.dt*7);v.vy*=Math.exp(-f.dt*7);const r=v.size*(1+bleed*(1-Math.exp(-v.age/Math.max(.02,bloom))));c.fillStyle=ink(v.seed*80);c.globalAlpha=Math.min(.85,Math.max(0,1-v.age/fade)*intensity);c.beginPath();for(let j=0;j<14;j++){const angle=j/14*Math.PI*2,rr=r*(1+rough*.22*Math.sin(j*2.7+v.seed));if(j===0)c.moveTo(v.x+Math.cos(angle)*rr,v.y+Math.sin(angle)*rr);else c.lineTo(v.x+Math.cos(angle)*rr,v.y+Math.sin(angle)*rr);}c.closePath();c.fill();}
  c.globalAlpha=1;s.points=s.points.filter(v=>v.age<fade);s.drops=s.drops.filter(v=>v.age<fade);engine.host.current?.setAttribute('data-particles',String(s.points.length+s.drops.length));return s.points.length>0||s.drops.length>0;
 });return <CursorSurface name="Pigment Trail" p={p} engine={engine}/>;
}
