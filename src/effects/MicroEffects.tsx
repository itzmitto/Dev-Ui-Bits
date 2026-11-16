import { useState } from 'react';
import { motion } from 'motion/react';
import { num, str, type EffectProps } from './types';

export function AnimatedToggle(p: EffectProps) {
  const [on,setOn]=useState(Boolean(p.checked));
  return <div className="toggle-demo"><button role="switch" aria-label="Demo toggle" aria-checked={on} className="effect-toggle" onClick={()=>setOn(!on)} style={{background:on?str(p,'color','#a855f7'):'#342e3e'}}><motion.span animate={{x:on?44:0,rotate:on?180:0}} transition={{type:'spring',stiffness:400,damping:24}}/></button><h3>{on?'A little more magic.':'Keep it simple.'}</h3><small>Click to switch things up.</small></div>;
}
export function HoverButton(p: EffectProps) {
  const [clicked,setClicked]=useState(false);
  return <div className="button-demo"><motion.button className="effect-button hover-effect" whileHover={{scale:1.07,boxShadow:`0 0 ${num(p,'glow',40)}px ${str(p,'color','#a855f7')}77`}} whileTap={{scale:.94}} style={{background:str(p,'color','#a855f7'),borderRadius:num(p,'roundness',16)}} onClick={()=>setClicked(!clicked)}>{clicked?'Looking good ✓':str(p,'text','Make your move')} <span>↗</span></motion.button><small>Hover. Click. Repeat.</small></div>;
}
export function RippleEffect(p: EffectProps) {
  const [ripples,setRipples]=useState<{x:number;y:number;id:number}[]>([]);
  return <button className="ripple-target" style={{background:`linear-gradient(135deg,${str(p,'color','#a855f7')}88,#20162f)`}} onClick={e=>{const b=e.currentTarget.getBoundingClientRect(),id=performance.now();setRipples(r=>[...r,{x:e.clientX-b.left,y:e.clientY-b.top,id}]);}}><span className="card-symbol">◎</span><h2>{str(p,'text','Start a ripple.')}</h2><small>Click anywhere. See what happens.</small>{ripples.map(r=><motion.i key={r.id} initial={{scale:0,opacity:.7}} animate={{scale:8,opacity:0}} transition={{duration:num(p,'duration',1)}} onAnimationComplete={()=>setRipples(all=>all.filter(a=>a.id!==r.id))} style={{left:r.x-25,top:r.y-25}}/>)}</button>;
}
export function InteractiveCursor(p: EffectProps) {
  const [pos,setPos]=useState({x:0,y:0,inside:false});
  return <div className="cursor-area" style={{cursor:pos.inside?'none':'auto'}} onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();setPos({x:e.clientX-r.left,y:e.clientY-r.top,inside:true});}} onPointerLeave={()=>setPos({...pos,inside:false})}><h2>{str(p,'text','Follow your curiosity.')}</h2><small>MOVE YOUR CURSOR</small>{pos.inside&&<><motion.div className="cursor-ring" animate={{x:pos.x-num(p,'size',48)/2,y:pos.y-num(p,'size',48)/2}} transition={{type:'spring',stiffness:160,damping:15}} style={{width:num(p,'size',48),height:num(p,'size',48),borderColor:str(p,'color','#a855f7')}}/><span className="cursor-dot" style={{left:pos.x,top:pos.y,background:str(p,'color','#a855f7')}}/></>}</div>;
}
