// Visual review screenshots.
//
// Not visual-regression tests with pass/fail thresholds — just a gallery of
// PNGs covering the main pages, a few representative recipe layouts, and key
// interactive states at mobile and desktop sizes. The screenshots get
// committed alongside the code change so reviewers can see the rendered
// result (and diff it against the previous version) directly in the PR.
const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

async function shoot(page, projectName, name) {
  const dir = path.join(SCREENSHOT_DIR, projectName);
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${name}.png`), fullPage: true });
}

test.describe('Core pages', () => {
  test('home', async ({ page }, testInfo) => {
    await page.goto('/index.html');
    await shoot(page, testInfo.project.name, 'home');
  });

  test('recipes list', async ({ page }, testInfo) => {
    await page.goto('/recipes-list.html');
    await shoot(page, testInfo.project.name, 'recipes-list');
  });

  test('about', async ({ page }, testInfo) => {
    await page.goto('/about.html');
    await shoot(page, testInfo.project.name, 'about');
  });

  test('flags page', async ({ page }, testInfo) => {
    await page.goto('/flags.html');
    await shoot(page, testInfo.project.name, 'flags');
  });

  test('flags page - flag toggled on', async ({ page }, testInfo) => {
    await page.goto('/flags.html');
    await page.locator('.flag-toggle input').first().click({ force: true });
    await shoot(page, testInfo.project.name, 'flags-toggled-on');
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
    test(`recipe detail - ${id}`, async ({ page }, testInfo) => {
      await page.goto(`/recipe-detail.html?id=${id}`);
      await shoot(page, testInfo.project.name, `recipe-${id}`);
    });
  }
});

test.describe('Interactive states (mobile only)', () => {
  test('mobile menu open', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile-only header controls');
    await page.goto('/index.html');
    await page.locator('#hamburgerMenu').click();
    await shoot(page, testInfo.project.name, 'mobile-menu-open');
  });

  test('search open', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile-only header controls');
    await page.goto('/index.html');
    await page.locator('#searchIconButton').click();
    await shoot(page, testInfo.project.name, 'search-open');
  });
});
