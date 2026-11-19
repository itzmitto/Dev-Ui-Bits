export const wrap=(value:number,length:number)=>((value%length)+length)%length;
export const relative=(value:number,length:number)=>wrap(value+length/2,length)-length/2;
export function coast(velocity:number,dt:number,momentum:number){return velocity*Math.exp(-dt*(2+18*(1-momentum)));}
export type CarouselImage={src:string;alt?:string;title?:string;href?:string};
/** JSON keeps per-image captions and links; newline/CSV paths are convenient in the controls. */
export function parseImages(value:unknown,fallback:readonly CarouselImage[]):CarouselImage[]{
 let raw:unknown=value;if(typeof raw==='string'){try{raw=JSON.parse(raw);}catch{raw=raw.split(/[\n,]/).map(src=>src.trim()).filter(Boolean);}}
 if(!Array.isArray(raw))return [...fallback];
 const items=raw.slice(0,40).flatMap(item=>{const o=typeof item==='string'?{src:item}:item as CarouselImage;if(!o||typeof o.src!=='string'||! /^(\/|https?:|data:image\/)/.test(o.src))return [];return [{src:o.src,alt:typeof o.alt==='string'?o.alt:'Gallery photograph',title:typeof o.title==='string'?o.title:undefined,href:typeof o.href==='string'&&/^https?:\/\//.test(o.href)?o.href:undefined}];});
 return items.length?items:[...fallback];
}
