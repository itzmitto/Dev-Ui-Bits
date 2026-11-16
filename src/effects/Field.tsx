import { useEffect, useRef } from 'react';
import { num, str, type EffectProps } from './types';

// Original Canvas 2D effects. One animation loop, bounded density, and DPR-aware resizing.
export function Field(p: EffectProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const mode = str(p, 'mode', 'slats');
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    let w = 1, h = 1, frame = 0;
    const pointer = {x: -1000, y: -1000};
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const resize = new ResizeObserver(([entry]) => {
      w = entry.contentRect.width; h = entry.contentRect.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      el.width = w * dpr; el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    resize.observe(el);
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); pointer.x = e.clientX-r.left; pointer.y=e.clientY-r.top; };
    const leave = () => { pointer.x = -1000; pointer.y = -1000; };
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
    const primary = str(p,'color','#a855f7'), secondary = str(p,'secondary','#ffffff');
    const rgb=(hex:string)=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
    const base=rgb(primary),glint=rgb(secondary);
    const start = performance.now();
    const draw = (now: number) => {
      const t = reduced || p.paused ? 0 : (now-start)*.001*num(p,'speed',.6);
      ctx.globalAlpha = 1; ctx.fillStyle = str(p,'background','#120f17'); ctx.fillRect(0,0,w,h);
      const scale = num(p,'scale',1.5), opacity=num(p,'opacity',1);
      if (mode === 'slats' || mode === 'grid') {
        const sw = num(p,'width',10), sh = num(p,'height',25), gap = num(p,'gap',3);
        const dx = Math.max(sw+gap,6), dy = Math.max(sh+gap,8);
        const direction=num(p,'direction',250)*Math.PI/180;
        for(let y=-dy;y<h+dy;y+=dy) for(let x=0;x<w;x+=dx){
          const distance = Math.hypot(x-pointer.x,y-pointer.y);
          const touch = p.interactive ? Math.max(0,1-distance/160)*num(p,'strength',1) : 0;
          const wave = Math.sin((x*Math.cos(direction)+y*Math.sin(direction))/(65*scale)+t*2)+Math.cos(x/(100*scale)-y/(90*scale)-t*1.5);
          const light = Math.max(0, Math.min(1, (wave+2)/4 + touch*.5));
          ctx.globalAlpha = (mode==='grid' ? .15+touch*.8 : .15+light*.7)*opacity;
          const shine=Math.pow(Math.max(0,(light-.65)/.35),3)*.85;
          ctx.fillStyle = mode==='grid'?primary:`rgb(${base.map((v,i)=>Math.round(v+(glint[i]-v)*shine)).join(',')})`;
          const height = mode==='grid' ? sw : sh*(.7+light*.3);
          ctx.beginPath(); ctx.roundRect(x,y + (mode==='grid'?0:wave*3),sw,height,Math.min(sw/2,num(p,'roundness',.75)*sw/2));ctx.fill();
        }
      } else if(mode==='particles') {
        const count=num(p,'density',80);
        const points=Array.from({length:count},(_,i)=>({x:((Math.sin(i*127.1)*.5+.5)*w+t*(8+i%8))%w,y:((Math.cos(i*73.7)*.5+.5)*h+Math.sin(t+i)*15+h)%h}));
        ctx.fillStyle=primary;ctx.strokeStyle=primary;
        points.forEach((point,i)=>{
          const d=Math.hypot(point.x-pointer.x,point.y-pointer.y);
          ctx.globalAlpha=opacity*(.4+(i%5)/10);
          ctx.beginPath();ctx.arc(point.x,point.y,num(p,'scale',1.5)*(1+i%3)+(p.interactive?Math.max(0,1-d/120)*4*num(p,'strength',1):0),0,Math.PI*2);ctx.fill();
          points.slice(i+1).forEach(other=>{const dist=Math.hypot(point.x-other.x,point.y-other.y);if(dist<95){ctx.globalAlpha=(1-dist/95)*.18*opacity;ctx.beginPath();ctx.moveTo(point.x,point.y);ctx.lineTo(other.x,other.y);ctx.stroke();}});
        });
      } else if(mode==='waves'){
        const count=num(p,'density',14);ctx.lineWidth=num(p,'width',2);
        for(let i=0;i<count;i++){
          ctx.beginPath();ctx.strokeStyle=i%3===0?secondary:primary;ctx.globalAlpha=(.2+.6*i/count)*opacity;
          for(let x=0;x<=w;x+=4){const mouse=p.interactive?Math.max(0,1-Math.abs(x-pointer.x)/180)*num(p,'strength',1)*30:0;const y=h/2+Math.sin(x/(100*scale)+t+i*.17)*(40+i*5)+Math.cos(x/180-t)*40+(i-count/2)*9+mouse; if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
        }
      } else {
        for(let i=0;i<4;i++){
          const px=w*(.5+.35*Math.sin(t*.4+i*2))+(p.interactive&&pointer.x>0?(pointer.x-w/2)*.15*num(p,'strength',1):0),py=h*(.5+.35*Math.cos(t*.35+i*2));
          const g=ctx.createRadialGradient(px,py,0,px,py,Math.max(w,h)*.65*scale);
          g.addColorStop(0,(i%2?secondary:primary)+'aa');g.addColorStop(1,(i%2?secondary:primary)+'00');ctx.fillStyle=g;ctx.globalAlpha=opacity;ctx.fillRect(0,0,w,h);
        }
      }
      frame=requestAnimationFrame(draw);
    };
    frame=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(frame);resize.disconnect();el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);};
  }, [p, mode]);
  return <canvas ref={canvas} className="field-canvas" aria-label={`${mode} animated background`} style={{filter:`blur(${num(p,'blur',0)}px)`}} />;
}
