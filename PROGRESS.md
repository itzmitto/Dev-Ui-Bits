# DevUI Bits — voortgang

Bijgewerkt: 16 november 2026. Versie 1.1.0.

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
