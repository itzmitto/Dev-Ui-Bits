# DevUI Bits

Een zelfstandige bibliotheek met **246 catalogusitems: 58 werkende React-componenten en 188 geplande componenten**. De echte componenten hebben live previews, schema-gestuurde Customize-controls, broncode en Sandpack. Geplande componenten gebruiken één eenvoudige tekstplaceholder. Gebouwd op het bestaande DevUI Bits-project: alle 29 bestaande effecten en functies zijn behouden.

**Start hier:** [SETUP-GITHUB-VERCEL.md](SETUP-GITHUB-VERCEL.md) beschrijft ZIP → VS Code → GitHub → publieke Vercel-site, met exacte commando's en controles vóór Git-initialisatie of remote-wijzigingen.

## Lokaal gebruiken

Aanbevolen: **Node.js 24 LTS**, met npm. De geïnstalleerde Vite- en Vitest-versies ondersteunen samen Node `^22.12.0 || ^24.0.0 || >=26.0.0`; `.nvmrc` en package.json kiezen expliciet 24.x, zodat Vercel geen nieuwere major kiest op basis van een brede range. Andere Node-majorversies worden niet door alle tools ondersteund.

```sh
npm ci
npm run dev
```

Open de door Vite afgedrukte URL. `/` opent de nieuwe homepage. `/browse` toont alle componenten; `/categories` toont de zes categorieën. Alle bestaande component-URLs blijven direct bereikbaar, inclusief `/backgrounds/micro-slats`. Geen ChatGPT-login, API-key, accountkoppeling of backend nodig. Gebruik de meegeleverde `.npmrc` en `vendor/`-map; deze horen bij de overdraagbare dependencyconfiguratie.

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

Voor browsertests:

```sh
npx playwright install chromium
npm run test:e2e
```

Op Linux eventueel `npx playwright install --with-deps chromium`. De testconfiguratie gebruikt standaard Playwright's Chromium, zonder een lokaal absoluut browserpad. Optioneel kan `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` naar een eigen Chromium-installatie wijzen. `PLAYWRIGHT_BASE_URL` laat dezelfde tests op een al draaiende production preview draaien; de standaardtests starten anders zelf Vite op poort 5173.

## Complete componentcatalogus

`/browse` en `/get-started/index` openen dezelfde volledige catalogus. Deze bevat alle 217 aangeleverde namen in de gevraagde volgorde plus 22 bestaande namen en zeven originele Cursor Trails: **246 unieke records**, waarvan **52 Ready** en **194 Planned**. In fase 4 zijn uitsluitend catalogus en placeholders gebouwd. Fase 5 voegt Tech Text toe. Fase 6 leverde tien extra Text Animations. Fase 7 ontwikkelt uitsluitend Animations, te beginnen met vijf bestaande planned records.

| Categorie | Totaal | Ready | Planned |
| --- | ---: | ---: | ---: |
| Text Animations | 34 | 16 | 18 |
| Animations | 41 | 8 | 33 |
| Components | 56 | 10 | 46 |
| Micro Interactions | 39 | 5 | 34 |
| Backgrounds | 69 | 6 | 63 |
| Cursor Trails | 7 | 7 | 0 |

De sidebar bevat GET STARTED, EXPLORE en de zes inklapbare categorieën. De lange lijst scrollt zelfstandig, markeert de actieve entry en opent automatisch de geselecteerde categorie. Op mobiel blijft het de bestaande drawer met Escape en focusherstel. Er is geen Search Components-veld of Create Component-navigatie.

De catalogus heeft categorie- en statusfilters, sortering op catalogusvolgorde, naam en ready-first, een dynamische teller en compacte cards. Filters staan in de URL en blijven na refresh behouden. Favorieten werken lokaal via de bladwijzerknoppen en `/favorites`; ze worden apart van IndexedDB opgeslagen. Een cataloguspreview start alleen op verzoek, maximaal één tegelijk, en rendert niet buiten beeld. De meeste effectmodules worden pas geladen wanneer ze nodig zijn.

Alle bestaande component-URLs blijven werken. Scroll Reveal staat nu bij Text Animations en Animated List bij Components, met behoud van respectievelijk `/animations/scroll-reveal` en `/animations/animated-list` als aliases naar hetzelfde record. Vergelijkbare namen zoals Tilted Card en Tilt Card zijn niet zonder echte implementatie samengevoegd.

Geplande detailpagina’s hebben uitsluitend metadata, status, een eenvoudige previewcontainer en een teruglink. Code, Editor en Customize ontbreken tot er echte broncode is. GET STARTED bevat eigen introductie, installatie, changelog, favorieten en een eerlijke MCP-informatiepagina: er is geen MCP-server geconfigureerd. Blocks, App UI, Templates en Skills zijn duidelijk geplande collecties.

