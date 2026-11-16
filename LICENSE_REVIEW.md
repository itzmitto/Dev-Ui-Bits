# Licenties, herkomst en publicatiecontrole

Controle uitgevoerd op 16 november 2026 voor de vastgelegde dependencies in package-lock.json. Dit is een technische inventarisatie, geen juridische garantie. Controleer voorwaarden opnieuw als je dependencies, assets of het gebruiksdoel verandert.

## Eigen projectcode — MIT

De 29 effectimplementaties, applicatiecode, naam, favicon en gallery-artwork zijn in dit project geschreven. De oorspronkelijke 21 componenten zijn behouden en uitgebreid met acht eigen implementaties. React Bits is alleen een visuele en functionele referentie; geen officiële logo's, bronbestanden, foto's of Pro-assets zijn opgenomen. De eigen code staat onder MIT in LICENSE.

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
