const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
  },
  webServer: {
    command: 'npx serve -l 4173 .',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    {
      // Pixel 5 (Chromium-based) rather than an iPhone preset, since CI only
      // installs the Chromium browser.
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'desktop',
      use: { viewport: { width: 1440, height: 900 } },
    },
  ],
});
