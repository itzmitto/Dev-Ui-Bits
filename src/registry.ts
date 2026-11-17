import { lazy, type ComponentType } from 'react';
import { textBatchOne } from './effects/textBatchOne.config';
import { textBatchTwo } from './effects/textBatchTwo.config';
import { techTextControls, techTextPresets, techTextValues } from './effects/TechText.config';
import { Field } from './effects/Field';
import { InteractiveParticleBackground } from './effects/InteractiveParticleBackground';
import { catalogNames, plannedDescription } from './catalogNames';
import { componentPath, type CatalogEntry, type Control, type Definition, type EffectProps } from './types';

const effectModules = import.meta.glob<Record<string, ComponentType<EffectProps>>>(['./effects/*.tsx', '!./effects/Field.tsx', '!./effects/InteractiveParticleBackground.tsx']);
function lazyPreview(source: string, exportName: string) {
  return lazy(async () => {
    const module = await effectModules[`./effects/${source}.tsx`]();
    return { default: module[exportName] };
  });
}
const Text = {
  BlurText: lazyPreview('TextEffects', 'BlurText'),
  SplitText: lazyPreview('TextEffects', 'SplitText'),
  GlitchText: lazyPreview('TextEffects', 'GlitchText'),
  TypewriterText: lazyPreview('TextEffects', 'TypewriterText'),
};
const Animation = {
  FadeIn: lazyPreview('AnimationEffects', 'FadeIn'),
  ScrollReveal: lazyPreview('AnimationEffects', 'ScrollReveal'),
  MagnetEffect: lazyPreview('AnimationEffects', 'MagnetEffect'),
  AnimatedList: lazyPreview('AnimationEffects', 'AnimatedList'),
};
const Card = {
  TiltCard: lazyPreview('CardEffects', 'TiltCard'),
  SpotlightCard: lazyPreview('CardEffects', 'SpotlightCard'),
  AnimatedCarousel: lazyPreview('CardEffects', 'AnimatedCarousel'),
  MagneticButton: lazyPreview('CardEffects', 'MagneticButton'),
};
const Micro = {
  AnimatedToggle: lazyPreview('MicroEffects', 'AnimatedToggle'),
  HoverButton: lazyPreview('MicroEffects', 'HoverButton'),
  RippleEffect: lazyPreview('MicroEffects', 'RippleEffect'),
  InteractiveCursor: lazyPreview('MicroEffects', 'InteractiveCursor'),
};
const AdvancedMegaMenu = lazyPreview('AdvancedMegaMenu', 'AdvancedMegaMenu');
const InteractiveCard3D = lazyPreview('InteractiveCard3D', 'InteractiveCard3D');
const MorphingButton = lazyPreview('MorphingButton', 'MorphingButton');
const AnimatedTabs = lazyPreview('AnimatedTabs', 'AnimatedTabs');
const MagneticNavigation = lazyPreview('MagneticNavigation', 'MagneticNavigation');
const ScrollStorytellingSection = lazyPreview('ScrollStorytellingSection', 'ScrollStorytellingSection');
const AdvancedImageGallery = lazyPreview('AdvancedImageGallery', 'AdvancedImageGallery');

