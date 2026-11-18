# Eén component toevoegen aan DevUI Bits

Werk in de bestaande projectroot, naast package.json. Bouw één effect per opdracht en laat andere geplande componenten ongemoeid. Git-commits, pushes en deployments voer je zelf uit.

## De centrale registry

`src/catalogNames.ts` bevat de aangeleverde namen in de gewenste categorie en volgorde. Dit is alleen catalogusdata. `src/registry.ts` koppelt deze namen aan echte implementatiedefinities en exporteert **één** definitieve `registry`.

- `status: 'planned'`: metadata met id, name, slug, category en description. Geen renderer, broncode of controls. De gedeelde `PlannedComponentPreview` verzorgt de card en detailpagina.
- `status: 'ready'`: dezelfde metadata plus preview, defaults, schema, source, exportName en dependencies; optioneel presets, styles en supportingFiles.
- `readyComponents` is een gefilterde weergave van dezelfde registry, geen tweede catalogus.
- `componentPath(item)` berekent de canonieke route uit categorie en slug. `findComponent(category, slug)` herkent ook aliases.

Sidebar, tellers, filters, kaarten, favorieten en detailroutes lezen deze registry. Je hoeft geen extra React Router-route of apart placeholderbestand toe te voegen.

## Van planned naar ready

Registratievoorbeeld: **Crystalized Ball** staat inmiddels Ready op `/animations/crystalized-ball`, met id `crystalized-ball`. Het onderstaande beschrijft zijn integratiepatroon; voeg deze implementatie niet nogmaals toe. Gebruik voor een volgende nieuwe implementatie een echt Planned-record, zoals Ripple Distortion.

1. Zoek de naam in `src/catalogNames.ts` en controleer het bestaande item, de route en status in de registry. Maak geen nieuwe naam, slug of id aan.
2. Bestudeer de zichtbare referentie en maak een eigen effectimplementatie. Voeg het echte effect toe als `src/effects/CrystalizedBall.tsx`, met een named export `CrystalizedBall`.
3. Volg het bestaande `EffectProps`-contract uit `src/effects/types.ts`: properties zijn strings, numbers of booleans. Gebruik getypeerde helpers of converteer expliciet naar de waarden die je effect nodig heeft. Gebruik echte defaults, veilige grenzen, resize-ondersteuning, reduced motion en cleanup van observers, listeners, timers en GPU-resources.
4. Voeg alleen benodigde libraries toe, indien de techniek dat rechtvaardigt. Controleer hun licenties. Geplande catalogusrecords hebben geen dependencies nodig.
5. Voeg **één** definitie aan de interne `implementations`-lijst in `src/registry.ts` toe. Gebruik exact de bestaande naam en categorie. Onderstaand voorbeeld toont uitsluitend de registratievorm; het implementeert geen effect:

```tsx
{
  ...def(
    'Crystalized Ball',
    'Animations',
    'Beschrijf hier het daadwerkelijk geïmplementeerde gedrag.',
    lazyPreview('CrystalizedBall', 'CrystalizedBall'),
    'CrystalizedBall',
    defaults,
    controls,
  ),
  dependencies: {}, // Vermeld hier uitsluitend de werkelijk gebruikte packages.
  // styles: ['CrystalizedBall.css'],
  // supportingFiles: ['crystalMath.ts'],
}
```

`defaults` en `controls` staan hier voor de echte, uitgewerkte waarden. Neem geen niet-werkende controls op. De helper `def` maakt een `ready`-definitie; de builder vervangt daardoor het bestaande geplande record op naam. Het id en de route blijven `crystalized-ball` en `/animations/crystalized-ball`. Laat de naam in catalogNames staan, zodat de volgorde behouden blijft.

