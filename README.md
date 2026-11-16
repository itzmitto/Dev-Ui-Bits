# DevUI Bits

Een zelfstandige bibliotheek met **29 originele React-componenten**, live previews, schema-gestuurde Customize-controls, echte broncode, Sandpack en een lokale componentworkshop. Gebouwd op het bestaande DevUI Bits-project: alle oorspronkelijke 21 effecten en functies zijn behouden.

**Start hier:** [SETUP-GITHUB-VERCEL.md](SETUP-GITHUB-VERCEL.md) beschrijft ZIP → VS Code → GitHub → publieke Vercel-site, met exacte commando's en controles vóór Git-initialisatie of remote-wijzigingen.

## Lokaal gebruiken

Aanbevolen: **Node.js 24 LTS**, met npm. De geïnstalleerde Vite- en Vitest-versies ondersteunen samen Node `^22.12.0 || ^24.0.0 || >=26.0.0`; `.nvmrc` en package.json kiezen expliciet 24.x, zodat Vercel geen nieuwere major kiest op basis van een brede range. Andere Node-majorversies worden niet door alle tools ondersteund.

```sh
npm ci
npm run dev
```

Open de door Vite afgedrukte URL. `/` opent de nieuwe homepage. `/browse` toont alle componenten; `/categories` toont de vijf categorieën. Alle bestaande component-URLs blijven direct bereikbaar, inclusief `/backgrounds/micro-slats`. Geen ChatGPT-login, API-key, accountkoppeling of backend nodig. Gebruik de meegeleverde `.npmrc` en `vendor/`-map; deze horen bij de overdraagbare dependencyconfiguratie.

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

## Homepage, thema en responsive layout

