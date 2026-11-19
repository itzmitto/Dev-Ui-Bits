import {useEffect,useRef,useState,type PointerEvent} from 'react';
import {useTextAnimation,bound} from './textRuntime';
import {useAnimationCanvas,canvasPoint} from './animationCanvas';
import type {EffectProps} from './types';
import './backgroundBatchOne.css';
export type BackgroundFrame={width:number;height:number;time:number;intro:number;mouse:number[];active:number;click:number[];hasClick:number;reduced:boolean};
type Uniforms=Record<string,number|readonly number[]>;
type Props={p:EffectProps;name:string;fragment:string;uniforms:(p:EffectProps)=>Uniforms;fallback:(c:CanvasRenderingContext2D,f:BackgroundFrame,p:EffectProps)=>void};
const vertex='attribute vec2 position;void main(){gl_Position=vec4(position,0.0,1.0);}';
export const backgroundPrelude=`precision highp float;uniform vec2 resolution;uniform float time,intro,active,hasClick,pixelRatio;uniform vec2 mouse;uniform vec3 click;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}`;
/** Minimal owned WebGL lifecycle: no scene library, one full-screen triangle pair, no GPU textures. */
export function BackgroundGL({p,name,fragment,uniforms,fallback}:Props){
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null),fallbackCanvas=useRef<HTMLCanvasElement>(null),gpu=useRef<{gl:WebGLRenderingContext;program:WebGLProgram;locations:Map<string,WebGLUniformLocation|null>;dispose:()=>void}|null>(null),pointer=useRef({x:0,y:0,inside:false}),state=useRef({time:0,intro:0,x:0,y:0,clickX:0,clickY:0,clickAge:9,drawn:false,sampling:1,average:1/60,budgetTime:0,lastQuality:'',width:0,height:0});
 const [failed,setFailed]=useState(false);
 const wake=useTextAnimation(host,(dt,_time,reduced)=>{
  const {width,height,dpr:baseDpr}=box.current,s=state.current,quality=String(p.quality||'medium');
  // A bounded, downward-only budget avoids resolution oscillation. High stays native.
  if(s.lastQuality!==quality||s.width!==width||s.height!==height){s.lastQuality=quality;s.width=width;s.height=height;s.sampling=quality==='low'?.72:1;s.average=1/60;s.budgetTime=0;}
  if(quality==='medium'&&!reduced&&p.paused!==true&&s.intro>.75){s.average=s.average*.88+dt*.12;s.budgetTime+=dt;if(s.budgetTime>.9&&s.average>1/48&&s.sampling>.55){s.sampling=Math.max(.55,s.sampling*.82);s.budgetTime=0;s.average=1/60;}}
  const targetWidth=Math.max(1,Math.round(width*baseDpr*s.sampling)),dpr=targetWidth/width,targetHeight=Math.max(1,Math.round(height*dpr)),el=canvas.current!;
  if(el.width!==targetWidth)el.width=targetWidth;if(el.height!==targetHeight)el.height=targetHeight;
  if(host.current)host.current.dataset.sampling=s.sampling.toFixed(3);
  
  if(!reduced&&p.paused!==true){s.time+=dt*bound(p.speed,.5,0,3);s.intro+=dt;s.clickAge+=dt;}else if(reduced){s.intro=3;s.clickAge=9;}
  const follow=p.paused===true?0:1-Math.exp(-dt/Math.max(.001,bound(p.mouseDampening,.15,0,.5)));s.x+=(pointer.current.x-s.x)*follow;s.y+=(pointer.current.y-s.y)*follow;
  const f:BackgroundFrame={width,height,time:s.time,intro:p.intro===false?1:Math.min(1,s.intro/1.5),mouse:[s.x/Math.max(1,width),1-s.y/Math.max(1,height)],active:pointer.current.inside&&p.mouseInteraction!==false?1:0,click:[s.clickX/width,1-s.clickY/height,s.clickAge],hasClick:s.clickAge<2?1:0,reduced};
  const resource=gpu.current;
  if(resource&&!failed){const{gl,program,locations}=resource;gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);gl.useProgram(program);
   const values:Uniforms={resolution:[width,height],pixelRatio:dpr,time:f.time,intro:f.intro,mouse:f.mouse,active:f.active,click:f.click,hasClick:f.hasClick,...uniforms(p)};
   for(const [key,value]of Object.entries(values)){if(!locations.has(key))locations.set(key,gl.getUniformLocation(program,key));const loc=locations.get(key)!;if(loc===null)continue;if(typeof value==='number')gl.uniform1f(loc,value);else if(value.length===2)gl.uniform2fv(loc,value);else if(value.length===3)gl.uniform3fv(loc,value);else gl.uniform4fv(loc,value);}
   gl.drawArrays(gl.TRIANGLES,0,6);
  }else if(failed&&fallbackCanvas.current){const el=fallbackCanvas.current;if(el.width!==canvas.current!.width||el.height!==canvas.current!.height){el.width=canvas.current!.width;el.height=canvas.current!.height;}const c=el.getContext('2d')!;c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,width,height);fallback(c,f,p);}
  else return false;
  s.drawn=true;if(host.current){host.current.dataset.engine=failed?'canvas-fallback':'webgl';host.current.dataset.clicks=String(f.hasClick);}
  return !reduced&&p.paused!==true&&(bound(p.speed,.5,0,3)>0||s.clickAge<2||s.intro<1.5||f.active>0&&Math.hypot(pointer.current.x-s.x,pointer.current.y-s.y)>.1);
 });
 const box=useAnimationCanvas(host,canvas,wake,String(p.quality||'medium'));
 useEffect(()=>{
  const el=canvas.current!;let disposed=false;
  const init=()=>{const gl=el.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:true});if(!gl){setFailed(true);return;}
   let program:WebGLProgram|null=null,buffer:WebGLBuffer|null=null;const shaders:WebGLShader[]=[];
   const dispose=()=>{if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program);for(const shader of shaders)gl.deleteShader(shader);};
   try{program=gl.createProgram();if(!program)throw Error('Unable to create shader program');for(const [kind,source]of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]] as const){const shader=gl.createShader(kind)!;shaders.push(shader);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader)||'Shader compilation failed');gl.attachShader(program,shader);}gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program)||'Shader link failed');buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);gpu.current={gl,program,locations:new Map(),dispose};setFailed(false);wake();}catch(e){dispose();if(host.current)host.current.dataset.shaderError=String(e);setFailed(true);}
  };
  const lost=(e:Event)=>{e.preventDefault();gpu.current?.dispose();gpu.current=null;setFailed(true);};const restored=()=>{if(!disposed)init();};el.addEventListener('webglcontextlost',lost);el.addEventListener('webglcontextrestored',restored);init();return()=>{disposed=true;el.removeEventListener('webglcontextlost',lost);el.removeEventListener('webglcontextrestored',restored);gpu.current?.dispose();gpu.current=null;};
 },[fragment]);
 const point=(e:PointerEvent<HTMLDivElement>)=>{const q=canvasPoint(e.currentTarget,e.clientX,e.clientY);if(p.paused===true)return q;Object.assign(pointer.current,q,{inside:true});wake();return q;};
 return <div ref={host} className="background-engine" data-background={name} style={{background:p.lightMode===true?'#f4f5f8':String(p.backgroundColor||p.color||'#120f17')}} onPointerMove={point} onPointerLeave={()=>{pointer.current.inside=false;wake();}} onPointerDown={e=>{const q=point(e);if(p.paused===true||p.mouseInteraction===false||p.flipOnClick===false||p.clickSwirl===false)return;Object.assign(state.current,{clickX:q.x,clickY:q.y,clickAge:0});wake();}}><canvas ref={canvas} aria-label={`${name} procedural background`} role="img" style={{visibility:failed?'hidden':'visible'}}/>{failed&&<><canvas ref={fallbackCanvas} aria-label={`${name} simplified Canvas fallback`} role="img"/><span className="background-fallback" role="status">WebGL unavailable · simplified Canvas preview</span></>}</div>;
}
