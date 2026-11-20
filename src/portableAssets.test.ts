import {it,expect,vi} from 'vitest';
import {materializeAssets} from './portableAssets';
it('embeds validated local PNG bytes without origin-dependent URLs and caches requests',async()=>{
 const bytes=new Uint8Array([137,80,78,71,13,10,26,10]);const mock=vi.fn(async()=>new Response(bytes));vi.stubGlobal('fetch',mock);
 try{const files={'/effects/flexImages.ts':"export const images=['/images/flex-carousel/test-original.png'];"};const output=await materializeAssets(files);expect(output['/effects/flexImages.ts']).toContain('data:image/png;base64,iVBORw0KGgo=');expect(output['/effects/flexImages.ts']).not.toContain('/images/');await materializeAssets(files);expect(mock).toHaveBeenCalledTimes(1);expect(files['/effects/flexImages.ts']).toContain('/images/');}finally{vi.unstubAllGlobals();}
});
it('rejects HTML/error responses instead of embedding broken fake PNGs',async()=>{
 vi.stubGlobal('fetch',vi.fn(async()=>new Response('<html>missing</html>')));try{await expect(materializeAssets({'/effects/flexImages.ts':"'/images/flex-carousel/test-invalid.png'"})).rejects.toThrow('Invalid PNG');}finally{vi.unstubAllGlobals();}
});
