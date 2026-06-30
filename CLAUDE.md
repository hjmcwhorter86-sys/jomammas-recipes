# CLAUDE.md

Guidance for Claude Code sessions working in this repo.

## Project

Static HTML/CSS/JS recipe site (no build tooling, no framework). Pages
(`index.html`, `recipes-list.html`, `recipe-detail.html`, `about.html`,
`flags.html`) load shared scripts via `<script>` tags:
`feature-flags.js`, `flags-service.js`, `data/units.js`,
`data/ingredient-nutrition.js`, `recipes-data.js`, `app.js`. The site is
deployed via Netlify directly from this repo — there is no separate build
step.

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

## Feature flags

`window.flagsService.isEnabled('flagName')` checks `feature-flags.js`
defaults plus any per-browser override set via `flags.html`. When adding a
flag-gated feature, spot-check it in the browser both with the flag on and
off (CI captures the screenshots).
