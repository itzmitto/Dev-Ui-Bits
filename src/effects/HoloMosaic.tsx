import {holoDefaults} from './backgroundBatchOne.defaults';
import {BackgroundGL,type BackgroundFrame} from './backgroundGL';
import {holoFragment} from './HoloMosaic.shader';
import {num,str,type EffectProps} from './types';
import {rgb} from './animationCanvas';
const uniforms=(p:EffectProps)=>Object.fromEntries([...['tileSize','gap','roundness','bevel','rotation','scatter','tilt','swirl','ripple','bands','softness','intensity','saturation','glitter','sheen','grain','opacity','mouseStrength','mouseRadius','variation'].map(k=>[k,k==='rotation'?num(p,k,0)*Math.PI/180:num(p,k,1)]),['baseColor',rgb(str(p,'color','#120f17'))],['metalColor',rgb(str(p,'metalColor','#e8ebf1'))],['lightMode',p.lightMode?1:0]]);
function fallback(c:CanvasRenderingContext2D,f:BackgroundFrame,p:EffectProps){const size=48*num(p,'tileSize',1);for(let y=0;y<f.height;y+=size)for(let x=0;x<f.width;x+=size){const glow=(1+Math.sin(x*.01+y*.02+f.time))/2,g=c.createLinearGradient(x,y,x+size,y+size);g.addColorStop(0,str(p,'color','#120f17'));g.addColorStop(glow*.8+.1,str(p,'metalColor','#e8ebf1'));g.addColorStop(1,str(p,'color','#120f17'));c.fillStyle=g;c.beginPath();c.roundRect(x+2,y+2,size-4,size-4,4);c.fill();}}
export function HoloMosaic(input:EffectProps){const p={...holoDefaults,...input};return <BackgroundGL p={p} name="Holo Mosaic" fragment={holoFragment} uniforms={uniforms} fallback={fallback}/>;}
