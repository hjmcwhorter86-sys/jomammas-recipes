// Visual review screenshots.
//
// Not visual-regression tests with pass/fail thresholds — just a gallery of
// PNGs covering the main pages, a few representative recipe layouts, and key
// interactive states at mobile and desktop sizes. The screenshots get
// committed alongside the code change so reviewers can see the rendered
// result (and diff it against the previous version) directly in the PR.
//
// Layout: screenshots/<page>/<viewport>-<variant>.png — one folder per page,
// general (main) to specific (interactive states, flag variants), so a
// reviewer can open a page's folder and see all its states together.
const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

async function shoot(page, pageName, viewport, variant = 'main') {
  const dir = path.join(SCREENSHOT_DIR, pageName);
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${viewport}-${variant}.png`) });
}

// Sets a per-browser feature flag override (as flags.html would via
// flags-service.js's localStorage-backed overrides) before the page loads.
async function setFlagOverride(page, key, value) {
  await page.addInitScript(([k, v]) => {
    localStorage.setItem(`flag:${k}`, v ? 'true' : 'false');
  }, [key, value]);
}

// Sets the US/Metric units preference (as units-service.js stores it) before
// the page loads.
async function setUnitSystemOverride(page, system) {
  await page.addInitScript((s) => {
    localStorage.setItem('unitSystem', s);
  }, system);
}

test.describe('Home page', () => {
  test('main', async ({ page }, testInfo) => {
    await page.goto('/index.html');
    await shoot(page, 'home', testInfo.project.name, 'main');
  });

  // Captures what the page looks like before images have finished loading, to
  // make the background-color fallback (vs the old teal flash) visible in the
  // PR screenshot diff.
  test('early load state (before images)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop-only visual demo');
    await page.route('**/*.{png,jpg,jpeg}', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      await route.continue();
    });
    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    await shoot(page, 'home', testInfo.project.name, 'early-load');
  });

  test('mobile menu open', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile-only header controls');
    await page.goto('/index.html');
    await page.locator('#hamburgerMenu').click();
    await shoot(page, 'home', testInfo.project.name, 'menu-open');
  });

  test('search open', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile-only header controls');
    await page.goto('/index.html');
    await page.locator('#searchIconButton').click();
    await shoot(page, 'home', testInfo.project.name, 'search-open');
  });
});

test.describe('Recipes list page', () => {
  test('main', async ({ page }, testInfo) => {
    await page.goto('/recipes-list.html');
    await shoot(page, 'recipes-list', testInfo.project.name, 'main');
  });
});

test.describe('About page', () => {
  test('main', async ({ page }, testInfo) => {
    await page.goto('/about.html');
    await shoot(page, 'about', testInfo.project.name, 'main');
  });
});

test.describe('Flags page', () => {
  test('main', async ({ page }, testInfo) => {
    await page.goto('/flags.html');
    await shoot(page, 'flags', testInfo.project.name, 'main');
  });

  test('flag toggled on', async ({ page }, testInfo) => {
    await page.goto('/flags.html');
    await page.locator('.flag-toggle input').first().click({ force: true });
    await shoot(page, 'flags', testInfo.project.name, 'flag-toggled-on');
  });
});

test.describe('Recipe detail pages', () => {
  // Chosen to cover different ingredient layouts: sectioned with ranges and
  // alternatives, a flat list with notes/optional items, and a "1 (N oz)
  // can X" display item.
  const recipeIds = [
    'korean-beef-bowls',
    'esquites-mexican-street-corn',
    'quick-pasta-arrabbiata',
  ];

  for (const id of recipeIds) {
    test(`${id} - main`, async ({ page }, testInfo) => {
      await page.goto(`/recipe-detail.html?id=${id}`);
      await shoot(page, `recipe-${id}`, testInfo.project.name, 'main');
    });
  }

  test('korean-beef-bowls - computed nutrition flag on', async ({ page }, testInfo) => {
    await setFlagOverride(page, 'showComputedNutrition', true);
    await page.goto('/recipe-detail.html?id=korean-beef-bowls');
    await shoot(page, 'recipe-korean-beef-bowls', testInfo.project.name, 'nutrition-flag-on');
  });

  test('korean-beef-bowls - computed nutrition flag off', async ({ page }, testInfo) => {
    await setFlagOverride(page, 'showComputedNutrition', false);
    await page.goto('/recipe-detail.html?id=korean-beef-bowls');
    await shoot(page, 'recipe-korean-beef-bowls', testInfo.project.name, 'nutrition-flag-off');
  });

  test('korean-beef-bowls - metric units', async ({ page }, testInfo) => {
    await setUnitSystemOverride(page, 'metric');
    await page.goto('/recipe-detail.html?id=korean-beef-bowls');
    await shoot(page, 'recipe-korean-beef-bowls', testInfo.project.name, 'metric-units');
  });
});

test.describe('Nutrition info page', () => {
  test('korean-beef-bowls', async ({ page }, testInfo) => {
    await page.goto('/nutrition-info.html?id=korean-beef-bowls');
    await shoot(page, 'nutrition-info-korean-beef-bowls', testInfo.project.name, 'main');
  });

  test('korean-beef-bowls - all ingredients', async ({ page }, testInfo) => {
    await page.goto('/nutrition-info.html?id=korean-beef-bowls');
    await page.locator('#toggleAllIngredientsBtn').click();
    await shoot(page, 'nutrition-info-korean-beef-bowls', testInfo.project.name, 'all-ingredients');
  });
});
