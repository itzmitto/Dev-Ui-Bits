## Fase 13 — uitbreiding in uitvoering (20 november 2026)

**246 items / 67 Ready / 179 Planned.** Batch 1: Circular Carousel, Depth Carousel, Bounce Cards en Drift Wall nieuw Ready; de eerdere 63 behouden. Eigen CSS-3D-layouts, springphysics en perspectivische drift, bestaande PNG’s en portable bronexports hergebruikt. Geen nieuwe dependencies/assets.

Validatie batch 1: strict TypeScript, productiebuild, 2 gerichte unit-tests en 6 browserchecks geslaagd. Deze controleren de vier nieuwe interacties/Customize/Code, één echt Sandpack-voorbeeld en 375/768/1440/2560px zonder overflow. Lokale screenshots bekeken; de te smalle Drift Wall-layout is gecorrigeerd voor de volgende batchbuild. Circular gebruikt vlakke CSS-3D-kaarten, geen gekromde mesh zoals de referentie.

Vervolg: batch 2 — Shape Waves, Aero Shards, Ghost Fibers, CRT Warp, Molten Metal. Daarna de zeven websitecomponenten uit batch 3. Geen Git-mutaties/publicaties uitgevoerd.

---

## Fase 12 — batch 1 afgerond: Flex Carousel + lokale PNG’s (19 november 2026)

**Actueel: 246 catalogusitems / 63 Ready / 183 Planned.** Start: 246 / 62 / 184. Uitsluitend de bestaande Flex Carousel-entry is van Planned naar Ready gegaan. Geen nieuwe catalogusrecords, routes, categorieën, dependencies of project-ZIP. Alle 62 eerdere Ready-componenten zijn behouden. Components: **56 totaal / 17 Ready / 39 Planned**; Backgrounds blijft **69 / 10 / 59**. De overige negen fase-12-componenten zijn niet ontwikkeld of van status veranderd.

### Opgeleverd

- `/components/flex-carousel`: oorspronkelijke WebGL-renderer met 32×8 meshsubdivisions per zichtbare kaart, S-vormige geometrievervorming door een onzichtbare lens, refractieve UV-verplaatsing en plaatselijke chromatische lichtsplitsing. Geen overgenomen upstream componentcode, shaders of demo-assets; geen blurmasker als vervanging voor vervorming.
- Naadloze virtuele slots, wrapping in beide richtingen (ook één afbeelding), echte pointer/touch drag, tijdafhankelijke momentumdemping, instelbare continue autoplay, hover-/focuspauze, pijltjestoetsen, klikfocus, Escape en vorige/volgende. Focus schaalt vloeiend en geeft naburige kaarten ruimte. Resize behoudt de relatieve positie. Instellingen werken via het bestaande schema; Liquid/Ribbon/Prism/Still zijn volledige eigen presets.
- Tien originele gegenereerde PNG’s in `public/images/flex-carousel/`, 900×1200, samen **5.857.124 bytes**. Werkelijke signatuur en IHDR-afmetingen getest. De contact sheet is bekeken. Zie `IMAGE_ASSETS.md` en `public/images/ASSET_CREDITS.md` voor prompts, alttekst, herkomst, optimalisatie en rechtenbeperkingen.
- Default image-array en JSON/pad-invoer; captions, altteksten en optionele veilige http(s)-links. Alleen zichtbare/nabije textures worden opgevraagd; onbekende/beschadigde/CORS-geblokkeerde media worden zichtbaar gemeld. WebGL-onbeschikbaarheid krijgt een gelabelde, vereenvoudigde scrollbare afbeeldingenrij.
- Bestaande Install/Usage/Code, Copy All Files, Copy for AI en Playground behouden. Voor portable broncode worden de tien default PNG’s op verzoek gevalideerd en in `flexImages.ts` ingebed. Sandpack compileert en laadt deze zonder localhost-/parent-origin-URLs. De hoofdpreview blijft gewone lokale public-paden gebruiken. Custom aangeleverde media blijft de verantwoordelijkheid van de gebruiker; die wordt niet stilzwijgend gedownload of hergelicentieerd.
- Het bronarchief is verplaatst van de registry naar dynamisch geladen `src/builtinFiles.ts`. De homepage laadt dit archief niet. Laatste productie-output: hoofdchunk **418,73 kB / 131,63 kB gzip**, bronarchief **362,82 kB / 113,55 kB gzip**, Editor **624,05 kB** apart. De eerdere circa 760 kB-hoofdchunkwaarschuwing is opgelost; de waarschuwingsgrens van 750 kB is niet verhoogd.

### Werkelijk uitgevoerd en geslaagd

- Strict TypeScript: `npm run typecheck`, laatste resultaat `artifacts/phase12/typecheck-final.log`.
- Vitest: **64 tests in 15 bestanden**, `npm test`, laatste resultaat `unit-final.log`.
- Productiebuild: `npm run build`, `build-final.log`; geen chunk-size-waarschuwing.
- Brede productie-regressie: **109 Playwright-tests geslaagd (6,1 min)**, `e2e-production.log`. Inclusief alle **246 catalogusroutes**, runtime/navigatie van alle **63 Ready-modules**, hun schema-controls en huidige instellingen in Code, homepage, categorieën, dark/light, IndexedDB, import/export, bestaande editorbewerking/compilerfouten/reset en de zes glasscomponenten.
- Na lazy-media/broncode-optimalisaties: **25 productiechecks geslaagd (1,0 min)**, `e2e-final.log`: 14 Flex-tests en 11 gedeelde Playground/copy/responsive-checks.
- Na de laatste shader-, contrast- en toegankelijkheidsverfijning: **15 Flex-productietests geslaagd (36,4 s)**, `e2e-polish.log`. Deze controleren echte GPU-rendering, beide dragrichtingen, momentum, autoplay/hover, custom media, kapotte media, presets, reset/restart, fullscreen, Code, echte Sandpack-compilatie met PNG’s, portable kopieeracties, hidden/reduced motion, contextverlies, native touchinput, directe route/refresh, lazy PNG-loading en **alle GPU-objecten vrij na SPA-unmount**. De drie aantallen overlappen; ze zijn niet opgeteld als unieke tests.
- Nieuwe Flex-viewports: **375×812, 768×1024, 1440×900, 1920×1080, 2560×1440, 3440×1440**, beide thema’s en geen horizontale overflow. Bestaande gedeelde interface daarnaast tot 3840×2160 getest.
- Bestaande Arc Cursor/Pigment Trail/runtime/config/brusher hashes uit `artifacts/phase10-resume-source.sha256` opnieuw gecontroleerd: **5× OK**, geen rendererwijzigingen daar.

### Referentie en visuele iteraties

De echte publieke Flex Carousel is met Chrome DevTools en Chromium/Playwright onderzocht bij 1440×1100: idle, langzame/snelle drags naar beide richtingen, klikken, Escape, autoplay en de zichtbare presets/props. Geen upstream broncode, shaders, assets of Copy for AI gebruikt. Onderzoek: `artifacts/phase12/reference-*.png`, `reference-visible.txt`, `research.mjs` en `observations.md`.

De lokale preview is meerdere keren bekeken, inclusief alle zes bovengenoemde formaten en Distortion 0 versus 1,3. Een echte gevonden shader-precisiemismatch veroorzaakte aanvankelijk de fallback; verholpen. Daarna de buigrichting omgedraaid naar de waargenomen richting, te sterke kleursplitsing gereduceerd, focus geïnterpoleerd, captionmutaties beperkt en witte previewachtergronden leesbaar gemaakt. De laatste screenshots zijn opnieuw geïnspecteerd. Een vroege dev-test werd beïnvloed door gelijktijdige HMR-wijzigingen; de definitieve runs gebruiken de stabiele productiebuild.

**Resterende visuele verschillen:** onze originele beelden en uniforme cover-kaarten verschillen van de gemengde natuurlijke beeldverhoudingen in de referentie. De eigen lens gebruikt een vast vloeiend S-profiel en bevat niet iedere upstream optie voor een roteerbare elliptische lens. Continue autoplay volgt de opdracht; de actuele publieke referentie gebruikt intervalstappen. Er is geen fysisch volledige raytracing/transmissie van een echte glazen lens. De screenshots delen een browserviewport, maar de bestaande DevUI-template heeft een andere previewmaat. Geen claim van pixel-perfect overeenkomst.

### Performance en beperkingen

`profile-flex-carousel.mjs` meet daadwerkelijke renderupdates na opwarming, niet fysieke monitor-FPS of GPU-tijd. Chromium met **ANGLE/Vulkan SwiftShader software-rendering** gaf na de laatste optimalisatie **60,1 updates/s bij 375px, 59,9 bij 1440px en 43,1 bij 2560px**. In alle drie: **0 doorlopende draws bij idle met autoplay uit, verborgen preview en reduced motion**, en geen pageerrors. Details: `performance.json` en `performance.log`. De eerdere shader gebruikte onnodig vijf texture-samples en zware multisampling: die redundante samples zijn conditioneel gemaakt en MSAA vervangen door zachte shader-randen. Het eerdere meetbestand `performance-before-shader-optimization.json` toont 59,7 / 40,7 / 23,6 updates/s. Dit zijn afzonderlijke korte tests, geen garantie dat alle winst alleen door één wijziging komt.

QHD op een software-GPU blijft onder 60 updates/s. Er is geen constant-60-FPS-claim of hardware-/energieprofiel. DPR is begrensd op 1,5; er is geen onbeperkte adaptieve opschaling. PNG’s zijn gepalettiseerd: zeer subtiele korrel/banding kan voorkomen. De standalone data-URL-module is groot; de gewone lokale public-paden zijn praktischer voor eigen productie-apps. De vereenvoudigde fallback behoudt niet alle optische/dragfunctionaliteit van WebGL.

### Exact vervolgpunt

**Fase 12 batch 2:** onderzoek eerst de echte publieke Circular Carousel-demo en bouw vervolgens Circular Carousel, Depth Carousel, Bounce Cards en Drift Wall afzonderlijk met de bestaande lokale PNG-set. Daarna batch 3: Shape Waves, Aero Shards, Ghost Fibers, CRT Warp, Molten Metal. **Alle negen blijven nu Planned.** De andere categorieën en eerdere Ready-renderers niet herschrijven. Geen Git-mutaties, pushes of deployments door deze uitvoering.

---

## Fase 11 — Backgrounds batch 1 afgerond (19 november 2026)

**Actueel: 246 catalogusitems / 62 Ready / 184 Planned.** Bij de start waren er daadwerkelijk 58 Ready en 188 Planned. Vier bestaande Planned-items zijn nu geïmplementeerd; geen nieuwe records, duplicaten, aliases of categorieën. Alle 58 eerdere Ready-componenten blijven behouden. Backgrounds bevat 69 items: de 64 namen uit de publieke officiële catalogus plus vijf bestaande eigen namen; **10 Ready / 59 Planned**. Andere categorieën zijn niet ontwikkeld of van status veranderd.

| Batch-1-item | Route | Resultaat | Zelfstandige techniek |
| --- | --- | --- | --- |
| Gradient ASCII | /backgrounds/gradient-ascii | Nieuw Ready | Canvas-lichtvelden, luminance/glyphmapping, herbruikbare rasterbuffer en gekleurde glyphatlas |
| Holo Mosaic | /backgrounds/holo-mosaic | Nieuw Ready | Eigen WebGL tile-SDF, normals, geëtste reflecties, interferentiekleuren en flipgolven |
| Flux Lines | /backgrounds/flux-lines | Nieuw Ready | Eigen WebGL impliciete contouren, domeinvervorming, numerieke gradiënten, magnetisme en klikvortices |
| Pattern Waves | /backgrounds/pattern-waves | Nieuw Ready | Canvas-hoogtevelden, afgeleide normals, verplaatste halftone-marks, contourlijnen en cursor-ripples |
| Micro Slats | /backgrounds/micro-slats | Bestaand Ready behouden | Bestaande Field-renderer en controls ongewijzigd |

### Referentieonderzoek en visuele iteraties

De publieke catalogus en de vier echte demo's zijn met Chromium/Playwright bezocht. Alleen Preview, zichtbare controls, keuzemenu's en openbare propertybeschrijvingen bekeken; geen upstream componentbroncode, shaders, interne assets, Copy for AI of BG Studio-export. De actuele catalogus telt 64 Backgrounds, overeenkomend met de reeds geregistreerde officiële lijst. Geen nieuwe dependencies of assets.

Gradient ASCII is bediend met echte horizontale/verticale/cirkel-/zigzagbewegingen, korte/snelle en langzamere stappen, cursorstilstand en klikken. De vier shapes zijn bekeken; character-/preset-/clickkeuzes, openbare defaults/ranges, Density/Glow/Speed via toetsenbord, Light Mode, intro, fullscreen en mobiel zijn onderzocht. De eerste promotiedialoog en een buitenbeeld vallend dropdownmenu verstoorden vroege captures; de dialoog is via de zichtbare Close-bediening gesloten en de openbare menus zijn met een hogere viewport opnieuw onderzocht. Vroege bedekte/lege captures zijn niet als visueel bewijs gebruikt.

Zie `artifacts/phase11/*public-description.txt`, `*public-controls.json`, `gradient-final-observations.json`, de referentiescreenshots en browseronderzoeksscripts. Voor Holo Mosaic, Flux Lines en Pattern Waves zijn ook echte cirkelbewegingen en klikken uitgevoerd en de openbare eigenschappen vastgelegd. Dat is geen claim dat elke mogelijke officiële preset/parametercombinatie volledig is geanalyseerd.

