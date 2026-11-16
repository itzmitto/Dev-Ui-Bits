import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { num, str, type EffectProps } from './types';

export function TiltCard(p: EffectProps) {
  const [r,setR]=useState({x:0,y:0});
  return <div style={{perspective:800}}><motion.div className="tilt-card" onPointerMove={e=>{const b=e.currentTarget.getBoundingClientRect();setR({x:-(e.clientY-b.top-b.height/2)/b.height*num(p,'strength',25),y:(e.clientX-b.left-b.width/2)/b.width*num(p,'strength',25)});}} onPointerLeave={()=>setR({x:0,y:0})} animate={{rotateX:r.x,rotateY:r.y}} style={{background:`radial-gradient(at top left, ${str(p,'color','#a855f7')}88, #17121f)`}}><span className="demo-eyebrow">A DIFFERENT DIMENSION</span><div className="card-symbol">✳</div><h2>{str(p,'text','Shift your perspective.')}</h2><small>Move your cursor to explore ↗</small></motion.div></div>;
}
export function SpotlightCard(p: EffectProps) {
  const [pos,setPos]=useState({x:50,y:50});
  return <div className="spotlight-card demo-panel" onPointerMove={e=>{const b=e.currentTarget.getBoundingClientRect();setPos({x:(e.clientX-b.left)/b.width*100,y:(e.clientY-b.top)/b.height*100});}} style={{background:`radial-gradient(circle ${num(p,'size',220)}px at ${pos.x}% ${pos.y}%, ${str(p,'color','#a855f7')}55, transparent), #19151f`}}><span className="card-symbol">⌘</span><h2>{str(p,'text','A moment in the spotlight.')}</h2><p>Every detail deserves a little attention.</p><small>HOVER TO EXPLORE ↗</small></div>;
}
const slides=[['01','Find your spark.','#a855f7'],['02','Follow the flow.','#38bdf8'],['03','Make your mark.','#fb7185']];
export function AnimatedCarousel(p: EffectProps) {
  const [index,setIndex]=useState(0);
  useEffect(()=>{if(!p.autoplay)return;const id=setInterval(()=>setIndex(i=>(i+1)%3),num(p,'duration',3)*1000);return()=>clearInterval(id);},[p.autoplay,p.duration]);
  const slide=slides[index];
  return <div className="carousel"><motion.div className="carousel-slide" key={index} initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} transition={{duration:.4}} style={{background:`radial-gradient(at 80% 10%, ${slide[2]}88, #19151f)`}}><span className="demo-eyebrow">{slide[0]} / THE POSSIBILITIES</span><div className="card-symbol">✳</div><h2>{slide[1]}</h2></motion.div><div className="carousel-controls"><button aria-label="Previous slide" onClick={()=>setIndex((index+2)%3)}>←</button><div>{slides.map((_,i)=><button key={i} aria-label={`Slide ${i+1}`} aria-pressed={index===i} onClick={()=>setIndex(i)} className={index===i?'selected':''}/>)}</div><button aria-label="Next slide" onClick={()=>setIndex((index+1)%3)}>→</button></div></div>;
}
export function MagneticButton(p: EffectProps) {
  const [xy,setXY]=useState({x:0,y:0}),[clicks,setClicks]=useState(0);
  return <div className="button-demo"><motion.button className="effect-button" style={{background:str(p,'color','#a855f7')}} animate={xy} whileTap={{scale:.94}} onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();setXY({x:(e.clientX-r.left-r.width/2)*num(p,'strength',.4),y:(e.clientY-r.top-r.height/2)*num(p,'strength',.4)});}} onPointerLeave={()=>setXY({x:0,y:0})} onClick={()=>setClicks(c=>c+1)}>{str(p,'text','Pull me in')} ↗</motion.button><small>{clicks?`${clicks} ${clicks===1?'click':'clicks'} · keep going`:'A button with a little attraction.'}</small></div>;
}
