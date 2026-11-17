export function sizeCanvas(canvas:HTMLCanvasElement,width:number,height:number,dpr=Math.min(2,devicePixelRatio||1)){
 const w=Math.max(1,Math.round(width*dpr)),h=Math.max(1,Math.round(height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}return dpr;
}
export function rasterText(canvas:HTMLCanvasElement,text:string,width:number,height:number,size:number,weight:number,family:string,spacing=0,lineHeight=1){
 canvas.width=Math.max(1,Math.round(width));canvas.height=Math.max(1,Math.round(height));const ctx=canvas.getContext('2d',{willReadFrequently:true})!;
 const lines=text.split('\n'),characters=lines.map(line=>Array.from(line));ctx.font=`${weight} ${size}px ${family}`;
 const measure=(line:string)=>ctx.measureText(line).width+Math.max(0,Array.from(line).length-1)*spacing*size;
 const largest=Math.max(1,...lines.map(measure));size*=Math.min(1,Math.max(1,width-72)/largest,Math.max(1,height-80)/(size*lineHeight*lines.length));
 ctx.font=`${weight} ${size}px ${family}`;ctx.fillStyle='#fff';ctx.textBaseline='alphabetic';
 const widths=lines.map(measure),metrics=ctx.measureText('Hg'),total=(lines.length-1)*size*lineHeight+metrics.actualBoundingBoxAscent+metrics.actualBoundingBoxDescent;
 const top=(height-total)/2+metrics.actualBoundingBoxAscent;
 characters.forEach((chars,row)=>{let x=(width-widths[row])/2;for(const char of chars){ctx.fillText(char,x,top+row*size*lineHeight);x+=ctx.measureText(char).width+spacing*size;}});
 return {size,ctx};
}
