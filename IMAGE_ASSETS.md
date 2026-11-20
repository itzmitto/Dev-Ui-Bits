# Image assets

## Flex Carousel

Ten original AI-generated PNG demo images are stored in `public/images/flex-carousel/`. They are intentionally separate from the original SVG gallery artwork used by older components. No React Bits or stock-site photos were copied. See `public/images/ASSET_CREDITS.md` for provenance and the rights limitations.

| architecture-01.png | 900×1200 | 608,930 |
| architecture-02.png | 900×1200 | 624,094 |
| nature-01.png | 900×1200 | 796,758 |
| nature-02.png | 900×1200 | 776,698 |
| futuristic-city-01.png | 900×1200 | 607,852 |
| futuristic-city-02.png | 900×1200 | 567,474 |
| landscape-01.png | 900×1200 | 506,497 |
| landscape-02.png | 900×1200 | 464,107 |
| abstract-01.png | 900×1200 | 521,023 |
| abstract-02.png | 900×1200 | 383,691 |

All ten files are 900×1200, portrait 3:4, with a combined size of 5,857,124 bytes (~5.86 MB decimal). They have genuine PNG signatures and tested IHDR dimensions. Quantization is an explicit storage optimization; minor color banding can occur in smooth gradients.

## Add or replace an image

1. Add a properly licensed PNG to `public/images/flex-carousel/`. Prefer 3:4 portrait images, around 900×1200, with known intrinsic dimensions and no watermarks.
2. Add `{src:'/images/flex-carousel/your-name.png',alt:'An accurate short description',title:'Optional caption'}` to `src/effects/flexImages.ts`.
3. Alternatively pass the component an `images` array. In Customize, use JSON with src/alt/title/href or a comma/newline-separated list of paths. Empty input resets to the local defaults. Only http(s) links are accepted for optional navigation.
4. When replacing an existing file, preserve its name/path or update the array. Keep source images out of src unless the accompanying export strategy is also updated.
5. Document source, permission, author and any required credits here. Test both the main preview and Playground.

The WebGL renderer requests only nearby image textures; it does not start all heavy catalogue previews. Images are cropped with cover semantics by the renderer. Width and Height control the card geometry; the source aspect ratio remains known. External images must allow CORS for WebGL texture upload. Broken media is reported visibly instead of silently marked loaded.

## Self-contained Code and Playground

`src/portableAssets.ts` resolves the known default PNG paths only when Code/Playground or Copy for AI requests portable source. It fetches cached/local PNG bytes, validates their signature, and replaces the image paths in the exported `flexImages.ts` with `data:image/png;base64,...`. Copy All Files, the existing component export, and Sandpack receive that same portable file map. No localhost URL, deployment domain or external CDN is embedded. Code displays the actual renderer and all helper files. The inline image module is large; use the ordinary public image paths for your own application when convenient. Custom image arrays are user-managed assets: copy those files alongside your project, or provide CORS-enabled URLs. They are not automatically downloaded/relicensed.

The main Vite app uses the local public PNG paths. Vite copies public assets unchanged to dist, and the existing Vercel SPA setup preserves these static file requests. No ZIP deliverable is made for this phase.

## Generation prompts

Shared prefix: Cinematic editorial image for a professional creative developer gallery. Soft directional golden side lighting, palette deep teal #163943, warm ivory #E8DDC9 and muted copper #B77A56, clean mid-distance composition, subtle film color grade, environmental background, no people. Portrait composition. No text, letters, brands, logos or watermarks.

- **architecture-01.png:** Sculptural concrete museum with sweeping curved stairs and a sunlit courtyard.
- **architecture-02.png:** Minimal modern house on a rocky coast, tall glass and limestone walls.
- **nature-01.png:** Ancient forest with mossy trunks and shafts of soft dawn light.
- **nature-02.png:** Fern canopy over a turquoise woodland stream with detailed foliage.
- **futuristic-city-01.png:** Original speculative coastal city of elegant curved towers and suspended gardens.
- **futuristic-city-02.png:** Futuristic elevated transit architecture over a misty harbor at dusk.
- **landscape-01.png:** Dramatic layered mountain ridges and a mirror lake in early morning.
- **landscape-02.png:** Desert dunes with sculptural ridgelines and distant weathered stone cliffs.
- **abstract-01.png:** Elegant sculptural folded satin ribbons, translucent teal glass and copper reflections, tactile studio still life.
- **abstract-02.png:** Macro composition of liquid metal folds and smooth frosted glass arcs, ivory and teal.
