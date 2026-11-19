import {fluxDefaults} from './backgroundBatchOne.defaults';
import {BackgroundGL,type BackgroundFrame} from './backgroundGL';
import {fluxFragment} from './FluxLines.shader';
import {num,str,type EffectProps} from './types';
import {rgb} from './animationCanvas';
const uniforms=(p:EffectProps)=>Object.fromEntries([...['glow','rimWidth','sharpness','lineWidth','shimmer','scale','turbulence','fluidity','mouseStrength','mouseRadius','opacity'].map(k=>[k,num(p,k,1)]),...['color1','color2','color3'].map(k=>[k,rgb(str(p,k,'#ffffff'))]),['lightMode',p.lightMode?1:0],['flowDirection',['down','up','left','right'].indexOf(str(p,'flowDirection','down'))]]);
function fallback(c:CanvasRenderingContext2D,f:BackgroundFrame,p:EffectProps){c.strokeStyle=str(p,'color1','#ffffff');c.lineWidth=num(p,'lineWidth',1);for(let line=0;line<18;line++){c.beginPath();for(let i=0;i<=100;i++){const x=i*f.width/100,y=f.height*(line/18+.05*Math.sin(i*.12+line+f.time)+.04*Math.sin(i*.25-line));if(i)c.lineTo(x,y);else c.moveTo(x,y);}c.stroke();}}
export function FluxLines(input:EffectProps){const p={...fluxDefaults,...input};return <BackgroundGL p={{...p,color:p.lightMode?'#f4f5f8':str(p,'backgroundColor','#120f17')}} name="Flux Lines" fragment={fluxFragment} uniforms={uniforms} fallback={fallback}/>;}
