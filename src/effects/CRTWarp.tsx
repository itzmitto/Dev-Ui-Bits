import {BackgroundGL} from './backgroundGL';
import {crtShader} from './CRTWarp.shader';
import {rgb} from './animationCanvas';
import {bound} from './textRuntime';
import type {EffectProps} from './types';
export function CRTWarp(p:EffectProps){return <BackgroundGL p={p} name="crt-warp" fragment={crtShader} uniforms={p=>({phosphor:rgb(String(p.color||'#c755f7')),bg:rgb(String(p.background||'#120f17')),curvature:bound(p.curvature,.45,0,1.5),scanlines:bound(p.scanlines,.55,0,1),chroma:bound(p.chroma,3,0,15),cellSize:bound(p.cellSize,12,3,35),flicker:bound(p.flicker,.2,0,1),contrast:bound(p.intensity,1.4,.3,3),maskStrength:bound(p.mask,.6,0,1)})} fallback={(c,f,p)=>{c.fillStyle=String(p.background||'#120f17');c.fillRect(0,0,f.width,f.height);c.fillStyle=String(p.color||'#c755f7');for(let y=0;y<f.height;y+=5){c.globalAlpha=.3+.25*Math.sin(y*.02+f.time);c.fillRect(0,y,f.width,2);}c.globalAlpha=1;}}/>;}
