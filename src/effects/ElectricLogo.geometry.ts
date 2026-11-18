import { traceAlpha } from './TechText.geometry';
export type ElectricPoint={x:number;y:number};
export type ElectricVertex=ElectricPoint&{nx:number;ny:number};
/** Uniform arc-length samples keep lightning frequency independent of raster stair steps. */
export function resampleOutline(points:ElectricPoint[],spacing=2):ElectricPoint[]{
 if(points.length<2)return points;if(!Number.isFinite(spacing)||spacing<=0)spacing=2;const output:ElectricPoint[]=[];let carry=0;
 for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],length=Math.hypot(b.x-a.x,b.y-a.y);if(!length)continue;let d=carry;for(;d<length;d+=spacing)output.push({x:a.x+(b.x-a.x)*d/length,y:a.y+(b.y-a.y)*d/length});carry=d-length;}return output;
}
/** Key corners inside the drawn image, including non-square opaque logos. */
export function keyOpaqueBackdrop(data:Uint8ClampedArray,width:number,height:number,bounds:{x:number;y:number;width:number;height:number}){
 const left=Math.max(0,Math.ceil(bounds.x)+1),right=Math.min(width-1,Math.floor(bounds.x+bounds.width)-2),top=Math.max(0,Math.ceil(bounds.y)+1),bottom=Math.min(height-1,Math.floor(bounds.y+bounds.height)-2);if(left>=right||top>=bottom)return;
 const corners=[(top*width+left)*4,(top*width+right)*4,(bottom*width+left)*4,(bottom*width+right)*4];if(!corners.every(i=>data[i+3]>250))return;
 const bg=corners.map(i=>[data[i],data[i+1],data[i+2]]).reduce((a,b)=>a.map((v,i)=>v+b[i]/4),[0,0,0]);
 // Tiling by row also keeps legitimate raster work inside Sandpack's loop guard.
 for(let y=Math.max(0,Math.floor(bounds.y));y<Math.min(height,Math.ceil(bounds.y+bounds.height));y++)for(let x=Math.max(0,Math.floor(bounds.x));x<Math.min(width,Math.ceil(bounds.x+bounds.width));x++){const i=(y*width+x)*4;if(Math.hypot(data[i]-bg[0],data[i+1]-bg[1],data[i+2]-bg[2])<70)data[i+3]=0;}
}
export function logoContours(image:HTMLImageElement|undefined,shape:string){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const c=canvas.getContext('2d',{willReadFrequently:true})!;
 if(image){const scale=440/Math.max(image.naturalWidth,image.naturalHeight),bounds={x:256-image.naturalWidth*scale/2,y:256-image.naturalHeight*scale/2,width:image.naturalWidth*scale,height:image.naturalHeight*scale};c.drawImage(image,bounds.x,bounds.y,bounds.width,bounds.height);
 const mask=c.getImageData(0,0,512,512);keyOpaqueBackdrop(mask.data,512,512,bounds);c.putImageData(mask,0,0);
 }else{c.fillStyle='#fff';const paths=shape==='bolt'?['M280 35 110 286 240 286 206 477 405 213 276 213Z']:shape==='diamond'?['M256 36 476 256 256 476 36 256Z M256 130 130 256 256 382 382 256Z']:['M184 100 52 256 184 412 222 374 122 256 222 138Z','M328 100 290 138 390 256 290 374 328 412 460 256Z','M275 140 226 372 256 372 305 140Z'];for(const path of paths)c.fill(new Path2D(path),'evenodd');}
 return traceAlpha(c.getImageData(0,0,512,512).data,512,512,1).filter(points=>points.length>20).map(points=>{const samples=resampleOutline(points,3);return samples.map((point,index)=>{const prev=samples[(index+samples.length-1)%samples.length],next=samples[(index+1)%samples.length],dx=next.x-prev.x,dy=next.y-prev.y,length=Math.hypot(dx,dy)||1;return {...point,nx:-dy/length,ny:dx/length};});});
}
