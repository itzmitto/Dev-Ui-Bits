import {useRef} from 'react';
import {useGalleryMotion} from './galleryMotion';
import {useGalleryImages,GalleryPhoto,GalleryControls} from './galleryKit';
import {relative} from './FlexCarousel.math';
import {bound} from './textRuntime';
import type {EffectProps} from './types';
import './gallery13.css';
export function DepthCarousel(p:EffectProps){const images=useGalleryImages(p),cards=useRef<(HTMLButtonElement|null)[]>([]);
 const motion=useGalleryMotion(p,images.length,s=>{const w=Math.min(bound(p.cardWidth,270,120,400),motion.host.current!.clientWidth*.65),h=Math.min(bound(p.cardHeight,350,160,440),motion.host.current!.clientHeight*.74);cards.current.forEach((el,i)=>{if(!el)return;let d=relative(i-s.position,images.length);if(d<-.55)d+=images.length;const depth=Math.max(0,d);el.style.width=w+'px';el.style.height=h+'px';el.style.transform=`translate(-50%,-50%) translate3d(${d*bound(p.spacing,100,30,180)*(p.direction==='left'?-1:1)}px,${depth*8}px,${-depth*bound(p.depth,220,80,500)}px) rotateY(${-Math.min(1,depth)*bound(p.tilt,18,0,45)}deg)`;el.style.opacity=String(d<-.5||d>bound(p.visibleCards,5,2,8)?0:Math.max(0,1-depth*bound(p.falloff,.18,.05,.4)));el.style.filter=`blur(${depth*bound(p.blur,1,0,5)}px)`;el.style.zIndex=String(100-Math.round(depth*10));el.style.pointerEvents=d>5||d<-.5?'none':'auto';});});
 return <div ref={motion.host} className="g13-stage depth-carousel" data-gallery="depth-carousel" role="region" aria-label="Depth Carousel" tabIndex={0} {...motion.bind} style={{perspective:bound(p.perspective,1400,500,3000),background:String(p.background||'#120f17')}}><div className="g13-space">{images.map((item,i)=><button key={i} data-index={i} className="g13-card" ref={el=>{cards.current[i]=el;}} onClick={()=>{if(motion.state.current.distance<6)motion.go(i);}} aria-label={`Focus ${item.title||'image '+(i+1)}`} style={{borderRadius:bound(p.radius,18,0,40)}}><GalleryPhoto item={item}/></button>)}</div><GalleryControls go={motion.go} state={motion.state} count={images.length}/></div>;
}
