#!/usr/bin/env node
const slug = process.argv[2];
const fs = require('fs');
const path = require('path');

let meta = { name: slug, description: '', faq: [], keywords: [] };
try {
  const metaPath = path.join('/Users/k3sava/projects', 'tool-' + slug, 'meta.json');
  if (fs.existsSync(metaPath)) meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
} catch(e) {}

const faqSection = meta.faq && meta.faq.length
  ? '\n## FAQ\n\n' + meta.faq.map(f => `### ${f.q}\n\n${f.a}`).join('\n\n')
  : '';

const readme = `# ${meta.name || slug}

> ${meta.description || 'Free browser-based tool.'}

**Live:** https://tools.iamkesava.com/${slug}

Part of [little tools](https://github.com/k3sava/little-tools) — free browser utilities by [Kesava](https://iamkesava.com).
${faqSection}

## License

MIT
`;

process.stdout.write(readme);
