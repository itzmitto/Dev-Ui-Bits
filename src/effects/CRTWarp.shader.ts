import {backgroundPrelude} from './backgroundGL';
export const crtShader=backgroundPrelude+`
uniform vec3 phosphor,bg;uniform float curvature,scanlines,chroma,cellSize,flicker,contrast,maskStrength;
float plasma(vec2 p,float t){return sin(p.x*7.+sin(p.y*4.+t*.5))*cos(p.y*5.-t*.4)+.6*sin(length(p-vec2(sin(t*.3),cos(t*.2))*.3)*12.-t);}
vec3 signal(vec2 uv){vec2 q=floor(uv*resolution/cellSize)*cellSize/resolution;float v=plasma(q,time);v=max(0.,floor((v*.5+.5)*5.)/5.);return phosphor*v*contrast+vec3(.12,.06,.3)*pow(v,2.);}
void main(){vec2 uv=gl_FragCoord.xy/pixelRatio/resolution;vec2 q=(uv-.5)*2.;q*=1.+curvature*dot(q,q)*.18;if(intro<1.)q.y/=max(.005,intro*intro);uv=q*.5+.5;if(max(abs(q.x),abs(q.y))>1.){gl_FragColor=vec4(bg,1.);return;}
if(active>.5){vec2 d=uv-mouse;uv+=d*exp(-dot(d,d)*28.)*.15;}float clickRadius=length(uv-click.xy);uv+=normalize(uv-click.xy+vec2(.0001))*sin(clickRadius*45.-click.z*12.)*exp(-click.z*3.)*.015*hasClick;
vec2 shift=vec2(chroma/resolution.x,0.);vec3 col=signal(uv);col.r=signal(uv+shift).r;col.b=signal(uv-shift).b;col=mix(col,signal(uv+vec2(.002,.003)),.13);
float scan=1.-scanlines*(.5+.5*sin(gl_FragCoord.y/pixelRatio*3.14159));vec3 mask=vec3(.7);float channel=mod(floor(gl_FragCoord.x/pixelRatio),3.);if(channel<1.)mask.r=1.;else if(channel<2.)mask.g=1.;else mask.b=1.;col*=mix(vec3(1.),mask,maskStrength);col*=scan*(1.-flicker*.12*hash(vec2(floor(time*60.),0.)));col*=pow(max(0.,1.-dot(q*.62,q*.62)),.4);gl_FragColor=vec4(bg+col,1.);}`;
