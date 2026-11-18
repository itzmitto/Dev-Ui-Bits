import type { BallFrame } from './CrystalizedBall.renderer';
import { rgba } from './animationCanvas';
/** A deliberately capped 2D renderer for devices without WebGL. No CSS stand-in. */
export function drawBallFallback(canvas:HTMLCanvasElement,f:BallFrame,seeds:Float32Array){
 const c=canvas.getContext('2d')!,dpr=canvas.width/f.width,radius=Math.min(f.width,f.height)*f.size/2,cx=f.width/2,cy=f.height/2;
 c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,f.width,f.height);
 const haze=c.createRadialGradient(cx,cy+radius*.6,0,cx,cy,radius);haze.addColorStop(0,rgba(f.color,f.haze*.12));haze.addColorStop(1,rgba(f.color,0));c.fillStyle=haze;c.beginPath();c.arc(cx,cy,radius,0,Math.PI*2);c.fill();
 c.strokeStyle=f.color;c.shadowColor=f.color;c.shadowBlur=f.glow*14;c.lineWidth=1.2;
 for(let k=0;k<f.strands;k++){c.beginPath();for(let i=0;i<=360;i++){const a=i*Math.PI/180,charge=Math.exp(-Math.hypot(Math.cos(a)-f.pointerX,Math.sin(a)-f.pointerY)*3)*f.hover,flare=Math.pow(Math.max(0,Math.sin(a*3-f.time*.35+k)),12)*f.flares*radius*.018,r=radius+(Math.sin(a*43+f.time*8+k)*.8+Math.sin(a*79-f.time*14+k)*.7)*f.crackle*(1+charge)+flare,x=cx+Math.cos(a)*r,y=cy-Math.sin(a)*r;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
 c.shadowBlur=0;
 for(let i=0;i<Math.min(seeds.length/4,f.particleCount);i++){const seedY=seeds[i*4+1],tone=seeds[i*4+3],u=(seedY+f.dustTime*.046*(f.motion===0?1:f.motion===1?-1:.2))%1,v=u<0?u+1:u;let y=-.985+Math.min(1.97,1.97*f.fill+tone*.38)*Math.pow(v,.8);if(tone>.97)y=-.985+1.97*v;const a=seeds[i*4]*Math.PI*2+Math.sin(f.dustTime*.2)*f.sway,radial=(Math.sqrt(seeds[i*4+2])*.55+Math.pow(seeds[i*4+2],.15)*.45)*Math.sqrt(Math.max(0,1-y*y)),z=Math.sin(a)*radial,front=(z+1)/2,x=Math.cos(a)*radial+Math.sin(f.dustTime*.3+tone*20)*(f.motion>1?.015:0),size=(.9+tone*1.7)*(1-f.depth*(.65-front*.85)),alpha=(.25+tone*.5)*(1-f.depth*(.75-front*.75))*(1-f.twinkle*.5+f.twinkle*.5*Math.sin(seeds[i*4]*130+f.dustTime*2));c.fillStyle=rgba(f.color,alpha);const px=cx+x*radius+f.pointerX*f.hover*5,py=cy-y*radius;if(f.round){c.beginPath();c.arc(px,py,Math.max(.3,size/2),0,Math.PI*2);c.fill();}else c.fillRect(px,py,size,size);}
 if(f.sparks>0){c.strokeStyle=rgba(f.color,f.sparks*.4);for(let i=0;i<4;i++){const a=f.time*.6+i*1.6;c.beginPath();c.arc(cx,cy,radius*.96,a,a+Math.max(0,Math.sin(f.time*2+i))*.12);c.stroke();}}
}
