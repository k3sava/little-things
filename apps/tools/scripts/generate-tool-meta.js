#!/usr/bin/env node
const slug = process.argv[2];
if (!slug) { process.stderr.write('Usage: node generate-tool-meta.js <slug>\n'); process.exit(1); }

const fs = require('fs');
const path = require('path');

const toolsTs = fs.readFileSync(path.join(__dirname, '../src/data/tools.ts'), 'utf-8');

// Find the line containing href: "/<slug>" — tool entries are single-line
const lines = toolsTs.split('\n');
const toolLine = lines.find(l => l.includes(`href: "/${slug}"`));

if (!toolLine) {
  process.stderr.write(`Tool not found: ${slug}\n`);
  process.exit(1);
}

function extract(text, key) {
  const m = text.match(new RegExp(key + ':\\s*["\']([^"\']*)["\']'));
  return m ? m[1] : '';
}
function extractArr(text, key) {
  const m = text.match(new RegExp(key + ':\\s*\\[([^\\]]+)\\]'));
  if (!m) return [];
  return (m[1].match(/["']([^"']+)["']/g) || []).map(s => s.replace(/["']/g, ''));
}

// Also read tool-faq.ts for FAQ data
let faq = [];
try {
  const faqTs = fs.readFileSync(path.join(__dirname, '../src/data/tool-faq.ts'), 'utf-8');
  const hrefKey = `"/${slug}"`;
  const idx = faqTs.indexOf(hrefKey);
  if (idx !== -1) {
    // Extract the array after this key
    const afterKey = faqTs.slice(idx + hrefKey.length);
    const arrMatch = afterKey.match(/:\s*\[([\s\S]*?)\],/);
    if (arrMatch) {
      const entries = arrMatch[1].match(/\{\s*q:\s*"([^"]+)",\s*a:\s*"([^"]+)"\s*\}/g) || [];
      faq = entries.map(e => {
        const qm = e.match(/q:\s*"([^"]+)"/);
        const am = e.match(/a:\s*"([^"]+)"/);
        return { q: qm ? qm[1] : '', a: am ? am[1] : '' };
      });
    }
  }
} catch(e) {}

const meta = {
  name: extract(toolLine, 'name') || slug,
  slug,
  href: '/' + slug,
  description: extract(toolLine, 'description') || '',
  icon: extract(toolLine, 'icon') || '🔧',
  collections: extractArr(toolLine, 'collections'),
  keywords: extractArr(toolLine, 'keywords'),
  faq
};

process.stdout.write(JSON.stringify(meta, null, 2) + '\n');
