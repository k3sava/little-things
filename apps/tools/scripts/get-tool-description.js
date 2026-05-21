#!/usr/bin/env node
const slug = process.argv[2];
const fs = require('fs');
const path = require('path');
try {
  const metaPath = path.join('/Users/k3sava/projects', 'tool-' + slug, 'meta.json');
  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    process.stdout.write((meta.description || slug) + '\n');
    process.exit(0);
  }
} catch(e) {}
process.stdout.write(slug + ' — free browser tool\n');
