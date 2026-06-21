// Shared config between scripts/optimize-images.js and
// scripts/check-images-optimized.js — keep the site-asset rule in one place
// so the CI check can't drift from what the optimizer actually does.

// Images that are recipe photos (resize + compress).
// Everything else (category icons, backgrounds, mascot, logo) gets compress only.
const SITE_ASSET_PREFIXES = [
  'background-',
  'hero-background-',
  'category-',
  'mascot',
  'jomammas-recipes-logo',
  'jo-mamma-kitchen',
  'no-photo',
];

const isSiteAsset = (filename) =>
  SITE_ASSET_PREFIXES.some((prefix) => filename.startsWith(prefix));

const MAX_RECIPE_PHOTO_WIDTH = 800;

module.exports = { SITE_ASSET_PREFIXES, isSiteAsset, MAX_RECIPE_PHOTO_WIDTH };
