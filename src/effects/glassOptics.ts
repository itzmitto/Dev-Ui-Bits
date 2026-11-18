/** Independently generated rounded-lens normal map. No imported shaders or texture assets. */
export function lensNormal(x:number,y:number,width:number,height:number,radius:number,edge:number){
 const r=Math.min(radius,width/2,height/2),qx=Math.abs(x-width/2)-(width/2-r),qy=Math.abs(y-height/2)-(height/2-r),ax=Math.max(0,qx),ay=Math.max(0,qy),length=Math.hypot(ax,ay);
 const distance=length+Math.min(0,Math.max(qx,qy))-r,band=Math.max(2,Math.min(width,height)*edge),t=Math.max(0,Math.min(1,1+distance/band));
 // Rounded-box signed-distance gradient; smooth sine profile avoids a hard edge in the glass.
 let nx=length?ax/length:qx>qy?1:0,ny=length?ay/length:qy>=qx?1:0;nx*=Math.sign(x-width/2);ny*=Math.sign(y-height/2);const slope=Math.sin(t*Math.PI/2);
 return {x:nx*slope,y:ny*slope};
}
export function glassDisplacement(width:number,height:number,radius:number,edge:number){const c=document.createElement('canvas');c.width=128;c.height=128;const ctx=c.getContext('2d')!,im=ctx.createImageData(128,128);for(let y=0;y<128;y++)for(let x=0;x<128;x++){const n=lensNormal(x/127*width,y/127*height,width,height,radius,edge),i=(y*128+x)*4;im.data[i]=128+n.x*125;im.data[i+1]=128+n.y*125;im.data[i+2]=128;im.data[i+3]=255;}ctx.putImageData(im,0,0);return c.toDataURL();}
