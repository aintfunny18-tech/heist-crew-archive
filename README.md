# The Crew Archive

A standalone fantasy intelligence dossier for eight selectable D&D heist specialists.

## Public path

Production:

`https://aintfunny18-tech.github.io/heist-crew-archive/`

The application deploys from `main` through the GitHub Pages workflow in
`.github/workflows/deploy-pages.yml`. Pull requests and non-`main` branches run
the independent validation workflow before merge.

## Current mode

The public site is presently framed for character selection. Players can review all eight level-10 chassis, compare their role and build showcases, inspect the verified character-sheet details, and rank a first, second, and third choice with an optional hard no.

## Architecture

- `index.html` — application shell and selection-status framing
- `styles.css` — core responsive dossier interface
- `player-profiles.css` — player-selection presentation layer
- `app.js` — hash routing and core rendering
- `archive-framing.js` — selection-stage copy, dossier presentation, and pre-play framing
- `player-profiles.js` — two-paragraph role/build showcases and current player-facing role labels
- `selection-build-polish.js` — final verified synergy and item-language corrections
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
