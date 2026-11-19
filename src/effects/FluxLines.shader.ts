import {backgroundPrelude} from './backgroundGL';
/** Domain-warped implicit contours. Numerical gradients convert level-set distance to pixel width. */
export const fluxFragment=backgroundPrelude+`
uniform vec3 color1,color2,color3;uniform float glow,rimWidth,sharpness,lineWidth,shimmer,scale,turbulence,fluidity,flowDirection,mouseStrength,mouseRadius,opacity,lightMode;
float field(vec2 p){vec2 w=p+vec2(sin(p.y*1.4+time*.23),cos(p.x*1.2-time*.17))*turbulence;return sin(w.x+sin(w.y*.85)*fluidity*3.0)*cos(w.y)+sin(w.x*1.7+w.y*.8+time*.12)*.35;}
void main(){vec2 uv=(gl_FragCoord.xy / pixelRatio)/resolution;vec2 p=((gl_FragCoord.xy / pixelRatio)-resolution*.5)/resolution.y*16.0/scale;
 vec2 velocity=flowDirection<.5?vec2(0.0,-1.0):flowDirection<1.5?vec2(0.0,1.0):flowDirection<2.5?vec2(1.0,0.0):vec2(-1.0,0.0);p+=velocity*time*.2;
 vec2 delta=(uv-mouse)*vec2(resolution.x/resolution.y,1.0);float reach=exp(-dot(delta,delta)/max(.001,mouseRadius*mouseRadius));p=rot(active*reach*mouseStrength*.9)*p;
 vec2 dc=uv-click.xy;float swirl=hasClick*exp(-dot(dc,dc)*12.0)*sin(click.z*4.0)*exp(-click.z*1.4);p+=rot(swirl)*dc*swirl*3.0;
 float value=field(p),epsilon=.008;vec2 gradient=vec2(field(p+vec2(epsilon,0.0))-value,field(p+vec2(0.0,epsilon))-value)/epsilon;
 float distancePx=abs(value)/max(.03,length(gradient))*resolution.y*scale/16.0;
 float core=exp(-pow(distancePx/max(.15,lineWidth*.6),2.0))*min(1.0,lineWidth*4.0);
 float bloom=pow(1.0/(1.0+distancePx*distancePx/max(.1,rimWidth*rimWidth*280.0)),sharpness);
 float broken=pow(.5+.5*sin(p.x*2.0-p.y*1.4+time*.7),shimmer*2.0);float brightness=(core+bloom*.45)*glow*(.015+broken+active*reach*.7);
 vec3 color=mix(color1,color2,.5+.5*sin(p.y*.3+time*.08));color=mix(color,color3,(.5+.5*sin(p.x*.4))*.4);
 if(lightMode>.5)color=vec3(1.0)-color*.75;
 gl_FragColor=vec4(color,clamp(brightness*intro*opacity,0.0,1.0));}
`;
