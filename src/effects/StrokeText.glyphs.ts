import { traceAlpha } from './TechText.geometry';
export type StrokeGlyph={d:string;x:number;y:number;width:number;height:number};
/** Convert our own rasterized font into real closed, dashable SVG contours. */
export function strokeGlyphs(text:string,font:string,spacing:number,width:number,height:number){
 const canvas=document.createElement('canvas'),c=canvas.getContext('2d',{willReadFrequently:true})!;c.font=font;
 const chars=Array.from(text.replaceAll('\n',' ')),measure=c.measureText(text.replaceAll('\n',' ')),total=measure.width+Math.max(0,chars.length-1)*spacing,baseline=(height+measure.actualBoundingBoxAscent-measure.actualBoundingBoxDescent)/2;let prefix='';
 return chars.map((char,index)=>{c.font=font;const m=c.measureText(char),left=Math.ceil(m.actualBoundingBoxLeft)+4,top=Math.ceil(m.actualBoundingBoxAscent)+4;const x=(width-total)/2+c.measureText(prefix).width+index*spacing-left,y=baseline-top;prefix+=char;
  canvas.width=Math.max(8,Math.ceil(m.actualBoundingBoxLeft+m.actualBoundingBoxRight)+8);canvas.height=Math.max(8,Math.ceil(m.actualBoundingBoxAscent+m.actualBoundingBoxDescent)+8);c.font=font;c.fillStyle='#fff';c.fillText(char,left,top);
  const paths=traceAlpha(c.getImageData(0,0,canvas.width,canvas.height).data,canvas.width,canvas.height,1);const d=paths.map(points=>points.map((p,i)=>`${i?'L':'M'}${(p.x+x).toFixed(2)} ${(p.y+y).toFixed(2)}`).join(' ')+'Z').join(' ');
  return {d,x,y,width:canvas.width,height:canvas.height};
 });
}
