#!/usr/bin/env bash
set -euo pipefail

rm -rf _site
mkdir -p _site

cp index.html app.js styles.css crew-data.js .nojekyll _site/
cp -R data portraits _site/
