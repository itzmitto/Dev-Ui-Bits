# DevUI Bits naar VS Code, GitHub en Vercel

Je hebt geen ChatGPT-hosting, login, API-key of backend nodig. Sandpack compileert via zijn openbare externe bundler; daarvoor is internet nodig. Je eigen componenten worden lokaal in je browser opgeslagen.

Gebruik **Node.js 24 LTS** en de meegeleverde lockfile. De tools ondersteunen Node `^22.12.0 || ^24.0.0 || >=26.0.0`; Het project fixeert Node 24.x in package.json, zodat Vercel dezelfde geteste major gebruikt. Controleer:

```sh
node --version
npm --version
```

De Git-commando's hieronder werken in Git Bash op Windows en in de terminal op macOS/Linux. Vervang de voorbeeld-URL door jouw echte GitHub-repository-URL. Publiceer geen persoonlijke componenten die je niet openbaar wilt maken.

## Stap 1 — ZIP downloaden en uitpakken

Download **DevUI-Bits-Source.zip** en pak hem uit met je bestandsbeheerder. Daarin staat de volledige map `DevUI-Bits/`. Bewaar deze map als projectmap. `node_modules`, `dist`, oude Git-geschiedenis, hostingmetadata en secrets zijn bewust weggelaten.

## Stap 2 — Openen in VS Code

Kies **File → Open Folder** en selecteer `DevUI-Bits`. Open vervolgens **Terminal → New Terminal**. Als het `code`-commando beschikbaar is, kan het ook zo:

```sh
cd DevUI-Bits
code .
```

Controleer dat `package.json` in de huidige terminalmap staat.

## Stap 3 — Dependencies installeren

```sh
npm ci
```

Gebruik ook de meegeleverde `.npmrc` en `vendor/`-map. Die zorgen dat Sandpack alleen de benodigde browser-runtime gebruikt. Verwijder deze bestanden niet. `npm ci` installeert precies de versies uit `package-lock.json`.

## Stap 4 — Lokaal starten en testen

```sh
npm run dev
```

Open de lokale URL die Vite afdrukt. Stop met **Ctrl+C**. Controleer een productieversie:

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

Open de afgedrukte preview-URL, ga direct naar `/components/tilt-card`, en refresh de pagina. Browserend-to-endtests draaien met:

```sh
npx playwright install chromium
npm run test:e2e
```

Op Linux kunnen extra systeembibliotheken nodig zijn: `npx playwright install --with-deps chromium`. Er staat geen computerspecifiek Chrome-pad in de configuratie.

## Stap 5 — Maak zelf een lege GitHub-repository

Log in op GitHub en kies **New repository**. Kies zelf de naam, bijvoorbeeld `devui-bits`, en **Public**. Maak de repository leeg: voeg op GitHub geen README, LICENSE of gitignore toe; die zitten al in het project. Kopieer de HTTPS-URL. Deze handleiding maakt geen repository namens jou aan.

## Stap 6 — Controleer Git vóór je iets initialiseert of verbindt

Voer eerst uit:

```sh
git rev-parse --show-toplevel
git status
git remote -v
```

Een foutmelding dat dit geen Git-repository is, is normaal bij een schone ZIP. Initialiseer alleen als er nog geen repository bestaat:

```sh
git init -b main
```

Bestaat er al een repository? Controleer of `--show-toplevel` precies jouw projectmap aanwijst. Als het een bovenliggende map is, verplaats de uitgepakte map buiten die bestaande repository en controleer opnieuw. Initialiseer niet blind een tweede repository en verwijder geen bestaande geschiedenis.

Controleer vervolgens de remote:

```sh
git remote -v
git remote get-url origin
```

Alleen als `origin` nog niet bestaat, voeg je jouw echte URL toe:

```sh
git remote add origin https://github.com/JOUW_GEBRUIKERSNAAM/JOUW_REPOSITORY.git
```

Als `origin` al naar jouw bedoelde nieuwe repository wijst, sla je `remote add` over. Wijst hij ergens anders naartoe? Overschrijf die remote niet. Gebruik bij voorkeur een schone uitgepakte ZIP-map, of voeg bewust een aparte naam toe nadat je hebt gecontroleerd dat `github` nog niet bestaat:

