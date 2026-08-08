#!/usr/bin/env bash
set -euo pipefail

required_files=(
  index.html
  app.js
  archive-framing.js
  player-profiles.js
  player-profiles.css
  selection-build-polish.js
  ranking-tool.js
  ranking-tool.css
  styles.css
  crew-data.js
  data/conman.js
  data/cleaner.js
  data/hacker.js
  data/hitter.js
  data/vent-guy.js
  data/driver.js
  data/distraction.js
  data/pickpocket.js
  portraits/conman.svg
  portraits/conman-reveal.svg
  portraits/cleaner.svg
  portraits/hacker.svg
  portraits/hitter.svg
  portraits/vent-guy.svg
  portraits/driver.svg
  portraits/distraction.svg
  portraits/pickpocket.svg
)

for file in "${required_files[@]}"; do
  test -f "$file" || {
    echo "Missing required file: $file" >&2
    exit 1
  }
done

grep -q "Character Selection" index.html
grep -q "player-profiles.js" index.html
grep -q "selection-build-polish.js" index.html
grep -q "ranking-tool.js" index.html
grep -q "ranking-tool.css" index.html
grep -q 'const tabs = \["overview", "abilities", "equipment", "spells", "notes", "relationships"\]' app.js
grep -q "Reveal identity" app.js
grep -q "Role & Build Showcase" archive-framing.js
grep -q "Eight dossiers. One crew to assemble. Impossible jobs ahead." archive-framing.js
grep -q "Campaign variant" selection-build-polish.js
grep -q "Copy ranking for Discord" ranking-tool.js

node --check app.js
node --check archive-framing.js
node --check player-profiles.js
node --check selection-build-polish.js
node --check ranking-tool.js

if grep -R "Verified feature on the current character sheet\\|Verified action or limited technique" data; then
  echo "Generic feature or action placeholder remains in character data." >&2
  exit 1
fi

if grep -q "Species design" app.js; then
  echo "Removed species-design prose is still present." >&2
  exit 1
fi

if grep -R "/f4-prestige-archive/" index.html app.js archive-framing.js player-profiles.js player-profiles.css selection-build-polish.js ranking-tool.js ranking-tool.css styles.css crew-data.js data portraits; then
  echo "Old F4 repository base path remains in deployable files." >&2
  exit 1
fi

bash scripts/build-site.sh
test -f _site/index.html
test -f _site/archive-framing.js
test -f _site/player-profiles.js
test -f _site/player-profiles.css
test -f _site/selection-build-polish.js
test -f _site/ranking-tool.js
test -f _site/ranking-tool.css
test -f _site/portraits/cleaner.svg
