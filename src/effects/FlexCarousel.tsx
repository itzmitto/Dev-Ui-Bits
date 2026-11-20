import {useEffect,useMemo,useRef,useState,type CSSProperties,type PointerEvent} from 'react';
import {useTextAnimation,bound} from './textRuntime';
import {useAnimationCanvas,canvasPoint,rgb} from './animationCanvas';
import {coast,relative,wrap,parseImages,type CarouselImage} from './FlexCarousel.math';
import {flexImages} from './flexImages';
import {flexVertex,flexFragment} from './FlexCarousel.shader';
import './FlexCarousel.css';
export type FlexCarouselProps={images?:string|readonly CarouselImage[]|readonly string[];speed?:number;direction?:string;gap?:number;imageWidth?:number;imageHeight?:number;borderRadius?:number;distortion?:number;glassStrength?:number;edgeWidth?:number;blur?:number;scale?:number;dragSensitivity?:number;momentum?:number;autoplay?:boolean;pauseOnHover?:boolean;interactive?:boolean;showCaptions?:boolean;background?:string};
type Texture={texture:WebGLTexture;width:number;height:number};
type GPU={gl:WebGLRenderingContext;program:WebGLProgram;uniforms:Record<string,WebGLUniformLocation|null>;textures:(Texture|null)[];request:(index:number)=>void;dispose:()=>void};
/** A subdivided image strip refracts through an original screen-space glass lens.
 * Motion lives in refs; pointer samples never trigger React renders. */
