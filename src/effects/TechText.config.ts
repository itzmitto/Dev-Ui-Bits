import type { Control, EffectProps } from '../types';
import { techTextDefaults } from './TechText.types';
export const techTextValues: EffectProps = { ...techTextDefaults };
const range=(key:string,label:string,min:number,max:number,step:number,group:string):Control=>({key,label,type:'range',min,max,step,group});
const toggle=(key:string,label:string,group:string):Control=>({key,label,type:'toggle',group});
const select=(key:string,label:string,options:string[],group:string):Control=>({key,label,type:'select',options,group});
export const techTextControls: Control[] = [
  {key:'text',label:'Text',type:'text',group:'Typography'},
  {key:'fontFamily',label:'Font Family',type:'text',group:'Typography'},
  range('fontWeight','Font Weight',100,900,100,'Typography'),
  range('fontSize','Font Size',24,300,1,'Typography'),
  range('letterSpacing','Letter Spacing',-.1,.3,.005,'Typography'),
  select('align','Alignment',['left','center','right'],'Typography'),
  {key:'color',label:'Text Color',type:'color',inherit:true,group:'Colors'},
  {key:'accentColor',label:'Accent Color',type:'color',inherit:true,group:'Colors'},
  select('lineStyle','Line Style',['dashed','solid'],'Outline'),
  range('dashLength','Dash Length',.5,24,.5,'Outline'),
  range('dashGap','Dash Gap',.5,20,.5,'Outline'),
  range('strokeWidth','Stroke Width',.2,6,.1,'Outline'),
  select('reveal','Reveal Mode',['letter','area','off'],'Interaction'),
  range('reach','Reach',10,500,1,'Interaction'),
  range('softness','Softness',0,1,.05,'Interaction'),
  range('speed','Speed',0,4,.1,'Interaction'),
  range('bounce','Bounce',0,1,.05,'Interaction'),
  range('specks','Specks',0,60,1,'Interaction'),
  select('intro','Intro Type',['none','type','assemble','metrics'],'Animation'),
  range('introDuration','Intro Duration',.2,8,.1,'Animation'),
  toggle('sweep','Sweep','Animation'),toggle('clickKick','Click Kick','Animation'),
  toggle('draggable','Draggable','Additional Options'),toggle('selection','Selection','Additional Options'),
  toggle('labels','Labels','Additional Options'),toggle('guides','Guides','Additional Options'),
];
// Complete presets make switching deterministic, including settings from a
// previous preset (e.g. Blueprint guides cannot leak into Minimal).
export const techTextPresets:Record<string,EffectProps> = {
  Vector:{...techTextValues,color:'#ffffff',accentColor:'#ffffff',lineStyle:'dashed',reveal:'letter',selection:true},
  Blueprint:{...techTextValues,color:'#e2efff',accentColor:'#60a5fa',guides:true,labels:true},
  Minimal:{...techTextValues,color:'#ffffff',labels:false,guides:false,specks:0,selection:false,sweep:false,clickKick:false},
  Interactive:{...techTextValues,color:'#ffffff',draggable:true,bounce:.75,clickKick:true,sweep:true},
};
