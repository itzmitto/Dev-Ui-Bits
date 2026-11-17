import { useEffect,useMemo,useRef } from 'react';
import { num,str,type EffectProps } from './types';
import { bound,seeded,useTextAnimation } from './textRuntime';
import './SplitFlapText.css';
export function flapPhrases(words:string,text:string){return text?[text.toUpperCase()]:words.split('|').map(word=>word.trim().toUpperCase()).filter(Boolean);}
export function flapOrder(count:number,order:string){const indexes=Array.from({length:count},(_,i)=>i);if(order==='right')indexes.reverse();if(order==='center')indexes.sort((a,b)=>Math.abs(a-(count-1)/2)-Math.abs(b-(count-1)/2));if(order==='random'){const random=seeded(194);for(let i=count-1;i>0;i--){const j=Math.floor(random()*(i+1));[indexes[i],indexes[j]]=[indexes[j],indexes[i]];}}return indexes;}
export function SplitFlapText(p:EffectProps){
 const host=useRef<HTMLDivElement>(null),tiles=useRef<(HTMLDivElement|null)[]>([]),latest=useRef(p);latest.current=p;
 const words=useMemo(()=>flapPhrases(str(p,'words','LAUNCH READY|SYNC ONLINE|SIGNAL LIVE'),str(p,'text','')),[p.words,p.text]);
 const count=Math.max(1,Math.round(bound(p.padTo,12,1,40)),...words.map(word=>Array.from(word).length));
 const state=useRef({age:0,phrase:0,from:'',target:'',rank:[] as number[],stage:[] as number[]});
 const padded=(word:string)=>p.align==='right'?word.padStart(count,' '):p.align==='center'?word.padStart(Math.floor((count+word.length)/2),' ').padEnd(count,' '):word.padEnd(count,' ');
 const prepare=(index:number,from:string)=>{const s=state.current;s.age=0;s.phrase=index;s.from=from.padEnd(count,' ');s.target=padded(words[index]??'');s.stage=Array(count).fill(-1);const order=flapOrder(count,str(latest.current,'order','left'));s.rank=order.map((_,i)=>order.indexOf(i));host.current?.setAttribute('aria-label',words[index]??'');};
 const wake=useTextAnimation(host,(dt,_time,reduced)=>{
  const q=latest.current,s=state.current;if(!q.paused)s.age+=dt;
  const duration=bound(q.flipDuration,.12,.04,.5),flips=Math.round(bound(q.flipsPerChar,8,1,20)),stagger=bound(q.stagger,.06,0,.3);
  const charset=q.charset==='numeric'?'0123456789':q.charset==='alpha'?'ABCDEFGHIJKLMNOPQRSTUVWXYZ':'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const getChar=(index:number,step:number)=>step<0?s.from[index]??' ':step>=flips?s.target[index]??' ':charset[(index*13+step*7+s.phrase*11)%charset.length];
  let active=false;
  tiles.current.forEach((tile,index)=>{
   if(!tile)return;const changed=s.from[index]!==s.target[index],local=s.age-s.rank[index]*stagger;
   const stage=reduced?flips:Math.min(flips,Math.max(-1,Math.floor(local/duration))),fraction=stage<0?0:Math.min(1,(local/duration)%1);
   const done=!changed||stage>=flips;
   if(!done)active=true;
   if(s.stage[index]!==stage||tile.dataset.target!==s.target[index]){
    const old=done?s.target[index]:getChar(index,stage-1),next=done?s.target[index]:getChar(index,stage);
    tile.querySelectorAll<HTMLElement>('[data-old]').forEach(node=>{node.textContent=old;});tile.querySelectorAll<HTMLElement>('[data-new]').forEach(node=>{node.textContent=next;});s.stage[index]=stage;tile.dataset.target=s.target[index];
   }
   const upper=tile.querySelector<HTMLElement>('.flap-falling-top')!,lower=tile.querySelector<HTMLElement>('.flap-falling-bottom')!;
   upper.style.transform=`rotateX(${done?-90:-Math.min(1,fraction*2)*90}deg)`;lower.style.transform=`rotateX(${done?0:90-Math.max(0,fraction*2-1)*90}deg)`;
   upper.style.filter=`brightness(${1-Math.sin(fraction*Math.PI)*num(q,'depth',.5)*.6})`;lower.style.filter=`brightness(${1-Math.sin(fraction*Math.PI)*num(q,'depth',.5)*.5})`;
   tile.style.setProperty('--flap-light',String(Math.sin(fraction*Math.PI)*num(q,'glare',0)));
  });
  const length=flips*duration+(count-1)*stagger;
  if(!reduced&&s.age>length+num(q,'cycleDelay',2400)/1000&&words.length>1&&(q.loop!==false||s.phrase<words.length-1)){prepare((s.phrase+1)%words.length,s.target);return true;}
  return !q.paused&&(active||words.length>1&&(q.loop!==false||s.phrase<words.length-1));
 });
 useEffect(()=>{prepare(0,p.intro===false?padded(words[0]??''):'');wake();},[words,count,p.align,p.order,p.charset,p.flipsPerChar,p.intro]);
 useEffect(()=>{const node=host.current!;const resize=()=>{const size=num(latest.current,'fontSize',52),gap=num(latest.current,'gap',6),fit=Math.min(1,(node.clientWidth-32)/(count*size*.72+(count-1)*gap));node.style.setProperty('--flap-size',`${size*fit}px`);node.style.setProperty('--flap-gap',`${gap*fit}px`);};const observer=new ResizeObserver(resize);observer.observe(node);resize();return()=>observer.disconnect();},[count,p.fontSize,p.gap]);
 return <div ref={host} className={`split-flap-text ${p.tileStyle==='minimal'?'flap-minimal':''}`} role="img" aria-label={words[0]??''} style={{'--flap-tile':str(p,'tileColor','#111827'),'--flap-ink':str(p,'textColor','#f8fafc'),'--flap-radius':`${num(p,'tileRadius',8)}px`,'--flap-depth':num(p,'depth',.5)} as React.CSSProperties}><div className="flap-board" aria-hidden="true">{Array.from({length:count},(_,index)=><div className="flap-tile" key={index} ref={el=>{tiles.current[index]=el;}}>
 <div className="flap-half flap-top"><span data-new/></div><div className="flap-half flap-bottom"><span data-old/></div>
 <div className="flap-half flap-top flap-falling-top"><span data-old/></div><div className="flap-half flap-bottom flap-falling-bottom"><span data-new/></div><i className="flap-hinge"/>
 </div>)}</div></div>;
}