De lokale engines zijn in meerdere rondes daadwerkelijk bekeken. Gevonden en hersteld:

- Gradient ASCII had eerst een te grijze middenband en zwakke glyphcontrast. Het eigen kleurprofiel en de glyphkleuren zijn naar diepere blauwe schaduw en helderdere letters bijgesteld. Eclipse gebruikt een aspectgecorrigeerde schermruimteradius. De glyphatlas telt volledige codepunten en bevat echte gecachte blur voor Depth of Field, geen enkel extra shadow-effect als vervanging voor focusvervaging.
- Flux Lines gaf in de eerste visuele proef een wit vlak doordat straight-alpha shaderoutput via een premultiplied context werd samengesteld. De eigen context gebruikt nu `premultipliedAlpha:false`; aparte pixeltests bewaken nul alpha bij Opacity nul. De contourfrequentie en glow zijn daarna gericht bijgesteld.
- Holo Mosaic had te brede, felle bevelranden; die zijn smaller/subtieler gemaakt. Pattern Waves kreeg kleinere speculaire highlights. De lijnmodus gebruikt nu per-segment shading/fade, zodat fade en opacity daar eveneens de echte rendering beïnvloeden.
- Voor de laatste vergelijking zijn de echte lokale componenten ook in een **genegeerde meetharness van 754×598** vastgelegd, gelijk aan de publieke previewmaat: `calibrated-final.json` en `*-calibrated-final.png`. Dit is uitsluitend onderzoek, geen tweede productarchitectuur. De gewone productiepagina's en mobiele screenshots zijn eveneens bekeken. Gekalibreerde captures tonen native sampling; Medium kan onder belasting adaptief lager bemonsteren.

### Functionaliteit, broncode en lifecycle

Gradient ASCII heeft Horizon/Pinch/Rise/Eclipse; Letters/Binary/Symbols/Blocks/Custom; Wave/Burst/None; twee tot acht kleuren; alle gevraagde numerieke controls; intro, light mode, mouse interaction, pause en volledige eigen presets. De component accepteert `colors` als array of hexlijst. Het bestaande schema gebruikt een bewerkbaar hexlijstveld; ongeldige/onvoldoende kleuren vallen terug op defaults. De begrensde atlas ondersteunt maximaal 32 codepunten. Wash en glyphs samplen hetzelfde eigen scalaire lichtveld, geen los tekstlaagje boven CSS-gradients.

De overige drie hebben verschillende eigen algoritmen en relevante werkende schema’s/presets, geen generieke herkleurde particle-engine. Bestaande Preview/Code/Editor, viewportknoppen, Reset/Restart, fullscreen, Install/Usage/Code, copyfuncties en lazy Sandpack worden hergebruikt. Alle runtimehelpers, CSS, defaults en de eigen GLSL-bestanden zijn onderdeel van de daadwerkelijke bronexport en compileren in Sandpack. Geen fictieve installatiecommando's of extra codevarianten.

`backgroundGL.tsx` deelt alleen input/GPU-lifecycle/quality. Program, vertexbuffer en beide shaders worden opgeruimd bij unmount en contextverlies, en hersteld bij contextrestauratie. Onbeschikbaar WebGL krijgt een **zichtbaar gelabelde vereenvoudigde Canvas-preview**, die niet dezelfde optische kwaliteit claimt. Bestaande visibility-/ResizeObserver-/HiDPI-hooks worden gebruikt; pointercoördinaten en shadergeometrie blijven in CSS-pixels. Geen globale cursorlaag.

### Daadwerkelijke eindtests

- `npm run typecheck`: **geslaagd**, strict TypeScript; `artifacts/phase11/typecheck-paused-final.log`.
- `npm test`: **56/56 tests, 13 bestanden geslaagd**; `artifacts/phase11/unit-paused-final.log`. Lichtvelden, paletvalidatie, glyphmapping, onderscheiden clickvelden, aspectgeometrie, Pattern-hoogten/fades, registry en complete transitieve exports/presets.
- `npm run build`: **geslaagd**; `artifacts/phase11/build-paused-final.log`. Hoofdbundel **759,81 kB / 238,08 kB gzip**. De bestaande 750-kB-waarschuwing wordt nu gegeven en is niet onderdrukt of verhoogd. Renderers blijven lazy; de bestaande eager broncodeteksten voor documentatie vergroten de startbundel. Async bronloading is een vervolgpunt voor schaalbaarheid.
- Brede productie-regressie: **104/104 geslaagd, 5,8 minuten**; `artifacts/phase11/e2e-production.log`. Inclusief alle **246** catalogusroutes, filters/tellers, sidebar, homepage, themes, GitHub-link, oorspronkelijke Micro Slats, alle toenmalige 62 Ready-routes, bestaande clickcomponenten, IndexedDB, import/export, live editorbewerking/fouten/reset en gedeelde copy-/Code-/Playgroundflows.
- Aanvullend **1/1 geslaagd, 56,6 seconden**: alle **62 Ready-schema’s** met gewijzigde controls, actuele Usage, tabwissels en Reset; `artifacts/phase11/e2e-all-ready.log`.
- Na de laatste Gradient-polish, sampling en echte glyphblur: **29/29 definitieve batchtests geslaagd, 2,9 minuten**, op de productiebuild vóór de laatste Pause/Restart-randfix; `artifacts/phase11/e2e-complete.log`. Alle vier nieuwe Sandpack-voorbeelden compileren werkelijk. Shapes, markmodes, pointer/klik, alle relevante controls, presets, Reset/Restart, echte pixels/opacity, touch/DPR, fullscreen, refresh, contextverlies/herstel, fallback en unmount zijn gecontroleerd. Browserconsole/pageerrors worden in de relevante preview-/Sandpacktests verzameld; geen fouten.

**Laatste randfix:** Restart terwijl Paused actief is initialiseert Gradient ASCII en de GPU-effecten nu met een zichtbaar stilstaand beeld, in plaats van een blijvend lege intro. Deze aanvullende flow is voor alle vier nieuwe engines uitgevoerd: **1/1 geslaagd, 4,8 seconden**, `artifacts/phase11/e2e-paused-final.log`. Typecheck, alle 56 unit-tests en de build zijn daarna opnieuw geslaagd. De nieuwe batch heeft daarmee 30 gecontroleerde scenario’s, uitgevoerd als 29 batchchecks plus deze gerichte hertest.

De brede regressie dateert van vóór de laatste uitsluitend nieuwe-engine-verfijningen; de volledige nieuwe batch is daarna opnieuw getest. De 104- en 29-testselecties overlappen en worden niet als 133 unieke scenario's voorgesteld. Tussentijdse geslaagde 12-/26-/14-testcontroles blijven als extra logs bewaard, niet dubbelgeteld in de eindresultaten. De eerste Gradient-browsertest gebruikte een verkeerde fullscreenknopnaam en is onderbroken na die fout; de selector is naar de echte bestaande knopnaam gecorrigeerd vóór de geslaagde hertests.

Alle negen gevraagde viewportgroottes zijn daadwerkelijk getest: **375×812, 430×932, 768×1024, 1366×768, 1440×900, 1920×1080, 2560×1440, 3440×1440, 3840×2160**. Beide themes, bounds, fullscreen, correcte DPI en geen horizontale overflow. Extra native touchcontext op 375px/DPR 2. Alleen Chromium/Linux (Chrome 155.0.8059.39, Node 24.22.2), geen fysieke telefoon- of Safari/Firefox-validatie.

De checksums van Arc Cursor, Pigment Trail, hun paint-/brushhelpers en cursorconfig stemmen nog overeen met de eindverificatie van fase 10 (`artifacts/phase10-resume-source.sha256`). Geen implementaties uit andere categorieën aangepast; alleen verwachte catalogustellers in bestaande tests zijn bijgewerkt.

### Gemeten performance en grenzen

`scripts/profile-background-batch-one.mjs` is na de eindtests zonder parallelle browsertests uitgevoerd op de definitieve productiebuild. Vier seconden opwarmtijd; twee seconden meetinterval per geval. Bewijs: `artifacts/phase11/performance.log` / `performance.json`.

| Engine | Viewportbreedte | Draw-updates/s | Gem. JS-callback ms | GPU-sampling begin → einde |
| --- | ---: | ---: | ---: | ---: |
| gradient-ascii | 1440 | 60.2 | 3.25 | n.v.t. |
| holo-mosaic | 1440 | 59.4 | 0.18 | 0.820 → 0.672 |
| flux-lines | 1440 | 60.1 | 0.14 | 0.820 |
| pattern-waves | 1440 | 60.2 | 3.67 | n.v.t. |
| gradient-ascii | 375 | 59.9 | 1.13 | n.v.t. |
| holo-mosaic | 375 | 59.9 | 0.16 | 1.000 |
| flux-lines | 375 | 59.8 | 0.13 | 1.000 |
| pattern-waves | 375 | 59.9 | 1.45 | n.v.t. |

Alle acht gevallen: **0 nieuwe canvassen tijdens de steekproef, 0 verborgen-preview-draws en 0 doorlopende reduced-motion-draws; geen pageerrors**. Atlas/rasterbuffers worden hergebruikt. Pattern-markdichtheid is begrensd; pointergolven, klikvelden en glyphatlas zijn bounded. Dit zijn korte draw-update-/JS-callbackmetingen, adaptatie kan tijdens het meetvenster nog veranderen. Geen gegarandeerde scherm-FPS, GPU-tijdmeting of langdurige heapgarantie.

De GPU-backend is hier **ANGLE/SwiftShader (software)**. Een eerste Holo-steekproef kwam op 1440px uit op 26,8 updates/s; de herhaalde opgewarmde eindproef op 59,4. Tijdens dat meetvenster ging Holo van factor 0,820 naar 0,672; Flux bleef op desktop op 0,820. De begin- en eindfactor zijn direct rond de meetsteekproef vastgelegd. Deze verandering kan niet uitsluitend aan adaptatie worden toegeschreven: warm-up en software-GPU-belasting variëren eveneens. De oorspronkelijke baseline staat in `performance-before-adaptive.json` en `.log`. Warm-up, belasting en software-GPU variëren; geen hardwareclaim.

Medium verlaagt bij onvoldoende gemeten framecadans de GPU-sampling in begrensde stappen, minimaal 0,55; High blijft native tot de DPR-cap en Low gebruikt factor 0,72. Geen op-en-neer oscillerende resolutie. Een aparte **synthetische** vertraagde-draw-test bewijst dat Medium reageert en High native blijft; die kunstmatige belasting is niet gebruikt in bovenstaande benchmark. Lagere sampling kan fijne randen verzachten. De fallback is eenvoudiger dan de normale GPU-renderer.

### Eerlijke visuele beperkingen en vervolg

Gradient ASCII heeft een eigen licht-/kleurprofiel, drift en systeemmonospace in plaats van een meegeleverd referentiefont; de Eclipse-rand en glow zijn niet identiek. Holo heeft een andere interferentie-/studioverdeling en geen volledige fysieke spectrale optica. Flux gebruikt analytische impliciete contouren, geen volledige vloeistofsolver; topologie en timing verschillen. Pattern Waves heeft een eigen hoogteveld/markgeometrie, waardoor de positie van glints en vouwen afwijkt. Geen pixel-perfecte of officiële API-compatibiliteitsclaim.

README.md, ADDING-COMPONENTS.md en LICENSE_REVIEW.md zijn bijgewerkt. De actuele gratis upstreamlicentie beperkt herdistributie van de componenten zelf; daarom is geen upstream componentcode of shader opgenomen. Geen nieuwe dependency/font/texture/afbeelding. Geen juridische garantie.

**Exact vervolgpunt: batch 2, eerst Shape Waves, daarna Aero Shards, Ghost Fibers, CRT Warp en Molten Metal.** Alle 59 resterende officiële backgrounds blijven Planned; batches 2–13 zijn niet gestart. Volgende uitvoering: lees deze resultaten, onderzoek de eigen publieke demo en promoveer alleen werkelijk werkende items, zonder dubbele records. Geen nieuwe project-ZIP, Git-mutaties, commits, pushes, PR's of deployments door deze uitvoering.



De eigen tijdelijke testservers op 5175 en 4175 zijn na verificatie afgesloten.

---

## Fase 10 — Arc Cursor & Pigment Trail afgerond (19 november 2026)

**246 catalogusitems / 58 Ready / 188 Planned.** De twee bestaande registraties, routes en alle overige 56 Ready-componenten zijn behouden. Geen nieuwe componenten, dependencies, assets of statuswijzigingen. Bij deze hervatting zijn de verbeterde renderers bewust niet herschreven; alleen eindcontroles, genegeerde onderzoeksartefacten en dit verslag zijn bijgewerkt.

### Aangetroffen werk en onderbroken controles

De implementaties, helpers, CSS, registry, tests, screenshots, eerdere logs en read-only Git-status/diff zijn geïnspecteerd. Bij aanvang was de werkboom schoon. Voor de eindcontrole zijn eigen tijdelijke Vite-servers op 4175/5175 gestart. De vorige laatste gerichte testronde had slechts resultaten tot test 26 van 45 en geen eindresultaat. Die run is daarom niet als geslaagd meegeteld.

