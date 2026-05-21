#!/usr/bin/env bash
# migrate-tool-repo.sh <slug>
set -e

SLUG="$1"
if [ -z "$SLUG" ]; then echo "Usage: $0 <slug>"; exit 1; fi

TOOLS_DIR="/Users/k3sava/projects/little-tools"
REPO_NAME="tool-$SLUG"
DEST="/Users/k3sava/projects/$REPO_NAME"

echo "Migrating tool: $SLUG → $REPO_NAME"

mkdir -p "$DEST/src"
cd "$DEST"
git init

# Copy tool source
cp -r "$TOOLS_DIR/src/app/$SLUG/." "$DEST/src/"

# Generate meta.json
node "$TOOLS_DIR/scripts/generate-tool-meta.js" "$SLUG" > "$DEST/meta.json"

# License
cp "$TOOLS_DIR/LICENSE" "$DEST/LICENSE" 2>/dev/null || cat > "$DEST/LICENSE" << 'EOF'
MIT License

Copyright (c) 2025 Kesava Mandiga

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction.
EOF

# README
node "$TOOLS_DIR/scripts/generate-tool-readme.js" "$SLUG" > "$DEST/README.md"

cd "$DEST"
git add .
git commit -m "init: $SLUG tool from little-tools"

gh repo create "k3sava/$REPO_NAME" --public \
  --description "$(node "$TOOLS_DIR/scripts/get-tool-description.js" "$SLUG")" \
  --push --source "$DEST"

echo "Done: https://github.com/k3sava/$REPO_NAME"
