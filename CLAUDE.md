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

## Visual review screenshots — mandatory for every change

This repo has a Playwright screenshot suite (`tests/screenshots.spec.js`)
that captures the core pages, a few representative recipe layouts, and key
interactive states at mobile and desktop sizes, saving PNGs into
`screenshots/`.

**Any change that could affect rendering — HTML, CSS, `app.js`,
`recipes-data.js`, feature flags, etc. — must regenerate these screenshots
and include the resulting diffs in the commit.** Reviewers rely on the
`screenshots/` diff in the PR's Files tab to see before/after rendering for
both mobile and desktop without checking out the branch.

To regenerate:

```bash
npm install
npx playwright install --with-deps chromium
npm run screenshots
```

Then `git status` / `git diff` should show any changed PNGs under
`screenshots/` — stage and commit them with your code change.

A GitHub Actions workflow (`.github/workflows/screenshots.yml`) also
regenerates and commits these automatically on every PR, but run it locally
first so you can review the rendered result before pushing.

## Feature flags

`window.flagsService.isEnabled('flagName')` checks `feature-flags.js`
defaults plus any per-browser override set via `flags.html`. When adding a
flag-gated feature, screenshot it both with the flag on and off.
