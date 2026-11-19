# Licenties, herkomst en publicatiecontrole

Controle uitgevoerd op 16 november 2026 voor de vastgelegde dependencies in package-lock.json. Dit is een technische inventarisatie, geen juridische garantie. Controleer voorwaarden opnieuw als je dependencies, assets of het gebruiksdoel verandert.

## Eigen projectcode — MIT

De eigen effectimplementaties, applicatiecode, naam, favicon en gallery-artwork zijn in dit project geschreven. De oorspronkelijke 21 componenten zijn behouden en uitgebreid met acht eigen implementaties. React Bits is alleen een visuele en functionele referentie; geen officiële logo's, bronbestanden, foto's of Pro-assets zijn opgenomen. De eigen code staat onder MIT in LICENSE.

De gallery gebruikt zes SVG-illustraties die door `src/effects/galleryArt.ts` worden opgebouwd. Er zijn geen externe foto-URLs of stockafbeeldingen. De browser rendert de illustraties lokaal als data-URL; er zijn geen beeld-CDN-accounts of tokens nodig.

## Dependencies en fonts

- React, Vite, TypeScript, Motion, Zustand, idb en de meeste onderliggende packages declareren MIT of een andere permissieve licentie.
- Sandpack React en Sandpack Client declareren Apache-2.0; hun oorspronkelijke licentieteksten zijn behouden in THIRD_PARTY_NOTICES.md.
- Lucide React declareert ISC; de iconen houden hun eigen licentie en copyrightvermelding.
- De lokaal gebundelde Geist-fontbestanden vallen onder SIL OFL-1.1. De volledige tekst en copyright staan in THIRD_PARTY_NOTICES.md en de publiek meegestuurde `third-party-notices.txt`. De fontbestanden zijn niet aangepast of hernoemd.
- Lightning CSS gebruikt MPL-2.0. Deze dependency is niet gewijzigd. De npm-versie, upstreambron en lockfile-tarball identificeren de beschikbare bron. De notices bevatten de oorspronkelijke MPL-tekst. Buildtools hebben hun eigen voorwaarden; de MIT-projectlicentie overschrijft die niet.

`npm run licenses` maakt de inventaris opnieuw op basis van geïnstalleerde lockfile-packages, inclusief licenties van build- en testtools en aanwezige THIRD-PARTY-LICENSE-bestanden. Het resultaat staat in THIRD_PARTY_NOTICES.md en `public/third-party-notices.txt`, zodat de productiebuild de notices ook aanbiedt. Niet-geïnstalleerde platformvarianten worden apart met hun gedeclareerde licentie vermeld. De bron-ZIP bevat geen node_modules of binaries van die varianten.

## Restrictieve ongebruikte dependency vervangen

Sandpack Client heeft ook een dependency op `@codesandbox/nodebox@0.1.8`, onder de **Sustainable Use License**. DevUI Bits gebruikt uitsluitend Sandpack's browser-React-template en heeft geen Node.js/server-sandbox nodig.

Een npm override vervangt alleen deze ongebruikte dependency door de originele MIT-adapter in `vendor/nodebox-browser-only`. De adapter bevat geen Nodebox-code en implementeert geen Node-runtime. Het importpad/package-name blijft voor importcompatibiliteit gelijk; de versie bevat `devui-browser-only`. Een expliciete fout ontstaat als een ontwikkelaar later toch een Node.js-sandbox probeert te activeren. De browser-React-functies zijn daadwerkelijk opnieuw getest. `.npmrc` en de relatieve lockfile houden deze vervanging reproduceerbaar; behoud daarom de vendor-map.

## Ontbrekende upstreamnotices en onzekerheden

Negen geïnstalleerde packages leveren geen afzonderlijk licentiebestand mee. De gedeclareerde SPDX-licentie is gecontroleerd en aanvullende upstreamteksten zijn opgenomen onder `licenses/supplemental/`, met bron-URL en waar beschikbaar de GitHub-blobhash in `sources.json`.

