#!/usr/bin/env bash
# Rebuilds the Helvetica Neue WOFF2 subsets the site serves (globals.css) from
# the OTFs. Latin, Latin-1, typographic punctuation, arrows and ×; layout
# features (kerning, ligatures) kept. Needs: python -m pip install fonttools brotli
set -euo pipefail
cd "$(dirname "$0")/../public/fonts/Helvetica_Neue"
mkdir -p woff2
U="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2193,U+2197,U+2212,U+2215,U+00D7"
for f in HelveticaNeueHeavy.otf HelveticaNeueHeavyItalic.otf HelveticaNeueMedium.otf HelveticaNeueMediumItalic.otf \
         HelveticaNeueRoman.otf HelveticaNeueItalic.ttf HelveticaNeueThin.otf HelveticaNeueThinItalic.otf; do
  python -m fontTools.subset "$f" --unicodes="$U" --layout-features='*' --flavor=woff2 --output-file="woff2/${f%.*}.woff2"
done