De eerdere volledige productie-regressie is wel aantoonbaar voltooid: **219/219 geslaagd, 14,6 minuten**, inclusief alle 246 catalogusroutes (`artifacts/phase10-full-production-e2e.log`). Dit resultaat dateert van vóór de laatste Pigment-verfijningen. Het wordt niet gepresenteerd als een volledige suite op de definitieve code. Omdat alleen de twee renderers en hun eigen helpers waren geraakt, is de getroffen testselectie opnieuw uitgevoerd plus een controle van alle 58 Ready-pagina's; de volledige suite is niet onnodig herhaald.

### Reeds aanwezige eigen rendererverbeteringen

- **Arc Cursor:** de oude losse hoekige segmenten en herhaalde zware shadows zijn vervangen door Catmull-Rom-padinterpolatie, dunne verweven filamenten, coherente ruimtelijke oscillatoren, taper, afzonderlijke bloom/heldere kern, onregelmatige korte vorken en begrensde vertakte klikontladingen. Auto/Glow/Ink, charge, natuurlijk terugtrekken, autoplay en idle delay zijn aangesloten. De bestaande propnamen blijven bruikbaar.
- **Pigment Trail:** de oude gladde polygon/ribbon met een enkel recht kleurverloop is vervangen door een eigen procedurele brushatlas met lokale ink-mixen, pigmentrand, bristlevariatie, papierkorrel, velocity-pressure, wet fringe en landende/uitbloeiende splashdruppels. Watercolor en Gouache hebben verschillende dekking/compositing. De dubbele snelheidsversmalling is verwijderd.
- **Laatste Pigment-verfijningen:** Watercolor gebruikt `darken` in plaats van herhaald vermenigvuldigen van overlappende afdrukken tot bijna zwart. De wet fringe groeit onafhankelijk van de kern. Midpoint-kwadratische curves met doorlopende raaklijnen en meegenomen afstandsresidu verbinden ook spaarzame pointer-/touchsamples zonder polygonale knikken.
- De lokale inputhelper gebruikt de bestaande HiDPI-/visibility-hooks, CSS-geschaalde pointercoördinaten, touch capture en de werkelijke achtergrondkleur inclusief transparante ancestors. Een cleanup-veilige wall-clock timeout wekt autoplay na idle; er is geen lege RAF-lus om die vertraging af te wachten. De eerdere echte autoplay-wakebug is al hersteld.
- Alleen deze twee effecten gebruiken de nieuwe paint-helper. Gedeelde Customize-/Code-/Editor-/websitecode en andere renderers zijn bij deze afronding niet aangepast. De echte broncode en transitieve helpers blijven beschikbaar in Code en het geïsoleerde Sandpack.

### Definitieve hercontrole op 19 november

- `npm run typecheck`: **geslaagd**, strict TypeScript; `artifacts/phase10-resume-typecheck.log`.
- `npm test`: **49/49 tests, 12/12 bestanden geslaagd**; `artifacts/phase10-resume-unit.log`. Onder meer registry-aantallen, behoud van routes, brush-curvetangenten, kleurcyclus, coherent noise, pressure, frame-onafhankelijk volgen, lifetime en volledige standalone bronexports.
- `npm run build`: **geslaagd**; `artifacts/phase10-resume-build.log`. Hoofdbundel 719,37 kB minified / 224,24 kB gzip; geen nieuwe dependency of aangepaste waarschuwingslimiet.
- Productie-Playwright: **45/45 geslaagd, 3,6 minuten**; `artifacts/phase10-resume-affected-e2e.log`. Uitgevoerd met de bestaande `npm run test:e2e`-configuratie en selectie `tests/cursor-rebuild.spec.ts tests/cursor-trails.spec.ts tests/playground.spec.ts`.
- Aanvullend: **1/1 geslaagd, 43,2 seconden**, `tests/glass-components.spec.ts -g 'all Ready'`; `artifacts/phase10-resume-all-ready-e2e.log`. Alle **58 Ready-pagina's** geladen, schema-controls gewijzigd, actuele waarden in Usage gecontroleerd, Preview/Code gewisseld en Reset uitgevoerd. Geen browsererrors. Dit is een gerichte regressiecontrole, geen nieuwe volledige functionele suite voor elk van de overige effecten.

Daarmee zijn bij deze hervatting **46 browsertests daadwerkelijk geslaagd**; eerdere tests zijn daarin niet dubbel geteld. De 45-testselectie bevat alle 13 nieuwe rebuild-tests, alle 21 bestaande cursorchecks en 11 gedeelde Playground-checks. Beide vernieuwde voorbeelden compileren daadwerkelijk in Sandpack-iframes; ook de overige vijf cursorvoorbeelden compileren. Code toont de echte nieuwe bestanden. Copy-acties, behouden instellingen bij tabwissels, presets, reset/restart, colorvalidatie, fullscreen en diepe route-refresh slagen.

Specifiek gecontroleerd: Arc Glow/Ink/Auto, klikontlading aan/uit, intensity nul, terugtrekken tot nul canvaspixels, vertraagd hervatten van autoplay en pause. Pigment Watercolor/Gouache/Auto, kleurbehoud bij overlappende afdrukken, echte wet-edge-uitbreiding, bleed, overige numerieke controls, splash aan/uit en fade naar nul pixels. Touch/DPR, CSS-scale-mapping en release van eigen theme-observers, idle timers, ResizeObserver/IntersectionObserver en RAF bij unmount slagen. Browserconsole/pageerrors worden in de relevante tests verzameld; geen fouten in de geslaagde eindruns.

Browser: **Google Chrome 155.0.8059.39, Linux, Playwright headless**; Node 24.22.2. Rebuild-viewports: 375×812, 768×1024, 1440×900, 1920×1080 en 2560×1440. De behouden cursorregressie omvat bovendien 430×932 en 3440×1440; de gedeelde Code/Customize-tests omvatten ook 1024×768 en 3840×2160. Beide themes, geen horizontale overflow, bruikbare controls en bounds gecontroleerd. Dit zijn browseremulaties, geen fysieke telefoonmetingen.

### Visuele eindcontrole

De reeds op 18 november met echte muisbediening gemaakte publieke referentiebeelden en analyse zijn behouden (`artifacts/phase10/ANALYSIS.md`). Die eerdere sessie onderzocht autoplay/idle, langzame/snelle horizontale bewegingen, cirkel, zigzag, korte bewegingen, klikken, stoppen, leave/re-enter, pause, modes en lichte/donkere achtergronden. Geen Pro-code, Code-tab, netwerkpayloads of beschermde assets zijn gebruikt.

Bij deze hervatting zijn **acht nieuwe opnames** gemaakt met echte `page.mouse.move`-interactie: beide huidige renderers, wit/donker, cirkel/zigzag, viewport 1440×1200 en preview 1094×560 gelijk aan de bestaande referentieopnames. Zie `artifacts/phase10/resume-visual.json`, `resume-visual.mjs` en `ArcCursor-resume-*.png` / `PigmentTrail-resume-*.png`. De beelden zijn daadwerkelijk bekeken. De laatste brushcurves zijn aaneengesloten zonder gaten; de oude diagonale lijn in de meetopname is weg doordat het testpad direct buiten de preview begint in plaats van via geïnterpoleerde instapbewegingen. Arc toont dunne gekleurde Ink-filamenten en een heldere kern met lokale glow op donker. Pigment behoudt verzadigde kleuren op wit en is zichtbaar als Gouache op donker. Geen nieuwe rendererfout aangetroffen die een verdere codewijziging vereist.

**Resterende zichtbare verschillen:** Pigment heeft een korreliger, minder egaal binnenvlak en een minder uitgesproken doorlopende natte buitenrand dan de referentie; kleurmengprofiel, druppels en leeftijdstaper verschillen. Arc heeft eigen filamentfasen, vorkverdeling en glowprofiel. De nieuwe captures vergelijken kenmerken met de eerder opgenomen referentie, niet exact dezelfde framefase; screenshot-/muislatentie en procedurele beweging verschillen. Geen claim van pixel-perfecte of 100% overeenkomst. Alleen Chromium is gevalideerd; geen exacte vloeistof-/papier-/elektriciteitssimulatie.

### Definitieve geïsoleerde performancemeting

`scripts/profile-cursor-rebuild.mjs` is na alle browsertests opnieuw uitgevoerd op de definitieve productiebuild, zonder parallelle browsertests. Acht meetgevallen: beide effecten op 1440px/375px met witte en donkere achtergrond. Bewijs: `artifacts/phase10-resume-performance.log` en `artifacts/phase10-performance.json`.

| Effect | Breedte | Automatisch gekozen modus | Draw-updates/s |
| --- | --- | --- | --- |
| arc-cursor | 1440 px | glow | 60 |
| arc-cursor | 1440 px | ink | 59.9 |
| pigment-trail | 1440 px | gouache | 59.9 |
| pigment-trail | 1440 px | watercolor | 59.9 |
| arc-cursor | 375 px | glow | 59.9 |
| arc-cursor | 375 px | ink | 59.9 |
| pigment-trail | 375 px | gouache | 59.9 |
| pigment-trail | 375 px | watercolor | 59.9 |

In alle acht gevallen: **0 nieuwe canvassen tijdens het meetinterval, 0 verborgen-tab-draws, 0 doorlopende reduced-motion-draws en 0 idle-draws na uitschakelen van autoplay en verstrijken van de levensduur**. Geen pageerrors. Dit zijn korte draw-/RAF-steekproeven bij standaardinstellingen op deze Chromium-omgeving, geen gegarandeerde scherm-FPS, GPU-/heapbenchmark of hardware-onafhankelijke 60-FPS-belofte. Renderstate blijft begrensd: Arc 160 knots/8 discharges; Pigment 1800 afdrukken/200 druppels, één herbruikbare brushatlas en papiertexture. Extreme settings kunnen zwaarder zijn.

LICENSE_REVIEW.md is ongewijzigd: geen nieuwe externe bron, dependency, asset of licentie-informatie. De bestaande herkomst-/licentiebeperkingen blijven gelden. De eigen tijdelijke servers op 4175/5175 zijn na verificatie afgesloten. Deze uitvoering heeft uitsluitend lokaal gewerkt, geen Git-mutaties, commits, pushes, PR's, ZIP of deployments uitgevoerd.

---

## Fase 9 — gedeeld Playground en zes Components (18 november 2026)

**Actueel: 246 catalogusitems, 58 Ready, 188 Planned.** Alle oorspronkelijke 52 Ready-componenten, routes/aliases, homepage, sidebar, themes, Sandpack, IndexedDB, import/export en Vercel-configuratie zijn behouden. Alleen de zes gevraagde Components zijn uit Planned gepromoveerd; overige 188 geplande items zijn ongewijzigd.

| Nieuw Ready | Route | Eigen techniek |
| --- | --- | --- |
| Glass Surface | /components/glass-surface | Eigen lens-normalmap, SVG-backdropdisplacement, getypeerde GlassPane met React children |
| Fluid Glass | /components/fluid-glass | WebGL SDF-raymarching, drie morfende volumes, optische dikte, dispersie, reflecties; Canvas-fallback |
| Reflective Card | /components/reflective-card | Procedurele studio-sampling, brushed metal, pointerlicht/tilt, optionele eigen videoreflectie |
| Accordion Gallery | /components/accordion-gallery | Flex-expansie, eigen SVG-art, parallax, captions en roving keyboard focus |
| Glass Icons | /components/glass-icons | Eigen vectoren, optische glasplaten, refractie/bevel, hover, callbacks en detailacties |
| Chroma Grid | /components/chroma-grid | Gedempte pointer, echte grayscale/kleurmaskers, frames en toegankelijke artworkdialogen |

### Gedeelde interface

- Eén compact Customize-systeem, drie/twee/één kolommen, met labels links, waarden rechts, native sliders, angle/numeric controls, toggles, dropdowns, presets en gevalideerde bewerkbare hexvelden. Verouderde, conflicterende controlregels zijn uit styles.css verwijderd.
- Code is standaard een lichte documentatieviewer: Install / Usage / Code, echte bestanden, syntaxkleuren, regelnummers, bestandskeuze, uitklappen en bronexport. Alleen beschikbare varianten. Geen fictief package-/shadcn-registrycommando.
- Copy Install / Usage / Code / All Files / for AI kopiëren daadwerkelijke eigen informatie en actuele instellingen, met feedback en clipboardfallback.
- Edit in Playground opent lazy de behouden Sandpack-editor. De bestaande Editor-tab, meerdere bestanden, live fouten, Reset, Copy, import/export en eigen componenten blijven beschikbaar. Geen Sandpack-start voor alleen Code lezen.
- De echte preview blijft gemount bij tabwissels, inclusief de interactieve state. Eigen animatieklokken stoppen voor verborgen/offscreen previews. Restart remount expliciet; Reset herstelt de echte defaults. Fullscreen heeft een bereikbare eigen Close-knop en Escape.

### Daadwerkelijke validatie

