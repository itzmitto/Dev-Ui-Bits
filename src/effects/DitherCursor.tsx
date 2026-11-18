import { useRef } from 'react';
import { num,str,type EffectProps } from './types';
import { CursorSurface,useCursorCanvas } from './cursorRuntime';
export const orderedThreshold=(x:number,y:number)=>{const bayer=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];return (bayer[((y%4+4)%4)*4+(x%4+4)%4]+.5)/16;};
export const radialCoverage=(distance:number,radius:number,exponent:number)=>Math.pow(Math.max(0,1-distance/Math.max(1,radius)),exponent);
/** A persistent scalar field is thresholded by a fixed Bayer lattice: no random pixel flicker. */
export function DitherCursor(p:EffectProps){
 const state=useRef({field:new Float32Array(0),cols:0,rows:0,cell:0});
 const engine=useCursorCanvas(p,f=>{const s=state.current,cell=Math.max(num(p,'ditherSize',6),Math.ceil(Math.sqrt(f.width*f.height/50000))),cols=Math.ceil(f.width/cell),rows=Math.ceil(f.height/cell);if(cols!==s.cols||rows!==s.rows||s.cell!==cell){Object.assign(s,{cols,rows,cell,field:new Float32Array(cols*rows)});}
  const radius=num(p,'radius',75)*(f.burst?1.8:1),exponent=num(p,'falloff',2),decay=Math.exp(-num(p,'decay',1.6)*f.dt),intensity=num(p,'intensity',1.4);let live=0;
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const index=row*cols+col;s.field[index]*=decay;}
  if(f.active||f.burst){const steps=Math.min(16,Math.max(1,Math.ceil(Math.hypot(f.dx,f.dy)/(cell*2))));for(let step=0;step<steps;step++){const x=f.x-f.dx*step/steps,y=f.y-f.dy*step/steps;const left=Math.max(0,Math.floor((x-radius)/cell)),right=Math.min(cols-1,Math.ceil((x+radius)/cell)),top=Math.max(0,Math.floor((y-radius)/cell)),bottom=Math.min(rows-1,Math.ceil((y+radius)/cell));for(let row=top;row<=bottom;row++)for(let col=left;col<=right;col++){const d=Math.hypot((col+.5)*cell-x,(row+.5)*cell-y),coverage=radialCoverage(d,radius,exponent)*intensity,index=row*cols+col;s.field[index]=Math.max(s.field[index],coverage);}}}
  f.ctx.fillStyle=str(p,'color','#ff9ffc');for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const v=s.field[row*cols+col];if(v>.02)live++;if(v>orderedThreshold(col,row))f.ctx.fillRect(col*cell,row*cell,Math.max(1,cell-1),Math.max(1,cell-1));}
  engine.host.current?.setAttribute('data-particles',String(live));return live>0;
 });return <CursorSurface name="Dither Cursor" p={p} engine={engine}/>;
}
