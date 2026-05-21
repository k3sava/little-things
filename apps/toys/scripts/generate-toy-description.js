#!/usr/bin/env node
const slug = process.argv[2];
const fs = require('fs');
try {
  const meta = JSON.parse(fs.readFileSync(`/Users/k3sava/projects/toy-${slug}/meta.json`, 'utf-8'));
  process.stdout.write((meta.description || slug) + '\n');
} catch(e) {
  process.stdout.write(slug + ' — creative browser toy\n');
}
