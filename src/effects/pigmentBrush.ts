import { seeded } from './textRuntime';
import { rgb } from './animationCanvas';
export const brushEdge=(distance:number,seed:number)=>Math.sin(distance*.13+seed)*.6+Math.sin(distance*.39-seed*2)*.4;
/** Smooth value noise rather than independent random pixels: pigment forms tiny connected islands. */
export function paperNoise(x:number,y:number,seed=1){
 const hash=(a:number,b:number)=>{const v=Math.sin(a*127.1+b*311.7+seed*74.7)*43758.5453;return v-Math.floor(v);};
 const ix=Math.floor(x),iy=Math.floor(y),tx=x-ix,ty=y-iy,sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty),a=hash(ix,iy)*(1-sx)+hash(ix+1,iy)*sx,b=hash(ix,iy+1)*(1-sx)+hash(ix+1,iy+1)*sx;return a*(1-sy)+b*sy;
}
export function quadraticPoint(ax:number,ay:number,cx:number,cy:number,bx:number,by:number,t:number){const u=1-t;return{x:u*u*ax+2*u*t*cx+t*t*bx,y:u*u*ay+2*u*t*cy+t*t*by};}
export const brushPressure=(speed:number)=>.5+.6/(1+Math.max(0,speed)*.0025);
export const pigmentMix=(distance:number,cycle:number)=>cycle>0?.5-.5*Math.cos(distance/cycle*Math.PI*2):0;
export type BrushOptions={a:string;b:string;rough:number;grain:number;edge:number;gouache:boolean;quality:string};
export type BrushAtlas={canvas:HTMLCanvasElement;tile:number;colors:number;key:string;grain:HTMLCanvasElement};
/** One reusable atlas; all texture pixels are generated here, with no external assets. */
export function createBrushAtlas(o:BrushOptions):BrushAtlas{
 const tile=o.quality==='low'?64:o.quality==='high'?128:96,colors=12,canvas=document.createElement('canvas');canvas.width=tile*colors;canvas.height=tile*2;const ctx=canvas.getContext('2d')!,image=ctx.createImageData(canvas.width,canvas.height),a=rgb(o.a),b=rgb(o.b),random=seeded(3891);
 // Row 0: concentrated pigment with a drying rim. Row 1: diffuse wet fringe.
 for(let row=0;row<2;row++)for(let j=0;j<colors;j++)for(let y=0;y<tile;y++)for(let x=0;x<tile;x++){
  const nx=(x+.5-tile/2)/(tile*.47),ny=(y+.5-tile/2)/(tile*.47),angle=Math.atan2(ny,nx),rad=Math.hypot(nx,ny),noise=paperNoise(nx*8+12,ny*8+12,5),fine=paperNoise(nx*26+31,ny*26+31,7),contour=1+o.rough*(.15*Math.sin(angle*5+.8)+.09*Math.sin(angle*11-1.2)+.18*(noise-.5)),r=rad/contour;
  const feather=row===1?.25+o.edge*.25:.025+o.edge*.09,coverage=Math.max(0,Math.min(1,(1-r)/feather));
  const rim=Math.exp(-Math.pow((r-.76)/.12,2)),clump=.65+.35*noise,granule=1-o.grain*(.6*fine+.4*(random()>.77?1:0)),bristle=1-o.rough*.18*Math.pow(.5+.5*Math.sin(nx*58+noise*3),8);
  const alpha=row===1?coverage*coverage*(.15+.55*noise)*granule:Math.pow(coverage,.65)*clump*granule*bristle;
  const darken=row===1?1:.96-rim*(o.gouache?.08:.27)-o.grain*.1*(fine-.5),t=j/(colors-1),i=((row*tile+y)*canvas.width+j*tile+x)*4;
  for(let k=0;k<3;k++)image.data[i+k]=Math.max(0,Math.min(255,(a[k]*(1-t)+b[k]*t)*255*darken+(o.gouache?rim*5:0)));image.data[i+3]=Math.round(alpha*255);
 }
 ctx.putImageData(image,0,0);
 const grain=document.createElement('canvas');grain.width=grain.height=192;const g=grain.getContext('2d')!,texture=g.createImageData(192,192);
 for(let y=0;y<192;y++)for(let x=0;x<192;x++){const i=(y*192+x)*4,cloud=paperNoise(x*.3,y*.3,11);texture.data[i+3]=Math.floor(o.grain*(random()*.48+cloud*.42)*255);}
 g.putImageData(texture,0,0);return{canvas,tile,colors,key:JSON.stringify(o),grain};
}
