import { describe,it,expect } from 'vitest';
import { falloff,spring,traceAlpha } from './effects/TechText.geometry';
import { normalizeTechText,techTextDefaults } from './effects/TechText.types';
import { techTextControls,techTextPresets } from './effects/TechText.config';
import { builtinFiles,findComponent,registry } from './registry';
import { validateSchema } from './storage';

describe('original Tech Text geometry and integration',()=>{
  it('traces closed silhouettes and internal counters from alpha samples',()=>{
    const size=20,pixels=new Uint8ClampedArray(size*size*4);
    for(let y=2;y<18;y++)for(let x=2;x<18;x++)if(!(x>=7&&x<13&&y>=7&&y<13))pixels[(y*size+x)*4+3]=255;
    const contours=traceAlpha(pixels,size,size,2);
    expect(contours).toHaveLength(2);
    for(const contour of contours){expect(contour[0]).toEqual(contour.at(-1));for(const point of contour){expect(Number.isFinite(point.x+point.y)).toBe(true);}}
    expect(traceAlpha(new Uint8ClampedArray(16),2,2,1)).toEqual([]);
  });
  it('has a smooth bounded area falloff and a stable spring with adjustable overshoot',()=>{
    expect(falloff(0,200,.7)).toBe(1);expect(falloff(200,200,.7)).toBe(0);
    expect(falloff(130,200,.7)).toBeCloseTo(.5);expect(falloff(199,200,0)).toBe(1);
    for(const bounce of [0,.4,1]){
      let position=100,velocity=0,min=100;
      for(let frame=0;frame<600;frame++){[position,velocity]=spring(position,velocity,1/60,bounce);min=Math.min(min,position);expect(Math.abs(position)).toBeLessThanOrEqual(100);}
      expect(position).toBe(0);expect(velocity).toBe(0);if(bounce===1)expect(min).toBeLessThan(-20);if(bounce===0)expect(min).toBe(0);
    }
  });
  it('uses exact requested defaults, validates controls and complete deterministic presets',()=>{
    expect(normalizeTechText({})).toEqual(techTextDefaults);
    expect(normalizeTechText({intro:undefined,sweep:undefined})).toEqual(techTextDefaults);
    expect(techTextDefaults).toMatchObject({text:'DevUI Bits',fontSize:150,fontWeight:600,letterSpacing:-.05,color:'currentColor',accentColor:'currentColor',intro:'none'});
    expect(normalizeTechText({fontSize:NaN,speed:-2,specks:200})).toMatchObject({fontSize:150,speed:0,specks:60});
    expect(()=>validateSchema(techTextControls,{...techTextDefaults})).not.toThrow();
    expect(techTextControls).toHaveLength(26);
    expect(()=>validateSchema([{key:'color',label:'Color',type:'color',group:{},inherit:true}],{color:'currentColor'})).toThrow('groups');
    expect(()=>validateSchema([{key:'color',label:'Color',type:'color',inherit:'true'}],{color:'currentColor'})).toThrow('inheritance');
    for(const preset of Object.values(techTextPresets))expect(Object.keys(preset).sort()).toEqual(Object.keys(techTextDefaults).sort());
    expect(techTextPresets.Minimal).toMatchObject({specks:0,guides:false,labels:false});
  });
  it('promotes exactly one existing record with all original source dependencies',()=>{
    expect(registry.filter(item=>item.name==='Tech Text')).toHaveLength(1);
    const item=findComponent('text-animations','tech-text');expect(item?.status).toBe('ready');
    if(item?.status!=='ready')throw new Error('Tech Text is not ready');
    const files=builtinFiles(item,item.defaults);
    for(const path of ['/effects/TechText.tsx','/effects/TechText.engine.ts','/effects/TechText.geometry.ts','/effects/TechText.types.ts','/effects/TechText.css'])expect(files[path]?.length,path).toBeGreaterThan(100);
    expect(item.dependencies).toEqual({});
    expect(findComponent('animations','ripple-distortion')?.status).toBe('planned');
  });
});