6. Iedere control heeft een unieke key, een label en een ondersteund type. Die key moet in defaults voorkomen. Types zijn `range`, `number`, `color`, `text`, `select` en `toggle`. Numerieke controls hebben min/max en een positieve step; kleuren gebruiken `#rrggbb`; `inherit: true` staat daarnaast expliciet `currentColor` toe. Optionele `group`-labels tonen sectiekoppen binnen hetzelfde controlschema. Select-opties moeten de default bevatten. Presets moeten echte, werkende propertycombinaties zijn.
7. Het previewveld gebruikt React.lazy voor het echte effectmodule. Bestanden direct in `src/effects/` worden door de module-glob gevonden. De gedeelde detailpagina toont de echte renderer onder Suspense; de catalogus start alleen een preview na een klik. Er draait maximaal één cataloguspreview tegelijk.
8. `source` is de bestandsnaam zonder `.tsx`; `exportName` moet exact overeenkomen met de named export. De Code-tab leest de werkelijke bron via Vite `?raw`. Geef eigen CSS op in `styles` en benodigde helpers in `supportingFiles`, relatief aan `src/effects/`. Deze worden ook aan Sandpack en de browserexport toegevoegd. Importeer eventuele nieuwe CSS tevens voor de websitepreview, volgens het bestaande patroon in `src/main.tsx` of vanuit het effectmodule.
9. Dependencies in de definitie moeten overeenkomen met de imports. Sandpack voert broncode geïsoleerd uit en heeft internet nodig. Controleer echte compilatie, compilerfouten, reset, copy en export. Bied geen nepconversie van TSX naar JSX of CSS naar Tailwind aan.
10. Test het effect, de controls, muis/toetsenbord, resize, reduced motion, bronbestanden en geïsoleerde editor. Controleer de eigen route direct én na een refresh. Pas pas daarna de documentatie en het vastgelegde aantal ready/planned entries in tests aan.

## Routes en naamconflicten

De definitieve registry controleert dubbele ids en routes. Exact dezelfde naam wordt één keer opgenomen; bestaande implementaties die niet in de aangeleverde lijst staan, blijven achteraan in hun categorie staan.

Bij fase 4 zijn twee canonieke categorieën aangepast aan de aangeleverde lijst:

| Component | Canonieke route | Behouden alias |
| --- | --- | --- |
| Scroll Reveal | `/text-animations/scroll-reveal` | `/animations/scroll-reveal` |
| Animated List | `/components/animated-list` | `/animations/animated-list` |

Beide URLs gebruiken hetzelfde record, dezelfde controls en broncode. Maak voor een alias geen tweede definitie. Houd bij toekomstige categorieverplaatsingen de oorspronkelijke URL in `aliases`.

Bijna dezelfde namen zijn afzonderlijke geplande items. Bijvoorbeeld Text Type versus Typewriter Text, Tilted Card versus Tilt Card, Carousel versus Animated Carousel en Particles versus Particle Background. Een verwant bestaand effect betekent niet dat het gevraagde nieuwe effect al klaar is.

## Een volledig nieuwe naam

Voeg een nieuwe geplande naam toe aan de juiste groep in `catalogNames.ts`. De registry genereert automatisch de placeholder, sidebarlink, teller en route. Geef een slug die niet al bestaat. Wil je deze naam direct als echt component toevoegen, voeg dan ook de uitgewerkte implementatiedefinitie toe zoals hierboven.

## Testen

```sh
npm run typecheck
npm test
npm run build
npm run test:e2e
```

De registrytests controleren de aangeleverde volgorde, unieke namen/ids/slugs/routes, alle bestaande routes en echte bronbestanden. De catalogustest doorloopt alle componentlinks. Een toekomstige implementatie verandert de ready/planned-telling: werk de verwachte aantallen gericht bij en laat de overige geplande items gepland.

Voor visuele controle: mobiel, tablet, desktop en een groot scherm; beide thema’s. Houd de app-shell gethematiseerd en laat het effect zijn eigen instelbare previewachtergrond gebruiken. Screenshots staan in de genegeerde `screenshots/`-map.

