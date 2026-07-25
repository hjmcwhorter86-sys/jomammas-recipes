// CI + pre-commit gate: fails if any em dash character shows up anywhere in
// the repo's tracked text files. Em dashes are a well-known LLM writing tic,
// and this repo's content (recipe notes, code comments, docs) is mostly
// written by Claude Code sessions, so a hard "zero em dashes" rule catches
// it mechanically instead of relying on a human proofreading every session's
// output. The em dash is built from its unicode escape below rather than
// written as a literal character, so this file doesn't trip its own check.

const { execSync } = require('child_process');
const fs = require('fs');

// Binary file types git happens to track; scanning them for a text glyph
// is pointless and can produce noisy coincidental matches. SVG is
// deliberately not in this list: it's XML text, not binary.
const SKIP_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp',
  '.woff', '.woff2', '.ttf', '.eot',
]);

const EM_DASH = String.fromCharCode(0x2014);

function trackedFiles() {
  return execSync('git ls-files', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
}

function hasSkippedExtension(file) {
  const dot = file.lastIndexOf('.');
  if (dot === -1) return false;
  return SKIP_EXTENSIONS.has(file.slice(dot).toLowerCase());
}

function checkEmDashes() {
  const problems = [];

  for (const file of trackedFiles()) {
    if (hasSkippedExtension(file)) continue;
    if (!fs.existsSync(file)) continue; // deleted-but-staged, nothing to check

    const content = fs.readFileSync(file, 'utf8');
    if (!content.includes(EM_DASH)) continue;

    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.includes(EM_DASH)) {
        problems.push(`${file}:${index + 1}: ${line.trim()}`);
      }
    });
  }

  if (problems.length > 0) {
    console.error('Em dash check failed. Found em dashes in:\n');
    problems.forEach((p) => console.error(`  - ${p}`));
    console.error('\nRewrite with a comma, colon, semicolon, or parentheses instead.');
    process.exit(1);
  }

  console.log('No em dashes found.');
}

checkEmDashes();
