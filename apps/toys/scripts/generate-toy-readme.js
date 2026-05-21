#!/usr/bin/env node
const slug = process.argv[2];
const fs = require('fs');

let meta = { title: slug, description: '', shortcuts: [], faq: [] };
try {
  const metaPath = `/Users/k3sava/projects/toy-${slug}/meta.json`;
  if (fs.existsSync(metaPath)) meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
} catch(e) {}

const shortcutRows = (meta.shortcuts || []).map(s => `| ${s.key} | ${s.label} |`).join('\n');
const faqSection = (meta.faq || []).length
  ? '\n## FAQ\n\n' + meta.faq.map(f => `### ${f.q}\n\n${f.a}`).join('\n\n')
  : '';

const readme = `# ${meta.title || slug}

> ${meta.description || 'Creative browser toy.'}

**Live:** https://toys.iamkesava.com/${slug}/

Part of [little toys](https://github.com/k3sava/little-toys) — browser-native creative experiments by [Kesava](https://iamkesava.com).

## Open it

No build step. Just open \`index.html\` in a browser.

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| D | Dark mode |
| ? | Shortcuts overlay |
${shortcutRows}
${faqSection}

## License

MIT
`;

process.stdout.write(readme);
