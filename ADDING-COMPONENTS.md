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

Bijvoorbeeld: **Crystalized Ball** staat al op `/animations/crystalized-ball` met id `crystalized-ball`.

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

6. Iedere control heeft een unieke key, een label en een ondersteund type. Die key moet in defaults voorkomen. Types zijn `range`, `number`, `color`, `text`, `select` en `toggle`. Numerieke controls hebben min/max en een positieve step; kleuren gebruiken `#rrggbb`. Select-opties moeten de default bevatten. Presets moeten echte, werkende propertycombinaties zijn.
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
