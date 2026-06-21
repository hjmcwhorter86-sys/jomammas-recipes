// CI gate: fails if any image under images/ wasn't run through
// `npm run optimize-images` — i.e. a recipe photo wider than the resize cap,
// or any image missing its images/originals/ backup.
//
// This is what would have caught the broken Creamy Chicken Piccata
// full-size image: it was added on a branch that missed the optimization
// pass, so it kept its full original size and had no originals/ backup.

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { isSiteAsset, MAX_RECIPE_PHOTO_WIDTH } = require('./image-config');

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const ORIGINALS_DIR = path.join(IMAGES_DIR, 'originals');

async function checkImages() {
  const files = fs.readdirSync(IMAGES_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return ['.png', '.jpg', '.jpeg'].includes(ext);
  });

  const problems = [];

  for (const file of files) {
    const srcPath = path.join(IMAGES_DIR, file);
    const origPath = path.join(ORIGINALS_DIR, file);

    if (!fs.existsSync(origPath)) {
      problems.push(`${file}: no backup at images/originals/${file}`);
      continue;
    }

    if (!isSiteAsset(file)) {
      const { width } = await sharp(srcPath).metadata();
      if (width > MAX_RECIPE_PHOTO_WIDTH) {
        problems.push(
          `${file}: ${width}px wide, exceeds the ${MAX_RECIPE_PHOTO_WIDTH}px recipe-photo cap`
        );
      }
    }
  }

  if (problems.length > 0) {
    console.error('Image optimization check failed:\n');
    problems.forEach((p) => console.error(`  - ${p}`));
    console.error('\nRun `npm run optimize-images` and commit the result (images/ + images/originals/).');
    process.exit(1);
  }

  console.log(`Checked ${files.length} image(s) — all optimized.`);
}

checkImages().catch((err) => {
  console.error(err);
  process.exit(1);
});
