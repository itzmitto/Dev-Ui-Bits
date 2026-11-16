import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { num, str, type EffectProps } from './types';

export function BlurText(p: EffectProps) {
  const words=str(p,'text','Ideas come to life.').split(' ');
  return <div className="effect-heading" style={{color:str(p,'color','#ffffff')}}>{words.map((word,i)=><motion.span key={i} initial={{filter:`blur(${num(p,'blur',12)}px)`,opacity:0,y:24}} animate={{filter:'blur(0px)',opacity:1,y:0}} transition={{duration:num(p,'duration',.8),delay:i*num(p,'delay',.15)}}>{word} </motion.span>)}</div>;
}
export function SplitText(p: EffectProps) {
  return <div className="effect-heading split-text" style={{color:str(p,'color','#ffffff')}} aria-label={str(p,'text','Make it move.')}>
    {str(p,'text','Make it move.').split('').map((char,i)=><motion.span aria-hidden key={i} initial={{y:num(p,'distance',65),rotate:10,opacity:0}} animate={{y:0,rotate:0,opacity:1}} transition={{type:'spring',bounce:.4,duration:num(p,'duration',.8),delay:i*num(p,'delay',.06)}}>{char===' '?'\u00a0':char}</motion.span>)}
  </div>;
}
export function GlitchText(p: EffectProps) {
  return <div className="effect-heading glitch" data-text={str(p,'text','BREAK THE PATTERN')} style={{color:str(p,'color','#ffffff'),animationDuration:`${num(p,'speed',2)}s`}}>{str(p,'text','BREAK THE PATTERN')}</div>;
}
export function TypewriterText(p: EffectProps) {
  const [count,setCount]=useState(0);const text=str(p,'text','Build something extraordinary.');
  useEffect(()=>{let reverse=false;const timer=setInterval(()=>setCount(c=>{if(c>=text.length){if(!p.loop)return c;reverse=true;}if(c<=0)reverse=false;return c+(reverse?-1:1);}),num(p,'speed',90));return()=>clearInterval(timer);},[text,p.speed,p.loop]);
  return <div className="effect-heading typewriter" style={{color:str(p,'color','#ffffff')}}>{text.slice(0,count)}<span className="caret">|</span></div>;
}