## Opslag en favorieten

De bestaande componentworkshop en eigen componentroutes blijven compatibel met IndexedDB versie 1. Wijzig of wis deze data niet bij het toevoegen van built-ins. Favorieten gebruiken alleen ids onder `devui-favorites-v1` in localStorage. Het behouden van een id houdt bestaande favorieten bruikbaar wanneer een planned item ready wordt.

GET STARTED / MCP is een informatiepagina: er is geen MCP-server geconfigureerd. Blocks, App UI, Templates en Skills zijn expliciet geplande collecties zonder verzonnen inhoud. Bouw ook deze pas uit na een afzonderlijke opdracht.

## Uitgewerkt voorbeeld: Tech Text (fase 5)

Tech Text is nu de eerste planned → ready-uitbreiding na de catalogusfase. Het record behoudt id `tech-text`, positie en route `/text-animations/tech-text`. Alle overige planned records blijven ongewijzigd. De catalogus telt 30 ready en 209 planned.

- `effects/TechText.tsx`: kleine React-wrapper; één engine per mount, updates via refs en volledige cleanup.
- `TechText.engine.ts`: layout, canvasbuffers, alpha-hitdetectie, reveal-maskers, selectie, pointer capture, toetsenbord, intros en springs.
- `TechText.geometry.ts`: eigen marching-squares-contourtracing en geteste wiskunde.
- `TechText.types.ts`: publieke props, exacte defaults en veilige numerieke grenzen.
- `TechText.config.ts`: de 26 bestaande schema-controls en vier complete presets. Dit bestand hoort bij de websiteconfiguratie en hoeft niet mee in het losse componentexport.
- `TechText.css`: eigen effectstijl. De registry vermeldt CSS en alle drie engine-/geometry-/typehelpers, zodat Sandpack en exports compleet zijn.

De bestaande Controls-renderer ondersteunt nu optionele `group`-koppen en `inherit: true` voor kleuren. Dat laatste bewaart daadwerkelijk `currentColor`; de color input toont een geldige hex-swatch en een aparte terugknop voor overerving. Bestaande hex-kleurcontrols blijven gelijk. De presetselectie wordt afgeleid uit de actuele waarden, zodat Reset geen oude presetnaam laat staan.

De tests meten echte canvaspixels voor reveal, kleur, dragging, spring return en kick. Ze controleren ook broncompilatie en geïsoleerd bewerken in Sandpack, alle intro’s en presets, DPR/touch, reduced motion, pauzering en vijf schermmaten in beide thema’s. Gebruik deze gerichte controles als patroon voor de volgende zelfstandige implementatie; neem het effect of de bron van een referentiesite niet letterlijk over. Zie LICENSE_REVIEW.md voor de gecontroleerde upstreambeperkingen en herkomst.

## Native text-effectmodules (fase 6)

Een module blijft onder `src/effects/Naam.tsx` met een named export `Naam`, eigen CSS en waar nodig eigen helpers. Dit sluit aan op de bestaande lazy glob en raw-source-export; maak geen tweede rendererarchitectuur. `textBatchOne.config.ts` groepeert uitsluitend metadata, defaults, controls en volledige presets. `registry.ts` voegt deze aan de bestaande implementations toe; catalogNames, ids en routes blijven gelijk.

Neem alle lokale imports in supportingFiles op, ook transitieve helpers. `textRuntime.ts` biedt een visibility-/reduced-motion-aware klok; de daadwerkelijke animatielogica blijft in de eigen module. `textCanvas.ts` verzorgt canvasgrootte en texturen. Particle Text exporteert ook particleTargets; Warp Text exporteert de eigen shaderhelper. Gebruik dependencies `{}` wanneer React en browser-API’s volstaan. Test het werkelijke Sandpack-iframe: alleen zichtbaar broncode tonen bewijst geen compileerbaar voorbeeld.

