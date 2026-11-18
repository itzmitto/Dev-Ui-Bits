import { useRef } from 'react';
import { str,type EffectProps } from './types';
import { usePaintCursor,PaintSurface,value,fadeInk,clamp01 } from './paintCursorRuntime';
import { createBrushAtlas,brushPressure,pigmentMix,brushEdge,type BrushAtlas } from './pigmentBrush';
export { brushEdge } from './pigmentBrush';
type Ink={x:number;y:number;radius:number;age:number;distance:number;angle:number;stretch:number;seed:number};
type Drop={x:number;y:number;vx:number;vy:number;radius:number;age:number;distance:number;seed:number};
/** Distance-spaced wet stamps overlap into a continuous brush, never a line of separate circles. */
export function PigmentTrail(p:EffectProps){
 const state=useRef({points:[] as Ink[],drops:[] as Drop[],distance:0,residual:0,lastX:0,lastY:0,connected:false,atlas:null as BrushAtlas|null,grainPattern:null as CanvasPattern|null});
 const engine=usePaintCursor({...p,followSpeed:value(p,'followSpeed',.06,.001,.5)},f=>{
  const s=state.current,c=f.ctx,size=value(p,'brushSize',14,1,80),fade=value(p,'fadeDuration',3.5,.1,15),bleed=value(p,'bleed',.5,0,2),bloom=value(p,'bloom',.9,.02,4),edge=value(p,'edgeSoftness',.6,0,1),rough=value(p,'roughness',.3,0,1),grain=value(p,'grain',.35,0,1),intensity=value(p,'intensity',1,0,3),cycle=value(p,'colorCycle',700,0,3000);
  const mode=str(p,'mode','auto'),gouache=mode==='gouache'||mode==='auto'&&f.dark;
  engine.host.current?.setAttribute('data-render-mode',gouache?'gouache':'watercolor');
  const options={a:str(p,'color','#5227ff'),b:str(p,'secondColor','#e0409a'),rough,grain,edge,gouache,quality:str(p,'quality','medium')},key=JSON.stringify(options);
  if(s.atlas?.key!==key){s.atlas=createBrushAtlas(options);s.grainPattern=c.createPattern(s.atlas.grain,'repeat');}const atlas=s.atlas;
  for(const point of s.points)point.age+=f.dt;
  s.points=s.points.filter(v=>v.age<fade);s.drops=s.drops.filter(v=>v.age<fade+.3);
  if(f.entered||!f.active)s.connected=false;
  if(f.moved){
   if(!s.connected){s.lastX=f.x-f.dx;s.lastY=f.y-f.dy;s.connected=true;s.residual=0;}
   const dx=f.x-s.lastX,dy=f.y-s.lastY,d=Math.hypot(dx,dy),angle=Math.atan2(dy,dx),spacing=Math.max(1.2,size*.18),steps=Math.min(100,Math.floor((d+s.residual)/spacing)),radius=size*brushPressure(f.speed);
   for(let i=0;i<steps;i++){const along=Math.min(d,(i+1)*spacing-s.residual),t=d?along/d:0;s.distance+=spacing;s.points.push({x:s.lastX+dx*t,y:s.lastY+dy*t,radius,age:0,distance:s.distance,angle,stretch:1+Math.min(.35,f.speed*.00015),seed:s.distance*.017});}
   s.residual=(s.residual+d)%spacing;s.lastX=f.x;s.lastY=f.y;
  }
  if(f.burst&&p.splash!==false){const count=f.reduced?3:25;for(let i=0;i<count;i++){const angle=i*2.399963+f.time*3,spread=(.25+(Math.sin(i*7.1)*.5+.5)*.75),velocity=size*(2+spread*9);s.drops.push({x:f.x,y:f.y,vx:Math.cos(angle)*velocity,vy:Math.sin(angle)*velocity,radius:size*(i===0?1.1:.12+spread*.28),age:0,distance:s.distance+i*11,seed:i*2.7});}}
  if(s.points.length>1800)s.points.splice(0,s.points.length-1800);if(s.drops.length>200)s.drops.splice(0,s.drops.length-200);
  const stamp=(x:number,y:number,radius:number,age:number,distance:number,angle:number,stretch:number,seed:number)=>{
   const life=fadeInk(age,fade);if(life<.002||intensity===0)return;
   const wet=1-Math.exp(-age/bloom),mix=pigmentMix(distance,cycle),tile=Math.min(atlas.colors-1,Math.floor(mix*(atlas.colors-1))),w=radius*Math.pow(life,.3)*(1+bleed*wet*.3)*(1+brushEdge(distance*.5,seed)*rough*.12),opacity=clamp01(life*intensity*(gouache?.45:.3));
   c.save();c.translate(x,y);c.rotate(angle+Math.sin(seed)*.12);c.scale(stretch,1/stretch);c.globalCompositeOperation=gouache?'source-over':'multiply';
   // A low-opacity, growing fringe spreads independently of the dense, textured core.
   if(bleed>0){const wetSize=w*(1.1+bleed*wet*.45);c.globalAlpha=opacity*(gouache?.16:.23)*bleed;c.drawImage(atlas.canvas,tile*atlas.tile,atlas.tile,atlas.tile,atlas.tile,-wetSize,-wetSize,wetSize*2,wetSize*2);}
   c.globalAlpha=opacity;c.drawImage(atlas.canvas,tile*atlas.tile,0,atlas.tile,atlas.tile,-w,-w,w*2,w*2);c.restore();
  };
  for(const v of s.points)stamp(v.x,v.y,v.radius,v.age,v.distance,v.angle,v.stretch,v.seed);
  for(const drop of s.drops){drop.age+=f.dt;const flight=Math.max(0,1-drop.age/.28),drag=Math.exp(-f.dt*9);drop.x+=drop.vx*f.dt*flight;drop.y+=drop.vy*f.dt*flight;drop.vx*=drag;drop.vy*=drag;const settled=clamp01((drop.age-.1)/bloom);stamp(drop.x,drop.y,drop.radius*(.5+.5*settled),Math.max(0,drop.age-.25),drop.distance,drop.seed,1.1,drop.seed);}
  if(grain>0&&s.grainPattern){c.globalCompositeOperation='destination-out';c.globalAlpha=1;c.fillStyle=s.grainPattern;c.fillRect(0,0,f.width,f.height);}
  c.globalAlpha=1;c.globalCompositeOperation='source-over';engine.host.current?.setAttribute('data-particles',String(s.points.length+s.drops.length));return s.points.length>0||s.drops.length>0;
 });return <PaintSurface name="Pigment Trail" p={p} engine={engine}/>;
}