const color:Control={key:'color',label:'Primary color',type:'color'};
const text:Control={key:'text',label:'Text',type:'text'};
const range=(key:string,label:string,min:number,max:number,step=1):Control=>({key,label,type:'range',min,max,step});
const duration=range('duration','Duration',.1,4,.1);
const delay=range('delay','Stagger delay',0,.5,.01);
const strength=range('strength','Mouse strength',.05,1,.05);
const toggle=(key:string,label:string):Control=>({key,label,type:'toggle'});
function def(name:string,category:Definition['category'],description:string,preview:Definition['preview'],source:string,defaults:EffectProps,schema:Control[]):Definition {
  const slug=name.toLowerCase().replaceAll(' ','-');
  return {id:slug,status:'ready',name,slug,category,description,preview,source,exportName:name.replaceAll(' ',''),defaults,schema,dependencies:source==='Field'?{}:{motion:'^14.14.0'}};
}
const backgroundControls=[color,{key:'secondary',label:'Glint color',type:'color'} as Control,{key:'background',label:'Background',type:'color'} as Control,range('speed','Speed',0,3,.05),range('scale','Scale',.5,4,.1),range('opacity','Opacity',.1,1,.05),toggle('interactive','Interactive'),strength];
const fieldDefaults={color:'#a855f7',secondary:'#ffffff',background:'#120f17',speed:.6,scale:1.5,opacity:1,interactive:true,strength:.7,blur:0};
const implementations:Definition[]=[
 ...Object.entries({...textBatchOne,...textBatchTwo}).map(([source,entry])=>({...def(source.replace(/([a-z])([A-Z])/g,'$1 $2'),'Text Animations',entry.description,lazyPreview(source,source),source,entry.defaults,entry.schema),dependencies:{},styles:[`${source}.css`],supportingFiles:entry.helpers,presets:entry.presets})),
 {...def('Tech Text','Text Animations','A wordmark with interactive vector contours, precision frames and spring-driven letters.',lazyPreview('TechText','TechText'),'TechText',techTextValues,techTextControls),dependencies:{},presets:techTextPresets,styles:['TechText.css'],supportingFiles:['TechText.engine.ts','TechText.geometry.ts','TechText.types.ts']},
 {...def('Micro Slats','Backgrounds','A field of light. A rhythm of motion. Tiny slats, endless possibilities.',Field,'Field',{...fieldDefaults,mode:'slats',width:10,height:25,gap:3,roundness:.75,direction:250,paused:false},[...backgroundControls.slice(0,3),range('width','Slat width',3,30),range('height','Slat height',8,60),range('gap','Gap',1,15),range('roundness','Roundness',0,1,.05),...backgroundControls.slice(3,6),range('direction','Direction',0,360),range('blur','Blur',0,8,.5),...backgroundControls.slice(6),toggle('paused','Paused')]),isNew:true,exportName:'Field',presets:{Swell:{color:'#a855f7',secondary:'#ffffff',speed:.6,scale:1.5,direction:250},Tide:{color:'#38bdf8',secondary:'#c6f6ff',speed:.3,scale:2.5,direction:290},Ember:{color:'#fb7185',secondary:'#ffdeb0',speed:.9,scale:1.2,direction:190},Signal:{color:'#a3e635',secondary:'#ffffff',speed:1.5,scale:.6,direction:90}}},
 def('Blur Text','Text Animations','Let your words come into focus, one thought at a time.',Text.BlurText,'TextEffects',{text:'Ideas come to life.',color:'#ffffff',duration:.8,delay:.15,blur:12},[text,color,duration,delay,range('blur','Initial blur',0,30)]),
 def('Split Text','Text Animations','Give every character an entrance of its own.',Text.SplitText,'TextEffects',{text:'Make it move.',color:'#ffffff',duration:.8,delay:.06,distance:65},[text,color,duration,delay,range('distance','Distance',0,150)]),
 def('Glitch Text','Text Animations','A little digital disruption for words that stand out.',Text.GlitchText,'TextEffects',{text:'BREAK THE PATTERN',color:'#ffffff',speed:2},[text,color,range('speed','Cycle duration',.2,5,.1)]),
 def('Typewriter Text','Text Animations','Build anticipation with a familiar, character-by-character reveal.',Text.TypewriterText,'TextEffects',{text:'Build something extraordinary.',color:'#ffffff',speed:90,loop:true},[text,color,range('speed','Typing interval (ms)',20,250),toggle('loop','Loop')]),
 def('Fade In','Animations','A considered entrance. A small detail that makes all the difference.',Animation.FadeIn,'AnimationEffects',{text:'A lasting impression.',color:'#a855f7',duration:1,distance:60,direction:'up'},[text,color,duration,range('distance','Distance',0,150),{key:'direction',label:'Direction',type:'select',options:['up','down','left']}]),
 def('Scroll Reveal','Animations','Reveal your story as your visitors explore.',Animation.ScrollReveal,'AnimationEffects',{color:'#a855f7',duration:.7,distance:60,once:false},[color,duration,range('distance','Distance',0,150),toggle('once','Reveal once')]),
 def('Magnet Effect','Animations','An irresistible, spring-powered pull towards your cursor.',Animation.MagnetEffect,'AnimationEffects',{text:'Come closer',color:'#a855f7',strength:.35},[text,color,strength]),
 def('Animated List','Animations','An orderly entrance for a list full of possibilities.',Animation.AnimatedList,'AnimationEffects',{color:'#a855f7',delay:.15,count:4},[color,delay,{key:'count',label:'Visible items',type:'number',min:1,max:4,step:1}]),
 def('Tilt Card','Components','A tactile card with a new perspective on every movement.',Card.TiltCard,'CardEffects',{text:'Shift your perspective.',color:'#a855f7',strength:25},[text,color,range('strength','Tilt angle',0,50)]),
 def('Spotlight Card','Components','Bring your content into the light with a cursor-following glow.',Card.SpotlightCard,'CardEffects',{text:'A moment in the spotlight.',color:'#a855f7',size:220},[text,color,range('size','Spotlight size',80,400)]),
 def('Animated Carousel','Components','Three ideas. One smooth, interactive carousel.',Card.AnimatedCarousel,'CardEffects',{autoplay:false,duration:3},[toggle('autoplay','Autoplay'),range('duration','Slide interval',1,8,.5)]),
 def('Magnetic Button','Components','A responsive button that meets you halfway.',Card.MagneticButton,'CardEffects',{text:'Pull me in',color:'#a855f7',strength:.4},[text,color,strength]),
 {...def('Particle Background','Backgrounds','A quiet constellation that responds to your presence.',Field,'Field',{...fieldDefaults,mode:'particles',density:80},[...backgroundControls.filter(c=>c.key!=='secondary'),range('density','Particle count',10,180)]),exportName:'Field'},
 {...def('Animated Gradient','Backgrounds','An ever-changing wash of color, with room to breathe.',Field,'Field',{...fieldDefaults,mode:'gradient',secondary:'#3b82f6',scale:1},[...backgroundControls,range('blur','Blur',0,12,.5)]),exportName:'Field'},
 {...def('Interactive Grid','Backgrounds','A precise dot matrix with a playful, interactive pulse.',Field,'Field',{...fieldDefaults,mode:'grid',width:5,height:5,gap:18},[...backgroundControls.filter(c=>c.key!=='secondary'&&c.key!=='speed'&&c.key!=='scale'),range('width','Dot size',2,16),range('height','Row height',2,16),range('gap','Gap',4,40)]),exportName:'Field'},
 {...def('Wave Background','Backgrounds','Flowing lines that turn a background into a living surface.',Field,'Field',{...fieldDefaults,mode:'waves',density:14,width:2},[...backgroundControls,range('density','Wave count',3,30),range('width','Line width',1,5,.5)]),exportName:'Field'},
 def('Animated Toggle','Micro Interactions','A satisfying switch, with just the right amount of spring.',Micro.AnimatedToggle,'MicroEffects',{color:'#a855f7',checked:false},[color,toggle('checked','Initially enabled')]),
 def('Hover Button','Micro Interactions','A soft glow and a confident lift. An invitation to interact.',Micro.HoverButton,'MicroEffects',{text:'Make your move',color:'#a855f7',glow:40,roundness:16},[text,color,range('glow','Glow size',0,80),range('roundness','Roundness',0,50)]),
 def('Ripple Effect','Micro Interactions','Every interaction makes a little wave.',Micro.RippleEffect,'MicroEffects',{text:'Start a ripple.',color:'#a855f7',duration:1},[text,color,duration]),
 def('Interactive Cursor','Micro Interactions','A spring-following cursor that brings a little personality.',Micro.InteractiveCursor,'MicroEffects',{text:'Follow your curiosity.',color:'#a855f7',size:48},[text,color,range('size','Ring size',20,100)]),
 {...def('Advanced Mega Menu','Components','A keyboard-accessible, animated navigation system with rich panels and meaningful destinations.',AdvancedMegaMenu,'AdvancedMegaMenu',{color:'#a855f7',columns:2,duration:.2,hoverOpen:false,showIcons:true},[color,{key:'columns',label:'Panel columns',type:'number',min:1,max:2,step:1},duration,toggle('hoverOpen','Open on hover'),toggle('showIcons','Show icons')]),isNew:true,styles:['advanced.css']},
 {...def('3D Interactive Card','Components','Layered CSS perspective, pointer-driven light, and a reversible card with another side to its story.',InteractiveCard3D,'InteractiveCard3D',{text:'Beyond the surface.',color:'#a855f7',tilt:22,perspective:900,glare:true},[text,color,range('tilt','Tilt angle',0,40),range('perspective','Perspective',400,1600,50),toggle('glare','Pointer glare')]),exportName:'InteractiveCard3D',isNew:true,styles:['advanced.css']},
 {...def('Morphing Button','Micro Interactions','A spring-driven journey from action to progress to success, with cleanup-safe asynchronous state.',MorphingButton,'MorphingButton',{text:'Launch something',color:'#a855f7',duration:1.5,roundness:18,autoReset:true},[text,color,duration,range('roundness','Roundness',0,32),toggle('autoReset','Auto reset')]),isNew:true,styles:['advanced.css']},
 {...def('Animated Tabs','Components','Shared-layout indicators, animated content and charts, and complete keyboard navigation.',AnimatedTabs,'AnimatedTabs',{color:'#a855f7',orientation:'horizontal',duration:.3,roundness:18},[color,{key:'orientation',label:'Orientation',type:'select',options:['horizontal','vertical']},duration,range('roundness','Roundness',0,30)]),isNew:true,styles:['advanced.css']},
 {...def('Magnetic Navigation','Components','A spring-following navigation dock with an animated active state and keyboard-accessible destinations.',MagneticNavigation,'MagneticNavigation',{color:'#a855f7',strength:.3,orientation:'horizontal',roundness:22},[color,strength,{key:'orientation',label:'Orientation',type:'select',options:['horizontal','vertical']},range('roundness','Dock roundness',0,35)]),isNew:true,styles:['advanced.css']},
 {...def('Interactive Particle Background','Backgrounds','A living particle network with spatial-hash connections, pointer forces, and click-driven bursts.',InteractiveParticleBackground,'InteractiveParticleBackground',{text:'A universe of possibilities.',color:'#a855f7',secondary:'#67e8f9',background:'#120f17',density:110,speed:1,connectionDistance:100,strength:.8,opacity:.8,trail:.2,interactive:true,interactionMode:'repel'},[text,color,{key:'secondary',label:'Secondary color',type:'color'},{key:'background',label:'Background',type:'color'},range('density','Particle count',20,200),range('speed','Speed',0,3,.1),range('connectionDistance','Connection distance',40,180,5),strength,range('opacity','Opacity',.1,1,.05),range('trail','Trail persistence',0,.8,.05),toggle('interactive','Interactive'),{key:'interactionMode',label:'Pointer force',type:'select',options:['repel','attract']}]),dependencies:{},isNew:true,styles:['advanced.css']},
 {...def('Scroll Storytelling Section','Animations','A three-chapter narrative with sticky artwork, scroll-linked transforms and a live reading indicator.',ScrollStorytellingSection,'ScrollStorytellingSection',{text:'FROM A LITTLE IDEA',color:'#a855f7',rotation:180,sectionHeight:380,showProgress:true},[text,color,range('rotation','Total rotation',0,360,10),range('sectionHeight','Chapter height',260,600,20),toggle('showProgress','Reading progress')]),isNew:true,styles:['advanced.css']},
 {...def('Advanced Image Gallery','Components','Filter an original art collection, explore its lightbox, zoom, and navigate with your keyboard.',AdvancedImageGallery,'AdvancedImageGallery',{text:'Look a little closer.',color:'#a855f7',columns:3,gap:12,roundness:10,layout:'masonry'},[text,color,{key:'columns',label:'Columns',type:'number',min:2,max:4,step:1},range('gap','Image gap',4,24),range('roundness','Image roundness',0,24),{key:'layout',label:'Layout',type:'select',options:['grid','masonry']}]),isNew:true,styles:['advanced.css'],supportingFiles:['galleryArt.ts']},

];
// One final registry drives every public catalogue surface. Exact names reuse the
// existing implementation; category moves keep their original URL as an alias.
function buildRegistry(): CatalogEntry[] {
  const byName = new Map(implementations.map(item => [item.name, item]));
  const listed = new Set(catalogNames.flatMap(group => group.names));
  return catalogNames.flatMap(({ category, names }) => [
    ...names.map((name): CatalogEntry => {
      const ready = byName.get(name);
      if (ready) {
        return {
          ...ready, category,
          aliases: ready.category === category ? ready.aliases : [...ready.aliases ?? [], componentPath(ready)],
        };
      }
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return { id: slug, name, slug, category, status: 'planned', description: plannedDescription };
    }),
    ...implementations.filter(item => item.category === category && !listed.has(item.name)),
  ]);
}
export const registry: CatalogEntry[] = buildRegistry();
export const readyComponents = registry.filter((entry): entry is Definition => entry.status === 'ready');
const routes = new Map<string, CatalogEntry>();
const ids = new Set<string>();
for (const entry of registry) {
  if (ids.has(entry.id)) throw new Error(`Duplicate component ID: ${entry.id}`);
  ids.add(entry.id);
  for (const route of [componentPath(entry), ...entry.aliases ?? []]) {
    if (routes.has(route)) throw new Error(`Duplicate component route: ${route}`);
    routes.set(route, entry);
  }
}
export const findComponent = (category: string, slug: string) => routes.get(`/${category}/${slug}`);
const rawSources=import.meta.glob('./effects/*.{tsx,ts,css}',{query:'?raw',import:'default',eager:true}) as Record<string,string>;
export function builtinFiles(component:Definition,props:EffectProps):Record<string,string>{
 const extraFiles=Object.fromEntries([...(component.styles??[]),...(component.supportingFiles??[])].map(file=>[`/effects/${file}`,rawSources[`./effects/${file}`]]));
 return {...extraFiles,'/App.tsx':`import { ${component.exportName} } from './effects/${component.source}';\nimport './effects/effects.css';\n${(component.styles??[]).map(file=>`import './effects/${file}';`).join('\n')}\nimport './styles.css';\n\nexport default function App() {\n  return <main className="preview-stage"><${component.exportName} {...${JSON.stringify(props,null,2)}} /></main>;\n}\n`,[`/effects/${component.source}.tsx`]:rawSources[`./effects/${component.source}.tsx`],'/effects/types.ts':rawSources['./effects/types.ts'],'/effects/effects.css':rawSources['./effects/effects.css'],'/styles.css':'*{box-sizing:border-box}body{margin:0;background:#120f17;font-family:system-ui,sans-serif}.preview-stage{height:100vh;min-height:350px;display:flex;align-items:center;justify-content:center;overflow:hidden;color:white}button{font-family:inherit}'};
}
