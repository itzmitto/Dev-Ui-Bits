/** Evenly samples a real alpha mask; the cap never cuts off the last lines. */
export function particleTargets(pixels:Uint8ClampedArray,width:number,height:number,step:number,limit=7000){
 const candidates:{x:number;y:number}[]=[];step=Math.max(1,Math.round(step));
 for(let y=0;y<height;y+=step)for(let x=0;x<width;x+=step)if(pixels[(y*width+x)*4+3]>128)candidates.push({x,y});
 const result:{x:number;y:number}[]=[],stride=Math.max(1,candidates.length/Math.max(1,limit));
 for(let index=0;index<candidates.length;index+=stride)result.push(candidates[Math.floor(index)]);
 return result;
}
