import { traceAlpha } from './TechText.geometry';
export type ElectricPoint={x:number;y:number};
/** Uniform arc-length samples keep lightning frequency independent of raster stair steps. */
export function resampleOutline(points:ElectricPoint[],spacing=2):ElectricPoint[]{
 if(points.length<2)return points;const output:ElectricPoint[]=[];let carry=0;
 for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],length=Math.hypot(b.x-a.x,b.y-a.y);if(!length)continue;let d=carry;for(;d<length;d+=spacing)output.push({x:a.x+(b.x-a.x)*d/length,y:a.y+(b.y-a.y)*d/length});carry=d-length;}return output;
}
export function logoContours(image:HTMLImageElement|undefined,shape:string){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const c=canvas.getContext('2d',{willReadFrequently:true})!;
 if(image){const scale=440/Math.max(image.naturalWidth,image.naturalHeight);c.drawImage(image,256-image.naturalWidth*scale/2,256-image.naturalHeight*scale/2,image.naturalWidth*scale,image.naturalHeight*scale);
 const mask=c.getImageData(0,0,512,512),d=mask.data;const corners=[(36*512+36)*4,(36*512+476)*4,(476*512+36)*4,(476*512+476)*4];if(corners.every(i=>d[i+3]>250)){const bg=corners.map(i=>[d[i],d[i+1],d[i+2]]).reduce((a,b)=>a.map((v,i)=>v+b[i]/4),[0,0,0]);for(let i=0;i<d.length;i+=4)if(Math.hypot(d[i]-bg[0],d[i+1]-bg[1],d[i+2]-bg[2])<70)d[i+3]=0;}c.putImageData(mask,0,0);
 }else{c.fillStyle='#fff';const paths=shape==='bolt'?['M280 35 110 286 240 286 206 477 405 213 276 213Z']:shape==='diamond'?['M256 36 476 256 256 476 36 256Z M256 130 130 256 256 382 382 256Z']:['M184 100 52 256 184 412 222 374 122 256 222 138Z','M328 100 290 138 390 256 290 374 328 412 460 256Z','M275 140 226 372 256 372 305 140Z'];for(const path of paths)c.fill(new Path2D(path),'evenodd');}
 return traceAlpha(c.getImageData(0,0,512,512).data,512,512,1).filter(points=>points.length>20).map(points=>resampleOutline(points));
}