De homepage bevat een interactieve particle-hero, vijf registrycategorieën en zes echte kleine live previews. De navbar bevat Home, Components, Categories, de [GitHub-repository](https://github.com/itzmitto/Dev-Ui-Bits) en een sun/moon-knop. De zoekvelden, de `/`-sneltoets en publieke Create-links zijn verwijderd.

Dark/light werkt op de volledige applicatie, inclusief navigatie, Customize, broncode, Sandpack, formulieren, footer en gallerydialogen. `src/theme.tsx` volgt de systeemvoorkeur tot je handmatig kiest. De keuze wordt opgeslagen als `devui-theme` in localStorage; de kleine bootstrapscript in `index.html` past het thema vóór het eerste scherm toe. Het kiezen van een thema verandert geen componentinstellingen of IndexedDB-data. Effectpreviews houden hun eigen instelbare kleuren.

Centrale CSS-variabelen in `src/styles.css` definiëren achtergrond, tekst, surfaces, hover, borders, muted text, accent, sidebar, toolbar, inputs, radius, shadow en spacing. Tailwind v4 verwijst naar dezelfde tokens. De bibliotheek gebruikt een flexibel grid: de rechterrail verdwijnt onder 1440 px en de sidebar wordt onder 840 px een uitschuifbaar menu met Escape, focusherstel en scroll-lock. Boven 1920 px krijgen preview en controls meer ruimte; ook ultrawide en 4K hebben expliciete afwerking.

Homepagepreviews worden pas bij het eerste verschijnen gemount en behouden daarna hun interactiestatus. Canvas-loops en CSS-animaties pauzeren buiten beeld; de hero gebruikt het bestaande particle-effect met visibility- en reduced-motion-ondersteuning. De Sandpack-editor wordt als aparte chunk geladen. De registry importeert de 29 ingebouwde effectmodules en hun broncode nog gezamenlijk; opsplitsing per component is een toekomstige optimalisatie voor honderden effecten, geen bestaande laadlimiet.

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

- `src/registry.ts`: metadata, defaults, controls, dependencies en bronbestandskoppelingen. De registry bouwt automatisch sidebar, categorieën, routes, Customize en codebestanden.
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
2. Voeg een `def(...)`-item toe aan `registry`. Geef voor iedere control een passende default op.
3. Stel `exportName` in als de echte exportnaam afwijkt van de componentnaam zonder spaties.
4. Voeg eigen CSS toe in `styles: ['MijnEffect.css']` en helperbestanden in `supportingFiles: ['mijnHelper.ts']`. Deze paden zijn relatief aan `src/effects/`. Importeer de CSS ook eenmaal in `src/main.tsx` voor de websitepreview. De registry voegt ze automatisch toe aan de code-editor en export.
5. Declareer eventuele npm-dependencies in het registry-item en controleer hun licenties.
6. Test de live preview, controls en geïsoleerde broncode. Routes en navigatie volgen uit metadata; er is geen limiet op het aantal registry-items. Bij honderden grote effecten is aanvullend lazy loading van previewmodules en broncode een logische performance-optimalisatie.

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

De bestaande Git-remote verwijst naar jouw repository https://github.com/itzmitto/Dev-Ui-Bits. In fase 3 is uitsluitend lokaal gewerkt: geen Git-mutatiecommando’s, remote-wijzigingen of Vercel-deployment uitgevoerd. Je bepaalt zelf wanneer je commit, pusht en publiceert. De handleiding SETUP-GITHUB-VERCEL.md blijft beschikbaar; de lokale production preview is daadwerkelijk getest, een publieke Vercel-deployment is in deze ronde niet getest.

De SPA-configuratie volgt de [officiële Vercel-documentatie](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas).

## Volledige bron-ZIP

Voor fase 3 is op verzoek **geen nieuwe bron-ZIP gemaakt**. Een eerder archief uit fase 2 bevat deze lokale wijzigingen niet. Onderstaand bestaand script blijft beschikbaar voor wanneer je zelf wilt exporteren.

```sh
npm run source:zip
```

Resultaat: `artifacts/DevUI-Bits-Source.zip`, met structuur `DevUI-Bits/package.json`, `DevUI-Bits/src/`, enzovoort. Inclusief lockfile, public assets, configuraties, tests, vendor-adapter, handleidingen en licentieteksten. Zonder node_modules, dist, Git-geschiedenis, secrets, hostingmetadata, caches of testresultaten. Een SHA-256-bestand staat ernaast.

De scripts gebruiken alleen Node's ingebouwde modules. Python of een systeemspecifiek ZIP-commando is niet nodig om een nieuwe bron-ZIP te maken. Bij de oplevering van fase 2 is de ZIP ook buiten de oorspronkelijke projectmap uitgepakt en schoon gecontroleerd; zie PROGRESS.md voor de exacte uitgevoerde controles.

## Licenties en externe services

Eigen projectcode: MIT. Geist: OFL-1.1. Lucide: ISC. Sandpack: Apache-2.0. Alle voorwaarden blijven afzonderlijk van toepassing; zie LICENSE, LICENSE_REVIEW.md en THIRD_PARTY_NOTICES.md. De notices worden ook met de website meegeleverd via `/third-party-notices.txt`.

De galleryillustraties zijn lokaal opgebouwde originele SVG's; er zijn geen stockfoto's of externe beeldassets. De ongebruikte Nodebox-dependency met Sustainable Use License is vervangen door een eigen MIT browseradapter; alle gevraagde React-editorfuncties blijven beschikbaar. Server-/Node.js-sandboxtemplates worden niet aangeboden.

Sandpack heeft internettoegang tot zijn openbare bundler nodig. Tailwind-workshoppreviews gebruiken de Tailwind-browsercompiler via jsDelivr; de hoofdwebsite gebruikt de normale productiebundel. Er zijn geen API-keys nodig. Dependencylicenties en servicevoorwaarden zijn verschillende zaken; het project is niet volledig offline en de licentiecontrole geeft geen juridische garantie. Bekende onzekerheden over ontbrekende historische upstreamnotices staan expliciet in LICENSE_REVIEW.md.

## Lokale oplevering fase 3

De daadwerkelijke projectroot is de bestaande `DevUI-Bits/`-submap van de gevonden projectmap. Voer de npm-commando’s uit in die map. De Git-remote is uitsluitend gelezen; er zijn door de ontwikkelagent geen Git-mutaties, pushes of deployments uitgevoerd. Committen, pushen en publiceren doe je zelf. De bestaande Vercel-configuratie is behouden.

De Playwright-suite bevat de bestaande component-, Customize-, Sandpack-, IndexedDB- en exportflows plus homepage-, thema-, navigatie- en responsive regressietests. Screenshots staan lokaal in `screenshots/` en worden door Git genegeerd. De elf geteste viewportmaten zijn 375×812, 430×932, 768×1024, 1024×768, 1280×800, 1366×768, 1440×900, 1920×1080, 2560×1440, 3440×1440 en 3840×2160, steeds in dark en light. De concrete resultaten en grenzen staan in PROGRESS.md.