**Verder ontwikkelen:** [ADDING-COMPONENTS.md](ADDING-COMPONENTS.md) beschrijft hoe één planned component met behoud van id en route ready wordt, inclusief renderer, defaults, controls, CSS, dependencies, Sandpack en tests.

## Cursor Trails — fase 8

Zeven zelfstandige effecten staan onder `/cursor-trails`: **Arc Cursor, Celebration Cursor, Chroma Halo, Dither Cursor, Glyph Stream, Pigment Trail en Stardust Cursor**. Alle 45 eerdere Ready-componenten en 194 andere Planned-items zijn behouden. Sidebar, categoriepagina, homepage-categoriekaarten, filters en tellers gebruiken dezelfde registry.

- Arc: coherente elektrische polylijnen, vertakkingen, glow en klikontladingen.
- Celebration: tuimelende confetti met zwaartekracht, luchtweerstand, flutter, wind en klikexplosies.
- Chroma: advecterende, vervormde kleurwolken met vooraf opgebouwde organische sprites en instelbare resolutie.
- Dither: een vervallend scalair veld met vaste Bayer-drempels; de cellen vormen één samenhangende trail.
- Glyph: scrambling tiles met momentum, elastische tethers, viscositeit en splashes.
- Pigment: een doorlopende kwastribbon met variabele breedte, onregelmatige randen, blooming, grain en inktspatten.
- Stardust: fijne sprite-particles met turbulente stroming, swirl, gekleurde wakes en rollende klikpuffs.

Iedere pagina heeft volledige presets, schema-controls, Pause, Autoplay, touch/pointerinteractie en de bestaande Reset/Restart/fullscreen-tools. Effecten blijven binnen hun eigen preview. De echte TSX, CSS en alle lokale helpers zijn meegeleverd in Code en de geïsoleerde Sandpack-editor; er zijn geen nieuwe dependencies of externe assets nodig. Sandpack zelf heeft zoals voorheen internet nodig.

Alle engines gebruiken eigen Canvas 2D-code. Halo, glyphs, inkt en stof gebruiken analytische beweging; het zijn geen numerieke vloeistofsimulaties of kopieën van Pro-shaders. Vorm, beweging en timing kunnen afwijken van de openbare referenties. Reduced motion schakelt automatische beweging uit en laat statische pointer-/tapfeedback toe. DPR is maximaal 2 (lager bij quality low/medium); pools en ditherraster zijn begrensd. Grote dichtheden of fullscreen op tragere apparaten kunnen minder vloeiend zijn; gebruik lagere quality/density.

De bronherkomst en beperkingen van de Pro-licentie staan in [LICENSE_REVIEW.md](LICENSE_REVIEW.md). Er is geen Pro-code, registry, shader, logo of beschermd asset opgenomen. Reproduceerbare performancecontrole: start `npm run preview -- --port 4175`, voer daarna `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4175 node scripts/profile-cursor-trails.mjs` uit (eventueel met `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`). Dit meet draw-updates en lifecycle, geen universele hardware-FPS-garantie.

Fase 8 daadwerkelijk gecontroleerd: **strict TypeScript, 36/36 Vitest, productiebuild en de volledige 175/175 Playwright-regressies geslaagd**. Na de laatste kleine tekst-/CSS- en alpha-correcties zijn **23/23 getroffen productiechecks opnieuw geslaagd**. Dit omvat alle zeven echte Sandpack-voorbeelden, live editing/reset, pointer/klik, presets/pause/reset/restart, zeven schermformaten in beide themes, touch/fullscreen, dither-schaling, werkelijke parameterwerking en observer-/RAF-cleanup. De laatste responsivechecks verzamelen ook console-errors; er zijn geen fouten of horizontale overflow gevonden. De productie-renderproef haalt hier circa 59–60 draw-updates/s per effect met nul doorlopende verborgen/reduced-motion-draws. Alleen Chromium is getest. Details, logpaden, gevonden en herstelde fouten staan in [PROGRESS.md](PROGRESS.md).

## Tech Text — fase 5

`/text-animations/tech-text` gebruikt nu een eigen Canvas 2D-engine. Alle 29 eerdere implementaties blijven bestaan; alleen dit bestaande planned record is uitgebreid. De defaults zijn DevUI Bits, font-weight 600, maximaal 150px en -0,05em spacing. De tekst krimpt op smalle previews en centreert op de echte ink-bounds.

