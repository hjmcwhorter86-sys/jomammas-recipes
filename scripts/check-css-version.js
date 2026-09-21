// CI + pre-commit gate for the "styles.css cache-busting" rule in
// CLAUDE.md: every HTML page loads styles.css with a ?v=N query string,
// and that N has to go up whenever styles.css changes, or GitHub Pages
// (and especially mobile Safari/Chrome) can keep serving visitors a
// stale stylesheet indefinitely. This has been missed by hand more than
// once, so it's enforced mechanically instead of relied on as a reminder.
//
// Two checks:
//   1. Consistency (always runs): every tracked HTML page must reference
//      the exact same styles.css?v=N. Catches a bump that only touched
//      some pages.
//   2. Staleness (only when a comparison ref is passed as argv[2]): if
//      styles.css differs from that ref but no page's version number
//      does, the bump was skipped entirely.

const { execSync } = require('child_process');
const fs = require('fs');

const VERSION_RE = /styles\.css\?v=(\d+)/;

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function trackedHtmlFiles() {
  return execSync('git ls-files "*.html"', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
}

function checkConsistency() {
  const filesByVersion = new Map();
  const missing = [];

  for (const file of trackedHtmlFiles()) {
    if (!fs.existsSync(file)) continue;
    const match = fs.readFileSync(file, 'utf8').match(VERSION_RE);
    if (!match) {
      missing.push(file);
      continue;
    }
    const version = match[1];
    if (!filesByVersion.has(version)) filesByVersion.set(version, []);
    filesByVersion.get(version).push(file);
  }

  const problems = [];
  if (missing.length > 0) {
    problems.push(`Missing a styles.css?v=N link entirely:\n${missing.map((f) => `  - ${f}`).join('\n')}`);
  }
  if (filesByVersion.size > 1) {
    const summary = [...filesByVersion.entries()]
      .map(([v, files]) => `  v=${v}: ${files.join(', ')}`)
      .join('\n');
    problems.push(`Pages disagree on the styles.css version:\n${summary}`);
  }
  return problems;
}

function checkBumpedAgainst(baseRef) {
  const cssChanged = run(`git diff --name-only ${baseRef} -- styles.css`);
  if (!cssChanged) return []; // styles.css untouched relative to baseRef

  const bumped = trackedHtmlFiles().some((file) => {
    const before = run(`git show ${baseRef}:${file}`);
    if (before === null) return true; // page didn't exist at baseRef, not a staleness risk
    const after = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    const beforeVersion = before.match(VERSION_RE)?.[1];
    const afterVersion = after.match(VERSION_RE)?.[1];
    return beforeVersion !== afterVersion;
  });

  if (!bumped) {
    return ['styles.css changed but no page\'s styles.css?v=N was bumped. Bump the version on every HTML page (see the "styles.css cache-busting" section of CLAUDE.md).'];
  }
  return [];
}

function main() {
  const baseRef = process.argv[2];
  const problems = [...checkConsistency(), ...(baseRef ? checkBumpedAgainst(baseRef) : [])];

  if (problems.length > 0) {
    console.error('styles.css cache-busting check failed:\n');
    problems.forEach((p) => console.error(`${p}\n`));
    process.exit(1);
  }

  console.log('styles.css cache-busting version looks consistent.');
}

main();
