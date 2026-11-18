export type DitherOptions={pattern:string;palette:string;levels:number;contrast:number;brightness:number;ink:readonly number[];paper:readonly number[]};
const bayer=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
/** True channel quantization with ordered/noise thresholds or propagated quantization error. */
export function ditherImage(input:Uint8ClampedArray,width:number,height:number,o:DitherOptions){
 const output=new Uint8ClampedArray(input.length),channels=o.palette==='rgb'?3:1,work=new Float32Array(width*height*channels),steps=Math.max(1,Math.round(o.levels)-1);
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=y*width+x;for(let ch=0;ch<channels;ch++){const value=channels===1?(input[i*4]*.2126+input[i*4+1]*.7152+input[i*4+2]*.0722)/255:input[i*4+ch]/255;work[i*channels+ch]=Math.max(0,Math.min(1,(value-.5)*o.contrast+.5+o.brightness));}output[i*4+3]=input[i*4+3];}
 const diffuse=(x:number,y:number,ch:number,error:number,weight:number)=>{if(x>=0&&x<width&&y<height)work[(y*width+x)*channels+ch]+=error*weight;};
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const index=y*width+x;for(let ch=0;ch<channels;ch++){const old=work[index*channels+ch],threshold=o.pattern==='bayer'?(bayer[(y%4)*4+x%4]+.5)/16:o.pattern==='noise'?((Math.imul(x+1,374761393)^Math.imul(y+1,668265263))>>>0)/4294967296:o.pattern==='lines'?((x+y)%6)/6:.5,value=Math.max(0,Math.min(steps,Math.floor(old*steps+threshold)))/steps;if(channels===1)for(let c=0;c<3;c++)output[index*4+c]=(o.ink[c]+(o.paper[c]-o.ink[c])*value)*255;else output[index*4+ch]=value*255;
 const error=old-value;if(o.pattern==='floyd'){diffuse(x+1,y,ch,error,7/16);diffuse(x-1,y+1,ch,error,3/16);diffuse(x,y+1,ch,error,5/16);diffuse(x+1,y+1,ch,error,1/16);}else if(o.pattern==='atkinson')for(const [dx,dy] of [[1,0],[2,0],[-1,1],[0,1],[1,1],[0,2]])diffuse(x+dx,y+dy,ch,error,1/8);
 }}return output;
}
