import type { FileMap } from './types';
/** Sandpack's CSS loader leaves package-relative font URLs unresolved.
 * Resolve only our known public font assets in the isolated draft. The Code tab
 * and Vite exports keep their original npm-relative, locally bundled assets.
 */
export function sandboxAssetFiles(files:FileMap):FileMap {
 const css=files['/effects/textDisplay.css'];
 if(!css)return files;
 return {...files,'/effects/textDisplay.css':css.replace(/@fontsource\/geist\/files\/(geist-latin-[1-9]00-normal\.woff2)/g,'https://cdn.jsdelivr.net/npm/@fontsource/geist@5.3.0/files/$1')};
}
