# The Crew Archive

A standalone, static Leverage-inspired fantasy intelligence dossier for an eight-member D&D crew built for heists.

## Public path

Production:

`https://aintfunny18-tech.github.io/heist-crew-archive/`

The application deploys from `main` through the GitHub Pages workflow in
`.github/workflows/deploy-pages.yml`. Pull requests and non-`main` branches run
the independent validation workflow before merge.

## Architecture

- `index.html` — application shell
- `styles.css` — responsive dossier interface
- `app.js` — hash routing and rendering
- `crew-data.js` and `data/*.js` — condensed verified crew data
- `portraits/*.svg` — canonical portrait assets with embedded compressed images

## Routes

- `#crew`
- `#dossiers`
- `#dossier/<character>/<tab>`
- `#operations`
- `#whiteboard`
- `#archive`
- `#archive/assets`
- `#archive/intel`
- `#archive/timeline`

## Content guardrails

- No operation is treated as canon before play.
- The whiteboard is ephemeral and deliberately does not persist.
- Relationship notes launch empty rather than inventing interpersonal history.
- Each character uses one canonical portrait file everywhere.
- The rules baseline is 2014 fifth edition plus compatible supplements.
