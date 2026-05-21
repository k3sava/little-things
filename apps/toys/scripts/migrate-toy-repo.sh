#!/usr/bin/env bash
# migrate-toy-repo.sh <slug>
set -e

SLUG="$1"
if [ -z "$SLUG" ]; then echo "Usage: $0 <slug>"; exit 1; fi

TOYS_DIR="/Users/k3sava/projects/little-toys"
REPO_NAME="toy-$SLUG"
DEST="/Users/k3sava/projects/$REPO_NAME"

echo "Migrating toy: $SLUG → $REPO_NAME"

mkdir -p "$DEST"
cd "$DEST"
git init

# Copy toy source
if [ -d "$TOYS_DIR/public/$SLUG" ]; then
  cp -r "$TOYS_DIR/public/$SLUG/." "$DEST/"
fi

# Generate meta.json
node "$TOYS_DIR/scripts/generate-toy-meta.js" "$SLUG" > "$DEST/meta.json"

# Vendor _chrome/
cp -r "$TOYS_DIR/public/_chrome" "$DEST/_chrome"

# License
cat > "$DEST/LICENSE" << 'EOF'
MIT License

Copyright (c) 2025 Kesava Mandiga

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
EOF

# README
node "$TOYS_DIR/scripts/generate-toy-readme.js" "$SLUG" > "$DEST/README.md"

cd "$DEST"
git add .
git commit -m "init: $SLUG toy from little-toys"

gh repo create "k3sava/$REPO_NAME" --public \
  --push --source "$DEST" \
  --description "$(node "$TOYS_DIR/scripts/generate-toy-description.js" "$SLUG")"

echo "Done: https://github.com/k3sava/$REPO_NAME"