- `npm run typecheck`: geslaagd, strict TypeScript.
- `npm test`: **42/42 tests, 11/11 bestanden geslaagd**. Inclusief eigen lensnormalen, unieke records, volledige presets, echte bronbestanden, transitieve imports en documentatie-/clipboardteksten.
- `npm run build`: geslaagd. De hoofdbundel ging van circa 753 naar 705 kB door ongebruikte metadata-bronstrings uit de eager raw-sourceglob te halen (gzip circa 234 → 219 kB). De eerdere chunkwaarschuwing is weg; het bestaande waarschuwingslimiet is niet verhoogd. Renderers en de zware Sandpack-editor blijven lazy chunks. De eigen bronbestanden zijn nog eager voor directe documentatie/copy; bij verdere groei is async bronloading een logisch optimalisatiepunt.
- **Volledige productie-Playwright: 206/206 geslaagd, 13,1 minuten.** Bewijs: artifacts/phase9-production-final-e2e.log. Alle 246 sidebar-/detailroutes zijn daadwerkelijk geopend. Alle 58 Ready-schema’s zijn met gewijzigde waarden, Usage, tabwissels en Reset doorlopen. Alle zes nieuwe voorbeelden compileren in echte Sandpack-iframes.
- Clipboardinhoud, actuele props, geen vroege Sandpack-request, behouden preview-element, Code/Editor, light/dark, persistent thema, direct openen/refresh, native en custom previews, IndexedDB, JSON-import/export en componentbronexport worden echt getest.
- Viewports van 375/430/768/1024/1440/1920/2560/3440/3840 px; beide themes; geen horizontale pagina-overflow. Bestaande suites omvatten bovendien 1280/1366 px. Screenshots zijn daadwerkelijk bekeken, met meerdere herstelrondes voor control-wrapping, mobiele labeluitlijning, fullscreen-close, Chroma Grid-hoogte en Code-actie-uitlijning.
- Native observers/RAF worden op SPA-unmount geteld. Fluid Glass wordt ook op concrete GPU-allocaties getest: 2 shaders, 1 program, 1 buffer, 1 texture; na unmount alles nul. Contextverlies/herstel en de eerlijk gelabelde Canvas-fallback werken. Videoreflectie is met een lokaal gegenereerde echte WebM getest op pause/resume, reduced motion, offscreen en broncleanup.
- De eerste brede run was **198 geslaagd / 6 gefaald**. De fouten waren oude offscreen-scrollaannames door de compacte controls, een onjuiste startpagina voor de nieuwe registrytest en een screenshotvergelijking. Die zijn onderzocht en gericht hersteld vóór de geslaagde volledige hertest. Glow Cursor had na afloop aantoonbaar nul canvaspixels; alleen twee pixels in de omringende screenshot verschilden door compositing. De test vergelijkt nu de echte canvasinhoud. Er is geen werkend effect herschreven om een test te laten slagen.

**Laatste afwerking geverifieerd:** na het groeperen van de Code-acties en verfijnen van Glass Icons’ mobiele gap/Lift-parallax zijn typecheck, alle 42 unit-tests en de productiebuild opnieuw geslaagd. Daarna zijn **32/32 getroffen productie-Playwright-tests opnieuw geslaagd, 1,9 minuut**, inclusief de expliciete nieuwe gap-/parallaxcheck, alle zes Sandpack-compilaties, alle 58 instellingenflows en de negen viewportgroottes. Bewijs: artifacts/phase9-finishing-e2e.log. test-results/.last-run.json bevat passed en geen failedTests.

### Gemeten rendergedrag

`scripts/profile-glass-components.mjs` is daadwerkelijk uitgevoerd op de definitieve productiebuild, na de browsertests. Fluid Glass en Reflective Card kwamen op 1440px en 375px uit op circa **59,8–60 draw-updates per seconde**, met **nul nieuwe canvasallocaties tijdens de meetintervallen**, **nul verborgen-preview-draws** en **nul doorlopende reduced-motion-draws**. De glasraymarcher slaat pixels buiten de objectbounds vroeg over. Bewijs: artifacts/phase9-performance.log en artifacts/phase9-performance.json. Dit is een meting in deze headless Chromium-omgeving met de standaardinstellingen, geen gegarandeerde FPS op andere hardware.

### Herkomst, grenzen en vervolg

Geen nieuwe dependencies, fonts, foto’s, textures of video-assets. Illustraties, vectoren, normaalmap, studio en shader zijn eigen implementaties. Alleen publieke gerenderde demo’s/propertybeschrijvingen en de twee screenshots zijn als visuele/functionele referentie gebruikt. Geen upstream componentcode, shaders, registrybestanden of Copy for AI-output overgenomen. Zie LICENSE_REVIEW.md.

Alleen Chromium is hier getest. SVG-backdropfilters verschillen per browser; Frosted is een expliciete alternatieve weergave. De SDF-lens en studio zijn realtime optische benaderingen; geen exacte fysische simulatie of identieke officiële API. Fluid Glass biedt eigen tekst-/illustratiescènes, geen algemene DOM-/video-/webcamrenderer. Galleryvoorbeelden gebruiken eigen illustraties in plaats van referentiefoto’s. De fallback heeft vereenvoudigde optica en meldt dat zichtbaar. Er wordt geen pixel-perfecte gelijkheid, universele browserondersteuning of hardware-onafhankelijke FPS geclaimd.

Vervolg: kies per afzonderlijke opdracht een item uit de resterende **188 Planned**-componenten. Maak geen duplicaten; koppel renderer, schema, helpers en tests aan hetzelfde record. De resterende Text Animations en Animations zijn in deze fase niet ontwikkeld.

Geen Git-mutaties, GitHub-acties of deployments door deze agent. Geen project-ZIP gemaakt.

---

## Fase 8 afgerond — zeven originele Cursor Trails (18 november 2026)

**Actueel: 246 catalogusitems, 52 Ready, 194 Planned.** Alle 45 bestaande Ready-componenten, bestaande routes, homepage, themes, controls, Sandpack en IndexedDB zijn behouden. Alleen de zeven gevraagde nieuwe cursor-effecten en hun categorie zijn toegevoegd; overige geplande effecten zijn ongewijzigd.

| Component | Route | Status |
| --- | --- | --- |
| Arc Cursor | /cursor-trails/arc-cursor | Ready |
| Celebration Cursor | /cursor-trails/celebration-cursor | Ready |
| Chroma Halo | /cursor-trails/chroma-halo | Ready |
| Dither Cursor | /cursor-trails/dither-cursor | Ready |
| Glyph Stream | /cursor-trails/glyph-stream | Ready |
| Pigment Trail | /cursor-trails/pigment-trail | Ready |
| Stardust Cursor | /cursor-trails/stardust-cursor | Ready |

### Daadwerkelijk uitgevoerde eindverificatie

