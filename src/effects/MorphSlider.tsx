import {useEffect,useRef,useState} from 'react';
import {useGalleryMotion} from './galleryMotion';
import {useGalleryImages,GalleryControls} from './galleryKit';
import {useAnimationCanvas} from './animationCanvas';
import {bound} from './textRuntime';
import {wrap} from './FlexCarousel.math';
import type {EffectProps} from './types';
import './gallery13.css';
export function MorphSlider(p:EffectProps){const images=useGalleryImages(p),[error,setError]=useState(''),canvas=useRef<HTMLCanvasElement>(null),loaded=useRef<(HTMLImageElement|null)[]>([]);
 const motion=useGalleryMotion({...p,response:5/bound(p.duration,.8,.2,2)},images.length,s=>{const c=canvas.current?.getContext('2d');if(!c)return;const {width:w,height:h,dpr}=box.current;c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle=String(p.background||'#120f17');c.fillRect(0,0,w,h);const index=Math.floor(s.position),t=s.position-index,blend=t*t*(3-2*t),amplitude=Math.sin(t*Math.PI)*bound(p.distortion,70,0,180);for(let layer=0;layer<2;layer++){const image=loaded.current[wrap(index+layer,images.length)];if(!image)continue;const aspect=image.naturalWidth/image.naturalHeight,target=w/h,sw=aspect>target?image.naturalHeight*target:image.naturalWidth,sh=aspect>target?image.naturalHeight:image.naturalWidth/target,sx=(image.naturalWidth-sw)/2,sy=(image.naturalHeight-sh)/2;c.globalAlpha=layer?blend:1;for(let strip=0;strip<160;strip++){const u=strip/160,frequency=bound(p.frequency,3,1,7),noise=p.transition==='melt'?Math.sin(u*17)+Math.sin(u*31)*.4:Math.sin(u*Math.PI*frequency),dy=noise*amplitude*(layer?-1:1);c.drawImage(image,sx+sw*u,sy,sw/160,sh,u*w,dy-amplitude*.5,w/160+.5,h+amplitude);}}c.globalAlpha=1;});
 const box=useAnimationCanvas(motion.host,canvas,motion.wake,'medium');
 useEffect(()=>{let dead=false;loaded.current=[];setError('');images.forEach((item,i)=>{const image=new Image();image.crossOrigin='anonymous';image.onload=()=>{if(!dead){loaded.current[i]=image;motion.wake();}};image.onerror=()=>{if(!dead)setError('Image unavailable. Use a local PNG or CORS-enabled URL.');};image.src=item.src;});return()=>{dead=true;};},[images]);
 return <div ref={motion.host} className="g13-stage morph-slider" data-gallery="morph-slider" role="region" aria-label="Morph Slider" tabIndex={0} {...motion.bind} style={{borderRadius:bound(p.radius,16,0,40)}}><canvas ref={canvas} role="img" aria-label="Images with animated displacement transitions" style={{width:'100%',height:'100%',display:'block'}}/><span className="g13-image-status" role="status">{error}</span><GalleryControls go={motion.go} state={motion.state} count={images.length}/></div>;
}
