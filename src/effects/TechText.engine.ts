import { clamp01, pointOnContours, spring, traceAlpha } from './TechText.geometry';
import type { Point, TechTextOptions } from './TechText.types';

type Sprite = { mask: HTMLCanvasElement; fill: HTMLCanvasElement; pixels: Uint8ClampedArray; path: Path2D; contours: Point[][]; left: number; top: number; width: number; height: number; scale: number };
type Glyph = { char: string; index: number; x: number; y: number; dx: number; dy: number; vx: number; vy: number; reveal: number; sprite: Sprite };
type Frame = { x:number; y:number; w:number; h:number; opacity:number };
const spriteScale=2;

/** A single lifecycle-owned, on-demand Canvas engine; no React state per frame. */
export class TechTextEngine {
  private ctx: CanvasRenderingContext2D;
  private options: TechTextOptions;
  private glyphs: Glyph[]=[];
  private sprites=new Map<string,Sprite>();
  private width=1;private height=1;private dpr=1;private fontSize=150;
  private left=0;private wordWidth=0;private baseline=0;private cap=0;private xHeight=0;private descent=0;
  private areaCanvas=document.createElement('canvas');
  private areaOpacity=0;private areaX=0;private areaY=0;
  private color='white';private accent='white';private typography='';
  private pointer={x:-1e5,y:-1e5,inside:false};
  private drag: { index:number; pointerId:number; x:number; y:number; moved:boolean } | null=null;
  private keyboard=-1;private active=-1;private frameBox:Frame={x:0,y:0,w:0,h:0,opacity:0};
  private raf=0;private last=0;private elapsed=0;private introElapsed=0;
  private visible=true;private destroyed=false;
  private reduced=matchMedia('(prefers-reduced-motion: reduce)');
  private resizeObserver:ResizeObserver;private intersection:IntersectionObserver;private themeObserver:MutationObserver;
  constructor(private canvas: HTMLCanvasElement,private host:HTMLDivElement,options:TechTextOptions) {
    const context=canvas.getContext('2d');
    if (!context) throw new Error('Tech Text requires Canvas 2D.');
    this.ctx=context;this.options=options;
    this.resizeObserver=new ResizeObserver(this.resize);this.resizeObserver.observe(host);
    this.intersection=new IntersectionObserver(([entry])=>{this.visible=entry.isIntersecting;this.schedule();});this.intersection.observe(host);
    this.themeObserver=new MutationObserver(()=>this.update(this.options));this.themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class','style','data-theme']});
    canvas.addEventListener('pointermove',this.move);canvas.addEventListener('pointerdown',this.down);
    canvas.addEventListener('pointerup',this.up);canvas.addEventListener('pointercancel',this.cancel);
    canvas.addEventListener('lostpointercapture',this.cancel);canvas.addEventListener('pointerleave',this.leave);
    canvas.addEventListener('keydown',this.key);canvas.addEventListener('blur',this.blur);
    document.addEventListener('visibilitychange',this.schedule);this.reduced.addEventListener('change',this.motionChange);
    document.fonts?.addEventListener('loadingdone',this.fontsChanged);
    void document.fonts?.ready.then(()=>{if(!this.destroyed)this.fontsChanged();});
    this.resize();
  }
  update(options:TechTextOptions) {
    const restart=options.intro!==this.options.intro;
    this.options=options;
    if(restart)this.introElapsed=0;
    if(!options.draggable && this.drag)this.finishDrag(false);
    this.canvas.style.touchAction=options.draggable?'none':'pan-y';
    this.layout();this.schedule();
  }
  private fontsChanged=()=>{this.typography='';this.layout();this.schedule();};
  private motionChange=()=>{this.glyphs.forEach(g=>{g.dx=g.dy=g.vx=g.vy=0;});this.schedule();};
  private resize=()=>{
    const bounds=this.host.getBoundingClientRect();
    this.width=Math.max(1,bounds.width);this.height=Math.max(1,bounds.height);
    this.dpr=Math.min(2,window.devicePixelRatio||1);
    const w=Math.round(this.width*this.dpr),h=Math.round(this.height*this.dpr);
    if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}
    this.layout();this.schedule();
  };
  private tint(sprite:Sprite) {
    const context=sprite.fill.getContext('2d')!;
    context.clearRect(0,0,sprite.fill.width,sprite.fill.height);
    context.drawImage(sprite.mask,0,0);context.globalCompositeOperation='source-in';
    context.fillStyle=this.color;context.fillRect(0,0,sprite.fill.width,sprite.fill.height);context.globalCompositeOperation='source-over';
  }
  private makeSprite(char:string,font:string):Sprite {
    this.ctx.font=font;const metrics=this.ctx.measureText(char),padding=3;
    const left=-metrics.actualBoundingBoxLeft-padding,top=-metrics.actualBoundingBoxAscent-padding;
    const width=Math.max(1,metrics.actualBoundingBoxLeft+metrics.actualBoundingBoxRight+padding*2);
    const height=Math.max(1,metrics.actualBoundingBoxAscent+metrics.actualBoundingBoxDescent+padding*2);
    const mask=document.createElement('canvas');mask.width=Math.ceil(width*spriteScale);mask.height=Math.ceil(height*spriteScale);
    const context=mask.getContext('2d',{willReadFrequently:true})!;
    context.scale(spriteScale,spriteScale);context.font=font;context.fillStyle='#fff';context.fillText(char,-left,-top);
    const pixels=context.getImageData(0,0,mask.width,mask.height).data;
    const contours=traceAlpha(pixels,mask.width,mask.height,spriteScale),path=new Path2D();
    for(const contour of contours){path.moveTo(contour[0].x,contour[0].y);for(let i=1;i<contour.length;i++)path.lineTo(contour[i].x,contour[i].y);path.closePath();}
    const fill=document.createElement('canvas');fill.width=mask.width;fill.height=mask.height;
    const sprite={mask,fill,pixels,path,contours,left,top,width:mask.width/spriteScale,height:mask.height/spriteScale,scale:spriteScale};
    this.tint(sprite);return sprite;
  }
  private layout() {
    const p=this.options,style=getComputedStyle(this.host),family=p.fontFamily.trim()||style.fontFamily||'sans-serif';
    const newColor=p.color==='currentColor'?style.color:p.color;
    this.accent=p.accentColor==='currentColor'?style.color:p.accentColor;
    if(newColor!==this.color){this.color=newColor;for(const sprite of this.sprites.values())this.tint(sprite);}
    // Intl.Segmenter preserves a grapheme (accent/emoji) as one draggable unit.
    const chars=Array.from(new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(p.text),part=>part.segment);
    const naturalFont=`${p.fontWeight} ${p.fontSize}px ${family}`;
    this.ctx.font=naturalFont;
    const naturalWidth=Math.max(1,this.ctx.measureText(p.text).width+Math.max(0,chars.length-1)*p.letterSpacing*p.fontSize);
    const naturalMetrics=this.ctx.measureText(p.text||'Hg');
    const naturalHeight=naturalMetrics.actualBoundingBoxAscent+naturalMetrics.actualBoundingBoxDescent;
    this.fontSize=p.fontSize*Math.min(1,Math.max(1,this.width-64)/naturalWidth,Math.max(1,this.height-100)/Math.max(1,naturalHeight));
    const font=`${p.fontWeight} ${this.fontSize}px ${family}`;
    this.ctx.font=font;this.ctx.textBaseline='alphabetic';
    const full=this.ctx.measureText(p.text||'Hg'),metrics=this.ctx.measureText('H'),x=this.ctx.measureText('x');
    this.cap=metrics.actualBoundingBoxAscent;this.xHeight=x.actualBoundingBoxAscent;this.descent=this.ctx.measureText('gp').actualBoundingBoxDescent;
    this.wordWidth=Math.max(0,this.ctx.measureText(p.text).width+Math.max(0,chars.length-1)*p.letterSpacing*this.fontSize);
    this.left=p.align==='left'?32:p.align==='right'?this.width-this.wordWidth-32:(this.width-this.wordWidth)/2;
    this.baseline=(this.height+full.actualBoundingBoxAscent-full.actualBoundingBoxDescent)/2;
    const key=JSON.stringify([p.text,font,p.letterSpacing]);
    if(key!==this.typography){
      if(this.drag)this.finishDrag(false);
      this.typography=key;this.sprites.clear();this.glyphs=[];this.drag=null;this.keyboard=-1;this.frameBox.opacity=0;
      this.canvas.dataset.dragging='false';this.canvas.style.touchAction=this.options.draggable?'none':'pan-y';
      let prefix='';
      chars.forEach((char,index)=>{
        prefix+=char;
        // Prefix measurement retains pair kerning while spacing remains in em.
        const end=this.ctx.measureText(prefix).width,advance=this.ctx.measureText(char).width;
        if(!/^\s+$/u.test(char)){
          let sprite=this.sprites.get(char);if(!sprite){sprite=this.makeSprite(char,font);this.sprites.set(char,sprite);}
          this.glyphs.push({char,index,x:end-advance+index*p.letterSpacing*this.fontSize,y:0,dx:0,dy:0,vx:0,vy:0,reveal:0,sprite});
        }
      });
    }
    // Read-only layout diagnostics also make precise canvas interactions testable.
    this.canvas.dataset.fontSize=this.fontSize.toFixed(3);
    this.canvas.dataset.glyphs=JSON.stringify(this.glyphs.map(g=>({char:g.char,x:this.left+g.x+g.sprite.left+3,y:this.baseline+g.sprite.top+3,width:g.sprite.width-6,height:g.sprite.height-6})));
    this.canvas.dataset.intro=p.intro;
    const bufferWidth=Math.max(1,...this.glyphs.map(g=>g.sprite.mask.width)),bufferHeight=Math.max(1,...this.glyphs.map(g=>g.sprite.mask.height));
    if(this.areaCanvas.width!==bufferWidth||this.areaCanvas.height!==bufferHeight){this.areaCanvas.width=bufferWidth;this.areaCanvas.height=bufferHeight;}
  }
  private hit(x:number,y:number) {
    for(let index=this.glyphs.length-1;index>=0;index--){
      const g=this.glyphs[index],s=g.sprite;
      const px=Math.floor((x-this.left-g.x-g.dx-s.left)*s.scale),py=Math.floor((y-this.baseline-g.dy-s.top)*s.scale);
      if(px>=0&&py>=0&&px<s.mask.width&&py<s.mask.height&&s.pixels[(py*s.mask.width+px)*4+3]>48)return index;
    }
    return -1;
  }
  private position(event:PointerEvent) {
    const bounds=this.canvas.getBoundingClientRect();
    this.pointer.x=(event.clientX-bounds.left)*this.width/bounds.width;
    this.pointer.y=(event.clientY-bounds.top)*this.height/bounds.height;
    this.pointer.inside=this.pointer.x>=0&&this.pointer.x<=this.width&&this.pointer.y>=0&&this.pointer.y<=this.height;this.keyboard=-1;
  }
  private move=(event:PointerEvent)=>{
    this.position(event);
    if(this.drag&&event.pointerId===this.drag.pointerId){
      const g=this.glyphs[this.drag.index];
      if(g){g.dx=this.pointer.x-this.drag.x;g.dy=this.pointer.y-this.drag.y;g.vx=g.vy=0;this.drag.moved ||= Math.hypot(g.dx,g.dy)>4;}
    }
    this.schedule();
  };
  private down=(event:PointerEvent)=>{
    if(event.button!==0)return;
    this.position(event);const index=this.hit(this.pointer.x,this.pointer.y);if(index<0)return;
    this.canvas.focus({preventScroll:true});
    if(this.options.draggable){
      const g=this.glyphs[index];this.drag={index,pointerId:event.pointerId,x:this.pointer.x-g.dx,y:this.pointer.y-g.dy,moved:false};
      this.canvas.setPointerCapture(event.pointerId);this.canvas.dataset.dragging='true';this.canvas.style.touchAction='none';
    } else if(this.options.clickKick)this.kick(index);
    this.schedule();
  };
  private up=(event:PointerEvent)=>{if(this.drag?.pointerId===event.pointerId)this.finishDrag(true);};
  private cancel=()=>{if(this.drag)this.finishDrag(false);};
  private finishDrag(click:boolean) {
    const drag=this.drag;if(!drag)return;this.drag=null;
    if(this.canvas.hasPointerCapture(drag.pointerId))this.canvas.releasePointerCapture(drag.pointerId);
    this.canvas.dataset.dragging='false';this.canvas.style.touchAction=this.options.draggable?'none':'pan-y';
    if(this.reduced.matches){const g=this.glyphs[drag.index];if(g)g.dx=g.dy=0;}
    else if(click&&!drag.moved&&this.options.clickKick)this.kick(drag.index);
    this.schedule();
  }
  private kick(index:number) {
    if(this.reduced.matches)return;
    this.glyphs.forEach((g,i)=>{const distance=Math.abs(i-index);if(distance<4){g.vy-=this.fontSize*(3.3/(1+distance*2.5));g.vx+=(i-index)*10/(1+distance);}});
    this.schedule();
  }
  private leave=()=>{this.pointer.inside=false;this.keyboard=-1;this.schedule();};
  private blur=()=>{this.keyboard=-1;this.schedule();};
  private key=(event:KeyboardEvent)=>{
    if(!this.glyphs.length)return;
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
      event.preventDefault();const direction=event.key==='ArrowRight'?1:-1;
      this.keyboard=(this.keyboard+direction+this.glyphs.length)%this.glyphs.length;this.pointer.inside=false;this.schedule();
    } else if(event.key==='Enter'||event.key===' '){event.preventDefault();if(this.options.clickKick)this.kick(Math.max(0,this.keyboard));}
    else if(event.key==='Escape'){this.keyboard=-1;this.pointer.inside=false;this.finishDrag(false);this.schedule();}
  };
  private schedule=()=>{
    if(this.destroyed)return;
    if(!this.visible||document.hidden){cancelAnimationFrame(this.raf);this.raf=0;this.last=0;return;}
    if(!this.raf)this.raf=requestAnimationFrame(this.draw);
  };
  private guides(opacity:number) {
    const c=this.ctx;c.save();c.globalAlpha=opacity*.34;c.strokeStyle=this.accent;c.fillStyle=this.accent;c.lineWidth=.6;c.setLineDash([3,5]);c.font='8px ui-monospace,monospace';
    for(const [offset,label] of [[-this.cap,'cap height'],[-this.xHeight,'x-height'],[0,'baseline'],[this.descent,'descender']] as const){
      const y=this.baseline+offset;c.beginPath();c.moveTo(20,y+.5);c.lineTo(this.width-20,y+.5);c.stroke();c.fillText(label,22,y-4);
    }
    c.restore();
  }
  private selection(index:number,dt:number,opacity:number) {
    const g=this.glyphs[index],p=this.options,c=this.ctx,b=this.frameBox;
    const factor=this.reduced.matches?1:1-Math.exp(-22*dt);
    let frameMoving=false;
    if(g){
      const s=g.sprite,target={x:this.left+g.x+g.dx+s.left,y:this.baseline+g.dy+s.top,w:s.width,h:s.height};
      frameMoving=Math.abs(b.x-target.x)+Math.abs(b.y-target.y)+Math.abs(b.w-target.w)+Math.abs(b.h-target.h)>.05;
      if(b.opacity<.01)Object.assign(b,target);else{b.x+=(target.x-b.x)*factor;b.y+=(target.y-b.y)*factor;b.w+=(target.w-b.w)*factor;b.h+=(target.h-b.h)*factor;}
    }
    b.opacity+=(opacity-b.opacity)*factor;
    if(b.opacity<.003)return false;
    c.save();c.globalAlpha=b.opacity*.75;c.strokeStyle=this.accent;c.fillStyle=this.accent;c.lineWidth=.65;
    if(p.selection){
      c.setLineDash([3,3]);c.strokeRect(b.x,b.y,b.w,b.h);c.setLineDash([]);
      for(const [x,y] of [[b.x,b.y],[b.x+b.w,b.y],[b.x,b.y+b.h],[b.x+b.w,b.y+b.h]])c.fillRect(x-1.5,y-1.5,3,3);
    }
    if(p.labels&&g){
      const label=this.drag?`${g.char}  Δ ${Math.round(g.dx)}, ${Math.round(-g.dy)}`:`${g.char}  ${Math.round(b.w-6)} × ${Math.round(b.h-6)}`;
      c.font='9px ui-monospace,monospace';c.globalAlpha=b.opacity*.55;
      c.fillText(label,Math.min(Math.max(8,b.x),Math.max(8,this.width-c.measureText(label).width-8)),Math.max(12,b.y-8));
    }
    if(g&&p.specks>0){
      for(let i=0;i<p.specks;i++){
        const phase=this.reduced.matches?i*.72:this.elapsed*p.speed*.8+i*2.399;
        const x=b.x+b.w/2+Math.cos(i*2.399)*(b.w/2+8+(i%4)*4)+Math.sin(phase)*2;
        const y=b.y+b.h/2+Math.sin(i*2.399)*(b.h/2+7+(i%3)*4)+Math.cos(phase)*2;
        c.globalAlpha=b.opacity*(.15+.4*(.5+.5*Math.sin(phase)));c.fillRect(x,y,i%5===0?2:1,i%5===0?2:1);
      }
    }
    c.restore();return frameMoving||Math.abs(b.opacity-opacity)>.005||!!g&&(p.specks>0&&p.speed>0);
  }
  private drawArea(g:Glyph,gx:number,gy:number,opacity:number) {
    const c=this.ctx,b=this.areaCanvas.getContext('2d')!,s=g.sprite,p=this.options;
    b.setTransform(spriteScale,0,0,spriteScale,0,0);
    const gradient=b.createRadialGradient(this.areaX-gx,this.areaY-gy,Math.min(p.reach-.001,p.reach*(1-p.softness)),this.areaX-gx,this.areaY-gy,p.reach);
    gradient.addColorStop(0,`rgba(0,0,0,${this.areaOpacity})`);gradient.addColorStop(1,'rgba(0,0,0,0)');
    b.setTransform(spriteScale,0,0,spriteScale,0,0);b.clearRect(0,0,this.areaCanvas.width/spriteScale,this.areaCanvas.height/spriteScale);
    b.globalCompositeOperation='source-over';b.drawImage(s.fill,0,0,s.width,s.height);
    b.globalCompositeOperation='destination-out';b.fillStyle=gradient;b.fillRect(0,0,s.width,s.height);
    c.globalAlpha=opacity;c.drawImage(this.areaCanvas,0,0,s.mask.width,s.mask.height,gx,gy,s.width,s.height);
    b.globalCompositeOperation='source-over';b.clearRect(0,0,s.width,s.height);
    b.strokeStyle=this.color;b.lineWidth=p.strokeWidth;b.lineJoin='round';b.setLineDash(p.lineStyle==='dashed'?[p.dashLength,p.dashGap]:[]);b.stroke(s.path);
    b.globalCompositeOperation='destination-in';b.fillStyle=gradient;b.fillRect(0,0,s.width,s.height);
    c.drawImage(this.areaCanvas,0,0,s.mask.width,s.mask.height,gx,gy,s.width,s.height);b.globalCompositeOperation='source-over';
  }
  private draw=(now:number)=>{
    this.raf=0;if(this.destroyed||!this.visible||document.hidden)return;
    const dt=this.last?Math.min(.04,(now-this.last)/1000):1/60;this.last=now;
    this.elapsed+=dt;this.introElapsed+=dt;
    const p=this.options,c=this.ctx,reduced=this.reduced.matches;
    const intro=reduced||p.intro==='none'?1:clamp01(this.introElapsed/p.introDuration);
    const inIntro=intro<1,typing=p.intro==='type'&&inIntro;
    let x=this.pointer.x,y=this.pointer.y;
    const sweeping=!this.pointer.inside&&this.keyboard<0&&p.sweep&&p.speed>0&&!reduced&&!inIntro&&p.reveal!=='off';
    if(sweeping){const phase=(this.elapsed*p.speed*.14)%1;x=this.left-60+phase*(this.wordWidth+120);y=this.baseline-this.cap*.4;}
    this.active=this.drag?.index??(this.keyboard>=0?this.keyboard:(this.pointer.inside||sweeping?this.hit(x,y):-1));
    if(typing)this.active=Math.min(this.glyphs.length-1,Math.floor(intro*this.glyphs.length));
    this.canvas.dataset.activeLetter=this.glyphs[this.active]?.char??'';
    this.canvas.style.cursor=this.active>=0&&p.draggable?(this.drag?'grabbing':'grab'):'default';
    this.canvas.dataset.introProgress=intro.toFixed(3);
    c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,this.width,this.height);
    let animate=inIntro||sweeping;
    if((p.guides&&this.active>=0)||(p.intro==='metrics'&&inIntro))this.guides(inIntro?Math.min(1,intro*6):1);
    const smoothing=reduced?1:1-Math.exp(-18*dt);
    const areaTarget=p.reveal==='area'&&(this.pointer.inside||sweeping)?1:0;
    if(areaTarget){if(this.areaOpacity<.01){this.areaX=x;this.areaY=y;}else{this.areaX+=(x-this.areaX)*smoothing;this.areaY+=(y-this.areaY)*smoothing;}}
    this.areaOpacity+=(areaTarget-this.areaOpacity)*smoothing;
    animate ||= Math.abs(areaTarget-this.areaOpacity)>.003;

    this.glyphs.forEach((g,index)=>{
      if(!this.drag||this.drag.index!==index){
        [g.dx,g.vx]=spring(g.dx,g.vx,dt,p.bounce);[g.dy,g.vy]=spring(g.dy,g.vy,dt,p.bounce);
      }
      const moving=Math.abs(g.dx)+Math.abs(g.dy)+Math.abs(g.vx)+Math.abs(g.vy)>.1;
      animate ||= moving;
      let target=0;
      if(p.reveal!=='off'){
        if(p.reveal==='letter')target=index===this.active?1:0;

      }
      g.reveal+=(target-g.reveal)*smoothing;animate ||= Math.abs(target-g.reveal)>.003;
      const s=g.sprite,gx=this.left+g.x+g.dx+s.left,gy=this.baseline+g.dy+s.top;
      let opacity=1,outline=g.reveal;
      if(typing){const local=intro*this.glyphs.length-index;opacity=clamp01(local*3);outline=Math.max(outline,1-clamp01((local-.6)*3));}
      const assembly=p.intro==='assemble'&&inIntro;
      if(assembly){
        const progress=clamp01((intro-index/Math.max(1,this.glyphs.length)*.2)/.8),ease=1-Math.pow(1-progress,3);
        opacity=clamp01((progress-.45)/.55);
        c.fillStyle=this.color;
        for(let dot=0;dot<36;dot++){
          const point=pointOnContours(s.contours,(dot+.5)/36),angle=dot*2.399+index;
          const spread=(1-ease)*(60+(dot%5)*22);
          c.globalAlpha=(1-progress)*clamp01(progress*5);c.fillRect(gx+point.x+Math.cos(angle)*spread,gy+point.y+Math.sin(angle)*spread,1.8,1.8);
        }
      }
      c.save();
      if(p.intro==='metrics'&&inIntro){
        c.beginPath();c.rect(this.left-8,this.baseline-this.cap-10,(this.wordWidth+16)*clamp01((intro-.2)/.8),this.cap+this.descent+20);c.clip();
        opacity=clamp01(intro*3);
      }
      if(moving&&p.reveal!=='off'){
        c.save();c.translate(this.left+g.x+s.left,this.baseline+s.top);c.globalAlpha=.2;c.strokeStyle=this.color;c.lineWidth=p.strokeWidth;c.setLineDash(p.lineStyle==='dashed'?[p.dashLength,p.dashGap]:[]);c.stroke(s.path);c.restore();
      }
      if(p.reveal==='area'&&this.areaOpacity>.002&&!inIntro){
        this.drawArea(g,gx,gy,opacity);
      } else {c.globalAlpha=(1-outline)*opacity;c.drawImage(s.fill,gx,gy,s.width,s.height);}
      if(outline>.002){c.translate(gx,gy);c.globalAlpha=outline*opacity;c.strokeStyle=this.color;c.lineWidth=p.strokeWidth;c.lineJoin='round';c.setLineDash(p.lineStyle==='dashed'?[p.dashLength,p.dashGap]:[]);c.stroke(s.path);}
      c.restore();
    });
    animate=this.selection(this.active,dt,this.active>=0?1:0)||animate;
    c.globalAlpha=1;
    if(animate&&!reduced)this.schedule();else this.last=0;
  };
  destroy() {
    this.destroyed=true;cancelAnimationFrame(this.raf);
    if(this.drag&&this.canvas.hasPointerCapture(this.drag.pointerId))this.canvas.releasePointerCapture(this.drag.pointerId);
    this.resizeObserver.disconnect();this.intersection.disconnect();this.themeObserver.disconnect();
    this.canvas.removeEventListener('pointermove',this.move);this.canvas.removeEventListener('pointerdown',this.down);
    this.canvas.removeEventListener('pointerup',this.up);this.canvas.removeEventListener('pointercancel',this.cancel);
    this.canvas.removeEventListener('lostpointercapture',this.cancel);this.canvas.removeEventListener('pointerleave',this.leave);
    this.canvas.removeEventListener('keydown',this.key);this.canvas.removeEventListener('blur',this.blur);
    document.removeEventListener('visibilitychange',this.schedule);this.reduced.removeEventListener('change',this.motionChange);
    document.fonts?.removeEventListener('loadingdone',this.fontsChanged);this.sprites.clear();this.glyphs=[];
  }
}