- `npm run typecheck`: geslaagd, strict TypeScript.
- `npm test`: **36/36 tests, 9/9 bestanden geslaagd**.
- `npm run build`: geslaagd; Vite-productiebundel in dist.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4175 npm run test:e2e`: **175/175 geslaagd, 10,8 minuten**. Volledige behouden regressies plus 21 cursorchecks. Alle 246 sidebar-/detailroutes zijn daadwerkelijk geopend; diepe routes en refresh gecontroleerd. Bewijs: artifacts/phase8-production-e2e.log en artifacts/phase8-full-last-run.json.
- Na die volledige run zijn alleen de laatste categorie-teksten, de scoped hintafstand en twee alpha-grensgevallen afgewerkt. De bron is opnieuw getypecheckt, met alle 36 unit-tests gecontroleerd en gebouwd. Daarna **23/23 getroffen productie-browsertests opnieuw geslaagd, 1,9 minuut**: alle 21 cursorchecks plus twee homepage/themeflows. Bewijs: artifacts/phase8-finishing-e2e.log; test-results/.last-run.json bevat passed en geen failedTests.
- De laatste checks bevatten alle zeven echte Sandpack-compilaties, live codebewerking zonder de originele bron te wijzigen, minimale standalone props/autoplay, Reset Code, presets, pointer/klik, Pause, Reset/Restart, opacity/intensity/kleur, dither-radius/decay en geschaalde coördinaten. Confetti moet na zijn levensduur ook aantoonbaar nul canvaspixels achterlaten.
- Alle zeven previews getest op 375×812, 430×932, 768×1024, 1440×900, 1920×1080, 2560×1440 en 3440×1440, beide themes en zonder horizontale overflow. Touch/DPR, viewportknoppen, fullscreen en Escape gecontroleerd. Console.error en pageerror worden in de cursor-preview-/Sandpack- en responsivechecks verzameld; de eindcontroles zijn foutloos.
- Alle zeven effecten getest op offscreen suspension, reduced motion en observer-/RAF-cleanup bij SPA-unmount. Bestaande regressies testen daarnaast IndexedDB, import/export, favorieten, oude text-/animation-engines en editorfuncties.

### Visuele verbetering en performance

Publieke referenties en eigen desktop-/mobiele previews zijn meerdere keren bekeken. Verbeterd: de ongewenste startlijn vanaf de canvasrand, de aanvankelijk hoekige kwastribbon, grove stofdeeltjes, ontbrekende categorie-icoonkoppeling, Arc-intensity op branches, negatieve confetti-alpha aan het einde en maximale highlight-alpha. De hint staat in smalle containers nu hoger dan de bestaande previewlabels; de eindbeelden en geometrische regressiecheck bevestigen dat de overlap weg is. Verouderde teksten noemen het aantal categorieën nu dynamisch.

Chroma Halo begon rond 25 draw-updates/s op desktop door full-canvas blur. Caching van organische sprites bracht het in de herhaalde productieproef naar circa 60 updates/s. Alle zeven effecten kwamen op 1440px en 375px uit op ongeveer **59–60 updates/s**, met **nul nieuwe canvasallocaties tijdens de meetintervallen**, **nul verborgen-tab-draws** en **nul doorlopende reduced-motion-draws**. Zie scripts/profile-cursor-trails.mjs, artifacts/phase8-performance.json en artifacts/phase8-performance-final.log. Dit meet deze headless Chromium-omgeving en standaardinstellingen, geen gegarandeerde FPS op andere hardware.

Broncode is per effect lazy geladen. De catalogus start nog steeds maximaal één expliciet gevraagde preview. Bounded pools: Arc maximaal 150 trailpunten/8 pulses, confetti 1000 papers, halo 26/45/70 blooms, glyphs 800 tiles, pigment 650 punten/180 druppels en stof 1100/2500/4500 deeltjes. Dither past zijn celgrootte aan rond maximaal 50.000 cellen. Canvas-DPR is maximaal 2, lager bij quality low/medium. Nieuwe npm-dependencies: geen.

### Gemeten rendergedrag

`scripts/profile-glass-components.mjs` is daadwerkelijk uitgevoerd op de definitieve productiebuild, na de browsertests. Fluid Glass en Reflective Card kwamen op 1440px en 375px uit op circa **59,8–60 draw-updates per seconde**, met **nul nieuwe canvasallocaties tijdens de meetintervallen**, **nul verborgen-preview-draws** en **nul doorlopende reduced-motion-draws**. De glasraymarcher slaat pixels buiten de objectbounds vroeg over. Bewijs: artifacts/phase9-performance.log en artifacts/phase9-performance.json. Dit is een meting in deze headless Chromium-omgeving met de standaardinstellingen, geen gegarandeerde FPS op andere hardware.

### Herkomst, grenzen en vervolgpunt

Alle zeven renderers zijn eigen Canvas 2D-implementaties met algemeen bekende technieken. Geen Pro-componentcode, Copy for AI, shaders, registrybestanden, logo’s of externe assets overgenomen. De publiek leesbare Pro-licentie en onzekerheden staan in LICENSE_REVIEW.md. Halo, glyphs, inkt en stof gebruiken analytische beweging, geen volledige vloeistofsolver. Vorm/timing kunnen afwijken van de referentie; er is geen claim van exacte reproductie. Alleen Chromium is getest; geen langdurige heap- of algemene browser-/hardwaregarantie. Sandpacks bundler blijft zoals voorheen internet nodig hebben.

README.md, ADDING-COMPONENTS.md en LICENSE_REVIEW.md zijn bijgewerkt. Geen onafgeronde onderdelen binnen deze zeven cursorcomponenten. De overige 194 items blijven Planned; verdere ontwikkeling daarvan vergt een volgende opdracht. Alleen eigen testservers zijn na verificatie afgesloten. Door deze uitvoering zijn geen Git-mutaties, GitHub-pushes, deployments of source-ZIP uitgevoerd. Tijdens read-only Gitinspectie waren externe HEAD-wijzigingen zichtbaar; die zijn niet door deze uitvoering gemaakt of teruggedraaid.

## Fase 8 — uitvoeringslog vóór de definitieve eindcontrole (18 november 2026)

Actuele registry: **246 items, 52 Ready, 194 Planned**. Cursor Trails bevat zeven nieuwe records; de 45 eerdere Ready-items en alle bestaande Planned-records zijn behouden. Geen andere geplande Text Animations of Animations gebouwd.

- Batch 1: Arc Cursor en Celebration Cursor; strict TypeScript, build, 34 unit-tests en drie gerichte browserchecks geslaagd.
- Batch 2: Chroma Halo, Dither Cursor en Glyph Stream; strict TypeScript, build, 34 unit-tests en zes gerichte browserchecks inclusief vijf Sandpack-voorbeelden geslaagd.
- Batch 3: Pigment Trail en Stardust Cursor; strict TypeScript, build, 34 unit-tests en acht gerichte browserchecks inclusief alle zeven Sandpack-voorbeelden geslaagd. De kwast is daarna verfijnd van losse hoekige segmenten tot een doorlopende, afgeronde ribbon; stofdeeltjes zijn fijner gemaakt.
- Uitgebreide browserproef: 18 van 19 checks slaagden, inclusief alle zeven schermbreedtes, touch/fullscreen, offscreen, reduced motion en observer-/RAF-cleanup. Eén fout bleek een meetrace na Restart in de schaaltest; die wacht nu aantoonbaar op de nieuwe preview.
- Aanvullende pixelcontrole vond een echte fout: Arc intensity beïnvloedde de branches nog niet. Ook de branches en ontladingen zijn nu gekoppeld. De gerichte dither-/kleur-/intensity- en geïsoleerde codebewerkingstests slagen daarna alle drie.
- Laatste strict typecheck, productiebuild en **36/36 Vitest** geslaagd. De volledige productie-regressie en gerichte eindcontrole zijn inmiddels geslaagd; zie de definitieve resultaten hierboven.
- Visuele controle: publieke demo's en eigen previews/schermopnames bekeken; alleen gerenderd gedrag onderzocht. De effecten zijn eigen ontwerpen en kunnen qua vorm en timing afwijken. Geen Pro-broncode, shaders, registrydata of assets gebruikt.
- Performance: eerste desktopproef vond Chroma Halo op circa 25 updates/s. Full-canvas blur vervangen door gecachete organische sprites; sterrenstofkleuren eveneens gecachet. Daarna alle zeven effecten op 1440px en 375px circa 59–60 updates/s, nul extra canvasallocaties tijdens de steekproef en nul doorlopende verborgen/reduced-motion-draws. Zie artifacts/phase8-performance.json en het reproduceerbare profielscript. Geen universele hardware-/browsergarantie.
- Standalone defaults gecontroleerd: ook bij slechts enkele meegegeven props hebben de exports werkende autoplay/defaultwaarden. De normale websitevoorbeelden gebruiken volledige registry-defaults.
- Geen nieuwe dependencies. README, ADDING-COMPONENTS en LICENSE_REVIEW beschrijven technieken, exports, beperkingen en Pro-licentieafbakening.
- Deze uitvoering voert geen Git-mutaties, publicatie, deployment of source-ZIP uit. Read-only Gitinspectie liet tussentijdse externe HEAD-wijzigingen zien; deze zijn niet teruggedraaid en niet door deze uitvoering aangemaakt.

Dit tussenverslag is afgerond door de definitieve eindcontrole hierboven. Alle zeven cursorcomponenten zijn gereed; de overige 194 items blijven Planned.

### Fase 8 — batch 2 gecontroleerd

- Chroma Halo, Dither Cursor en Glyph Stream toegevoegd met eigen engines: vervormde advecterende blooms, een vervallend scalair veld met Bayer-dithering, en elastische glyph-tiles met momentum en scramble.
- 246 items, 50 Ready, 196 Planned. Pigment Trail en Stardust Cursor nog Planned.
- Daadwerkelijk geslaagd: strict TypeScript, productiebuild, 34 Vitest-tests en zes gerichte Playwright-tests inclusief alle vijf echte Sandpack-previews. Autoplay- en pointer-screenshots bekeken. Geen Pro-broncode of externe assets gebruikt.
- Vervolgpunt: batch 3, daarna brede responsive-, lifecycle-, performance- en regressietests.

## Fase 8 — Cursor Trails (18 november 2026), batch 1 gecontroleerd

- Nieuwe categorie Cursor Trails: zeven unieke routes, waarvan Arc Cursor en Celebration Cursor functioneel aangesloten zijn; de andere vijf blijven Planned tot hun eigen batch slaagt.
- Actueel: 246 catalogusitems, 47 Ready, 199 Planned. Alle 45 eerdere Ready-componenten behouden.
- Eigen Canvas 2D-engines: coherente elektrische polylijnen/vertakkingen/klikontlading; confetti met zwaartekracht, drag, flutter, wind en rotatie.
- Batch 1 daadwerkelijk geslaagd: strict TypeScript, productiebuild, 34 Vitest-tests en 3 gerichte Playwright-tests inclusief beide echte Sandpack-voorbeelden, presets, pause, reset, restart, pointer en klik.
- Browsercontrole vond een ontbrekende categorie-icoonkoppeling in de detailpagina; hersteld en opnieuw getest. Publieke Pro-demo's alleen visueel bekeken, geen implementatiecode of assets overgenomen. Eigen vorm/timing kan afwijken.
- Vervolgpunt: batch 2 — Chroma Halo, Dither Cursor, Glyph Stream. Daarna batch 3 en volledige regressiecontrole.
- Geen Git-mutaties, publicatie of ZIP uitgevoerd door deze uitvoering.

# DevUI Bits — voortgang

Bijgewerkt: 18 november 2026. Versie 1.1.0.

## Fase 7 — Animations, batch 1 afgerond

Hervat op 18 november na de gevraagde stop. De vijf bestaande entries Crystalized Ball, Electric Logo, Dither Veil, Glow Cursor en Scroll Expand zijn geïntegreerd met echte modules, controls, presets en volledige bronexports. Registry: 239 totaal, 45 Ready / 194 Planned; Animations 8 Ready / 33 Planned, Text Animations ongewijzigd 16 Ready / 18 Planned. Alle vijf zijn Ready na werkende preview, controls, presets, echte broncompilatie en de definitieve productieregressie. Alle 40 eerdere Ready-implementaties zijn behouden.

- 17 november: openbare demo’s/controls/presetmenu’s onderzocht, sliders werkelijk bediend en Frost/Silk geselecteerd. Eigen effectcode en eigen standaardmedia, geen gekopieerde effectbron of assets. Nieuwe dependencies: geen.
- Eerste ontwikkelronde: 18/21 Playwright geslaagd; drie failures. Sandpack brak de 160.000 seedwrites af via loopbeveiliging: herschreven naar 40.000 iteraties zonder beveiliging uit te schakelen. Een sliderselector raakte de gelijknamige Particles-sidebarlink: op slider-role gericht. Reduced-motionmetadata liep achter op de daadwerkelijk gelezen mediawaarde: klokstatus ook in het renderframe gesynchroniseerd. Gerichte hercontroles: 2/2 ball/source/interactiechecks en 1/1 lifecyclecheck geslaagd.
- 18 november: strikte TypeScript, 30/30 Vitest en productiebuild daadwerkelijk geslaagd vóór de laatste Electric Logo-bloomoptimalisatie. De ontwikkelronde van **22/22 Playwright-tests is geslaagd in 2,1 minuten**. GPU-resourcevrijgave is toegevoegd aan de eerdere interactie-, responsive-, broncompilatie-, observer- en RAF-checks.
- Crystalized Ball: native WebGL met volume-particles tot 40.000 en geanimeerde elektrische rand; shaderwerk beperkt tot de relevante randzone/scissor. De lichtere echte Canvas-fallback is apart geëxporteerd en toont expliciet de fallbackstatus, met maximaal 2.200 particles. Contextverlies/herstel en initiële WebGL-afwezigheid zijn gericht getest.
- Electric Logo: eigen alpha-contouren, uniforme samples en gecachete normalen; bloom op halve resolutie, kern op volle DPR; eigen codevorm en CORS-imageoptie. Dither Veil: vijf echte quantisatie-/error-diffusionvarianten, kleurreveal en adaptief begrensde celroosters. Glow Cursor: eigen geadveceerde lichtfilamenten en vortices, geleidelijk uitdovende halo. Scroll Expand: echte interne scroll, pinned frame/zoom, video-lifecycle en getypeerde children; window-mode vraagt een passende documentflow.
- Eerste renderproef vóór optimalisaties: ongeveer 43 updates/s bol, 46 logo, 59 dither, 60 cursor in softwaregerenderde Chromium. Offscreen en reduced motion telkens nul gemeten draws. Definitieve herhaling op de productiebuild: bol 60,0, Electric Logo 60,0, Dither Veil 58,9 en Glow Cursor 60,0 Canvas/WebGL-renderupdates/s. Bij alle vier zijn in de gemeten offscreen- en reduced-motionintervallen nul draws geteld, zonder page-/consoleerrors. Scroll Expand is DOM-gebaseerd en wordt niet door deze drawprofiler geteld; zijn beweging en teardown zijn via de browserinteractie- en RAF-checks gecontroleerd. Alle vijf definitieve screenshots en de actieve cursor-/scrollcaptures zijn visueel geïnspecteerd. Eigen logo/artwork en het eenvoudigere fallbackbeeld blijven expliciete verschillen met de referentie. Het gaat om renderupdates, niet bewezen fysiek gepresenteerde FPS of een universele geheugenlekgarantie.

Eerste volledige productieronde: **153/153 geslaagd in 8,6 minuten**, exit 0. Daarna zijn alleen de lokale pointerconversie en directe reduced-motioncursor verfijnd; typecheck, 31/31 Vitest en herbouw slagen. De laatste volledige ronde op exact die definitieve build slaagt: **154/154 Playwright-tests in 8,1 minuten**, procesexit 0 en test-results/.last-run.json = passed zonder failedTests. Daarmee slagen alle 128 behouden regressies en 26 nieuwe animatiechecks. De laatste strict TypeScript-check, **31/31 Vitest** en productiebuild slagen eveneens. De geschaalde pointer/reduced-motionpixeltest slaagt op de ontwikkelversie. De media-/grote-roosterchecks slagen eveneens; de eerste keyingtest las vóór de asynchrone afbeeldingslading en wacht nu op de werkelijk geladen contour. Dit is gericht opnieuw geslaagd. De laatste typecheck en **31/31 Vitest** slagen.

Verificatiegrenzen: Chromium op deze Linux-omgeving; geen Safari/Firefox of echte mobiele GPU getest. De bol rapporteert ANGLE/SwiftShader software-rendering. De screenshotvergelijking is geen pixelperfectheidsclaim: logo, ring-artwork en landschap zijn eigen assets; Canvas-fallback en analytische light-trail verschillen van de upstreamweergave. Window-scroll vraagt een natuurlijke paginalayout; de begrensde demo gebruikt standaard interne scroll. CORS en rechten voor eigen media blijven bij de gebruiker. Geen nieuwe dependencies, datamigratie of andere Planned-implementaties.

Nog Planned — alle 33 resterende aangevraagde Animations:

- Batch 2: Ripple Distortion, Elastic Mesh, Swarm Cursor, Halftone Reveal, Pixel Swap.
- Batch 3: Cursor Grid, Animated Content, Fade Content, Electric Border, Orbit Images.
- Batch 4: Pixel Transition, Glare Hover, Logo Loop, Target Cursor, Laser Flow.
- Batch 5: Ghost Cursor, Gradual Blur, Click Spark, Magnet, Strands.
- Batch 6: Sticker Peel, Pixel Trail, Cubes, Metallic Paint, Noise.
- Batch 7: Shape Blur, Crosshair, Image Trail, Ribbons.
- Batch 8: Splash Cursor, Meta Balls, Blob Cursor, Star Border.

Batch 1 is volledig afgeleverd. Volgend implementatiepunt is **Ripple Distortion**, gevolgd door de overige vier componenten van batch 2. Er is nog geen implementatie van batch 2 gestart. De 18 resterende Text Animations blijven ongewijzigd Planned.

Git is uitsluitend read-only gebruikt. De lokale HEAD veranderde op 17 november buiten de Git-opdrachten van de agent (onder meer 6cc7285); geen externe commits teruggedraaid. Geen nieuwe bron-ZIP, deployment, Git-mutatie of push uitgevoerd. Eindlogs: artifacts/phase7-production-e2e-final.log, artifacts/phase7-build-final.log en artifacts/phase7-performance.json. De eerdere rondes staan onder artifacts/phase7-*.log; tijdelijke /tmp-logs van 17 november zijn niet meer aanwezig.

Lokale teardown: alleen de door de agent gestarte Vite-processen op 5175 en 4175 zijn na de geslaagde eindronde gestopt; overige servers zijn niet aangepast.

## Fase 6 — Text Animations, batches 1 en 2

Status: batches 1 en 2 geïmplementeerd, visueel gecontroleerd en volledig getest; tien zelfstandige modules gebouwd; geen andere Planned-categorieën aangepast. De toenmalige catalogus bevatte 239 records, **40 Ready / 199 Planned**, met **16 Ready / 18 Planned** bij Text Animations. Alle oorspronkelijke 30 Ready-componenten, routes, dataflows, themes en architectuur blijven behouden. Geen Git-mutatieopdrachten, deployment of nieuwe ZIP door de agent.

### Batch 1

- Text Loop: echte SVG-curves/ribbons, shape-keuze, crossing, momentum-drag, hover en scrollboost.
- Masked Heading: Canvas woordmaskers, zes reveal-modi, pointerparallax, spotlight, outline, eigen kleurmesh en optionele eigen CORS-media. De standaardmesh wijkt bewust af van de referentievideo; upstreamassets zijn niet overgenomen. Video pauzeert bij offscreen, verborgen document, reduced motion en Paused; cleanup verwijdert media/listeners.
- Particle Text: echte alpha-glyphsampling, uniforme particlecap 7000, vier formaties, springs, pointerrepulsie en click bursts. Geen gewone tekst-fade.
- Split Flap Text: vier echte geclipte halve panelen per tile, 3D-hinge, wisselende glyphs, meerdere cascadevolgordes, phrase-loop, diepte/licht en responsive tilegrootte.
- Warp Text: zelfstandig geschreven WebGL-lens met bulge/pinch/swirl, ambient warp, refraction/chromatic en click-ripple. Geen nieuwe WebGL-library. Shaderresources worden ook bij compile/linkfailure opgeruimd; expliciete fallback zonder WebGL.
- Alle vijf hebben complete presets, werkende primitive controls en echte TSX/CSS/helperexports. Vier gebruiken de bestaande Geist-package met volledige gescopeerde gewichten; Split Flap gebruikt systeemmonospace. Gedeelde visibility-aware RAF-klok, DPR-cap 2 en geen React-renders per pointerframe.
- Typecheck, 19/19 Vitest en productiebuild geslaagd. Eerste volledige browserpoging werd vóór de einduitslag afgebroken; niet als geslaagde ronde geteld. De aanvullende dragtest had aanvankelijk de verkeerde scrollpositie; hersteld en opnieuw uitgevoerd. Daarna **107/107 Playwright-productietests geslaagd in 6,7 minuten**, exit 0: bestaande regressies, alle routes, vijf echte Sandpack-compilaties, presets/reset/restart, pointerinteracties, acht viewportgroottes, themes, reduced motion en offscreenstilstand.

### Batch 2

- Stroke Text: gemeten glyphs via eigen marching squares naar echte SVG-paden, geanimeerd contourmasker, wipe/fade-fill, solid/dashed/dotted, marching, hover/scroll/loop en shadow. Rasterafgeleide contouren zijn een eigen techniek; geen originele font-Béziercurves of upstreambron.
- Depth Text: 2–64 echte DOM-lagen in perspective, damped pointertilt, idle orbit/float, intro-extrusion en substepped springcompressie. Bij visuele QA gevonden afvlakking door CSS-filter hersteld; 3D-laagtransforms en echte kleurgewichten opnieuw gecontroleerd.
- Fold Text: paper/blinds/flip met echte losse scharnierpanelen, origin/angle, vijf stagger-volgordes, crease shading, hover-refold en trigger/loop. De rusttoestand blijft niet onnodig doorrenderen bij een stilstaande cursor.
- Echo Text: eigen delayed followers, entrance, pointer/figure-eight/werkelijke scrollsnelheid, click burst, blur, tint/gradient, scale en outline ghosts.
- Circular Text: gemeten natuurlijke of gelijk verdeelde glyphposities, hover-speed easing, perspectief, capture/angular dragging en inertial return. Eigen arrow/globe/text center-opties; geen gekopieerde assets.
- Elke module heeft volledige presets, eigen CSS/TSX, werkende controls en echte bronexports. De bestaande Geist-package levert gescopeerde 100–900-fontgewichten voor negen nieuwe voorbeelden; de oude website-fontselectie is behouden. Geen nieuw package geïnstalleerd. Een tijdelijke TypeScript-inferentiefout bij conditionele fontdependencies is hersteld met expliciet getypeerde entries.
- Ontwikkelronde vóór de laatste fontverfijning: **15/15 Playwright-tests geslaagd**, acht viewportgroottes (375, 430, 768, 1366, 1440, 1920, 2560, 3440), beide themes, echte beweging/interactie, reset/restart, refresh en alle vijf Sandpack-compilaties. Daarna **5/5 bron-/CSS-compilatiechecks opnieuw geslaagd**. Laatste strict typecheck, **23/23 Vitest** en productiebuild slagen. Volledige productieronde: **123/123 geslaagd in 7,8 minuten**, exit 0. Dit bewijst nog geen correcte fontassetlading in Sandpack: de daarna toegevoegde strengere FontFace-check ontdekte vijf fallbackgevallen (5 failed / 13 passed in de aanvullende ronde). Oorzaak: Sandpack herschreef package-relatieve CSS-font-URL’s niet. Een beperkte immutable draft-adapter lost dit op via versievaste jsDelivr-fontbestanden, met behoud van originele Code/Vite-bron en lokale hoofdwebsite-assets. Twee unitregressies toegevoegd; laatste typecheck, **25/25 Vitest** en productiebuild geslaagd. **8/8 gerichte productiechecks** slagen na de fix, inclusief de vijf werkelijk geladen fontgewichten, echte observer/RAF-cleanup, hover alleen boven de ring en touchscreen burst-coördinaten. De volledige productieronde met de editorfix is vervolgens geslaagd: **125/125 tests in 7,6 minuten**, exit 0. De daarna gevonden en beperkte rendererverbeteringen zijn apart opnieuw gevalideerd: **16/16 batch-1-productiechecks** na de glyph/kerningcorrectie; daarna **4/4 gerichte productiechecks** inclusief een zelf gegenereerde video voor media-lifecycle; ten slotte **4/4 Depth Text-productiechecks** voor echte compilatie, springinteractie, alle tien native lifecycle-flows en caching/dynamische lagen. De laatste typographyverfijning is vervolgens met beide effectbatches opnieuw gecontroleerd: **36/36 productiechecks geslaagd**, inclusief alle negen daadwerkelijk geladen fontgewichten. De definitieve volledige productiecheck slaagt: **128/128 Playwright-tests in 7,6 minuten**, exit 0, op dezelfde build. Dit omvat alle eerdere regressies en alle nieuwe glyph-, video-, fontasset-, hover-, touch- en layercachetests. De laatste typecheck, 25/25 Vitest en productiebuild slagen. Text Loop is na de SVG-maatverfijning bovendien nog afzonderlijk met echte broncompilatie getest (1/1 geslaagd).

### Laatste visuele en performanceverfijningen

- Bij Masked Heading week de schaalintro bij het gemeten woord MMMMMM zeven pixels af van de normale tekstbreedte. Glyphposities worden nu inclusief kerning/tracking vooraf gecachet. MMMMMM en AVATAR eindigen in de browser op exact dezelfde horizontale pixelgrenzen als zonder intro. De nieuwe test controleert die grenzen, nul measureText-calls in de bemonsterde rustframes en de volledige eindvorm bij reduced motion.
- Een afzonderlijke mediacontrole vond dat de typography-effectcleanup een lopende video pauzeerde bij tekstwijzigingen. Alleen het media-effect beheert nu afspelen/pauzeren. De browsertest maakt zelf een korte kleurenvideo via Canvas/MediaRecorder en bevestigt ononderbroken tekstbewerking, reduced-motionpauze/hervatting, offscreenpauze/hervatting en verwijderde src bij unmount. Er is geen extern videobestand toegevoegd.
- De eerste renderproef mat 46,6–60 renderupdates/s. Depth Text voert nu alleen laagupdates uit bij werkelijk gewijzigde spacing of aantal lagen. De test controleert nul laagstylewrites bij rust en correcte initialisatie na wijzigen naar 48 lagen. Laatste proef op 1440×1000: alle zes doorlopend animerende voorbeelden circa 60 updates/s en nul updates tijdens de afzonderlijke offscreenintervallen van 1,5 seconde; geen page-/consolefouten in die proef. Warp Text meldt SwiftShader software-rendering. Dit telt renderwerk, niet bewezen fysiek gepresenteerde beeldframes, en is geen universele FPS-/geheugengarantie.
- Herhaalbare proef: scripts/profile-text-effects.mjs. Meetgegevens: artifacts/phase6-performance.json. Actuele screenshots: screenshots/phase6-*-production.png. Depth Text, Particle Text, Text Loop en Masked Heading zijn na de laatste wijzigingen visueel geïnspecteerd; de overige screenshots en tussentijdse vergelijkingen blijven beschikbaar.
- Volgend implementatiepunt blijft **batch 3: Text Type, Shuffle, Shiny Text, Text Pressure, Curved Loop**. De publieke tabellen/presetkeuzes zijn alvast uitgelezen naar artifacts/references/, zonder deze records of implementaties aan te passen. Text Pressure noemt Roboto Flex als variabel font; daarvan zijn nog geen nieuwe fontassets toegevoegd of afzonderlijke rechten gecontroleerd. Dit onderzoek is geen afgeronde effectimplementatie.

De laatste visuele controle heeft het contrast van de eigen Masked Heading-mesh verbeterd. Vier engines uit batch 1 gebruiken nu eveneens de gescopeerde fontgewichten, zodat 700/800/900 niet ongemerkt op 600 terugvallen. Font-loading vernieuwt de benodigde metingen. Text Loop gebruikt echte SVG-advance-maten en textLength/lengthAdjust op gesloten curves voor een passend aantal volledige frases zonder resetnaad. Deze veranderingen raken geen oorspronkelijke effectimplementaties.

### Nog Planned — 18 aangevraagde Text Animations

Text Type, Shuffle, Shiny Text, Text Pressure, Curved Loop; Fuzzy Text, Gradient Text, Falling Text, Text Cursor, Decrypted Text; True Focus, Scroll Float, ASCII Text, Scrambled Text, Rotating Text; Scroll Velocity, Variable Proximity, Count Up. Geen van deze is als Ready gepresenteerd. De zes oorspronkelijke Text Animations zijn ongewijzigd behouden.

### Referenties en verificatiegrenzen

Publieke demo’s en tabellen per component onderzocht; geen upstream-effectbron gekopieerd. Presetnamen volgen de zichtbare demo, waarden zijn eigen afstemming waar niet volledig geverifieerd. Een aankondigingsmodal hinderde de eerste geautomatiseerde referentiescreenshots; daarna via bediening gesloten en de demo’s ook afzonderlijk visueel bekeken. Statische screenshots tonen niet ieder moment van een animatie en zijn geen pixelperfectheidsclaim. Masked Heading gebruikt eigen media; Canvas/WebGL en CSS/font-rasterisatie kunnen per browser afwijken.

Alle browserchecks gebruiken lokaal Chromium; Safari/Firefox, echte hardware en publieke hosting zijn niet getest. Sandpack gebruikt de bestaande externe bundlerservice. Lifecyclechecks en offscreenmetingen zijn gerichte regressies, geen formeel bewijs van afwezigheid van elk geheugenlek of algemene 60-FPS-garantie. Screenshots en logs staan lokaal onder screenshots/ en artifacts/ en zijn gitignored. De lokale HEAD veranderde wederom buiten de Git-opdrachten van de agent (onder meer 3543c06 en f5790c9); de agent gebruikte Git uitsluitend read-only.

## Fase 5 — uitsluitend Tech Text

Status: implementatie, visuele vergelijking en volledige productieregressie geslaagd. De bestaande Tech Text-entry blijft op dezelfde id, positie en route. Het totaal is 239, met 30 ready en 209 planned; alle oorspronkelijke 29 implementaties zijn behouden.

- Screenshot en zichtbare officiële preview/props bestudeerd. Het genoemde tekstbestand was niet beschikbaar; geen effectbron van upstream gekopieerd. Actuele licentie en beperkingen in LICENSE_REVIEW.md vastgelegd. Zelfstandige implementatie, geen nieuwe dependencies, Git-mutatiecommando’s, publicatie, deployment of bron-ZIP.
- Eén lifecycle-owned Canvas-engine met getypeerde props, grapheme-/kerningmetingen, ink-bound-centrering, auto-fit, DPR maximaal 2, alpha-sprites en eigen marching-squares-contouren inclusief counters. Buffers en paden worden bij typographywijzigingen vernieuwd, niet tijdens pointerbewegingen.
- Letter-/area-/off-reveal; area gebruikt een herbruikbaar canvas met echt radiaal compositingmasker. Dash/solid, stroke, smooth frame, anchors, labels, specks, vier typografische guides en kleurinstellingen reageren direct.
- Pointer capture, individuele dragging, substepped spring return, click kick met nabuurimpuls en toetsenbordselectie/kick. None/type/assemble/metrics-intro’s, Restart en idle sweep. Offscreen/hidden pauzering, reduced motion, volledige listener/observer/RAF-cleanup.
- Bestaande schema-renderer gebruikt voor 26 controls in zes groepen; alleen optionele groepslabels en expliciete currentColor-ondersteuning toegevoegd. Vier complete presets, correcte presetweergave na Reset. De bestaande broncode- en Sandpack-export bevat TSX, CSS en alle drie helpers.
- Eerste browsertests corrigeerden verouderde pointercoördinaten nadat de controls de pagina hadden gescrold en assertions midden in bestaande reveal-/viewporttransities. De tests scrollen nu werkelijk naar de canvas en wachten op de gemeten eindtoestand. Dragging, physics, intro’s en echte Sandpackcompilatie slagen.
- Gerichte ontwikkelronde: 18/18 Playwright geslaagd. Vier nieuwe unitchecks maken 14/14 geslaagd. Eerste performanceproef meet circa 59,8 canvasframes/s in lokale Chromium headless bij 1536×1024; 0 tekenframes in de gecontroleerde offscreen- en rustintervallen. Dit is één lokale proef, geen algemene FPS-garantie.
- Screenshots op 375, 768, 1440, 1920 en 2560px in dark en light gemaakt. Desktop 1920-dark en mobiel 375-light visueel vergeleken met de screenshot: witte 600-weight woordmarkering, nauwe spacing, dunne gestippelde silhouette, vierkante ankers en kleine maatlabels. Daarna centrering nog op de echte ink-bounds gecorrigeerd.
- Laatste typecheck, Vitest 14/14 en productiebuild geslaagd. Tech Text laadt als eigen chunk van circa 18,2 kB (6,3 kB gzip), plus 1 kB CSS. De volledige productieronde slaagt: **92/92 Playwright-tests in 4,1 minuten**, procesexit 0, geen failedTests. Dit zijn de behouden 73 regressies plus 19 Tech Text-checks inclusief HiDPI-touch.
- Na die volledige ronde is uitsluitend de validatie van optionele group/inherit-metadata aangescherpt. Laatste typecheck, 14/14 unit-tests en herbouw slagen; vervolgens **5/5 gerichte productiechecks in 17,6 seconden** geslaagd (exit 0): bestaande Sandpack/IndexedDB, JSON-import/export, Tech Text-defaults en kleuren, presets/reset, echte Tech Text-broncompilatie, geïsoleerd bewerken, compilerfouten en reset.
- De volledige ronde controleerde ook alle 239 routes, alle 30 ready-previews, homepage, dark/light, Customize en de behouden editor/dataflows. Tech Text is op 375×812, 768×1024, 1440×900, 1920×1080 en 2560×1440 in beide thema’s getest, inclusief viewportknoppen, fullscreen en directe refresh. HiDPI op DPR 3 is daadwerkelijk begrensd tot 2; echte touch-tap getest.
- Laatste performanceproef: circa 59,8 canvasframes/s bij de standaard sweep, en 0 tekenframes in de bemonsterde offscreen- en rustintervallen. Het meetbestand staat lokaal in artifacts/tech-text-performance.json. Alle normale screenshots staan onder screenshots/phase5-tech-*.png; aanvullende default-screenshots tonen de standaard 15 specks en ingeschakelde sweep. De uiteindelijke default-preview is opnieuw visueel gecontroleerd.
- De lokale HEAD veranderde opnieuw buiten de opdrachten van de agent (onder meer 8603a90). De agent heeft uitsluitend read-only Git-opdrachten gebruikt, geen commits gemaakt en externe wijzigingen niet teruggedraaid.
- Browserscope: Chromium; geen Firefox/Safari, echte-apparaat- of publieke deploymenttest. De broneditor gebruikt nog de bestaande openbare Sandpack-service.

## Fase 4 — complete catalogus en sidebar

Status: catalogus, navigatie, visuele controle en volledige productieregressie afgerond. De eerdere aanvraag voor een echt Crystalized Ball-effect is vervangen door de laatste opdracht: uitsluitend catalogus en placeholders. Crystalized Ball blijft planned.

- Dezelfde bestaande projectroot gebruikt: /home/andre/Personal-Projects/Project-Dev-Ui-Bits/DevUI-Bits. Geen nieuw project, nieuwe dependencies, effectimplementaties, IndexedDB-migratie, bron-ZIP, Git-mutatiecommando’s of deployment.
- Tijdens deze ronde veranderde HEAD buiten de door de agent uitgevoerde opdrachten (onder meer d9ce486 en ee5a917). De agent gebruikte uitsluitend read-only Git-inspectie en heeft die externe commits niet gemaakt of teruggedraaid.
- Alle 217 aangeleverde namen in de opgegeven categorie en volgorde geregistreerd. 22 bestaande namen die niet op die lijst stonden, zijn behouden. Eindtotaal: 239 unieke records, 29 ready en 210 planned.
- Eén definitieve registry met een discriminated union: planned bevat alleen metadata; ready bevat de echte renderer, defaults, schema, dependencies en bronkoppeling. Dubbele ids en routes worden expliciet afgewezen.
- Scroll Reveal en Animated List naar de aangeleverde categorie verplaatst met behoud van hun oude URLs als aliases. Alle oorspronkelijke 29 implementaties en hun id blijven bestaan. Bijna gelijknamige effecten worden niet ten onrechte als ready gemarkeerd.
- Uitgebreide sidebar met branding, Browse all, categorie-iconen, GET STARTED, EXPLORE, vijf inklapbare categorieën, eigen scrollcontainer, actieve highlight en automatische positionering. Mobiele drawer en dark/light blijven het bestaande systeem gebruiken.
- Components-overzicht met teller, categorie-/statusfilter, echte sorteeropties, URL-persistentie en compacte statuscards. Desktop standaard drie kolommen, bredere schermen vier/vijf/zes, tablet twee, mobiel één. Geen zoekveld of Create-knop teruggebracht.
- Eén PlannedComponentPreview voor alle geplande cards en detailpagina’s, zonder nep-effecten, Code, Editor of Customize. Elke entry heeft een werkende route en een teruglink.
- GET STARTED en EXPLORE hebben echte informatiepagina’s. MCP vermeldt expliciet dat er geen server is. Blocks, App UI, Templates en Skills bevatten geen verzonnen content. Favorieten zijn werkend, lokaal en los van bestaande IndexedDB-data opgeslagen.
- Ready-previewmodules waar zinvol naar React.lazy verplaatst. Er start geen effect op de catalogus zonder klik; maximaal één cataloguspreview tegelijk. De bestaande homepage en echte detailpagina’s gebruiken hun behouden implementaties onder Suspense.
- ADDING-COMPONENTS.md toegevoegd voor toekomstige planned → ready-ontwikkeling, zonder dubbele records of routes. README bijgewerkt.

### Controle en visuele vergelijking

- Actuele live React Bits-catalogus bekeken, inclusief donkere styling, Geist, 32px-titel, compacte sidebar en drie cardkolommen. Er was geen screenshotbijlage zichtbaar in deze chat; de visuele vergelijking gebruikt de live referentie.
- Strict TypeScript geslaagd. Vitest 10/10 geslaagd, inclusief volledige naamvolgorde, aantallen, unieke ids/slugs/routes, oude aliases, statusgrenzen en echte bronbestanden.
- Productiebuild geslaagd. De aanvankelijke waarschuwingen over foundationmodules die zowel lazy als direct gebruikt werden zijn opgelost; de overige effectmodules zijn apart geladen.
- Eerste gerichte browserronde 7/8: sidebar/aliases, favorieten, previewbeperking en 375/1920px in beide thema’s slagen. De filtercontrole vond een race bij snelle opeenvolgende URL-filterwijzigingen; updates worden nu met de actuele URL samengevoegd en de controle wacht op de zichtbare filterstatus.
- Eerste volledige productieronde: 72/73 geslaagd. De oudere mobiele navigatiecheck ontdekte dat het Ready-statuspunt via zijn title de toegankelijke linknaam veranderde. Sidebarlinks hebben nu een expliciete componentnaam en een aparte statusbeschrijving voor schermlezers; de volledige suite wordt opnieuw uitgevoerd.
- Screenshots van catalogus en planned-pagina’s op alle tien gevraagde breedtes in dark en light gemaakt. De 375px-light-, 1920px-dark- en 3840px-light-catalogus en de 1920px-dark-placeholder visueel geïnspecteerd. De sidebarspacing is na de eerste vergelijking compacter gemaakt.
- Browsercontrole is lokaal in Chromium; geen afzonderlijke Safari-, Firefox-, echte-apparaat- of publieke deploymenttest uitgevoerd. Sandpack blijft afhankelijk van zijn bestaande openbare bundler.
- De entrybundel is door lazy effectmodules teruggebracht van circa 589 kB naar 427 kB (133 kB gzip). De editor blijft een aparte chunk van circa 624 kB (211 kB gzip); CSS circa 117 kB (22 kB gzip). Raw broncode blijft centraal beschikbaar; planned records laden geen effectmodules.
- Definitieve volledige productieronde: **73/73 Playwright-tests geslaagd in 2,8 minuten**, expliciete procesexit 0. test-results/.last-run.json meldt passed zonder failedTests. Dit omvat de oorspronkelijke 47 regressies plus 26 nieuwe cataloguschecks.
- Alle 239 componentroutes daadwerkelijk geopend en gecontroleerd; alle 29 echte previews, Customize, broncode, Sandpack-compilatie/bewerken/fouten/reset, extra bestanden, themawissels, IndexedDB opslaan/herladen/bewerken en JSON-import/export slagen. De herstelde mobiele Tilt Card-navigatie slaagt ook. Geen vastgestelde React-runtimefouten in de gecontroleerde flows.
- Catalogus en planned-pagina gecontroleerd op 375×812, 430×932, 768×1024, 1024×768, 1366×768, 1440×900, 1920×1080, 2560×1440, 3440×1440 en 3840×2160, elk in dark en light. Assertions controleren gridkolommen, thema, drawer, actieve link, directe route/refresh en geen horizontale overflow. De behouden homepage/detailmatrix controleert daarnaast 1280×800.
- Laatste typecheck, Vitest 10/10, productiebuild en git diff --check geslaagd. Node 24.22.2 en npm 11.19.1 gebruikt. De productiepreview draaide lokaal op 4175; de optionele Chromium-locatie is alleen via environment meegegeven en niet in het project hardcoded. Screenshots staan in screenshots/phase4-*.png en blijven door Git genegeerd.

## Fase 3 — homepage, responsive layout en thema

Status: implementatie en volledige productietestronde geslaagd. De volgende secties over fase 1 en 2 zijn de behouden historie.

### Project en grenzen

- Het letterlijk opgegeven `/Home/Personal-Projects/Project-Dev-Ui-Bits` bestaat niet. De bestaande app is gevonden in `/home/andre/Personal-Projects/Project-Dev-Ui-Bits/DevUI-Bits`. Alleen deze bestaande projectmap is aangepast; geen nieuw project aangemaakt.
- README, PROGRESS, package.json, configuraties, app, registry, effects, editor, CSS en tests gelezen. Aan het begin was de Git-werkmap schoon. De bestaande remote is uitsluitend gelezen en verwijst naar jouw GitHub-repository.
- Door de agent zijn alleen read-only Git-opdrachten gebruikt. Geen git add/commit/push, remote-mutatie, PR, release of deployment uitgevoerd. Tijdens het werk veranderde de lokale HEAD ook buiten de uitgevoerde Git-opdrachten; die commits zijn niet teruggedraaid.
- Geen nieuwe bron-ZIP gemaakt. Bestaande browser-exportfuncties zijn wel behouden en getest; hun testdownload is geen nieuw volledig bronarchief.
- Geen dependencies toegevoegd of versies gewijzigd. Alle 29 registry-items, hun broncode, vijf categorieën, componentroutes en Vercel-configuratie zijn behouden. Geen IndexedDB-migratie of verwijdering uitgevoerd.

### Gerealiseerd

1. `/` is een echte homepage met de gevraagde titel en beschrijving, twee CTA’s, eigen particle-hero, vijf categoriekaarten, zes werkelijke interactieve registry-previews en gedeelde footer. `/categories` is een apart werkend overzicht.
2. Navbar met Home, Components, Categories, officiële GitHub-silhouetlink naar de opgegeven repository en Lucide Sun/Moon-toggle. De GitHub-link heeft target blank, noopener/noreferrer, aria-label, hover en keyboardfocus. Lucide levert geen brandicons; het silhouet is inline SVG, zonder extra dependency.
3. Publieke zoekvelden, zoekbuttons, `/`-sneltoets en alle publieke Create-links verwijderd. De registry blijft de ontwikkelroute via VS Code. De oude `/create` en `/edit/:id` blijven direct beschikbaar voor compatibiliteit, inclusief import/export en bestaande data. Deze routes zijn niet met authenticatie afgeschermd.
4. Centraal dark/light-thema met CSS-variabelen en Tailwind v4-koppeling. Systeemvoorkeur zolang geen handmatige keuze bestaat, localStorage-persistentie, systeemwijzigingen en synchronisatie via storage-events. De inline bootstrapscript past het thema vóór de eerste render toe.
5. Thema toegepast op homepage, sidebar, rail, Customize, tabs, code, Sandpack, formulieren, knoppen, footer, meldingen en gallerydialogen. Effectpreviews houden hun eigen instelbare kleuren. Themawissels veranderen geen componentinstellingen.
6. Vaste paginamarges vervangen door een flexibel CSS-grid met minmax/clamp. De rechterrail verdwijnt onder 1440 px; de sidebar wordt onder 840 px een mobiel menu. Grote schermen krijgen brede previews en drie/vier controlkolommen. Mobiele toolbar, grids, editor, formulieren en footer passen binnen het scherm.
7. Mobiele navigatie met Escape, focusherstel, focusbegrenzing, scroll-lock en automatisch sluiten bij navigatie of desktopbreedte. De sidebar scrollt binnen de eigen lijst naar het actieve component, zonder de pagina te verplaatsen.
8. Homepagepreviews mounten bij eerste zichtbaarheid en bewaren hun interactiestatus. Canvas-loops en CSS-animaties pauzeren buiten beeld; hero-particles en Field respecteren reduced motion en documentzichtbaarheid. MotionConfig volgt de systeemvoorkeur. Alle listeners, observers en RAFs hebben cleanup.
9. Sandpack blijft lazy geladen. Een nieuwe regressietest vond dat themawissels of kopieermeldingen conceptcode konden resetten door nieuwe files/customSetup-objecten. De provider krijgt nu inhoudelijk gememoïseerde bestanden, dependencies en opties. Bewerkte code en toegevoegde bestanden blijven behouden bij themawissels en meldingen.

### Visuele vergelijking en checks

- De actuele gratis React Bits-homepage en Micro Slats-referentie bekeken. Via browserinspectie zijn onder andere de donkere achtergrond rgb(18,15,23), Geist en medium headings bevestigd. Eigen branding en zelfgeschreven effecten behouden; geen Pro-assets gebruikt.
- Meerdere screenshotrondes op desktop, mobiel, light en dark. Na inspectie zijn onder andere contrast in de rail, verborgen skiplink, actieve navigatie, previewstatus en sticky navbar gecorrigeerd. Volledige screenshots worden aan de bovenkant van de pagina genomen; features worden eerst werkelijk geladen, zodat lazy content ook op de vergelijking staat.
- TypeScript: geslaagd. Vitest: 6/6 geslaagd. Productiebuild: geslaagd, zonder chunkwaarschuwingen.
- Eerste selectie: 8/8 Playwright-checks geslaagd. Eerste volledige ontwikkelronde: 43/44, met één directe boundingBox-meting tijdens een UI-update. Hersteld met een zichtbaarheidverwachting; de getroffen tabletcontrole slaagt in de productiepreview en in een gerichte ontwikkeltest.
- Eerste uitgebreide productieronde: 46/47. De extra test ontdekte het echte Sandpack-resetprobleem; dat is opgelost. Gerichte ontwikkelcontrole daarna: 4/4, inclusief tablet, desktop, mobiel menu en code/bestandsbehoud na themawissel.
- Laatste volledige productiecontrole: **47/47 geslaagd** (Playwright rapporteert 47 passed in 1,8 minuten, expliciete procesexit 0; test-results/.last-run.json meldt passed en geen failedTests). Inclusief de herstelde editorflow: conceptcode en toegevoegd bestand blijven behouden na kopiëren en themawissel. Alle bestaande routes, Customize, code/CSS, editorcompilatie, compilerfouten/reset, JSX/Tailwind, opslaan/refresh/bewerken en JSON-import/export zijn opnieuw getest. Geen vastgestelde React-runtimefouten in de gecontroleerde flows.
- Alle gevraagde npm-scripts zijn daadwerkelijk uitgevoerd, met Node 24.22.2 en npm 11.19.1. De browserrun gebruikte de optionele Chromium-locatie via environment, niet via een hardcoded projectpad. De productiepreview draaide lokaal op poort 4173, de ontwikkelserver op 5173.

Gecontroleerde viewportmatrix, in beide thema’s: 375×812, 430×932, 768×1024, 1024×768, 1280×800, 1366×768, 1440×900, 1920×1080, 2560×1440, 3440×1440 en 3840×2160. Assertions controleren pagina-overflow, heading/CTA/toolbarpositie, beschikbare previewbreedte, controls en directe refresh. Screenshots staan lokaal onder screenshots/phase3-*.png en zijn genegeerd door Git.

### Grenzen van deze ronde

- Browserchecks gebruiken Chromium. Er is geen afzonderlijke Safari-, Firefox- of echte-apparaattest uitgevoerd en geen publieke Vercel-deployment getest.
- De registry laadt de ingebouwde effectmodules en raw broncode nog gezamenlijk; de editor heeft een aparte chunk. De huidige entry is circa 589 kB / 188 kB gzip, editor circa 624 kB / 211 kB gzip en CSS circa 102 kB / 19 kB gzip. Voor honderden zware effecten kan bron-/previewcode per component verder worden opgesplitst. De homepage start niet 29 animatieloops.
- Sandpack-compilatie en Tailwind-workshop blijven afhankelijk van hun openbare externe compilers. De hoofdwebsite, thema-instelling en IndexedDB vereisen geen account, API-key of ChatGPT-hosting.
- Er is geen nieuwe ZIP gemaakt; een ouder fase-2-archief bevat deze lokale wijzigingen niet. Committen, pushen, exporteren en publiceren blijven jouw keuze.

## Fase 1 behouden

Het bestaande Vite/React-project is uitgebreid, niet opnieuw opgebouwd. De oorspronkelijke 21 effectimplementaties, vijf categorieën, registry, routing, zoekfunctie, paginatemplate, live previews, Customize-controls, Sandpack, IndexedDB en JSON/code-export zijn behouden. De bestaande visuele tokens, Geist-typografie en compacte donkere layout blijven de basis.

## Fase 2 — uitgevoerde wijzigingen

1. README, voortgang, packagebestanden, configuraties en broncode gelezen. De projectsubmap had een eigen Git-repository zonder ingestelde remote; Git-geschiedenis en remotes zijn niet gewijzigd. Geen GitHub-repository aangemaakt of force-push uitgevoerd.
2. Het project is een zelfstandig Vite 8 + React 19 + strict TypeScript + Tailwind v4-project. De oorspronkelijke runtimeversies zijn behouden; zwevende `latest`-verwijzingen zijn vastgelegd als compatibele ranges met de bestaande lockfile.
3. Node 24.x vastgelegd in engines en .nvmrc; getest met Node 24.22.2 en npm 11.19.1. Dit voorkomt dat Vercel op basis van een brede engines-range automatisch een andere major kiest.
4. Vercel-configuratie toegevoegd: framework Vite, npm ci, npm run build, dist en SPA-rewrite. Het oude hostingmanifest is verwijderd. Geen applicatielogin, ChatGPT-runtime, API-key of lokale absolute bronpaden nodig.
5. Playwright-configuratie overdraagbaar gemaakt: standaard beheerde Chromium-installatie, optionele browserlocatie via environment, optionele base-URL voor production preview. Het machinespecifieke pad is verwijderd uit de broncode.
6. Registry uitgebreid met optionele CSS- en helperbestanden. Alle nieuwe routes, controls en codebestanden volgen de bestaande architectuur.
7. Sandpack heeft nu een zichtbaar dependency-overzicht, compile-status, bestandslocatie en begrijpelijke foutmelding, naast de bestaande editor, multi-file tabs, copy, reset, console en export.
8. De acht nieuwe componenten maken het totaal 29. CSS-3D gebruikt native perspective; er zijn geen onnodige Three.js- of GSAP-dependencies toegevoegd.
9. De gallery gebruikt zes originele lokaal opgebouwde SVG-illustraties; geen externe foto's, betaalde assets of officiële React Bits-branding.
10. LICENSE (MIT), LICENSE_REVIEW.md, volledige dependency-notices, publieke notices en scripts voor herhaalbare bron-ZIP en licentierapport toegevoegd.
11. SETUP-GITHUB-VERCEL.md bevat alle tien gevraagde stappen, inclusief controles vóór git init en remote add, placeholders en nooit force-push.

## Nieuwe advanced componenten

| Component | Route | Werkelijk geïmplementeerd |
| --- | --- | --- |
| Advanced Mega Menu | /components/advanced-mega-menu | rijke panels, keyboard/escape, buitenklik, selectie, hoveroptie |
| 3D Interactive Card | /components/3d-interactive-card | CSS-3D, pointer-tilt, glare, keyboard-flip en achterkant |
| Morphing Button | /micro-interactions/morphing-button | idle/loading/success, morphtransities en opgeruimde timers |
| Animated Tabs | /components/animated-tabs | shared-layout indicator, panel/chart, keyboard en orientatie |
| Magnetic Navigation | /components/magnetic-navigation | magnetische pointer, active-state, panels en roving focus |
| Interactive Particle Background | /backgrounds/interactive-particle-background | spatial hash, fysica, attract/repel, bursts, visibility en reduced motion |
| Scroll Storytelling Section | /animations/scroll-storytelling-section | interne scroll, sticky artwork, drie hoofdstukken, leesvoortgang |
| Advanced Image Gallery | /components/advanced-image-gallery | masonry/grid, filters, lightbox, zoom, keyboard en focusherstel |

Iedere nieuwe component heeft eigen registry-metadata, defaultproperties, Customize-schema, route, live preview en werkelijke kopieerbare broncode, inclusief benodigde CSS en helperbestanden. Responsive gedrag en reduced motion zijn meegenomen.

## Tests tot nu toe

- `npm ci`: geslaagd met de definitieve browseradapter en lockfile; npm audit meldt 0 kwetsbaarheden. De eerste overridepoging had een ongeldige relatieve link; opgelost met de correcte relatieve override en install-links=true. De geslaagde schone installatie gebruikt geen oude Nodebox-code.
- `npm run typecheck`: geslaagd, strict TypeScript.
- `npm run build`: geslaagd, zonder buildfouten of chunkwaarschuwingen.
- `npm test`: 6/6 geslaagd. IndexedDB-lifecycle, importvalidatie, ZIP-structuur, alle registrydefaults/routes en alle echte bron-/CSS-/helperbestanden gecontroleerd. Vitest is ingesteld om ruwe CSS-bronbestanden correct mee te nemen.
- Playwright op de ontwikkelserver: 18/18 geslaagd (57,8 seconden).
- Playwright op de echte productiepreview: 18/18 geslaagd (38,6 seconden).
- Alle 29 componentroutes en vijf categorieën geladen, zonder vastgestelde React-runtimefouten.
- Directe diepe links, refresh, asset/notice-respons en de workshop werken zonder login in de productiepreview.
- Originele flows opnieuw getest: zoeken, sliders, selects, toggles, viewport, reset/fullscreen, broncode/CSS, ZIP, TSX-editing, compilerfout, reset, opslaan/refresh/bewerken, JSON-import/export en JSX/Tailwind.
- Advanced flows getest: keyboardmenu, 3D-flip, async button, tabs/nav, particlepixels en reduced-motionstilstand, scrollhoofdstukken, filters, lightbox, zoom, focustrap en focusherstel.
- Gallery + helperbestand compileert ook werkelijk in Sandpack na de dependencyvervanging.
- Mobiele schermen en tablet gecontroleerd; geen horizontale pagina-overflow gevonden. Visuele screenshots beschikbaar in de lokale screenshots-map, uitgesloten van de bron-ZIP.
- Publicatiescan: geen herkenbare secrets/private keys, privé-hosting-URLs of lokale absolute paden in de onderzochte applicatie-, public-, script-, test- en vendorbestanden. De lockfile verwijst alleen naar npm en de relatieve vendor-map. Dit is patrooncontrole, geen garantie tegen elke mogelijke geheimwaarde.

## Licentiecontrole

- Eigen code: MIT. Geist: OFL-1.1. Lucide: ISC. Sandpack: Apache-2.0. Lightning CSS: MPL-2.0. Volledige voorwaarden blijven apart van toepassing.
- 131 geïnstalleerde packages gedocumenteerd; 41 afwezige platformvarianten vermeld.
- De ongebruikte restrictief gelicentieerde Nodebox-dependency is vervangen door eigen MIT-code. Alleen browser-React-sandboxes worden aangeboden; geen server-/Node.js-templates.
- Negen ontbrekende upstreamlicentieteksten zijn aangevuld met herkomstregistratie. Exacte historische copyrightteksten zijn niet voor elke release zelfstandig bewezen; static-browser-server leverde geen LICENSE/NOTICE en de upstreamlicentie-endpoint gaf 404. De gedeclareerde Apache-2.0-tekst is toegevoegd. Zie LICENSE_REVIEW.md voor deze onzekerheid en de gebruikte bronnen. Geen juridische garantie geclaimd.

## Bron-ZIP en schone installatie

Het ZIP-script neemt broncode, public-assets, packagebestanden, lockfile, Vite/Vercel/TS/testconfiguratie, handleidingen, vendor-adapter en licentiebestanden op onder één DevUI-Bits/-map. Het sluit node_modules, dist, .git, .env, hostingmetadata, caches en testresultaten uit.

De bron-ZIP is daadwerkelijk uitgepakt in een nieuwe aparte map zonder .git, node_modules of dist. Daar is npm ci uitgevoerd: 125 packages toegevoegd, 132 geaudit, 0 gemelde kwetsbaarheden. De map gebruikt eigen geïnstalleerde dependencies, geen symlink naar de oorspronkelijke projectmap.

Uitgevoerd vanuit de uitgepakte map:

- npm ci: geslaagd.
- npm run typecheck: geslaagd.
- npm test: 6/6 geslaagd.
- npm run build: geslaagd.
- npm run dev: gestart op een aparte poort.
- npm run preview: gestart op een aparte poort.
- Volledige Playwright-suite tegen die zelfstandige production preview: 18/18 geslaagd (39,7 seconden), inclusief editor, IndexedDB, alle routes, deep-link refresh en nieuwe componenten.

De browsercontroles gebruikten de hier geïnstalleerde Chrome expliciet via de optionele environmentvariabele. Het project zelf bevat dit lokale pad niet; op je eigen computer installeer je Chromium met het gedocumenteerde Playwright-commando.

De ZIP-structuur, CRC-integriteit en verplichte bestanden zijn gecontroleerd. Alle 65 bronbestanden staan onder DevUI-Bits/. Uitgesloten directories, secretsbestanden en buildcaches ontbreken. Na het vastleggen van deze testresultaten is de definitieve ZIP opnieuw gemaakt; de applicatie-, configuratie-, test- en dependencybestanden zijn bytegelijk aan de schoon geteste kopie. Alleen deze voortgangstekst is bijgewerkt. Een SHA-256-sidecar is beschikbaar naast het archief.

Oplevering: DevUI-Bits-Source.zip. De volledige overdraagbare bronmap, geen link naar uitsluitend een gehoste website. De setuphandleiding, README, MIT-licentie, third-party-notices, bekende licentieonzekerheden en alle tests zitten in het archief.

## Bekende grenzen

- Geen publieke GitHub-repository of Vercel-deployment aangemaakt; dat gebeurt met jouw account en gekozen repository volgens de handleiding. De lokale productiebuild en SPA-routes zijn getest, een nog niet bestaande Vercel-deployment niet.
- Sandpack-compilatie en Tailwind-workshop hebben internet nodig. De hoofdwebsite en IndexedDB zijn zelfstandig client-side.
- IndexedDB is browser- en originlokaal. Eigen browsercomponenten worden niet zonder jouw keuze openbaar gepubliceerd of in de bron-ZIP opgenomen.
- Er was in fase 1 geen screenshotbijlage beschikbaar; het bestaande ontwerp is toen met de live gratis referentie vergeleken en nu behouden.

Laatste eindcontrole van dezelfde 128/128-geteste build: performanceproef na de volledige fontintegratie geslaagd, 59,9–60,0 renderupdates/s voor de zes doorlopende voorbeelden en nul updates buiten beeld, zonder vastgestelde page-/consolefouten. Screenshots zijn opnieuw gemaakt en geïnspecteerd. test-results/.last-run.json meldt passed met een lege failedTests-lijst. git diff --check slaagt. Alleen de eigen testservers worden daarna gestopt; er is geen nieuwe bron-ZIP, Git-mutatieopdracht of deployment uitgevoerd.
