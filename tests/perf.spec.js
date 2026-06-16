// Performance regression tests.
//
// All 4 assertions below FAIL on the unoptimized codebase and PASS after the
// performance fixes are applied. Run with: npx playwright test tests/perf.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Performance', () => {
  test('body background-color is not the teal flash color', async ({ page }) => {
    await page.goto('/index.html');
    const bg = await page.$eval(':root', (el) =>
      getComputedStyle(el).getPropertyValue('--bg').trim()
    );
    // Before fix: --bg is #81d8d0 (teal), which shows as a jarring flash
    // while the wood background image loads.
    expect(bg, '--bg must not be teal (#81d8d0)').not.toBe('#81d8d0');
  });

  test('background-wood.png is declared as a preload', async ({ page }) => {
    await page.goto('/index.html');
    const hrefs = await page.$$eval('link[rel="preload"][as="image"]', (els) =>
      els.map((e) => e.getAttribute('href'))
    );
    expect(
      hrefs.some((h) => h && h.includes('background-wood.png')),
      'A <link rel="preload" as="image"> for background-wood.png must exist'
    ).toBe(true);
  });

  test('logo-image has fetchpriority=high', async ({ page }) => {
    await page.goto('/index.html');
    const fp = await page.$eval('img.logo-image', (img) => img.fetchPriority);
    expect(fp, 'Logo must have fetchpriority="high"').toBe('high');
  });

  test('recipe card images are lazy-loaded', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForSelector('.newest-card-image', { timeout: 3000 });
    const allLazy = await page.$$eval('.newest-card-image', (imgs) =>
      imgs.every((img) => img.loading === 'lazy')
    );
    expect(allLazy, 'All .newest-card-image elements must have loading="lazy"').toBe(true);
  });
});