Controleer na iedere batch de eerdere Ready-telling, unieke records, defaults/presets, echte beweging/interactie, cleanup, responsive screenshots, geïsoleerde compilatie en de volledige productieregressie. Documenteer afwezige referentieassets en aantoonbare visuele verschillen; voeg geen upstreamvideo of broncode toe zonder afzonderlijke rechtenbeoordeling.

Batch 2 gebruikt dezelfde registratieflow via `textBatchTwo.config.ts`, niet een tweede registry. `textLayout.ts` deelt alleen fitting, timing en stagger-volgorde; alle vijf effecten hebben hun eigen rendering en interactie. Stroke Text hergebruikt de eigen bestaande marching-squares-utility van Tech Text en exporteert daarom ook TechText.geometry.ts en het getypeerde supportbestand, zonder de Tech Text-implementatie te wijzigen.

Vergeet bij fontgebruik de transitieven niet: `textDisplay.css` hoort in supportingFiles, de module importeert die CSS, en `@fontsource/geist` staat in de voorbeelddependencies. De alias maakt de 100–900-assets bereikbaar zonder globale bestaande font-faces te vervangen. Houd de OFL-attributie van de bestaande fontdependency behouden. Test ook de werkelijke CSS/font-imports in Sandpack.

De lifecycle-browsertest instrumenteert ResizeObserver, IntersectionObserver en pending RAF’s tijdens echte SPA-navigatie. Gebruik dit als regressiecontrole, niet als algemene garantie dat iedere mogelijke geheugenlek afwezig is. Een screenshot bij rust bewijst geen animatie; test ook tussentijdse contouren, transforms, scharnierrotaties, volgers of echte pixelwijzigingen.

Sandpack-assetresolutie: `src/sandboxAssets.ts` behandelt uitsluitend de bekende package-relatieve URL’s in `/effects/textDisplay.css`. Het live draft gebruikt versievaste jsDelivr-fontassets; read-only Code en normale projectexports behouden de originele lokale package-imports. Verander de versie bewust wanneer de fontdependency wordt bijgewerkt. De adapter muteert de bronbestanden niet, en de memoization in Editor bewaart gebruikersbewerkingen bij themawissels. Controleer niet alleen of het iframe rendert: eis ook dat de bedoelde FontFace met het juiste gewicht werkelijk `loaded` is. Een systeemfallback kan een ogenschijnlijk geslaagde preview opleveren.

De vier typografische engines Text Loop, Masked Heading, Particle Text en Warp Text gebruiken eveneens textDisplay.css met expliciete voorbeelddependency @fontsource/geist. Split Flap blijft systeemmonospace. De registry leidt deze fontdependency af van de aanwezige helper, zodat runtime en source-export niet uiteenlopen. Text Loop meet de echte SVG-tekst en vult gesloten curves met een heel aantal frases; laadwijzigingen van fonts vernieuwen de meting. Gebruik bij toekomstige acroniemen zoals ASCII Text expliciet de bestaande catalogusnaam als een automatische PascalCase-naamverdeling niet klopt.

## Animations-modules (fase 7)

`animationBatchOne.config.ts` bevat alleen metadata, primitive defaults, controls en volledige presets. `registry.ts` koppelt deze aan dezelfde bestaande catalogusrecords; het is geen tweede registry. Voeg de volgende Animations-batch op dezelfde manier toe en behoud de exacte catalogusnamen/routes. De volgende nog Planned-component is Ripple Distortion.

Canvas-effecten kunnen `animationCanvas.ts` gebruiken voor ResizeObserver, DPR-cap en kleurconversie. Het deelt de bestaande `textRuntime.ts`-klok; ondanks de historische naam is die bruikbaar voor native animaties. De klok beheert offscreen/document visibility, reduced motion en één RAF. Iedere module houdt zijn eigen rendering en interactiestate in refs. Pointerbewegingen horen geen React-render per frame te veroorzaken.

