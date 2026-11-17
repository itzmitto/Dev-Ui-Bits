// Independently authored full-screen lens shader. No geometry or shader library.
const vertex=`attribute vec2 aPosition;varying vec2 vUv;void main(){vUv=(aPosition+1.0)*.5;gl_Position=vec4(aPosition,0.,1.);}`;
const fragment=`precision highp float;varying vec2 vUv;uniform sampler2D uText;uniform vec2 uResolution;uniform vec2 uPointer;uniform vec3 uClick;uniform float uTime,uAmbient,uScale,uStrength,uRadius,uLens,uChromatic,uRefraction,uRipple,uIntro;
void main(){
 vec2 uv=vec2(vUv.x,1.-vUv.y);float aspect=uResolution.x/uResolution.y;vec2 p=uv-uPointer;p.x*=aspect;
 float radius=max(.03,uRadius*aspect),distance=length(p),weight=pow(max(0.,1.-distance/radius),2.);
 vec2 bend=vec2(sin(uv.y*uScale*12.+uTime*.9),cos(uv.x*uScale*11.-uTime*.65))*(uAmbient+uIntro*.5)*.027;
 if(uLens<.5)bend+=p/vec2(aspect,1.)*weight*uStrength*.75;
 else if(uLens<1.5)bend-=p/vec2(aspect,1.)*weight*uStrength*.75;
 else{float angle=weight*uStrength*3.5;mat2 turn=mat2(cos(angle),-sin(angle),sin(angle),cos(angle));bend+=(turn*p-p)/vec2(aspect,1.);}
 if(uRipple>.5)bend+=p/vec2(aspect,1.)*sin(distance*32.-uTime*4.)*weight*uStrength*.07;
 vec2 cp=uv-uClick.xy;cp.x*=aspect;float age=uClick.z;
 float wave=exp(-pow(length(cp)-age*.7,2.)/.003)*exp(-age*1.6)*step(.001,age);bend+=normalize(cp+vec2(.00001))/vec2(aspect,1.)*wave*.028;
 vec2 sampleUv=uv+bend;vec2 split=bend*(uRefraction*8.+uChromatic*weight*.2)+vec2(uRefraction*.09,0.);
 vec4 base=texture2D(uText,sampleUv),r=texture2D(uText,sampleUv+split),b=texture2D(uText,sampleUv-split);
 gl_FragColor=vec4(r.r,base.g,b.b,max(base.a,max(r.a,b.a)))*(1.-uIntro*.5);
}`;
export type WarpFrame={width:number;height:number;pointerX:number;pointerY:number;time:number;ambient:number;scale:number;strength:number;radius:number;lens:number;chromatic:number;refraction:number;ripple:boolean;intro:number;clickX:number;clickY:number;clickAge:number};
export function createWarpRenderer(canvas:HTMLCanvasElement){
 const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,preserveDrawingBuffer:true});if(!gl)return null;
 const compile=(type:number,source:string)=>{const shader=gl.createShader(type)!;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Error(`Warp shader: ${message}`);}return shader;};
 const vs=compile(gl.VERTEX_SHADER,vertex);let fs:WebGLShader;try{fs=compile(gl.FRAGMENT_SHADER,fragment);}catch(error){gl.deleteShader(vs);throw error;}const program=gl.createProgram()!;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);throw new Error('Warp shader could not link.');}gl.useProgram(program);
 const buffer=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const position=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
 const texture=gl.createTexture()!;gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 const names=['uResolution','uPointer','uClick','uTime','uAmbient','uScale','uStrength','uRadius','uLens','uChromatic','uRefraction','uRipple','uIntro'] as const;const uniforms=Object.fromEntries(names.map(name=>[name,gl.getUniformLocation(program,name)]));
 return {upload(source:HTMLCanvasElement){gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);},draw(frame:WarpFrame){gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(uniforms.uResolution,frame.width,frame.height);gl.uniform2f(uniforms.uPointer,frame.pointerX,frame.pointerY);gl.uniform3f(uniforms.uClick,frame.clickX,frame.clickY,frame.clickAge);for(const [name,value] of Object.entries({uTime:frame.time,uAmbient:frame.ambient,uScale:frame.scale,uStrength:frame.strength,uRadius:frame.radius,uLens:frame.lens,uChromatic:frame.chromatic,uRefraction:frame.refraction,uRipple:frame.ripple?1:0,uIntro:frame.intro}))gl.uniform1f(uniforms[name],value);gl.drawArrays(gl.TRIANGLES,0,6);},dispose(){gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);}};
}
