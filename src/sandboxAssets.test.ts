import { it,expect } from 'vitest';
import { sandboxAssetFiles } from './sandboxAssets';
it('resolves the known font assets only inside isolated Sandpack drafts',()=>{
 const files={'/effects/textDisplay.css':"src:url('@fontsource/geist/files/geist-latin-900-normal.woff2'); src:url('./my-font.woff2')",'/App.tsx':'original source'};
 const draft=sandboxAssetFiles(files);expect(draft['/effects/textDisplay.css']).toContain('https://cdn.jsdelivr.net/npm/@fontsource/geist@5.3.0/files/geist-latin-900-normal.woff2');expect(draft['/effects/textDisplay.css']).toContain("url('./my-font.woff2')");expect(draft['/App.tsx']).toBe(files['/App.tsx']);expect(files['/effects/textDisplay.css']).not.toContain('https://');expect(sandboxAssetFiles(draft)).toEqual(draft);
});
it('leaves unrelated component files and custom asset URLs unchanged',()=>{
 const files={'/styles.css':"src:url('@fontsource/geist/files/geist-latin-900-normal.woff2')",'/Component.tsx':'custom'};expect(sandboxAssetFiles(files)).toBe(files);
});
