import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { num, str, type EffectProps } from './types';

export function FadeIn(p: EffectProps) {
  const d=str(p,'direction','up'),offset=num(p,'distance',60);
  return <motion.div className="demo-panel" style={{borderColor:str(p,'color','#a855f7')}} initial={{opacity:0,x:d==='left'?offset:0,y:d==='up'?offset:d==='down'?-offset:0}} animate={{opacity:1,x:0,y:0}} transition={{duration:num(p,'duration',1)}}><span className="demo-eyebrow">A LITTLE MOTION</span><h2>{str(p,'text','A lasting impression.')}</h2><p>Good interfaces don’t just appear. They arrive.</p></motion.div>;
}
export function ScrollReveal(p: EffectProps) {
  return <div className="scroll-demo" tabIndex={0} aria-label="Scroll to reveal cards"><small>SCROLL TO DISCOVER ↓</small>{['A little curiosity.','A new perspective.','Something remarkable.'].map((t,i)=><motion.div className="demo-panel" key={t} style={{borderColor:str(p,'color','#a855f7')}} initial={{opacity:0,y:num(p,'distance',60),filter:'blur(8px)'}} whileInView={{opacity:1,y:0,filter:'blur(0px)'}} viewport={{once:Boolean(p.once),amount:.5}} transition={{duration:num(p,'duration',.7)}}><span className="demo-eyebrow">0{i+1} / DISCOVER</span><h2>{t}</h2></motion.div>)}</div>;
}
export function MagnetEffect(p: EffectProps) {
  const [pos,setPos]=useState({x:0,y:0});const ref=useRef<HTMLDivElement>(null);
  return <div ref={ref} className="magnet-zone" onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();setPos({x:(e.clientX-r.left-r.width/2)*num(p,'strength',.35),y:(e.clientY-r.top-r.height/2)*num(p,'strength',.35)});}} onPointerLeave={()=>setPos({x:0,y:0})}><motion.div className="magnet-orb" animate={pos} transition={{type:'spring',stiffness:180,damping:14}} style={{background:str(p,'color','#a855f7')}}><span>✳</span><small>{str(p,'text','Come closer')}</small></motion.div></div>;
}
export function AnimatedList(p: EffectProps) {
  const [selected,setSelected]=useState(-1);
  return <div className="animated-list">{['Design without limits','Add a little motion','Make it your own','Ship something great'].slice(0,num(p,'count',4)).map((t,i)=><motion.button key={t} initial={{x:-30,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:i*num(p,'delay',.15)}} whileHover={{x:8}} onClick={()=>setSelected(i)} className={selected===i?'chosen':''} style={{borderColor:selected===i?str(p,'color','#a855f7'):undefined}}><span>0{i+1}</span>{t}<span>↗</span></motion.button>)}</div>;
}