- Voor enkele packages komt de aanvullende tekst uit de huidige upstreamrepository. Die komt overeen met de gedeclareerde licentiesoort, maar de historische copyrighttekst van precies de geïnstalleerde release is hiermee niet zelfstandig bewezen.
- `static-browser-server@1.0.3` declareert Apache-2.0, maar levert geen afzonderlijke LICENSE/NOTICE mee. De licentie-API van de opgegeven upstreamrepository gaf 404. Daarom is de officiële Apache-2.0-tekst toegevoegd en blijft de ontbrekende historische attributie expliciet een onzekerheid. Het pakket wordt niet aangepast; de npm-bronversie blijft identificeerbaar.
- `intersection-observer` verwijst vanuit zijn bronheader naar W3C-20150513. De standaardtekst en de originele Google-copyrightvermelding zijn toegevoegd.

Externe services hebben eigen gebruiksvoorwaarden: Sandpack gebruikt een openbare CodeSandbox-bundler, en Tailwind-workshoppreviews halen de Tailwind browsercompiler van jsDelivr. Het project bevat daarvoor geen keys en verlangt geen ChatGPT-login. Dit betekent wel dat de code-editor niet volledig offline werkt. De Tailwind-browsercompiler is geschikt voor deze geïsoleerde workshop; de hoofdwebsite gebruikt de normale Tailwind/Vite-productiebundel.

## Publieke broncodecontrole

De bron-ZIP gebruikt een expliciete bestandsselectie. `.git`, `.openai`, `.vercel`, `.env*`, node_modules, dist, caches, testresultaten en tijdelijke bestanden zijn uitgesloten. De voormalige hostingmanifest is verwijderd; applicatieroutes en IndexedDB zijn volledig client-side. De Playwright-configuratie bevat geen vast lokaal browserpad. De lockfile gebruikt npm-register-URLs en de eigen relatieve vendor-map, geen interne package registry.

Er zijn geen API-keys, vereiste secrets of persoonlijke accountgegevens in de applicatie opgenomen. Custom componenten uit jouw browser worden niet stilzwijgend aan de bron-ZIP toegevoegd. Controleer eigen wijzigingen en geïmporteerde code opnieuw voordat je die openbaar publiceert; dit document dekt geen later toegevoegde assets of componenten.

## Tech Text — bron- en licentiecontrole op 17 november 2026

