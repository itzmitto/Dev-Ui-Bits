import { useRef } from 'react';
import { num,str,type EffectProps } from './types';
import { CursorSurface,useCursorCanvas,mixColor,rand } from './cursorRuntime';
type Tile={x:number;y:number;ox:number;oy:number;vx:number;vy:number;phase:number;age:number;seed:number};
export function glyphAlphabet(mode:string,custom:string){return Array.from(mode==='custom'?custom||'01':mode==='binary'?'01':mode==='symbols'?'<>/{}[]+=*#':'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789').slice(0,256);}
export function GlyphStream(p:EffectProps){
 const state=useRef({tiles:[] as Tile[],distance:0});
 const engine=useCursorCanvas({...p,followSpeed:.01+num(p,'smoothing',.45)*.16},f=>{const s=state.current,c=f.ctx,cell=num(p,'cellSize',14),gap=num(p,'cellGap',2),spacing=cell+gap,life=num(p,'trailLength',1.1),alphabet=glyphAlphabet(str(p,'characterSet','alphanumeric'),str(p,'customCharacters','01')),momentum=num(p,'momentum',.7),breakup=num(p,'breakup',.7);
  const tile=(x:number,y:number,vx:number,vy:number)=>s.tiles.push({x,y,ox:x,oy:y,vx,vy,phase:rand(0,Math.PI*2),age:0,seed:Math.floor(rand(0,10000))});
  if(f.moved){s.distance+=Math.hypot(f.dx,f.dy);const count=Math.min(12,Math.floor(s.distance/Math.max(2,spacing*.55))),d=Math.hypot(f.dx,f.dy)||1;for(let i=0;i<count;i++){const x=f.x-f.dx*i/Math.max(1,count),y=f.y-f.dy*i/Math.max(1,count);for(let row=-1;row<=1;row++)tile(x-f.dy/d*row*spacing,y+f.dx/d*row*spacing,f.dx*momentum*8,f.dy*momentum*8);}s.distance-=count*Math.max(2,spacing*.55);}
  if(f.burst){const n=f.reduced?8:Math.round(45*num(p,'splashSize',1.2));for(let i=0;i<n;i++){const a=rand(0,Math.PI*2),speed=rand(40,180)*num(p,'splashSize',1.2);tile(f.x,f.y,Math.cos(a)*speed,Math.sin(a)*speed);}}
  if(s.tiles.length>800)s.tiles.splice(0,s.tiles.length-800);c.textAlign='center';c.textBaseline='middle';c.font=`600 ${cell*num(p,'glyphScale',.6)}px ${str(p,'fontFamily','monospace')}`;
  for(const v of s.tiles){v.age+=f.dt;const tension=num(p,'tension',.15),viscosity=num(p,'viscosity',.3),wobble=num(p,'wobble',.4),drag=Math.exp(-f.dt*(1+viscosity*10));v.vx=(v.vx+(v.ox-v.x)*tension*14*f.dt+Math.sin(v.phase+f.time*4)*wobble*20*f.dt)*drag;v.vy=(v.vy+(v.oy-v.y)*tension*14*f.dt+Math.cos(v.phase-f.time*3)*wobble*20*f.dt)*drag;v.x+=v.vx*f.dt;v.y+=v.vy*f.dt;const fade=Math.max(0,1-v.age/life),jitter=Math.sin(v.phase+v.age*5)*breakup*v.age*10;c.globalAlpha=fade*fade;c.fillStyle=mixColor(str(p,'headColor','#854dff'),str(p,'tailColor','#f09bff'),1-fade);c.beginPath();c.roundRect(v.x-cell/2+jitter,v.y-cell/2,cell,cell,Math.min(cell/2,num(p,'cellRadius',2)));c.fill();c.fillStyle=str(p,'glyphColor','#ffffff');const index=(v.seed+Math.floor(f.time*num(p,'scrambleSpeed',8)))%alphabet.length;c.fillText(alphabet[index],v.x+jitter,v.y+.5);}
  c.globalAlpha=1;s.tiles=s.tiles.filter(v=>v.age<life);engine.host.current?.setAttribute('data-particles',String(s.tiles.length));return s.tiles.length>0;
 });return <CursorSurface name="Glyph Stream" p={p} engine={engine}/>;
}