export function FlexCarousel(p:FlexCarouselProps){
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null),caption=useRef<HTMLSpanElement>(null),counter=useRef<HTMLSpanElement>(null),link=useRef<HTMLAnchorElement>(null),gpu=useRef<GPU|null>(null);
 const items=useMemo(()=>parseImages(p.images,flexImages),[p.images]);
 const [status,setStatus]=useState('Loading photographs…'),[fallback,setFallback]=useState(false);
 const state=useRef({offset:0,velocity:0,target:0,snapping:false,drag:false,hover:false,focus:false,insideFocus:false,lastX:0,lastT:0,travel:0,width:200,height:280,step:212,cycle:2120,index:0,draws:0,focusMix:0});
 const wake=useTextAnimation(host,(dt,_time,reduced)=>{
  const node=host.current,r=gpu.current,s=state.current;if(!node||!r)return false;
  const {width:w,height:h}=box.current;
  const previousStep=s.step;
  s.width=Math.min(bound(p.imageWidth,190,80,600),w*.58);s.height=Math.min(bound(p.imageHeight,280,100,650),h*.58);s.step=s.width+bound(p.gap,12,0,80);s.cycle=s.step*items.length;if(previousStep!==s.step){s.offset*=s.step/previousStep;s.target*=s.step/previousStep;}
  if(s.snapping&&!s.drag){const delta=relative(s.target-s.offset,s.cycle);s.offset+=delta*(reduced?1:1-Math.exp(-dt*11));if(Math.abs(delta)<.15){s.offset=s.target;s.snapping=false;}s.velocity=0;}
  else if(!s.drag&&!reduced){s.offset+=s.velocity*dt;s.velocity=coast(s.velocity,dt,bound(p.momentum,.85,0,1));if(Math.abs(s.velocity)<.15)s.velocity=0;if(p.autoplay!==false&&!(p.pauseOnHover!==false&&s.hover)&&!s.focus&&!s.insideFocus){s.offset+=(p.direction==='right'?-1:1)*bound(p.speed,28,0,250)*dt;}}
  s.focusMix+=(Number(s.focus)-s.focusMix)*(reduced?1:1-Math.exp(-dt*10));
  s.offset=wrap(s.offset,s.cycle);s.index=wrap(Math.round(s.offset/s.step),items.length);
  const title=items[s.index]?.title||items[s.index]?.alt||'Gallery',count=`${s.index+1} / ${items.length}`;const alt=items[s.index]?.alt||title;if(canvas.current&&canvas.current.getAttribute('aria-label')!==alt)canvas.current.setAttribute('aria-label',alt);if(caption.current&&caption.current.textContent!==title)caption.current.textContent=title;if(counter.current&&counter.current.textContent!==count)counter.current.textContent=count;
  if(link.current){const href=items[s.index]?.href;link.current.hidden=!href;if(href)link.current.href=href;}
  node.dataset.offset=s.offset.toFixed(3);node.dataset.velocity=s.velocity.toFixed(2);node.dataset.index=String(s.index);node.dataset.draws=String(++s.draws);node.dataset.dragging=String(s.drag);
  const {gl,program,uniforms:u,textures}=r;gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);
  gl.uniform2f(u.viewport,w,h);gl.uniform2f(u.card,s.width,s.height);gl.uniform1f(u.distortion,bound(p.distortion,.85,0,2));gl.uniform1f(u.edgeWidth,bound(p.edgeWidth,.65,.1,1.3));gl.uniform1f(u.glass,bound(p.glassStrength,1,0,3));gl.uniform1f(u.radius,bound(p.borderRadius,0,0,60));gl.uniform1f(u.blur,bound(p.blur,0,0,8));gl.uniform1f(u.velocity,s.velocity);gl.uniform1f(u.focus,s.focusMix);gl.uniform1i(u.image,0);
  // Repeating virtual slots cover even a one-image data set without a seam.
  const slots=Math.ceil(w/s.step)+6,base=Math.floor(s.offset/s.step);for(let slot=base-Math.ceil(slots/2);slot<=base+Math.ceil(slots/2);slot++){
   const index=wrap(slot,items.length),x=slot*s.step-s.offset;if(Math.abs(x)>w*.5+s.width*(.5*bound(p.scale,1,.5,1.5)+.25))continue;const texture=textures[index];if(!texture){r.request(index);continue;}
   const centered=Math.abs(x)<s.step*.5;gl.uniform2f(u.center,x+(centered?0:Math.sign(x)*s.width*.25*s.focusMix),0);gl.uniform1f(u.scale,bound(p.scale,1,.5,1.5)*(centered?1+.35*s.focusMix:1));gl.uniform2f(u.imageSize,texture.width,texture.height);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture.texture);gl.drawArrays(gl.TRIANGLES,0,32*8*6);
  }
  return !reduced&&(Math.abs(Number(s.focus)-s.focusMix)>.001||s.snapping||Math.abs(s.velocity)>.15||p.autoplay!==false&&bound(p.speed,28,0,250)>0&&!(p.pauseOnHover!==false&&s.hover)&&!s.focus&&!s.insideFocus);
 });
 const box=useAnimationCanvas(host,canvas,wake,'medium');
 useEffect(()=>{
  const el=canvas.current!;let dead=false,dispose=()=>{};
  const init=()=>{
   const gl=el.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false});if(!gl){setFallback(true);setStatus('WebGL unavailable · simplified image strip');return;}
   const shaders:WebGLShader[]=[],textures:(Texture|null)[]=items.map(()=>null),program=gl.createProgram()!,buffer=gl.createBuffer()!;let resourcesDisposed=false;
   dispose=()=>{if(resourcesDisposed)return;resourcesDisposed=true;for(const t of textures)if(t)gl.deleteTexture(t.texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);for(const shader of shaders)gl.deleteShader(shader);gpu.current=null;};
   try{
    for(const [kind,source] of [[gl.VERTEX_SHADER,flexVertex],[gl.FRAGMENT_SHADER,flexFragment]] as const){const shader=gl.createShader(kind)!;shaders.push(shader);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader)||'Shader compilation failed');gl.attachShader(program,shader);}
    gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program)||'Shader linking failed');gl.useProgram(program);
    const mesh:number[]=[];for(let x=0;x<32;x++)for(let y=0;y<8;y++)mesh.push(x/32,y/8,(x+1)/32,y/8,x/32,(y+1)/8,x/32,(y+1)/8,(x+1)/32,y/8,(x+1)/32,(y+1)/8);
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(mesh),gl.STATIC_DRAW);const attr=gl.getAttribLocation(program,'uv');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    const uniforms=Object.fromEntries(['viewport','card','center','distortion','edgeWidth','scale','focus','velocity','image','imageSize','glass','blur','radius'].map(key=>[key,gl.getUniformLocation(program,key)]));let failed=0;const pending=new Set<number>();
    const request=(i:number)=>{if(pending.has(i)||dead||resourcesDisposed)return;pending.add(i);const item=items[i],image=new Image();image.crossOrigin='anonymous';image.decoding='async';image.onload=()=>{if(dead||resourcesDisposed)return;const texture=gl.createTexture()!;gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);}catch{gl.deleteTexture(texture);failed++;setStatus('Image upload blocked. Use local PNGs or CORS-enabled media.');return;}textures[i]={texture,width:image.naturalWidth,height:image.naturalHeight};setStatus(failed?`${failed} image(s) could not be loaded`:'');wake();};image.onerror=()=>{if(!dead&&!resourcesDisposed){failed++;setStatus(`${failed} image(s) could not be loaded`);}};image.src=item.src;};gpu.current={gl,program,uniforms,textures,request,dispose};wake();
   }catch{dispose();setFallback(true);setStatus('WebGL initialization failed · simplified image strip');}
  };
  const lost=(e:Event)=>{e.preventDefault();dispose();},restore=()=>{if(!dead){setFallback(false);init();}};el.addEventListener('webglcontextlost',lost);el.addEventListener('webglcontextrestored',restore);init();
  return()=>{dead=true;dispose();el.removeEventListener('webglcontextlost',lost);el.removeEventListener('webglcontextrestored',restore);};
 },[items]);
 const step=(direction:number)=>{const s=state.current;s.focus=false;s.target=Math.round(s.offset/s.step)*s.step+direction*s.step;s.snapping=true;wake();};
 const select=()=>{const s=state.current;s.focus=!s.focus;s.target=Math.round(s.offset/s.step)*s.step;s.snapping=true;wake();};
 const background=String(p.background||'#120f17'),channels=rgb(background),foreground=channels[0]*.2126+channels[1]*.7152+channels[2]*.0722>.55?'#16121c':'#ffffff';
 const point=(e:PointerEvent<HTMLDivElement>)=>canvasPoint(host.current!,e.clientX,e.clientY).x;
 const finish=(e:PointerEvent<HTMLDivElement>)=>{const s=state.current;if(!s.drag)return;s.drag=false;host.current?.releasePointerCapture(e.pointerId);if(s.travel<5){const index=Math.round((s.offset+s.lastX-box.current.width*.5)/s.step);const same=wrap(index,items.length)===s.index;s.focus=same?!s.focus:false;s.target=index*s.step;s.snapping=true;}wake();};
 return <div ref={host} className="flex-carousel" style={{'--fc-background':background,color:foreground} as CSSProperties} role="region" aria-roledescription="carousel" aria-label="Flex Carousel" tabIndex={0}
 onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();step(e.key==='ArrowRight'?1:-1);}if(e.key==='Enter'){e.preventDefault();select();}if(e.key==='Escape'){state.current.focus=false;wake();}}}
 onFocus={()=>{state.current.insideFocus=true;wake();}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget)){state.current.insideFocus=false;wake();}}}
 onPointerEnter={()=>{state.current.hover=true;wake();}} onPointerLeave={()=>{state.current.hover=false;wake();}}
 onPointerDown={e=>{if(p.interactive===false||e.button!==0||(e.target as HTMLElement).closest('button,a'))return;const s=state.current;s.drag=true;s.focus=false;s.snapping=false;s.lastX=point(e);s.lastT=performance.now();s.travel=0;s.velocity=0;e.currentTarget.setPointerCapture(e.pointerId);wake();}}
 onPointerMove={e=>{const s=state.current;if(!s.drag)return;const x=point(e),delta=(s.lastX-x)*bound(p.dragSensitivity,1,.2,3),now=performance.now();s.offset+=delta;s.velocity=s.velocity*.35+Math.max(-2500,Math.min(2500,delta/Math.max(.008,(now-s.lastT)/1000)))*.65;s.travel+=Math.abs(delta);s.lastX=x;s.lastT=now;wake();}}
 onPointerUp={finish} onPointerCancel={e=>{state.current.drag=false;state.current.velocity=0;host.current?.releasePointerCapture(e.pointerId);wake();}}>
 <canvas ref={canvas} role="img" aria-label={items[state.current.index]?.alt||'Gallery photograph'}/>
 {fallback&&<div className="flex-carousel-fallback">{items.map((item,i)=><img key={i} src={item.src} alt={item.alt||''} loading="lazy"/>)}</div>}
 {status&&<div className="flex-carousel-status" role="status">{status}</div>}
 {p.showCaptions!==false&&<div className="flex-carousel-caption"><span ref={caption}/><span>DRAG TO EXPLORE</span></div>}
 <div className="flex-carousel-footer"><button aria-label="Previous image" onClick={()=>step(-1)}>←</button><span ref={counter} aria-live="off"/><button aria-label="Next image" onClick={()=>step(1)}>→</button><a ref={link} hidden target="_blank" rel="noopener noreferrer">Open image</a></div>
 </div>;
}
