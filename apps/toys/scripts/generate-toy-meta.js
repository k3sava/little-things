#!/usr/bin/env node
const slug = process.argv[2];
if (!slug) { process.stderr.write('Usage: node generate-toy-meta.js <slug>\n'); process.exit(1); }

const fs = require('fs');
const path = require('path');

// Read toys.json if it exists
let toyData = null;
try {
  const toysJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/toys.json'), 'utf-8'));
  toyData = (toysJson.toys || toysJson).find(t => t.slug === slug);
} catch(e) {}

// Read kamiMeta from index.html
let kamiMeta = {};
try {
  const html = fs.readFileSync(path.join(__dirname, '../public', slug, 'index.html'), 'utf-8');
  const m = html.match(/window\.kamiMeta\s*=\s*(\{[\s\S]*?\});/);
  if (m) {
    // Safe eval via Function
    kamiMeta = Function('"use strict"; return (' + m[1] + ')')();
  }
} catch(e) {}

const meta = {
  slug,
  title: (toyData && toyData.title) || kamiMeta.title || slug,
  description: (toyData && toyData.description) || kamiMeta.tagline || '',
  category: (toyData && toyData.category) || 'generative',
  nativeNote: kamiMeta.nativeNote || false,
  shortcuts: kamiMeta.shortcuts || [],
  faq: kamiMeta.faq || [],
  related: kamiMeta.related || []
};

process.stdout.write(JSON.stringify(meta, null, 2) + '\n');
