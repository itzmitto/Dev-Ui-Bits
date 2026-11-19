import {backgroundPrelude} from './backgroundGL';
/** Independently derived rounded-tile SDF, etched reflection field and thin-film interference. */
export const holoFragment=backgroundPrelude+`
uniform vec3 baseColor,metalColor;uniform float tileSize,gap,roundness,bevel,rotation,scatter,tilt,swirl,ripple,bands,softness,intensity,saturation,glitter,sheen,grain,opacity,lightMode,mouseStrength,mouseRadius,variation;
float surface(vec2 p){return sin(p.x*bands*3.0+sin(p.y*swirl*3.0+time*.35))+cos(length(p*2.0)*4.0-time*.55)*ripple;}
void main(){
 vec2 uv=(gl_FragCoord.xy / pixelRatio)/resolution;vec2 world=rot(rotation)*((gl_FragCoord.xy / pixelRatio)-resolution*.5);float cell=48.0*tileSize;vec2 id=floor(world/cell),local=fract(world/cell)-.5;float seed=hash(id+variation);
 vec2 center=(id+.5)*cell;float d=length((center+resolution*.5)/resolution-mouse);float magnet=active*exp(-d*d/max(.001,mouseRadius*mouseRadius))*mouseStrength;
 float ring=hasClick*exp(-pow((length(uv-click.xy)-click.z*.55)/.055,2.0))*exp(-click.z);float flip=(1.0-intro)*clamp(length(center/resolution)*2.0,0.0,1.0)*1.5+ring*3.14159;
 local.x/=max(.025,abs(cos(flip)));local+=vec2(sin(seed*6.28),cos(seed*6.28))*magnet*.06;
 float radius=.02+roundness*.18;vec2 q=abs(local)-vec2(.5-gap*.5-radius);float sdf=length(max(q,0.0))+min(max(q.x,q.y),0.0)-radius;
 if(sdf>0.0){gl_FragColor=vec4(lightMode>.5?vec3(.94):baseColor,opacity);return;}
 vec2 p=(center+local*cell)/resolution.y;float field=surface(p*2.0+seed*scatter*.3);float angle=field+seed*scatter*3.0+time*.08+magnet*.8;
 vec2 edgeNormal=sign(local)*smoothstep(.42,.5,abs(local));vec3 normal=normalize(vec3(edgeNormal*bevel*.7+vec2(sin(seed*5.0),cos(seed*4.0))*tilt*.4,1.0));
 float reflection=pow(.5+.5*sin(angle*3.0+normal.x*4.0+normal.y*2.0),3.0-softness*1.5);
 float spec=pow(max(0.0,dot(normal,normalize(vec3(.4+magnet,.6,.8)))),24.0)*sheen;
 vec3 spectral=.5+.5*cos(vec3(0.0,2.094,4.188)+angle*6.2831);
 vec3 metal=mix(baseColor,metalColor,clamp(.035+reflection*.72+spec*.5,0.0,1.0));
 vec3 color=mix(metal,metal*spectral*1.7,saturation)*intensity;
 float rim=exp(-abs(sdf)*120.0);color+=metalColor*rim*(.07+bevel*.1);
 float sparkle=step(.9992,hash(floor(local*120.0)+id*193.0))*pow(max(0.0,sin(time+seed*20.0)),10.0)*glitter;color+=metalColor*sparkle;
 color+=(hash((gl_FragCoord.xy / pixelRatio)+floor(time*10.0))-.5)*grain*.2;
 if(lightMode>.5)color=mix(vec3(.94),color,.65);
 gl_FragColor=vec4(clamp(color,0.0,1.0),opacity*intro);
}`;
