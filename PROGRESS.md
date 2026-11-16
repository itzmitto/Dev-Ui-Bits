# DevUI Bits — voortgang

Bijgewerkt: 16 november 2026. Versie 1.1.0.

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