De 26 schema-controls en vier volledige presets regelen typography, geërfde of gekozen kleuren, dashed/solid contouren, letter/area/off-reveal, selection, labels, specks, guides, dragging, click kick, bounce, sweep en none/type/assemble/metrics-intro’s. De bestaande Restart-, Reset-, viewport- en fullscreenknoppen werken. Gebruik links/rechts en Enter/Spatie voor toetsenbordinteractie.

De engine meet graphemes en kerning, bewaart alpha-sprites en Path2D-contouren, gebruikt een herbruikbaar radiaal masker voor area reveal en substeps voor stabiele springs. DPR is begrensd op 2. De RAF-loop stopt buiten beeld, in een verborgen document en bij rust; reduced motion schakelt automatische beweging uit. Fontwijzigingen veroorzaken een nieuwe layout, pointerbewegingen geen React-renders. Een eigen Font Family moet al via CSS op de pagina geladen of op het apparaat beschikbaar zijn.

Code en Editor leveren de echte TSX, CSS en drie helperbestanden, zonder extra npm-dependencies. Sandpackbewerkingen blijven geïsoleerd. De herkomst en actuele upstreamlicentiecontrole staan in [LICENSE_REVIEW.md](LICENSE_REVIEW.md); neem React Bits-broncode niet zonder eigen beoordeling over. Uitgevoerde checks en beperkingen staan in PROGRESS.md.

## Homepage, thema en responsive layout