Crystalized Ball exporteert zowel de eigen GPU-renderer als de lichtere Canvas-fallback. Voeg **alle** transitieve helpers toe aan supportingFiles. Electric Logo hergebruikt alleen de eigen bestaande Tech Text-contourutility en typehelper. `animationArt.ts` bevat eigen proceduraal artwork en een lokale SVG-data-URL; geen upstreammedia of assetaccount. Externe afbeeldingen hebben CORS én geschikte gebruiksrechten nodig.

Test niet alleen een zichtbaar iframe: controleer dat de bedoelde renderer daadwerkelijk draait. Sandpacks loopbeveiliging liet een 160.000-iteratielus voor 40.000 vierdelige particle-seeds afbreken en activeerde daardoor ten onrechte de fallback. De seedgenerator doet nu maximaal 40.000 iteraties met vier writes per iteratie. Ditherberekeningen zijn per rij opgedeeld en adaptief begrensd. Schakel de veiligheidscontrole niet uit om grote, legitieme berekeningen te laten werken.

De browsertests controleren ook echte GPU-resourceaantallen (shaders/programs/buffers), contextverlies/herstel, ontbrekende WebGL, observer-/RAF-teardown, broncompilatie, acht viewportgroottes en beide themes. Stop en documenteer resterende fouten voordat een nieuwe batch als klaar wordt gepresenteerd. `ScrollExpandProps` ondersteunt getypeerde React children in een normaal project; de primitive Customize-editor gebruikt Overlay Title als demo-inhoud. Window-scroll vraagt buiten de begrensde demo om een eigen natuurlijke paginalayout.

## Cursor Trails — module- en exportpatroon (fase 8)

De categorie staat in `types.ts` en `catalogNames.ts`. Zeven metadata-definities in `effects/cursorTrails.config.ts` worden via dezelfde `registry.ts` gekoppeld aan hun eigen lazy geladen TSX-module. Maak geen extra registry of handmatige Router-routes. Bij een toekomstige categorie: werk ook de bestaande iconen/omschrijvingen in Sidebar, App en HomePage bij en controleer de categoriegrids en categorietests.

Elke cursor heeft eigen simulatiestate en drawlogica. `cursorRuntime.tsx` deelt uitsluitend lokale pointercoördinaten (ook bij CSS-schaal), smoothing, autoplay-overname, visibility/reduced-motion/RAF en de begrensde canvasresizing. Pointerframes veroorzaken geen React-stateupdates. Render nooit via document-brede pointerlisteners of buiten de preview.

Neem alle transitieve imports mee in `supportingFiles`: cursorRuntime.tsx, cursorTrails.css, textRuntime.ts, textCanvas.ts en animationCanvas.ts. Het voorbeeld exporteert gewone React + browser-API-code met lege extra dependencies; de gedeelde helpers zijn onderdeel van het exporteerbare component, geen verborgen DevUI-runtime. `builtinFiles` genereert het echte gebruiksvoorbeeld. Houd presets volledig, schema’s maximaal 30 controls en alle controls functioneel. Pas pool-/rastercaps aan wanneer nieuwe controls veel werk kunnen veroorzaken; behoud Sandpacks loopbeveiliging.

`tests/cursor-trails.spec.ts` controleert alle routes en Sandpack-voorbeelden, echte pointer/klik, presets/pause/reset/restart, gevraagde schermgroottes, themes, touch/fullscreen, schaalcoördinaten, offscreen/reduced motion en unmount-cleanup. `src/cursorTrails.test.ts` controleert algoritmen, unieke records, volledige presets en transitieve bronexports. Het profielscript gebruikt native canvas-drawmetingen op de lokale productiebuild en schrijft alleen genegeerde artifacts. Test bronwijzigingen opnieuw voordat je Ready rapporteert.

