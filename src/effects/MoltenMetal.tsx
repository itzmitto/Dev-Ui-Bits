import {BackgroundGL} from './backgroundGL';
import {moltenShader} from './MoltenMetal.shader';
import {rgb} from './animationCanvas';
import {bound} from './textRuntime';
import type {EffectProps} from './types';
export function MoltenMetal(p:EffectProps){return <BackgroundGL p={p} name="molten-metal" fragment={moltenShader} uniforms={p=>({hot:rgb(String(p.color||'#ff752a')),cold:rgb(String(p.secondary||'#dc212e')),core:rgb(String(p.coreColor||'#fff5e4')),bg:rgb(String(p.background||'#100c0a')),scale:bound(p.scale,4,1,10),detail:bound(p.detail,3,0,6),glow:bound(p.glow,1.5,.2,3),thickness:bound(p.thickness,1,.3,2.5),turbulence:bound(p.turbulence,.8,0,2)})} fallback={(c,f,p)=>{c.fillStyle=String(p.background||'#100c0a');c.fillRect(0,0,f.width,f.height);for(let j=0;j<18;j++){c.beginPath();for(let x=0;x<f.width;x+=5){const y=f.height*.5+Math.sin(x*.01+j*.3+f.time)*f.height*.3+Math.sin(x*.02+j)*25;if(x===0)c.moveTo(x,y);else c.lineTo(x,y);}c.strokeStyle=String(p.color||'#ff752a');c.lineWidth=.6;c.stroke();}}}/>;}
