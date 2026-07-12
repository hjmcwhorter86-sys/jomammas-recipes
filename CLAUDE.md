# CLAUDE.md

Guidance for Claude Code sessions working in this repo.

## Project

Static HTML/CSS/JS recipe site (no build tooling, no framework). Pages
(`index.html`, `recipes-list.html`, `recipe-detail.html`, `about.html`,
`flags.html`) load shared scripts via `<script>` tags:
`feature-flags.js`, `flags-service.js`, `data/units.js`,
`data/ingredient-nutrition.js`, `recipes-data.js`, `app.js`. There is no
separate build step. Production deploys to GitHub Pages on every merge to
`main` via `.github/workflows/pages.yml`, which also publishes a
`pr-preview/pr-<number>/` subfolder deploy for each open PR. See that
workflow's header comment for the deployment architecture.

## Visual review

There is no automated screenshot suite — it was removed as noise-generating
(regenerated the whole gallery on every PR regardless of relevance, and
some of it was non-deterministic besides). When a change could affect
rendering, open the affected page(s) in a browser and confirm the specific
thing you changed actually renders correctly. `tests/perf.spec.js` remains
for automated perf-regression checks.

## styles.css cache-busting

Every page loads `styles.css` with a `?v=N` query string (e.g.
`styles.css?v=2`). GitHub Pages serves static files with no cache-busting
of its own, and browsers (mobile Safari/Chrome especially) can keep
serving a stale cached copy of `styles.css` indefinitely otherwise —
visitors who loaded the site before a CSS change may not see it until
their cache expires. **Whenever you edit `styles.css`, bump the `?v=N` on
the `<link rel="stylesheet">` tag in every HTML page** (currently 9 files)
so the new stylesheet is fetched fresh instead of read from cache.

## Feature flags

`window.flagsService.isEnabled('flagName')` checks `feature-flags.js`
defaults plus any per-browser override set via `flags.html`. When adding a
flag-gated feature, spot-check it in the browser both with the flag on and
off.