De zeven cursor-effecten zijn zelfstandig geschreven aan de hand van de functionele opdracht en zichtbare algemene demo-ideeën. Gebruik dit patroon ook bij vervolgwerk: geen Pro-code, Copy for AI, registryendpoints, shaderextractie of beschermde assets. Zie LICENSE_REVIEW.md voor de afbakening.


## Gedeeld Playground en documentatie (fase 9)

`Controls.tsx` en `playground.css` verzorgen automatisch het compacte schema-grid voor iedere Ready-component. Gebruik bestaande types range/angle/number/text/color/select/toggle; labels moeten uniek en toegankelijk zijn. Een ongeldige hex-draft wijzigt geen echte prop. `Control.group` is optioneel, niet verplicht: voeg geen kunstmatige controls toe voor een mooier grid. De resetfunctie en complete presets komen van de bestaande definitie. Alle updates moeten andere waarden behouden.

`codeDocumentation.ts` bouwt Install, Usage, alle bestanden en AI-context uit dezelfde echte `builtinFiles`-output. `CodeDocumentation.tsx` is een lichte lexical viewer: geen compiler en geen Sandpack-start. Voeg geen kunstmatige JavaScript/Tailwind-conversie toe. Package-managercommando’s installeren uitsluitend de vermelde dependencies. Lokale component-/helper-/CSS-bestanden moeten via de getoonde paden worden toegevoegd.

De Code-tab biedt Edit in Playground en bronexport. `Editor.tsx` wordt lazy geladen op verzoek. Laat de preview gemount maar hidden bij een tabwissel; dit bewaart bijvoorbeeld actieve tabs en selectie. Gebruik visibility-aware clocks zodat een behouden, verborgen canvas niet blijft renderen. Bewaar ook editor-drafts bij theme-/tabwissels.

`glassComponents.config.ts` bevat de zes metadata-/schema-/presetsets; `registry.ts` koppelt ze aan bestaande catalogusitems. Maak geen nieuwe records voor deze slugs. GlassSurface exporteert ook `GlassPane`; AccordionGallery exporteert `AccordionPanels`; GlassIcons exporteert `GlassIconGrid`; ChromaGrid exporteert `ChromaCards`. Neem altijd alle transitieve imports mee in supportingFiles, inclusief CSS. De exporttest controleert lokale imports tegen de werkelijke bronbestanden en Sandpack compileert ieder voorbeeld.

Voor eigen optica: `glassOptics.ts` genereert lokaal een afgeronde normaalmap; `FluidGlass.renderer.ts` bevat de onafhankelijke shader en dispose-functie. Hergebruik deze eigen utilities waar passend, maar neem geen externe shadercode of assets over zonder expliciet geschikte herdistributierechten. WebGL-fallbacks moeten eerlijk gelabeld zijn en reduced motion respecteren. Beperk DPR, pauzeer onzichtbare canvassen en ruim shaders, buffers, textures, observers en callbacks op.

Nieuwe regressies staan in playground.spec.ts, glass-components.spec.ts, codeDocumentation.test.ts en glassComponents.test.ts. Controleer echte clipboard-inhoud, preview-identiteit, alle Ready-schema’s, importpaden, Sandpack-compilatie, offscreen/reduced motion, unmount-cleanup en de 3/2/1 control-layout tot 4K. Bestaande tests voor Editor blijven Sandpack controleren; Code-viewertests gebruiken nu `.code-documentation .code-viewer`.

De raw-sourceglob sluit `*.config.ts` uit: dit zijn registry-/controlsmetadata, geen runtimebestanden voor de component. Zo worden de metadata niet ook nog als ongebruikte bronstrings in de startbundel opgenomen. Een runtimehelper die werkelijk nodig is moet bij supportingFiles staan en mag niet de naam van een registryconfigbestand krijgen.

Customize-specifieke legacyregels zijn uit styles.css verwijderd. Houd de gedeelde control-styling in playground.css, zodat oude breakpointregels geen tweede layout blijven afdwingen.
