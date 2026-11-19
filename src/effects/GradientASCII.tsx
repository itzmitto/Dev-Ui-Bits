import {useRef,type PointerEvent} from 'react';
import {useTextAnimation,bound} from './textRuntime';
import {useAnimationCanvas,canvasPoint} from './animationCanvas';
import {asciiLight,parseASCIIColors,paletteRGB,noise,unit,glyphIndex,clickInfluence,type ASCIIShape} from './GradientASCII.field';
import './GradientASCII.css';
export interface GradientASCIIProps {
 colors?:string|readonly string[];shape?:ASCIIShape;characters?:string;characterStyle?:string;cellSize?:number;density?:number;glyphOpacity?:number;gradientOpacity?:number;glow?:number;depthOfField?:number;flicker?:number;softness?:number;scale?:number;flow?:number;speed?:number;grain?:number;variation?:number;scrambleRadius?:number;mouseInteraction?:boolean;clickEffect?:'wave'|'burst'|'none';intro?:boolean;lightMode?:boolean;fontFamily?:string;paused?:boolean;quality?:string;
}
type Pulse={x:number;y:number;age:number};
type Cache={key:string;canvas:HTMLCanvasElement;tile:number;characters:string;tones:number;palette:number[][]};
const styles:Record<string,string>={letters:' =+xX0S8#@',binary:' 01',symbols:' .:;+=*#%@',blocks:' ░▒▓█'};
/** Cached glyph atlas and a sampled procedural light field. No DOM updates on pointer movement. */
export function GradientASCII(p:GradientASCIIProps){
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 const pointer=useRef({x:-10,y:-10,heat:0,inside:false}),state=useRef({time:0,intro:0,drawn:false,pulses:[] as Pulse[],atlas:null as Cache|null,wash:null as HTMLCanvasElement|null,image:null as ImageData|null});
 const wake=useTextAnimation(host,(dt,_time,reduced)=>{
  const el=canvas.current,c=el?.getContext('2d');if(!c||!el)return false;
  const s=state.current,{width:w,height:h,dpr}=box.current,cell=bound(p.cellSize,18,8,40),density=bound(p.density,.8,0,1),speed=bound(p.speed,1,0,3),flow=bound(p.flow,.5,0,2),soft=bound(p.softness,.5,0,1),scale=bound(p.scale,1,.4,2.5),variation=bound(p.variation,0,0,100),grain=bound(p.grain,.08,0,.4),glow=bound(p.glow,.2,0,1.5),flicker=bound(p.flicker,.2,0,1),dof=bound(p.depthOfField,0,0,1),lightMode=p.lightMode===true;
  if(p.paused&&s.drawn)return false;if(p.paused)s.intro=3;
  if(!reduced){s.time+=dt*speed;s.intro+=dt;pointer.current.heat*=Math.exp(-dt*5);for(const pulse of s.pulses)pulse.age+=dt;}else{s.intro=3;pointer.current.heat=0;s.pulses=[];}
  s.pulses=s.pulses.filter(v=>v.age<1.2);
  const colors=parseASCIIColors(p.colors),characters=Array.from(p.characterStyle==='custom'?p.characters||styles.letters:styles[p.characterStyle||'']||p.characters||styles.letters).slice(0,32).join('')||' .#';
  const sequence=Array.from(characters);
  const font=p.fontFamily||'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',tones=16,tile=Math.min(96,Math.ceil(cell*dpr*1.7)),key=JSON.stringify([colors,characters,cell,dpr,font,lightMode,dof,glow]);
  if(s.atlas?.key!==key){
   const atlas=document.createElement('canvas');atlas.width=tile*sequence.length;atlas.height=tile*tones*2;const a=atlas.getContext('2d')!;a.textAlign='center';a.textBaseline='middle';a.font=`${cell*dpr*.8}px ${font}`;
   for(let blur=0;blur<2;blur++)for(let tone=0;tone<tones;tone++){const rgb=paletteRGB(colors,tone/(tones-1));a.fillStyle=`rgb(${rgb.map(v=>Math.round(lightMode?v*.42:v+(255-v)*(.15+.5*tone/(tones-1)))).join(',')})`;a.shadowColor=a.fillStyle;a.filter=blur?`blur(${cell*dpr*.12}px)`:"none";a.shadowBlur=glow*cell*dpr*.12;for(let i=0;i<sequence.length;i++)a.fillText(sequence[i],(i+.5)*tile,(blur*tones+tone+.5)*tile);}
   s.atlas={key,canvas:atlas,tile,characters,tones,palette:Array.from({length:256},(_,i)=>paletteRGB(colors,i/255))};
  }
  // Reuse a small raster for the wash; interpolate it to the HiDPI destination.
  const step=p.quality==='low'?12:6,sw=Math.ceil(w/step)+1,sh=Math.ceil(h/step)+1;
  if(!s.wash){s.wash=document.createElement('canvas');}
  if(s.wash.width!==sw||s.wash.height!==sh||!s.image){s.wash.width=sw;s.wash.height=sh;s.image=s.wash.getContext('2d')!.createImageData(sw,sh);}
  const shape=p.shape||'horizon',intro=p.intro===false?1:unit(s.intro/1.8),sample=(x:number,y:number)=>asciiLight(x,y,s.time,shape,soft,scale,flow,variation,w/h);
  const image=s.image,data=image.data;
  for(let y=0;y<sh;y++)for(let x=0;x<sw;x++){const brightness=sample(x/(sw-1),y/(sh-1)),rgb=s.atlas.palette[Math.round(brightness*255)],n=(noise(x,y,variation+Math.floor(s.time*15))-.5)*grain*55,i=(y*sw+x)*4;for(let k=0;k<3;k++)data[i+k]=Math.max(0,Math.min(255,rgb[k]+n));data[i+3]=unit(brightness*1.35)*bound(p.gradientOpacity,.9,0,1)*intro*(lightMode?.38:1)*255;}
  s.wash.getContext('2d')!.putImageData(image,0,0);c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);c.imageSmoothingEnabled=true;c.drawImage(s.wash,0,0,w,h);
  const atlas=s.atlas,cw=cell*.6,cols=Math.ceil(w/cw),rows=Math.ceil(h/cell),radius=bound(p.scrambleRadius,.1,.02,.4),opacity=bound(p.glyphOpacity,.85,0,1);let glyphs=0;
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
   const px=(x+.5)*cw,py=(y+.5)*cell,u=px/w,v=py/h,b=sample(u,v),n=noise(x,y,variation),threshold=(1-density)*(1+(1-b)*1.5);
   if(density===0||n<threshold||b<.025||intro<noise(x,y,3)*.45)continue;
   let disturbance=p.mouseInteraction===false?0:Math.exp(-Math.pow(Math.hypot(px-pointer.current.x,py-pointer.current.y)/h/radius,2))*pointer.current.heat;
   for(const pulse of s.pulses)disturbance=Math.max(disturbance,clickInfluence(Math.hypot(px-pulse.x,py-pulse.y)/h,pulse.age,p.clickEffect||'wave'));
   const shimmer=(noise(x,y,Math.floor(s.time*7))-.5)*flicker*.18,brightness=unit(b+shimmer),index=disturbance>.15?Math.floor(noise(x,y,Math.floor(s.time*20)+7)*sequence.length):glyphIndex(brightness,sequence.length),tone=Math.min(tones-1,Math.floor(brightness*(tones-1))),blur=n<dof?1:0,fade=unit(b*2)*intro;
   c.globalAlpha=opacity*fade*(.65+.35*brightness);c.drawImage(atlas.canvas,index*tile,(blur*tones+tone)*tile,tile,tile,px-tile/dpr/2,py-tile/dpr/2,tile/dpr,tile/dpr);glyphs++;
  }
  c.globalAlpha=1;s.drawn=true;if(host.current){host.current.dataset.glyphs=String(glyphs);host.current.dataset.shape=shape;host.current.dataset.pulses=String(s.pulses.length);}
  return !reduced&&!p.paused&&(speed>0||s.pulses.length>0||pointer.current.heat>.01||p.intro!==false&&s.intro<1.8);
 });
 const box=useAnimationCanvas(host,canvas,wake,p.quality||'medium');
 const move=(e:PointerEvent<HTMLDivElement>)=>{if(p.mouseInteraction===false||p.paused)return;Object.assign(pointer.current,canvasPoint(e.currentTarget,e.clientX,e.clientY),{heat:1,inside:true});wake();};
 return <div className="gradient-ascii" ref={host} style={{background:p.lightMode?'#f4f5f8':'#120f17'}} onPointerMove={move} onPointerLeave={()=>{pointer.current.inside=false;}} onPointerDown={e=>{move(e);if(p.paused||p.clickEffect==='none')return;const point=canvasPoint(e.currentTarget,e.clientX,e.clientY);state.current.pulses.push({...point,age:0});if(state.current.pulses.length>8)state.current.pulses.shift();wake();}}><canvas ref={canvas} role="img" aria-label="Gradient ASCII animated luminance field"/></div>;
}