```sh
git remote get-url github
git remote add github https://github.com/JOUW_GEBRUIKERSNAAM/JOUW_REPOSITORY.git
```

Gebruik in dat laatste geval in de volgende stap `github` in plaats van `origin`.

## Stap 7 — Controleren, committen en pushen

Controleer eerst of de doelrepository echt leeg is en welke branch je lokaal gebruikt:

```sh
git branch --show-current
git ls-remote origin
git status --short
git add --dry-run .
```

`git ls-remote origin` moet voor de nieuw gemaakte lege repository geen bestaande refs tonen. Toont het wel bestaande commits/branches? Stop en controleer de repository. Force-push nooit.

Controleer dat `.env`, `node_modules`, `dist` en `artifacts` niet worden toegevoegd. Commit daarna:

```sh
git add .
git diff --cached --stat
git commit -m "Add DevUI Bits component library"
git push -u origin HEAD
```

`HEAD` pusht je huidige branch zonder hem te hernoemen. Noteer de branchnaam uit `git branch --show-current` voor Vercel. Als Git om je identiteit vraagt, configureer je eigen Git-naam en e-mailadres lokaal. Als GitHub om authenticatie vraagt, gebruik je GitHub's ondersteunde login of credential manager; zet geen token in je repository of remote-URL.

## Stap 8 — GitHub-repository importeren in Vercel

Log in op Vercel, kies **Add New → Project**, en importeer jouw repository. Selecteer de branch die je zojuist hebt gepusht.

| Instelling | Waarde |
| --- | --- |
| Root Directory | de map met `package.json`, meestal `./` |
| Framework Preset | Vite |
| Node.js Version | 24.x |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment variables | niet nodig |

`vercel.json` bevat de SPA-rewrite voor React Router. Daardoor werken directe componentlinks en browserrefreshes op diepe routes. De configuratie volgt de [officiële Vercel-documentatie voor Vite-SPA's](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas).

## Stap 9 — Publiek deployen

Klik zelf op **Deploy**. Open na een succesvolle build de door Vercel gegeven URL, rechtstreeks ook op `/components/tilt-card` en `/components/advanced-image-gallery`. Refresh die pagina's. Controleer Preview, Customize, Editor en Create Component.

Controleer in de Vercel-instellingen of **Deployment Protection** de productie-URL afschermt; kies de gewenste publieke toegang in je eigen account. Dit project bevat zelf geen login. Deze oplevering maakt geen Vercel-project en geen publieke GitHub-repository aan.

IndexedDB hoort bij de browser én de domeinnaam. Een custom component op localhost verschijnt niet automatisch op je Vercel-domein. Gebruik **Export library** en **Import JSON** om je componenten over te zetten. Een browseropslag-import publiceert die code niet automatisch aan alle bezoekers; voor een gedeeld ingebouwd component registreer je de broncode in `src/registry.ts` en commit je die.

## Stap 10 — Wijzigingen publiceren via Git

Pas de code aan, test lokaal en controleer je huidige remote voordat je pusht:

```sh
git remote -v
npm run typecheck
npm test
npm run build
git status --short
git add .
git diff --cached --stat
git commit -m "Improve DevUI Bits components"
git push
```

Na de eerste push met `-u` weet Git welke branch bij welke remote hoort. Vercel bouwt volgende pushes naar de ingestelde productiebranch automatisch. Voor een nieuw component: voeg een effectbestand en registry-item toe; routes, sidebar, Customize en broncodetab volgen uit de registry. Zie README.md voor aanvullende CSS- en helperbestanden.

Wil je een nieuwe volledige bron-ZIP maken?

```sh
npm run source:zip
```

Het resultaat staat in `artifacts/DevUI-Bits-Source.zip`. Behoud LICENSE, THIRD_PARTY_NOTICES.md en de `licenses/`-map bij verspreiding; lees ook LICENSE_REVIEW.md voor de grenzen van de uitgevoerde controle.
