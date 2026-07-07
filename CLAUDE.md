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

## Visual review screenshots — let CI handle the full suite

This repo has a Playwright screenshot suite (`tests/screenshots.spec.js`)
that captures the core pages, a few representative recipe layouts, and key
interactive states at mobile and desktop sizes, saving PNGs into
`screenshots/`.

**You do not need to run the full screenshot suite locally.** It's slow
(install + every page at mobile and desktop), and a GitHub Actions workflow
(`.github/workflows/screenshots.yml`) regenerates and commits these PNGs
automatically on every PR — so reviewers still get the before/after
`screenshots/` diff in the PR's Files tab without you regenerating them by
hand. Treat the screenshot suite as primarily a CI step.

What's expected locally instead: when a change could affect rendering,
open the affected page(s) in a browser and confirm the specific thing you
changed actually renders correctly. That targeted spot-check is enough —
no need to capture or commit PNGs yourself.

If you ever do want to regenerate the whole suite locally (rarely
necessary), it's:

```bash
npm install
npx playwright install --with-deps chromium
npm run screenshots
```

and any changed PNGs under `screenshots/` can be staged alongside your code
change — but CI will produce them regardless.

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
off (CI captures the screenshots).