De homepage bevat een interactieve particle-hero, vijf registrycategorieën en zes echte kleine live previews. De navbar bevat Home, Components, Categories, de [GitHub-repository](https://github.com/itzmitto/Dev-Ui-Bits) en een sun/moon-knop. De zoekvelden, de `/`-sneltoets en publieke Create-links zijn verwijderd.

Dark/light werkt op de volledige applicatie, inclusief navigatie, Customize, broncode, Sandpack, formulieren, footer en gallerydialogen. `src/theme.tsx` volgt de systeemvoorkeur tot je handmatig kiest. De keuze wordt opgeslagen als `devui-theme` in localStorage; de kleine bootstrapscript in `index.html` past het thema vóór het eerste scherm toe. Het kiezen van een thema verandert geen componentinstellingen of IndexedDB-data. Effectpreviews houden hun eigen instelbare kleuren.

Centrale CSS-variabelen in `src/styles.css` definiëren achtergrond, tekst, surfaces, hover, borders, muted text, accent, sidebar, toolbar, inputs, radius, shadow en spacing. Tailwind v4 verwijst naar dezelfde tokens. De bibliotheek gebruikt een flexibel grid: de rechterrail verdwijnt onder 1440 px en de sidebar wordt onder 840 px een uitschuifbaar menu met Escape, focusherstel en scroll-lock. Boven 1920 px krijgen preview en controls meer ruimte; ook ultrawide en 4K hebben expliciete afwerking.

Homepagepreviews worden pas bij het eerste verschijnen gemount en behouden daarna hun interactiestatus. Canvas-loops en CSS-animaties pauzeren buiten beeld; de hero gebruikt het bestaande particle-effect met visibility- en reduced-motion-ondersteuning. De Sandpack-editor wordt als aparte chunk geladen. De meeste effectmodules worden inmiddels via React.lazy geladen. Field en de homepage-particles worden ook rechtstreeks door bestaande onderdelen gebruikt. De raw broncode blijft centraal beschikbaar voor Code en export; verder opsplitsen daarvan is een mogelijke vervolgstap voor honderden zware implementaties.

## Componenten

De oorspronkelijke 21 effecten zijn verdeeld over Text Animations, Animations, Components, Backgrounds en Micro Interactions. De acht aanvullingen zijn:

| Component | Route | Interactie |
| --- | --- | --- |
| Advanced Mega Menu | `/components/advanced-mega-menu` | rijke panels, toetsenbord, Escape, buitenklik, hoveroptie |
| 3D Interactive Card | `/components/3d-interactive-card` | CSS-perspective, tilt, glare en omklappen |
| Morphing Button | `/micro-interactions/morphing-button` | idle → loading → success, cleanup van timers |
| Animated Tabs | `/components/animated-tabs` | gedeelde indicator, content en grafiek, roving focus |
| Magnetic Navigation | `/components/magnetic-navigation` | veeranimatie, magnetische pointer en werkende panels |
| Interactive Particle Background | `/backgrounds/interactive-particle-background` | spatial hash, pointerkrachten, bursts, pauze buiten beeld |
| Scroll Storytelling Section | `/animations/scroll-storytelling-section` | sticky artwork, hoofdstukken en leesvoortgang |
| Advanced Image Gallery | `/components/advanced-image-gallery` | echte masonry/grid, filters, lightbox, zoom en focustrap |

Alle aanvullingen gebruiken de bestaande registry en paginatemplate. Reduced motion wordt ondersteund door Motion's instellingen, expliciete reduced-motion-hooks en CSS; het nieuwe particle-effect stopt continu tekenen bij reduced motion en wanneer het niet zichtbaar is.

## Architectuur en uitbreiden

- `src/registry.ts`: één definitieve ready/planned-registry, lazy previewmodules, defaults, controls, bronbestanden en routealiases.
- `src/catalogNames.ts`: de 217 aangeleverde namen, categorieën en volgorde.
- `src/CatalogPage.tsx` + `src/Sidebar.tsx`: filters, sortering, kaarten en uitgebreide navigatie.
- `src/PlannedComponentPreview.tsx`: één gedeelde placeholder en geplande detailpagina.
- `src/catalogState.ts` + `src/CatalogUI.tsx`: lokale favorieten en statusweergave.
- `src/catalog.css`: gethematiseerde catalogus-, sidebar- en responsive styling.
- `src/types.ts`: `Definition`, `CustomComponent`, categorieën en controls.
- `src/effects/`: eigen React-, Motion-, CSS- en Canvas-effecten. CSS-3D heeft geen Three.js nodig; er zijn geen GSAP- of Three.js-dependencies toegevoegd.
- `src/App.tsx`: gedeelde bibliotheekshell, componentpagina, collecties en behouden workshoproutes.
- `src/HomePage.tsx`: homepage, categorieoverzicht en previews die pas bij zichtbaarheid laden.
- `src/SiteChrome.tsx`: GitHub-knop, themaknop en gedeelde footer.
- `src/theme.tsx` + `index.html`: centraal themasysteem en instelling vóór de eerste render.
- `src/Controls.tsx`: tekst, kleur, nummer, range, select en toggle uit het schema.
- `src/Editor.tsx`: lazy-loaded Sandpack met multi-file editor, dependency-overzicht, foutmelding, console, copy, reset en export. Code draait in een geïsoleerde iframe.
- `src/storage.ts`: idb/IndexedDB, Zustand en gevalideerde versie-1 JSON-imports. Importeren maakt nieuwe IDs; bestaande componenten worden niet overschreven.
- `src/export.ts`: code-/project-ZIP en JSON-export in de browser.
- `src/styles.css`: centrale tokens, app-layout en Tailwind v4 via de officiële Vite-plugin.
- `scripts/package-source.mjs`: volledige overdraagbare bron-ZIP met één projectmap.
- `scripts/license-report.mjs`: dependencylicenties en publiek meegeleverde notices.

Een nieuw ingebouwd component toevoegen:

1. Exporteer een effect dat `EffectProps` accepteert in `src/effects/MijnEffect.tsx`.
2. Voeg een `def(...)`-item toe aan de interne `implementations`-lijst in `src/registry.ts`. Geef voor iedere control een passende default op.
3. Stel `exportName` in als de echte exportnaam afwijkt van de componentnaam zonder spaties.
4. Voeg eigen CSS toe in `styles: ['MijnEffect.css']` en helperbestanden in `supportingFiles: ['mijnHelper.ts']`. Deze paden zijn relatief aan `src/effects/`. Importeer de CSS ook eenmaal in `src/main.tsx` voor de websitepreview. De registry voegt ze automatisch toe aan de code-editor en export.
5. Gebruik exact de reeds geplande naam om hetzelfde catalogusrecord ready te maken; zie ADDING-COMPONENTS.md.
6. Declareer eventuele npm-dependencies in het registry-item en controleer hun licenties.
7. Test de live preview, controls en geïsoleerde broncode. Routes en navigatie volgen uit metadata; er is geen limiet op het aantal registry-items. De previewmodules zijn lazy geladen; bij honderden grote effecten kan ook de raw broncode verder worden opgesplitst.

De code-tab gebruikt de echte implementatie via Vite `?raw`. Built-ins bieden TSX en CSS; workshoptemplates zijn apart geschreven voor JSX/TSX en CSS/Tailwind. Er wordt geen nepconversie aangeboden.

## Eigen componenten bewaren

De publieke website heeft geen Create Component-knop of link. Voeg nieuwe gedeelde componenten bij voorkeur via VS Code en `src/registry.ts` toe, zoals hierboven beschreven.

De bestaande lokale workshop is voor compatibiliteit nog rechtstreeks bereikbaar via `/create`; bestaande `/edit/:id`-routes blijven werken. Deze route is niet afgeschermd met authenticatie, alleen uit de publieke navigatie gehaald. Bestaande IndexedDB-records en import/export zijn behouden, zonder datamigratie. Kies in deze behouden workshop naam, categorie, taal en styling en open de workspace. `/Component.tsx` of `/Component.jsx` exporteert standaard `Component`. De automatisch gegenereerde App geeft de ingestelde properties door.

Voorbeelddefaults:

```json
{"text":"Hello, possibilities.","color":"#a855f7","speed":1}
```

Bijbehorend schema:

```json
[
  {"key":"text","label":"Text","type":"text"},
  {"key":"color","label":"Primary color","type":"color"},
  {"key":"speed","label":"Speed","type":"range","min":0.1,"max":3,"step":0.1}
]
```

Ook `toggle`, `number` en `select` met `options` worden ondersteund. Nummers hebben min, max en positieve step nodig. Voeg dependencies toe als npm-naam/versie-JSON, bijvoorbeeld `{"motion":"^14.14.0"}`.

**Save component** bewaart code en metadata in deze browser. Na een refresh blijft de eigen route beschikbaar. **Export library** maakt een JSON-backup; **Import JSON** neemt die mee naar een ander apparaat of domein. **Export ZIP** in de editor downloadt een los React/Vite-componentproject.

IndexedDB is browser- en originlokaal. Je localhost-bibliotheek verschijnt dus niet vanzelf op Vercel en is niet automatisch zichtbaar voor andere bezoekers. Om een eigen component onderdeel van de gedeelde website te maken, voeg je de bron aan de registry toe en publiceer je die via Git.

## GitHub en Vercel

Het project is een gewone Vite-SPA. `vercel.json` stelt Vite, `npm ci`, `npm run build`, `dist` en een SPA-rewrite in. Daardoor werken directe links zoals `/components/tilt-card` en refreshes op die routes. De assets worden lokaal meegebundeld. Hostingmetadata van de eerdere omgeving is verwijderd.

De bestaande Git-remote verwijst naar jouw repository https://github.com/itzmitto/Dev-Ui-Bits. In fase 3 en 4 is uitsluitend lokaal gewerkt: geen Git-mutatiecommando’s, remote-wijzigingen of Vercel-deployment uitgevoerd. Je bepaalt zelf wanneer je commit, pusht en publiceert. De handleiding SETUP-GITHUB-VERCEL.md blijft beschikbaar; de lokale production preview is daadwerkelijk getest, een publieke Vercel-deployment is in deze ronde niet getest.

De SPA-configuratie volgt de [officiële Vercel-documentatie](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas).

## Volledige bron-ZIP

Voor fase 3 en 4 is op verzoek **geen nieuwe bron-ZIP gemaakt**. Een eerder archief uit fase 2 bevat deze lokale wijzigingen niet. Onderstaand bestaand script blijft beschikbaar voor wanneer je zelf wilt exporteren.

```sh
npm run source:zip
```

Resultaat: `artifacts/DevUI-Bits-Source.zip`, met structuur `DevUI-Bits/package.json`, `DevUI-Bits/src/`, enzovoort. Inclusief lockfile, public assets, configuraties, tests, vendor-adapter, handleidingen en licentieteksten. Zonder node_modules, dist, Git-geschiedenis, secrets, hostingmetadata, caches of testresultaten. Een SHA-256-bestand staat ernaast.

De scripts gebruiken alleen Node's ingebouwde modules. Python of een systeemspecifiek ZIP-commando is niet nodig om een nieuwe bron-ZIP te maken. Bij de oplevering van fase 2 is de ZIP ook buiten de oorspronkelijke projectmap uitgepakt en schoon gecontroleerd; zie PROGRESS.md voor de exacte uitgevoerde controles.

## Licenties en externe services

Eigen projectcode: MIT. Geist: OFL-1.1. Lucide: ISC. Sandpack: Apache-2.0. Alle voorwaarden blijven afzonderlijk van toepassing; zie LICENSE, LICENSE_REVIEW.md en THIRD_PARTY_NOTICES.md. De notices worden ook met de website meegeleverd via `/third-party-notices.txt`.

De galleryillustraties zijn lokaal opgebouwde originele SVG's; er zijn geen stockfoto's of externe beeldassets. De ongebruikte Nodebox-dependency met Sustainable Use License is vervangen door een eigen MIT browseradapter; alle gevraagde React-editorfuncties blijven beschikbaar. Server-/Node.js-sandboxtemplates worden niet aangeboden.

Sandpack heeft internettoegang tot zijn openbare bundler nodig. Tailwind-workshoppreviews gebruiken de Tailwind-browsercompiler via jsDelivr; de hoofdwebsite gebruikt de normale productiebundel. Er zijn geen API-keys nodig. Dependencylicenties en servicevoorwaarden zijn verschillende zaken; het project is niet volledig offline en de licentiecontrole geeft geen juridische garantie. Bekende onzekerheden over ontbrekende historische upstreamnotices staan expliciet in LICENSE_REVIEW.md.

## Lokale oplevering fase 5

De daadwerkelijke projectroot is de bestaande `DevUI-Bits/`-submap van de gevonden projectmap. Voer de npm-commando’s uit in die map. De Git-remote is uitsluitend gelezen; er zijn door de ontwikkelagent geen Git-mutaties, pushes of deployments uitgevoerd. Committen, pushen en publiceren doe je zelf. De bestaande Vercel-configuratie is behouden.

De Playwright-suite bevat de bestaande component-, Customize-, Sandpack-, IndexedDB- en exportflows plus homepage-, thema-, navigatie- en responsive regressietests. Fase 4 voegt controles toe voor alle 239 catalogusroutes, namen, categorieën, filters, sortering, favorieten, placeholders en routealiases. Screenshots staan lokaal in `screenshots/` en worden door Git genegeerd. De elf geteste viewportmaten zijn 375×812, 430×932, 768×1024, 1024×768, 1280×800, 1366×768, 1440×900, 1920×1080, 2560×1440, 3440×1440 en 3840×2160, steeds in dark en light. Fase 5 slaagt: typecheck, 14 Vitest-tests, productiebuild en de volledige 92 Playwright-tests. Na de laatste controlmetadata-validatie zijn de vijf getroffen instellingen-, import- en editorflows ook gericht op de herbouwde productieversie geslaagd. De catalogus en planned-pagina’s zijn op de tien fase-4-breedtes in beide thema’s gecontroleerd; de behouden homepage/detailmatrix bevat ook 1280px. Browsercontrole is beperkt tot Chromium. De concrete resultaten, herstelde fouten en grenzen staan in PROGRESS.md.

## Text Animations — fase 6, batch 1

Text Loop, Masked Heading, Particle Text, Split Flap Text en Warp Text hebben eigen modules, complete presets, echte TSX/CSS-bronbestanden en geïsoleerde Sandpack-voorbeelden. Technieken: SVG textPath met momentum; Canvas-media clipping; glyph-particles met springs; mechanische halve flip-panelen; een zelfstandig geschreven WebGL-lensshader. Geen nieuwe npm-packages geïnstalleerd. Vier voorbeelden uit deze batch gebruiken de bestaande Geist-fontdependency; Split Flap gebruikt systeemmonospace. Alle 30 eerdere Ready-implementaties blijven behouden.

Masked Heading gebruikt standaard een eigen gegenereerde kleurmesh, geen gekopieerde referentievideo. Via Media URL kan eigen CORS-geschikte media worden gebruikt. Font Family verwacht een lokaal of via CSS geladen font. Split Flap gebruikt voor de schema-editor een met `|` gescheiden phrasestring. Warp Text toont een expliciete statische fallback als WebGL ontbreekt. De controls en presetnamen volgen de zichtbare demo; eigen parameterafstemming is geen claim van identieke upstreambron of pixelperfecte reproductie.

De resterende 18 aangevraagde Text Animations blijven Planned tot hun eigen implementatie en controles zijn afgerond. Zie PROGRESS.md voor actuele testresultaten en voortgang.

## Text Animations — fase 6, batch 2

Stroke Text, Depth Text, Fold Text, Echo Text en Circular Text zijn gekoppeld aan hun bestaande records en routes. Elke module heeft eigen TSX/CSS, schema-controls, vier complete presets, bronexports en een geïsoleerd compileerbaar Sandpack-voorbeeld. Stroke Text maakt echte SVG-contouren uit eigen glyphmetingen; Depth Text gebruikt een 3D-stack met springcompressie; Fold Text echte scharnierpanelen; Echo Text vertraagde kopieën met pointer/scroll/auto-trails; Circular Text gemeten ringtypografie met angular dragging en momentum.

Negen nieuwe voorbeelden gebruiken bestaande Geist-fontassets via de eigen alias `DevUI Display`, zodat 100–900 echt beschikbaar zijn zonder de fontselectie van bestaande pagina’s te wijzigen. Het project had `@fontsource/geist` al geïnstalleerd; de geïsoleerde voorbeelden vermelden die dependency nu ook. Fontlicentie: OFL-1.1. Er is geen extra animatie-, shader- of physicsbibliotheek geïnstalleerd.

De publieke presetnamen en relevante properties zijn onderzocht; presetwaarden en algoritmen zijn zelfstandig afgestemd. Dit is geen claim van pixelperfecte reproductie. Stroke Text tekent uit gerasterde fonts afgeleide vectorcontouren, niet de oorspronkelijke font-Béziercurves. Circular Text biedt in de primitive schema-editor enkele eigen center-opties in plaats van willekeurige React children. Een custom Font Family moet al op de gebruiker zijn apparaat of via CSS beschikbaar zijn.

Sandpack laat package-relatieve font-URL’s in CSS onveranderd. Alleen het bewerkbare geïsoleerde draft zet daarom de bekende Geist-assetpaden om naar de vastgezette openbare jsDelivr-packageversie 5.3.0. Code-tab en normale Vite-projectexport behouden de originele npm-relatieve CSS en lokaal gebundelde fonts. Een export vanuit de live editor bevat de op dat moment zichtbare draft-URL’s. De editor had al internet nodig; de hoofdwebsite blijft voor deze fonts zelfstandig.

Optionele lokale renderproef na `npm run preview`: `PLAYWRIGHT_BASE_URL=http://localhost:4173 node scripts/profile-text-effects.mjs`. Installeer eerst Playwright Chromium zoals hierboven. Deze proef telt echte canvas-/WebGL-draws of DOM/SVG-mutaties en controleert offscreenstilstand. Het is geen algemene FPS- of geheugenlekgarantie.

Verificatie bij afronding van fase 6, batches 1–2: **strict TypeScript, 25/25 Vitest, productiebuild en 128/128 Playwright-tests geslaagd**. Getest zijn onder meer de behouden componenten/routes/editor/IndexedDB-flows, alle tien nieuwe bronnen in Sandpack, daadwerkelijke fontassetlading, controls/presets, responsive themes, pointer/touch, glyphmetingen, video-lifecycle en observer-/RAF-cleanup. De eerdere proef en reparaties staan in PROGRESS.md. Fase 6 is nog niet geheel afgerond: batch 3 tot en met 6 blijven Planned.

## Animations — fase 7, batch 1

De bestaande routes van **Crystalized Ball, Electric Logo, Dither Veil, Glow Cursor en Scroll Expand** zijn aangesloten op eigen implementaties. Alle 40 eerdere Ready-componenten en de 18 overige Planned Text Animations zijn behouden. De resterende 33 aangevraagde Animations blijven Planned. Er zijn geen nieuwe dependencies geïnstalleerd.

- Crystalized Ball: native WebGL met echte 3D-particleposities, maximaal 40.000 GPU-punten, meerdere elektrische randfilamenten, flares, diepte, haze, pointerstroming en click kick. Contextverlies/herstel en een expliciete geanimeerde Canvas-fallback met maximaal 2.200 deeltjes. De fallback is eenvoudiger dan de WebGL-renderer.
- Electric Logo: eigen marching-squares-alpha-tracing, uniforme contoursampling, gecachete normalen, fluctuerende filamenten en springende arcs. Standaard een eigen DevUI-codevorm; eigen CORS-afbeeldingen kunnen via Image URL worden gebruikt. Bloom rendert op halve resolutie, de scherpe kern op volledige DPR.
- Dither Veil: echte Floyd–Steinberg-/Atkinson-error diffusion en Bayer-, noise- en lijnendithering; duotone/RGB, kleurreveal, celgewijs terugkeren, reverse en click waves. Standaard eigen iriserend artwork. De kwaliteit begrenst het werkrooster adaptief tot circa 50.000/100.000/180.000 cellen; op grote previews kan de effectieve pixelgrootte daardoor toenemen.
- Glow Cursor: verbonden, geadveceerde lichtfilamenten, koelende kleuren, geleidelijke uitdoving en click-vortices. Geen vloeistofsolver; dit is een eigen lichttrailtechniek, niet de nog Planned Splash Cursor.
- Scroll Expand: een eigen scrollcontainer met pinned stage, werkelijk scrollgestuurde frameafmetingen, radius en zoom, verdwijnende titel en inkomende overlay. Afbeelding/video, toegankelijk scrollfocus en optionele window-scroll. Eigen landschapsillustratie als standaardmedia. Window-scroll verwacht een natuurlijke documentflow met voldoende ruimte voor de lange track; gebruik in begrensde previewpanelen de standaard interne scroller.

Iedere module heeft eigen TSX/CSS, complete presets, werkende schema-controls, daadwerkelijke bronexports en de bestaande geïsoleerde Sandpack-editor. Effectachtergronden zijn bewust onafhankelijk van het app-thema. De getoonde algoritmen en presetafstemming zijn zelfstandig geschreven; eigen logo/artwork verschillen van de officiële demo-assets. Er wordt geen pixelperfecte of identieke interne simulatie geclaimd.

De renderers gebruiken de bestaande visibility-aware klok en begrenzen DPR op maximaal 2. De gedeelde klok synchroniseert zijn reduced-motionstatus ook in het frame, omdat een gewijzigde mediawaarde in Chromium al vóór het change-event zichtbaar kan zijn. Er zijn geen nieuwe Text Animation-effecten gebouwd. De Seed-initialisatie en grote ditherroosters gebruiken beperkte/per-rij-lussen, zodat Sandpacks veiligheidslimiet intact kan blijven.

Teststatus en laatste visuele/performance-uitkomsten staan in PROGRESS.md. Herhaal de lokale renderproef met `PLAYWRIGHT_BASE_URL=http://localhost:4173 node scripts/profile-animation-effects.mjs` na het starten van een production preview. De proef telt renderupdates en offscreen/reduced-motionstilstand; dit is geen algemene hardware-FPS-garantie. Het precieze vervolgpunt is batch 2: Ripple Distortion, Elastic Mesh, Swarm Cursor, Halftone Reveal en Pixel Swap.

Definitieve verificatie van fase 7, batch 1 (18 november): **strict TypeScript, 31/31 Vitest, productiebuild en 154/154 Playwright-tests geslaagd**. De suite bevat alle behouden regressies plus 26 nieuwe checks voor rendering, controls, presets, werkelijke Sandpack-compilatie, GPU-/observer-/RAF-cleanup, contextverlies/fallback, eigen afbeeldingen/video, diepe routes, touch/DPR, geschaalde pointerposities en acht viewportmaten in beide thema’s. Lokale Chromium-renderproef: circa 59–60 Canvas/WebGL-updates/s voor de vier grafische effecten, nul offscreen/reduced-motion-draws in de gemeten intervallen. De DOM-animatie Scroll Expand wordt niet door deze drawprofiler geteld. Dit is geen algemene hardware-, browser- of geheugenlekgarantie. Batch 2 is nog niet geïmplementeerd.


## Fase 9 — Playground en code-documentatie

Alle Ready-pagina’s gebruiken één compact Customize-grid (3/2/1 kolommen), met directe updates, instelbare presets, gevalideerde hexvelden en echte toetsenbordbediening. De Code-tab toont **Install, Usage en Code**: werkelijke dependencies, lokale bestandsinstructies, syntaxkleuren, regelnummers, bronbestandsselectie en uitklapbare snippets. Alleen daadwerkelijk beschikbare taal-/stijlvarianten worden getoond. Er is geen DevUI-package of shadcn-installatieregistry.

Copy Install, Copy Usage, Copy Code, Copy All Files en Copy for AI kopiëren de eigen bronbestanden en actuele instellingen. **Edit in Playground** opent pas dan Sandpack; de bestaande Editor-tab, live foutmeldingen, meerdere bestanden, Reset, Copy en export blijven beschikbaar. De oorspronkelijke preview blijft gemount bij tabwissels; instellingen en interactieve state blijven behouden. Animatieklokken pauzeren wanneer de verborgen preview buiten beeld is.

Zes bestaande Planned-items hebben nu eigen implementaties in dezelfde registry:

- **Glass Surface**: eigen lens-normalmap + SVG-displacement voor echte backdrop-vervorming; `GlassPane` accepteert React children. Frosted-modus is een expliciete browserfallback.
- **Fluid Glass**: zelfstandige WebGL SDF-raymarcher met torus, bol en afgeronde kubus, optische dikte, refractie, dispersie, reflections en pointer-/klikmorphing. Bij ontbrekende WebGL is er een duidelijk gelabelde, eenvoudiger Canvas-lens.
- **Reflective Card**: procedureel bemonsterde studio-reflectie met brushed metal, pointerlicht en tilt; optionele eigen video-URL. Geen webcamtoegang of externe standaardvideo.
- **Accordion Gallery**: uitschuifbare panelen met eigen SVG-artwork, parallax, kleuronthulling en pijltjes/Home/End-navigatie.
- **Glass Icons**: eigen vectoriconen en echte glazen platen, met kleurbending, highlights en bruikbare detailacties. `GlassIconGrid` ondersteunt eigen items, links en callbacks.
- **Chroma Grid**: gedempte cursor-spotlight onthult kleur boven grayscale; eigen artwork, flexibele kolommen en toegankelijke detaildialogen. `ChromaCards` ondersteunt eigen items/links.

Geen nieuwe dependencies. Alle oorspronkelijke 52 Ready-componenten en alle 246 routes blijven behouden; overige 188 items zijn Planned. Broncode en lokale export bevatten alle transitieve helpers. Publieke demo’s zijn visuele/functionele referenties, geen compatibiliteitsgarantie. De procedurele studio, eigen illustraties, vereenvoudigde fallback en onafhankelijk geschreven glasoptica verschillen zichtbaar van sommige officiële voorbeelden. Zie PROGRESS.md voor daadwerkelijk uitgevoerde tests en LICENSE_REVIEW.md voor herkomst en beperkingen.