Referenties: de door de gebruiker aangeleverde screenshot en [zichtbare Tech Text-demo](https://reactbits.dev/text-animations/tech-text). Het genoemde `Geplakte tekst.txt` was niet beschikbaar in de bijlagen of de onderzochte lokale bestanden en is dus niet gelezen of gebruikt. De effectbron van React Bits is niet gedownload of gekopieerd.

De [actuele upstream LICENSE.md](https://raw.githubusercontent.com/DavidHDev/react-bits/main/LICENSE.md) vermeldt MIT + Commons Clause en een afzonderlijke beperking op het verkopen, sublicentiëren of herdistribueren van de componenten zelf. Een publieke componentenbibliotheek is daarom geen reden om de upstreamcode onder de gewone MIT-projectlicentie over te nemen. Deze inventarisatie geeft geen juridische garantie; voorwaarden kunnen veranderen en moeten vóór latere publicatie of toevoeging van upstreamcode opnieuw worden beoordeeld.

De nieuwe Tech Text-engine, contourtracing, physics, React-wrapper, controls en tests zijn zelfstandig voor DevUI Bits geschreven vanuit het zichtbare gedrag en de gebruikersspecificatie. Er zijn geen upstreambestanden, logo’s, eigen fontassets of Pro-assets in opgenomen en geen nieuwe dependencies toegevoegd. De eigen implementatie blijft onder de projectlicentie MIT; daarmee wordt geen herlicentiëring van React Bits-code geclaimd. Het visuele/functionele referentiegebruik vormt geen juridische beoordeling van alle mogelijke rechten. Er is in deze fase niets door de agent gepubliceerd of gedeployd.

## Text Animations fase 6 — batch 1, 17 november 2026

Visuele/functionele bronnen: de publieke demo’s en gerenderde propertytabellen voor [Text Loop](https://reactbits.dev/text-animations/text-loop), [Masked Heading](https://reactbits.dev/text-animations/masked-heading), [Particle Text](https://reactbits.dev/text-animations/particle-text), [Split Flap Text](https://reactbits.dev/text-animations/split-flap-text) en [Warp Text](https://reactbits.dev/text-animations/warp-text). Er is geen upstream-effectbron gedownload of opgenomen. De SVG-beweging, raster-/particlelogica, halve flip-panelen en lensshader zijn zelfstandig geschreven. De helpers hergebruiken uitsluitend eigen projectcode. Er zijn geen nieuwe libraries, fonts of externe assets toegevoegd.

De actuele upstream LICENSE.md is opnieuw gelezen: MIT + Commons Clause en een expliciete beperking voor verkoop, sublicentiëring en herdistributie van de componenten zelf. Die bron is dus niet als gewone MIT-code overgenomen. De eigen code valt onder de bestaande project-MIT; deze notitie is geen juridische garantie of vrijgave voor het later toevoegen van upstreambestanden.

Masked Heading gebruikt een eigen procedurale mesh in plaats van de referentievideo. Door de gebruiker ingestelde Media URL’s worden alleen client-side geladen; de gebruiker moet de rechten en CORS-toegang zelf regelen. Presetnamen en publieke parameters zijn als functionele referentie onderzocht; eigen presetwaarden zijn waar nodig opnieuw afgestemd. De onafhankelijke implementatie pretendeert geen exacte kopie van interne algoritmen of originele mediacontent.

## Text Animations fase 6 — batch 2, 17 november 2026

De publieke demo’s, propertytabellen en interactieve presetbediening van [Stroke Text](https://reactbits.dev/text-animations/stroke-text), [Depth Text](https://reactbits.dev/text-animations/depth-text), [Fold Text](https://reactbits.dev/text-animations/fold-text), [Echo Text](https://reactbits.dev/text-animations/echo-text) en [Circular Text](https://reactbits.dev/text-animations/circular-text) zijn onderzocht. De upstream-effectbron is niet opgehaald of overgenomen. Contourtracing komt uit de eerder voor DevUI Bits geschreven Tech Text-utility; 3D-stacking, scharnierpanelen, delayed followers en ring/inertia zijn nieuwe eigen code. De bovenstaande MIT + Commons Clause-onzekerheden blijven van toepassing op toekomstig upstreambron-gebruik; geen juridische garantie.

Bestaande Geist-assets uit het reeds geïnstalleerde `@fontsource/geist` worden onder een gescopeerde alias gebruikt. Er is geen font van React Bits gedownload. De upstream fontbestanden zijn niet aangepast; alleen de CSS-alias is eigen styling. De OFL-1.1-voorwaarden en bestaande fontattributie blijven van toepassing. Voor zelfstandige Sandpack-voorbeelden is dezelfde fontdependency expliciet gedeclareerd. Er zijn geen nieuwe npm-packages of externe afbeeldingen/videos toegevoegd.

De strengere browsertest ontdekte dat Sandpacks CSS-loader package-relatieve font-URL’s niet oplost. Het geïsoleerde bewerkbare draft gebruikt daarom de identieke bestaande OFL-fontbestanden via `https://cdn.jsdelivr.net/npm/@fontsource/geist@5.3.0/files/`. Er wordt geen effectcode van dat CDN geladen. Hoofdwebsite, read-only bronweergave en normale Vite-export houden de lokale npm-assets. Een export uit de editor bewaart de zichtbare draft-URL’s en heeft voor die fonts internet nodig. Dit voegt jsDelivr-fontverkeer toe aan de bestaande online sandbox; de gebruiksvoorwaarden van de CDN-dienst blijven afzonderlijk gelden. Er worden hiervoor geen secrets, accountgegevens of lokale projectbestanden naar een nieuwe dienst gestuurd.

Bij de laatste typographycontrole zijn ook Text Loop, Masked Heading, Particle Text en Warp Text aangesloten op dezelfde gescopeerde bestaande Geist-assets. Dat maakt de aangeboden gewichten daadwerkelijk beschikbaar; er is geen nieuw fontpakket geïnstalleerd of React Bits-font gekopieerd. De hierboven beschreven OFL-voorwaarden en het onderscheid tussen lokale Vite-assets en de versievaste sandbox-CDN gelden dus voor negen van de tien nieuwe voorbeelden. Split Flap gebruikt systeemmonospace.

## Animations fase 7 — batch 1, 17–18 november 2026

Visuele en functionele bronnen: de publieke gerenderde demo’s en propertytabellen van [Crystalized Ball](https://reactbits.dev/animations/crystalized-ball), [Electric Logo](https://reactbits.dev/animations/electric-logo), [Dither Veil](https://reactbits.dev/animations/dither-veil), [Glow Cursor](https://reactbits.dev/animations/glow-cursor) en [Scroll Expand](https://reactbits.dev/animations/scroll-expand). Pointer-, click- en scrollbediening, sliders en de zichtbare ball/cursor-presetmenu’s zijn in de browser onderzocht. Onderzoekscripts leggen uitsluitend gerenderde UI, tabellen en screenshots vast; er zijn geen upstream-effectbronbestanden of demo-assets opgenomen.

De op 17 november gelezen en op 18 november opnieuw gecontroleerde upstream LICENSE.md vermeldt nog steeds MIT + Commons Clause met een expliciete beperking voor het verkopen, sublicentiëren of herdistribueren van de componenten zelf. Die code is niet als gewone MIT-code overgenomen. De eigen shaderformules, GPU-particleposities, elektrische contourbeweging, ditheralgoritmen, trailadvection en scrolllayout zijn zelfstandig geschreven met algemeen bekende technieken. Hergebruik van contourtracing en de RAF-klok betreft uitsluitend eerder geschreven DevUI-code. Eigen projectcode blijft onder de bestaande MIT-licentie; dit geeft geen juridische garantie over alle mogelijke rechten en is geen toestemming om later upstreambron over te nemen.

Defaultmedia: een eigen analytisch gerenderde iriserende ring, eigen DevUI-code/bolt/diamond-vectorvormen en een zelfgeschreven SVG-landschap. Geen officiële React Bits-logo’s, referentiefoto’s, modellen, shaders, fontbestanden of Pro-assets toegevoegd. De ring/het landschap wijken zichtbaar af van de originele demo-afbeeldingen; dat is gedocumenteerd. Presetnamen zijn als zichtbare functionaliteit onderzocht; waarden zijn eigen combinaties en geen kopie van upstream-configuratiebestanden.

Geen nieuwe npm-dependencies, assetdiensten, API-keys of accounts. Normale previews gebruiken alleen bestaande packages en browser-API’s. Sandpack blijft de bestaande externe bundler gebruiken; eigen Media/Image URL’s kunnen uiteraard verkeer naar de door de gebruiker gekozen server veroorzaken. De gebruiker blijft verantwoordelijk voor rechten en CORS van eigen media. Er is door de agent niets gepubliceerd, gecommit, gepusht of gedeployd.

## Fase 8 — originele Cursor Trails, controle 18 november 2026

Publiek bekeken visuele referenties (alleen gerenderde previews, zichtbare bediening en beschrijving):

- https://pro.reactbits.dev/docs/components/arc-cursor
- https://pro.reactbits.dev/docs/components/celebration-cursor
- https://pro.reactbits.dev/docs/components/chroma-halo
- https://pro.reactbits.dev/docs/components/dither-cursor
- https://pro.reactbits.dev/docs/components/glyph-stream
- https://pro.reactbits.dev/docs/components/pigment-trail
- https://pro.reactbits.dev/docs/components/stardust-cursor

De openbare [React Bits Pro License Agreement](https://pro.reactbits.dev/license) vermeldt als laatste wijziging 11 september 2026. Secties 2.4 en 2.6 beperken herdistributie, onder meer in publieke componentbibliotheken, en verduidelijken dat openbare previews geen toestemming geven om de onderliggende broncode, componenten of implementatiedetails te extraheren of te kopiëren. Een betaalde licentie is dus geen vrijbrief voor het publiceren van Pro-broncode. Dit is een feitelijke inventarisatie van de gelezen voorwaarden, geen juridisch oordeel of garantie over onafhankelijke vormgeving of namen.

Daarom is geen Code-tab, Copy for AI, beschermd registryendpoint, netwerkbundel, shader, assetbestand of afgeschermde implementatie gebruikt. De browser is alleen gebruikt om de openbare visuele presentatie te bekijken en pointerinteractie uit te voeren. Vergelijkingsschermafbeeldingen staan uitsluitend in genegeerde `artifacts/`, niet in public assets of de componentbron.

De nieuwe DevUI-code is zelfstandig geschreven: sinus-gebaseerde coherente elektrische polylijnen en vertakkingen; Newtoniaanse confettideeltjes met drag/flutter; vervormde advecterende blooms; een zelf opgebouwd scalair veld met algemeen bekende Bayer-ordered-dithering; glyphdeeltjes met elastische tethers; kwastribbons met eigen ruimtelijke randruis en procedurele grain; stofdeeltjes met analytische turbulentie en gecachete radiale sprites. Geen upstream-algoritme, parameterconfiguratie of presetbestand gekopieerd. Eigen presets zijn lokaal afgestemd. Hergebruik betreft alleen bestaande eigen Canvas-/lifecyclehelpers. De vorm en beweging kunnen zichtbaar verschillen; er wordt geen exacte gelijkheid of officiële compatibiliteit geclaimd.

Er zijn geen nieuwe npm-dependencies, fonts, afbeeldingen, logo’s, textures of online assets toegevoegd. React en de bestaande browser-/UI-tools behouden hun eerder beschreven licenties. De eigen code valt onder de bestaande project-MIT-licentie, die geen rechten op React Bits Pro-materiaal verleent. Deze uitvoering publiceert niets en voert geen Git-mutaties of deployments uit. Controleer rechten opnieuw wanneer later toch externe code of assets worden toegevoegd.


## Fase 9 — gedeelde documentatie en zes Components (18 november 2026)

Visuele/functionele bronnen: publieke pagina’s [Text Loop](https://reactbits.dev/text-animations/text-loop), [Glass Surface](https://reactbits.dev/components/glass-surface), [Fluid Glass](https://reactbits.dev/components/fluid-glass), [Reflective Card](https://reactbits.dev/components/reflective-card), [Accordion Gallery](https://reactbits.dev/components/accordion-gallery), [Glass Icons](https://reactbits.dev/components/glass-icons) en [Chroma Grid](https://reactbits.dev/components/chroma-grid), plus de twee door de gebruiker aangeleverde screenshots. Alleen de gerenderde UI, het zichtbare gedrag en openbare propertybeschrijvingen zijn onderzocht; geen componentimplementatie, shaderbestand, registry-payload of Copy for AI-output is overgenomen.

De officiële [LICENSE.md](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md) is opnieuw gecontroleerd op 18 november 2026: MIT met Commons Clause, waaronder beperkingen voor producten waarvan de waarde uit herdistributie van de componenten bestaat. Deze bibliotheek neemt daarom geen upstream-componentcode over. De zelfstandige implementaties zijn geschreven met algemeen bekende afgeronde SDF’s, raymarching, normaalmetingen, backdrop-displacement, sampled lighting, CSS-perspectief, maskers en toegankelijke React-interactie. Een visuele referentie verleent geen recht op beschermde bronbestanden of assets. Dit is geen juridische garantie; controleer de actuele voorwaarden opnieuw vóór eventuele toekomstige overname/publicatie van externe code.

De nieuwe glas-/gallerymodules gebruiken bestaande eigen galleryArt.ts-illustraties, procedurele studio-reflecties, een eigen gegenereerde normaalmap en nieuw getekende SVG-pictogrammen. Geen externe foto’s, video’s, fonts, texturen, logo’s, shaderlibraries of nieuwe npm-dependencies. Reflective Card gebruikt standaard geen webcam of remote video; bij een zelf ingestelde video-URL blijven de rechten van dat materiaal de verantwoordelijkheid van de gebruiker. De bestaande React/Lucide/Sandpack/dependency-attributies blijven gelden.

De gedeelde codeviewer/highlighter en kopieercontext zijn eigen code; er zijn geen nieuwe externe highlighterlicenties. Getoonde exports bevatten de eigen implementatie en alle benodigde helpers. Onafhankelijke optica, eigen illustraties en procedurele reflecties zijn bewust geen exacte kopie of officiële API-compatibiliteitsclaim. De WebGL-fallback heeft beperktere optica en is als zodanig zichtbaar gelabeld. Er wordt in deze uitvoering niets gepubliceerd of gedeployed.

## Fase 10 — originele Arc/Pigment reconstructie, 18 november 2026

Visuele/functionele referenties: [Arc Cursor](https://pro.reactbits.dev/docs/components/arc-cursor) en [Pigment Trail](https://pro.reactbits.dev/docs/components/pigment-trail). Alleen de publiek weergegeven Preview, controls en propertybeschrijvingen zijn gelezen en met echte muisinteractie onderzocht. Geen Pro-Code-tab, Copy for AI, registry, netwerkpayloads, verborgen implementaties of betaalde shaders/assets gebruikt. Browseropnames zijn lokale, git-ignored onderzoeksartifacts, geen assets voor de website. Het optionele vergelijkingsscript leest uitsluitend gerenderde UI en neemt screenshots; het haalt geen componentbroncode op.

De [publieke Pro-licentie](https://pro.reactbits.dev/license), bekeken op 18 november 2026, bevat beperkingen op herdistributie van het Pro-product en verleent via publieke demo's geen recht op de onderliggende implementatie. Er is daarom geen Pro-productcode opgenomen. DevUI's nieuwe spline-/filamentalgoritmen, eigen hash/noise, pigmentatlas, papierstructuur, brush-dynamiek en lokale inputhelper zijn zelfstandig geschreven met bestaande React-/Canvas-API's en eigen lifecyclehelpers. Geen nieuwe dependency, afbeelding, video, font of texture van derden toegevoegd. De bestaande dependency-notices blijven gelden.

Dit document legt technische herkomst vast; het geeft geen juridische garantie over alle mogelijke rechten op de visuele vormgeving of de toepasselijkheid van voorwaarden. De eigen implementatie claimt geen identiteit met het Pro-product of rechten op officiële branding. Er is niets door deze uitvoering gepubliceerd/gecommit/gepusht/gedeployd.


## Fase 11 — zelfstandige Backgrounds, 19 november 2026

Referenties: [publieke Backgrounds-catalogus](https://reactbits.dev/c/backgrounds), [Gradient ASCII](https://reactbits.dev/backgrounds/gradient-ascii), [Holo Mosaic](https://reactbits.dev/backgrounds/holo-mosaic), [Flux Lines](https://reactbits.dev/backgrounds/flux-lines) en [Pattern Waves](https://reactbits.dev/backgrounds/pattern-waves). Alleen gerenderde Preview, zichtbare bediening, openbare propertybeschrijvingen en muisinteracties zijn onderzocht. Geen officiële componentbroncode, GLSL, interne assets, registryfiles, Copy for AI-output of Background Studio-exports zijn gebruikt. Screenshots zijn genegeerde lokale onderzoeksartefacten en worden niet als component-assets aangeboden.

De [actuele upstream LICENSE.md](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md), bekeken op 19 november 2026, vermeldt MIT met een aanvullende Commons Clause en beperkingen op herdistributie van de componenten zelf. Gratis beschikbare demo’s zijn daarom niet behandeld als toestemming om upstream componentcode in deze openbare bibliotheek op te nemen. Dit is een vastlegging van de gelezen voorwaarden, geen juridische garantie over toepasselijkheid of alle rechten op vormgeving.

De eigen analoge lichtvelden, glyphatlas, afgeronde tile-SDF, reflecties, interferentiekleuren, impliciete contouren, normals, hoogtevelden en GPU-lifecycle zijn zelfstandig geschreven met algemeen beschikbare Canvas/WebGL/GLSL-technieken. Geen nieuwe library, font, afbeelding, texture of andere externe asset toegevoegd. Bestaande React-/Vite-/Sandpack-attributies blijven gelden. Pattern Waves gebruikt hier Canvas 2D en vereist geen upstream ogl-dependency. Micro Slats is niet vervangen.

Onafhankelijke rendering en publieke default/propertynamen betekenen geen claim van officiële API-compatibiliteit, identieke optica of pixel-perfecte reproductie. De GPU-fallbacks zijn zichtbaar als vereenvoudigde alternatieven aangeduid. Er wordt door deze uitvoering niets gepubliceerd, gecommit, gepusht of gedeployed.
