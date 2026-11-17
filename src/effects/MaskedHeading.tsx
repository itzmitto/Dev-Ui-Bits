import { useEffect,useRef } from 'react';
import { num,str,type EffectProps } from './types';
import { bound,easeOut,fontOf,useTextAnimation } from './textRuntime';
import { sizeCanvas } from './textCanvas';
import './MaskedHeading.css';
type Word={text:string;x:number;y:number;width:number;index:number};
export function MaskedHeading(p:EffectProps){
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null),latest=useRef(p);latest.current=p;
 const data=useRef({w:1,h:1,dpr:1,size:80,font:'',words:[] as Word[],time:0,hover:false,pointer:{x:.5,y:.5},smooth:{x:.5,y:.5},mask:null as HTMLCanvasElement|null,media:null as HTMLCanvasElement|null,spot:null as HTMLCanvasElement|null,texture:null as HTMLCanvasElement|null,image:null as HTMLImageElement|null,video:null as HTMLVideoElement|null});
 const wake=useTextAnimation(host,(dt,time,reduced)=>{
  const s=data.current,el=canvas.current;if(!el||!s.mask||!s.media||!s.texture||!s.spot)return false;
  const q=latest.current;if(!q.paused)s.time+=dt;
  const active=q.trigger!=='hover'||s.hover;
  const progress=reduced||q.reveal==='none'?1:active?s.time/Math.max(.1,num(q,'duration',1.1)):0;
  const c=el.getContext('2d')!,m=s.mask.getContext('2d')!,media=s.media.getContext('2d')!;
  for(const ctx of [c,m,media]){ctx.setTransform(s.dpr,0,0,s.dpr,0,0);ctx.clearRect(0,0,s.w,s.h);}
  const smooth=reduced?1:1-Math.exp(-dt*5);s.smooth.x+=(s.pointer.x-s.smooth.x)*smooth;s.smooth.y+=(s.pointer.y-s.smooth.y)*smooth;
  m.font=s.font;m.fillStyle='#fff';m.textBaseline='alphabetic';
  for(const word of s.words){
   const stagger=num(q,'stagger',.09)/Math.max(.1,num(q,'duration',1.1));const value=easeOut(progress-word.index*stagger);
   m.save();
   if(q.reveal==='wipe'){m.beginPath();m.rect(0,0,s.w*easeOut(progress),s.h);m.clip();}
   const y=word.y+(q.reveal==='rise'?(1-value)*s.size*.8:0);
   m.globalAlpha=q.reveal==='wipe'?1:value;if(q.reveal==='blur')m.filter=`blur(${(1-value)*12}px)`;
   if(q.reveal==='scale'){
    let x=word.x;Array.from(word.text).forEach((char,index)=>{const advance=m.measureText(char).width,local=easeOut(progress-(word.index*3+index)*stagger/3);m.save();m.translate(x+advance/2,word.y-s.size*.32);m.scale(local,local);m.globalAlpha=local;m.fillText(char,-advance/2,s.size*.32);m.restore();x+=advance+num(q,'tracking',-.03)*s.size;});
   }else m.fillText(word.text,word.x,y);m.restore();
  }
  const drift=reduced?0:num(q,'drift',18),parallax=num(q,'parallax',26),zoom=bound(q.fillScale,1.25,1,2)+(s.hover?num(q,'hoverZoom',0):0);
  const dx=(s.smooth.x-.5)*parallax+Math.sin(time*.2)*drift,dy=(s.smooth.y-.5)*parallax+Math.cos(time*.17)*drift;
  const source=s.video&&s.video.readyState>=2?s.video:s.image?.complete&&s.image.naturalWidth?s.image:s.texture;
  media.save();media.translate(s.w/2+dx,s.h/2+dy);media.scale(zoom,zoom);const iw='videoWidth' in source?source.videoWidth:source.width,ih='videoHeight' in source?source.videoHeight:source.height;const ratio=Math.max(s.w/Math.max(1,iw),s.h/Math.max(1,ih));media.drawImage(source,-iw*ratio/2,-ih*ratio/2,iw*ratio,ih*ratio);media.restore();
  if(q.tintEnabled){media.globalCompositeOperation='color';media.fillStyle=str(q,'tint','#ff5a36');media.fillRect(0,0,s.w,s.h);media.globalCompositeOperation='source-over';}
  const filter=`brightness(${num(q,'brightness',1)}) saturate(${q.grayscale?0:num(q,'saturation',1)})`;
  c.filter=q.spotlight?`${filter} grayscale(1) brightness(.28)`:filter;c.drawImage(s.media,0,0,s.w,s.h);c.filter='none';
  if(q.spotlight){
   const sc=s.spot.getContext('2d')!;sc.setTransform(s.dpr,0,0,s.dpr,0,0);sc.clearRect(0,0,s.w,s.h);sc.filter=filter;sc.drawImage(s.media,0,0,s.w,s.h);sc.filter='none';
   const x=s.hover?s.smooth.x*s.w:s.w*(.5+.3*Math.sin(time*.35)),y=s.hover?s.smooth.y*s.h:s.h*.5,r=num(q,'spotlightRadius',180);
   const gradient=sc.createRadialGradient(x,y,0,x,y,r);gradient.addColorStop(0,'#fff');gradient.addColorStop(1,'#fff0');sc.globalCompositeOperation='destination-in';sc.fillStyle=gradient;sc.fillRect(0,0,s.w,s.h);sc.globalCompositeOperation='source-over';c.drawImage(s.spot,0,0,s.w,s.h);
  }
  c.globalCompositeOperation='destination-in';c.drawImage(s.mask,0,0,s.w,s.h);c.globalCompositeOperation='source-over';
  if(q.outline){c.font=s.font;c.strokeStyle=str(q,'outlineColor','#ffffff');c.lineWidth=num(q,'outlineWidth',1);for(const word of s.words)c.strokeText(word.text,word.x,word.y);}
  return !q.paused&&(progress<1+s.words.length*num(q,'stagger',.09)||drift>0||!!s.video||!!q.spotlight||Math.abs(s.smooth.x-s.pointer.x)+Math.abs(s.smooth.y-s.pointer.y)>.001);
 });
 useEffect(()=>{
  const root=host.current!,el=canvas.current!,s=data.current;
  s.mask=document.createElement('canvas');s.media=document.createElement('canvas');s.spot=document.createElement('canvas');s.texture=document.createElement('canvas');s.texture.width=800;s.texture.height=500;
  const t=s.texture.getContext('2d')!;t.fillStyle='#102632';t.fillRect(0,0,800,500);
  for(const [x,y,r,color] of [[100,60,400,'#e8c584'],[630,370,420,'#7fc7c8'],[310,390,290,'#3e395b'],[650,40,220,'#fae6c2']] as const){const g=t.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,color+'00');t.fillStyle=g;t.fillRect(0,0,800,500);}
  const resize=()=>{const q=latest.current,b=root.getBoundingClientRect();s.w=b.width;s.h=b.height;s.dpr=sizeCanvas(el,s.w,s.h);for(const buffer of [s.mask!,s.media!,s.spot!])sizeCanvas(buffer,s.w,s.h,s.dpr);
   s.size=Math.max(12,s.w*bound(q.textScale,.115,.04,.22));s.font=`${num(q,'weight',700)} ${s.size}px ${fontOf(root,str(q,'fontFamily',''))}`;const c=el.getContext('2d')!;c.font=s.font;c.letterSpacing=`${num(q,'tracking',-.03)*s.size}px`;
   let x=0,row=0;const words=str(q,'text','Designed in the details').split(/\s+/);s.words=[];
   words.forEach((text,index)=>{const width=c.measureText(text).width,space=c.measureText(' ').width;if(x&&x+width>s.w-60){row++;x=0;}s.words.push({text,x,y:row*s.size*num(q,'lineHeight',1.06),width,index});x+=width+space;});
   const rows=row+1,top=(s.h-rows*s.size*num(q,'lineHeight',1.06))/2+s.size*.8;
   for(let row=0;row<rows;row++){const line=s.words.filter(w=>w.y===row*s.size*num(q,'lineHeight',1.06)),width=Math.max(0,...line.map(w=>w.x+w.width)),offset=q.align==='left'?30:q.align==='right'?s.w-30-width:(s.w-width)/2;for(const word of line){word.x+=offset;word.y+=top;}}
   for(const ctx of [s.mask!.getContext('2d')!,el.getContext('2d')!])ctx.letterSpacing=`${num(q,'tracking',-.03)*s.size}px`;wake();};
  resize();const observer=new ResizeObserver(resize);observer.observe(root);document.fonts?.addEventListener('loadingdone',resize);void document.fonts?.ready.then(()=>{if(root.isConnected)resize();});
  return()=>{observer.disconnect();document.fonts?.removeEventListener('loadingdone',resize);s.video?.pause();};
 },[p.text,p.textScale,p.weight,p.fontFamily,p.tracking,p.align,p.lineHeight]);
 useEffect(()=>{const s=data.current;s.time=0;wake();},[p.reveal,p.trigger,p.text]);
 useEffect(()=>{
  const s=data.current;let live=true;s.image=null;s.video?.pause();s.video=null;
  const src=str(p,'src','');if(!src)return;
  if(p.mediaType==='video'){const video=document.createElement('video');video.crossOrigin='anonymous';video.muted=true;video.loop=true;video.playsInline=true;video.src=src;s.video=video;const visibility=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!latest.current.paused)void video.play().catch(()=>{});else video.pause();});visibility.observe(host.current!);video.addEventListener('loadeddata',wake);return()=>{live=false;visibility.disconnect();video.pause();video.removeEventListener('loadeddata',wake);video.removeAttribute('src');video.load();};}
  const image=new Image();image.crossOrigin='anonymous';image.onload=()=>{if(live){s.image=image;wake();}};image.src=src;return()=>{live=false;image.onload=null;};
 },[p.src,p.mediaType,p.paused]);
 return <div ref={host} className="masked-heading" onPointerEnter={()=>{data.current.hover=true;if(p.trigger==='hover')data.current.time=0;wake();}} onPointerLeave={()=>{data.current.hover=false;wake();}} onPointerMove={event=>{const b=event.currentTarget.getBoundingClientRect();data.current.pointer={x:(event.clientX-b.x)/b.width,y:(event.clientY-b.y)/b.height};wake();}}><canvas ref={canvas} role="img" aria-label={str(p,'text','Designed in the details')}/></div>;
}
