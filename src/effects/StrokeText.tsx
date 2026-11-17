import { useEffect,useId,useRef,useState } from 'react';
import { num,str,type EffectProps } from './types';
import { fontOf,useTextAnimation } from './textRuntime';
import { textEase,useFittedText } from './textLayout';
import { strokeGlyphs,type StrokeGlyph } from './StrokeText.glyphs';
import './StrokeText.css';
import './textDisplay.css';
export function StrokeText(p:EffectProps){
 const host=useRef<HTMLDivElement>(null),svg=useRef<SVGSVGElement>(null),latest=useRef(p);latest.current=p;const id=useId().replaceAll(':','');const [layout,setLayout]=useState({w:1,h:1,glyphs:[] as StrokeGlyph[]});
 const text=str(p,'text','Draw Attention'),size=useFittedText(host,text,num(p,'fontSize',128),num(p,'fontWeight',800),str(p,'fontFamily',''));
 const clock=useRef({age:0,active:p.trigger!=='hover',hover:false});
 const wake=useTextAnimation(host,(dt,time,reduced)=>{const q=latest.current,s=clock.current;if(!q.paused&&s.active)s.age+=dt;const duration=num(q,'drawDuration',1.6),stagger=num(q,'stagger',.05),total=duration+num(q,'fillDelay',.2)+.6+layout.glyphs.length*stagger;let age=s.age;if(q.trigger==='loop'){const cycle=total*2+1;age%=cycle;if(age>total+.5)age=Math.max(0,2*total+.5-age);}
  svg.current?.querySelectorAll<SVGGElement>('.stroke-glyph').forEach((group,index)=>{const rank=q.reverse?layout.glyphs.length-1-index:index,g=layout.glyphs[index],local=age-rank*stagger;const draw=reduced?1:s.active?textEase(local/duration,str(q,'ease','ease-out')):0,fill=reduced?1:textEase((local-duration-num(q,'fillDelay',.2))/.5,'ease-out');group.querySelector('.stroke-draw')?.setAttribute('stroke-dashoffset',String(1-draw));const rect=group.querySelector('.stroke-fill-clip');if(rect){const vertical=q.wipeFrom==='top'||q.wipeFrom==='bottom',value=q.fillMode==='wipe'?fill:1;rect.setAttribute('x',String(g.x+(q.wipeFrom==='right'?g.width*(1-value):0)));rect.setAttribute('y',String(g.y+(q.wipeFrom==='bottom'?g.height*(1-value):0)));rect.setAttribute('width',String(g.width*(vertical?1:value)));rect.setAttribute('height',String(g.height*(vertical?value:1)));}group.querySelector('.stroke-fill')?.setAttribute('opacity',String(q.fillMode==='none'?0:q.fillMode==='fade'?fill:1));group.querySelector('.stroke-outline')?.setAttribute('stroke-dashoffset',String(q.marching?-time*16:0));});
  return !q.paused&&s.active&&(q.trigger==='loop'||!!q.marching&&q.strokeStyle!=='solid'||s.age<total);
 });
 useEffect(()=>{const root=host.current!;const resize=()=>{const b=root.getBoundingClientRect(),font=`${num(p,'fontWeight',800)} ${size}px ${fontOf(root,str(p,'fontFamily',''))}`;setLayout({w:b.width,h:b.height,glyphs:strokeGlyphs(text,font,num(p,'letterSpacing',-4)*size/num(p,'fontSize',128),b.width,b.height)});};resize();const observer=new ResizeObserver(resize);observer.observe(root);document.fonts?.addEventListener('loadingdone',resize);return()=>{observer.disconnect();document.fonts?.removeEventListener('loadingdone',resize);};},[text,size,p.fontWeight,p.fontFamily,p.letterSpacing,p.fontSize]);
 useEffect(()=>{clock.current.age=0;clock.current.active=p.trigger!=='hover';wake();if(p.trigger!=='scroll')return;const observer=new IntersectionObserver(([e])=>{if(e.isIntersecting){clock.current.active=true;wake();}},{threshold:.3});observer.observe(host.current!);return()=>observer.disconnect();},[p.trigger,p.text,p.drawDuration,p.fillMode]);
 const dash=p.strokeStyle==='dotted'?`0 ${num(p,'dashLength',10)}`:p.strokeStyle==='dashed'?`${num(p,'dashLength',10)} ${num(p,'dashLength',10)*.65}`:undefined;
 return <div ref={host} className="stroke-text" onPointerEnter={()=>{const s=clock.current;if(p.trigger==='hover'||p.hoverRedraw){s.age=0;s.active=true;wake();}}}><svg ref={svg} role="img" aria-label={text} viewBox={`0 0 ${layout.w} ${layout.h}`}>
 {layout.glyphs.map((g,i)=><g key={i} className="stroke-glyph"><defs><mask id={`draw-${id}-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width={layout.w} height={layout.h}><path className="stroke-draw" d={g.d} pathLength="1" fill="none" stroke="white" strokeWidth={Math.max(8,num(p,'strokeWidth',1.4)*3)} strokeDasharray="1" strokeDashoffset="1"/></mask><clipPath id={`fill-${id}-${i}`}><rect className="stroke-fill-clip" x={g.x} y={g.y} width="0" height={g.height}/></clipPath></defs>
 <path className="stroke-fill" d={g.d} fillRule="evenodd" fill={str(p,'fillColor','#ffffff')} clipPath={`url(#fill-${id}-${i})`} style={{filter:p.shadow?`drop-shadow(0 5px 8px ${str(p,'shadowColor','#a78bfa')})`:undefined}}/>
 <path className="stroke-outline" d={g.d} fill="none" stroke={str(p,'strokeColor','#a78bfa')} strokeWidth={num(p,'strokeWidth',1.4)} strokeDasharray={dash} strokeLinecap={p.strokeStyle==='dotted'?'round':'butt'} mask={`url(#draw-${id}-${i})`}/></g>)}
 </svg></div>;
}
