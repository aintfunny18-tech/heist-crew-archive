#!/usr/bin/env bash
set -euo pipefail

rm -rf _site
mkdir -p _site

cp \
  index.html \
  app.js \
  archive-framing.js \
  player-profiles.js \
  player-profiles.css \
  selection-build-polish.js \
  ranking-tool.js \
  ranking-tool.css \
  styles.css \
  crew-data.js \
  .nojekyll \
  _site/
cp -R data portraits _site/
