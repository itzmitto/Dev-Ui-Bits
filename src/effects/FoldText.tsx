import { useEffect,useRef } from 'react';
import { num,str,type EffectProps } from './types';
import { useTextAnimation } from './textRuntime';
import { staggerRanks,textEase,useFittedText } from './textLayout';
import './FoldText.css';
export function FoldText(p:EffectProps){
 const host=useRef<HTMLDivElement>(null),mark=useRef<HTMLDivElement>(null),latest=useRef(p);latest.current=p;const state=useRef({age:0,active:p.trigger!=='hover',hover:false,px:-10000,py:-10000});
 const text=str(p,'text','Design unfolds'),units=p.splitBy==='word'?text.split(/(\s+)/):p.splitBy==='line'?text.split('\n'):Array.from(text),ranks=staggerRanks(units.length,str(p,'staggerFrom','start'));
 const size=useFittedText(host,text,num(p,'fontSize',80),num(p,'fontWeight',800),str(p,'fontFamily',''));
 const wake=useTextAnimation(host,(dt,_time,reduced)=>{const q=latest.current,s=state.current;if(!q.paused&&s.active)s.age+=dt;const duration=num(q,'duration',.65),total=duration+units.length*num(q,'stagger',.045),delay=num(q,'loopDelay',1.4),cycle=total*2+delay*2,age=s.age%cycle;
  const pieces=Array.from(mark.current?.querySelectorAll<HTMLElement>('.fold-unit')??[]);const centers=pieces.map(piece=>({x:piece.offsetLeft+piece.offsetWidth/2+(mark.current?.offsetLeft??0),y:piece.offsetTop+piece.offsetHeight/2+(mark.current?.offsetTop??0)}));
  pieces.forEach((piece,i)=>{let progress=s.active?textEase((s.age-ranks[i]*num(q,'stagger',.045))/duration,str(q,'ease','ease-out')):0;if(q.trigger==='loop')progress=textEase(((age>total+delay?cycle-delay-age:age)-ranks[i]*num(q,'stagger',.045))/duration,str(q,'ease','ease-out'));if(reduced)progress=1;
   const distance=Math.hypot(centers[i].x-s.px,centers[i].y-s.py),hover=q.hoverRefold&&!reduced?Math.max(0,1-distance/num(q,'refoldRadius',140))*num(q,'refoldAngle',45):0;
   piece.querySelectorAll<HTMLElement>('.fold-slice').forEach((panel,j)=>{const angle=(num(q,'foldAngle',92)*(1-progress)+hover)*(q.foldStyle==='paper'&&j%2?-1:1),horizontal=q.hinge==='left'||q.hinge==='right',sign=q.hinge==='bottom'||q.hinge==='right'?-1:1;panel.style.transform=`rotate${horizontal?'Y':'X'}(${angle*sign}deg)`;panel.style.opacity=String(.08+.92*progress);panel.style.filter=`brightness(${1-Math.min(1,Math.abs(angle)/100)*num(q,'creaseShading',.55)})`;});
  });return !q.paused&&s.active&&(q.trigger==='loop'||s.age<total||!!q.hoverRefold&&s.hover);
 });
 useEffect(()=>{state.current.age=0;state.current.active=p.trigger!=='hover'&&p.trigger!=='scroll';wake();if(p.trigger!=='scroll')return;const observer=new IntersectionObserver(([e])=>{if(e.isIntersecting){state.current.active=true;wake();}},{threshold:.3});observer.observe(host.current!);return()=>observer.disconnect();},[p.text,p.trigger,p.foldStyle,p.hinge,p.splitBy,p.staggerFrom]);
 const count=p.foldStyle==='blinds'?4:p.foldStyle==='flip'?1:2;
 return <div ref={host} className="fold-text" role="img" aria-label={text} style={{perspective:num(p,'perspective',700),fontSize:size,fontWeight:num(p,'fontWeight',800),fontFamily:str(p,'fontFamily','')||'inherit',color:str(p,'color','#ffffff')}} onPointerEnter={()=>{const s=state.current;s.hover=true;if(p.trigger==='hover'){s.age=0;s.active=true;}wake();}} onPointerMove={e=>{const b=e.currentTarget.getBoundingClientRect();state.current.px=e.clientX-b.x;state.current.py=e.clientY-b.y;wake();}} onPointerLeave={()=>{state.current.hover=false;state.current.px=state.current.py=-10000;wake();}}>
 <div ref={mark} className="fold-wordmark" aria-hidden="true">{units.map((unit,i)=><span className={`fold-unit ${p.splitBy==='line'?'fold-line':''}`} key={i}><span className="fold-measure">{unit||' '}</span>{Array.from({length:count},(_,j)=><span key={j} className="fold-slice" style={{top:`${j*100/count}%`,height:`${100/count}%`,transformOrigin:p.hinge==='left'?'left center':p.hinge==='right'?'right center':p.hinge==='bottom'?'center bottom':'center top'}}><span style={{height:`${count*100}%`,top:`${-j*100}%`}}>{unit||' '}</span></span>)}</span>)}</div>
 </div>;
}
