import {useRef} from 'react';
import {useGalleryMotion} from './galleryMotion';
import {useGalleryImages,GalleryPhoto,GalleryControls} from './galleryKit';
import {bound} from './textRuntime';
import type {EffectProps} from './types';
import './gallery13.css';
export function CircularCarousel(p:EffectProps){
 const images=useGalleryImages(p),cards=useRef<(HTMLButtonElement|null)[]>([]);
 const motion=useGalleryMotion(p,images.length,s=>{const w=Math.min(bound(p.cardWidth,200,90,340),motion.host.current!.clientWidth*.48),h=bound(p.cardHeight,240,120,380),radius=(w+bound(p.spacing,25,0,120))*images.length/(2*Math.PI);cards.current.forEach((el,i)=>{if(!el)return;const a=(i-s.position)*Math.PI*2/images.length,x=Math.sin(a)*radius,z=(Math.cos(a)-1)*radius;el.style.width=w+'px';el.style.height=h+'px';el.style.transform=`translate(-50%,-50%) translate3d(${p.orientation==='vertical'?0:x}px,${p.orientation==='vertical'?x:0}px,${z}px) rotate${p.orientation==='vertical'?'X':'Y'}(${(p.orientation==='vertical'?-1:1)*a*180/Math.PI}deg)`;el.style.opacity=String(.35+.65*(Math.cos(a)+1)/2);el.style.zIndex=String(Math.round(100+Math.cos(a)*50));el.setAttribute('aria-current',String(Math.round(s.position)%images.length===i));});});
 return <div ref={motion.host} className="g13-stage circular-carousel" data-gallery="circular-carousel" role="region" aria-label="Circular Carousel" tabIndex={0} {...motion.bind} style={{perspective:bound(p.perspective,1800,500,3000),background:String(p.background||'#120f17')}}><div className="g13-space" style={{transform:`rotateX(${bound(p.tilt,-5,-35,35)}deg)`,transformStyle:'preserve-3d'}}>{images.map((item,i)=><button key={i} data-index={i} ref={el=>{cards.current[i]=el;}} className="g13-card" aria-label={`Focus ${item.title||'image '+(i+1)}`} onClick={()=>{if(motion.state.current.distance<6)motion.go(i);}} style={{borderRadius:bound(p.radius,10,0,40)}}><GalleryPhoto item={item}/></button>)}</div><GalleryControls go={motion.go} state={motion.state} count={images.length}/></div>;
}
