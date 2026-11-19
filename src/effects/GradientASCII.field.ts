export type ASCIIShape='horizon'|'pinch'|'rise'|'eclipse';
export const unit=(v:number)=>Math.max(0,Math.min(1,v));
export const noise=(x:number,y:number,seed=0)=>{const n=Math.sin(x*127.1+y*311.7+seed*74.7)*43758.5453;return n-Math.floor(n);};
export const defaultASCIIColors=['#1e3fd8','#f6f8ff','#a5d8ff','#38bdf8'];
export function parseASCIIColors(value:string|readonly string[]|undefined){const colors=(typeof value==='string'?value.split(/[\s,;]+/):value??defaultASCIIColors).filter(v=>/^#[\da-f]{6}$/i.test(v)).slice(0,8);return colors.length>=2?colors:defaultASCIIColors;}
export function paletteRGB(colors:readonly string[],t:number){const mapped=colors.length>2?(t<.78?t*.032:.02496+(t-.78)/.22*.97504):t;const q=unit(mapped)*(colors.length-1),i=Math.min(colors.length-2,Math.floor(q)),f=q-i;return [1,3,5].map(k=>{const a=parseInt(colors[i].slice(k,k+2),16),b=parseInt(colors[i+1].slice(k,k+2),16);return a+(b-a)*f;});}
/** Independent analytic light fields, shared by the wash and the glyph luminance sampler. */
export function asciiLight(x:number,y:number,time:number,shape:ASCIIShape,softness=.5,scale=1,flow=.5,variation=0,aspect=1){
 const t=time*.17+variation*.73,px=(x-.5)/scale+.5+Math.sin(y*4+t)*flow*.035,py=(y-.5)/scale+.5+Math.sin(x*5-t*.7)*flow*.025;
 let light:number;
 if(shape==='pinch'){const width=.045+Math.pow(Math.abs(px-.5)*1.8,1.6)*.48;light=Math.exp(-Math.pow((py-.5-Math.sin(t)*.055)/width,2));}
 else if(shape==='rise'){const h=py+.08*Math.sin(px*5+t);light=Math.pow(unit((h-.2)/.8),1.5);}
 else if(shape==='eclipse'){const radius=Math.hypot((px-.5)*aspect,py-.52);light=Math.exp(-Math.pow((radius-.29)/(.035+softness*.17),2));}
 else {const radius=Math.hypot((px-.5)*.9,(py-1.08)*1.2);light=unit((radius-.53)/.92);}
 const edge=.08+softness*.22;return unit(light)*unit(light/edge);
}
export function glyphIndex(light:number,length:number){return Math.min(length-1,Math.max(0,Math.floor(unit(light)*(length-1))));}
export function clickInfluence(distance:number,age:number,mode:string){if(mode==='none'||age>1.2)return 0;return mode==='burst'?Math.exp(-distance*distance/.018)*Math.exp(-age*5):Math.exp(-Math.pow((distance-age*.65)/.032,2))*Math.exp(-age*2);}
