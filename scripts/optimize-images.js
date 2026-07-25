// One-time image optimization script for JoMamma's Recipes.
//
// Usage: npm run optimize-images
//
// What it does:
//   1. Copies every original image to images/originals/ (git-tracked; never changes)
//   2. Overwrites images/ with compressed versions (same filename/extension):
//      - Recipe photos: resized to 800px wide max + lossy compression
//      - Site assets (logos, icons, backgrounds): lossy compression only, no resize
//   3. Prints a before/after size report
//
// Recipe detail pages reference images/originals/ for full-quality display;
// thumbnails and cards use the compressed images/ versions.
//
// Run once, then commit both the originals/ folder and the overwritten images/.

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { isSiteAsset, MAX_RECIPE_PHOTO_WIDTH } = require('./image-config');

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const ORIGINALS_DIR = path.join(IMAGES_DIR, 'originals');

async function optimizeImages() {
  fs.mkdirSync(ORIGINALS_DIR, { recursive: true });

  const files = fs.readdirSync(IMAGES_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return ['.png', '.jpg', '.jpeg'].includes(ext);
  });

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of files) {
    const srcPath = path.join(IMAGES_DIR, file);
    const origPath = path.join(ORIGINALS_DIR, file);

    // Step 1: Back up original (skip if already backed up)
    if (!fs.existsSync(origPath)) {
      fs.copyFileSync(srcPath, origPath);
    }

    const origSize = fs.statSync(origPath).size;
    totalOriginal += origSize;

    const ext = path.extname(file).toLowerCase();
    const tmpPath = srcPath + '.tmp';

    let pipeline = sharp(origPath);

    if (!isSiteAsset(file)) {
      // Recipe photo: cap at 800px wide (fine for 320px float on detail page)
      pipeline = pipeline.resize(MAX_RECIPE_PHOTO_WIDTH, null, { withoutEnlargement: true });
    }

    if (ext === '.jpg' || ext === '.jpeg') {
      await pipeline.jpeg({ quality: 80, mozjpeg: true }).toFile(tmpPath);
    } else {
      // PNG with lossy quantisation (requires libimagequant; falls back to
      // lossless if not available; still saves some bytes via level 9).
      await pipeline
        .png({ quality: 80, compressionLevel: 9, effort: 10 })
        .toFile(tmpPath);
    }

    const newSize = fs.statSync(tmpPath).size;
    totalOptimized += newSize;

    fs.renameSync(tmpPath, srcPath);

    const pct = Math.round((1 - newSize / origSize) * 100);
    const sign = pct > 0 ? `-${pct}%` : `+${Math.abs(pct)}%`;
    console.log(
      `${file.padEnd(50)} ${kb(origSize).padStart(8)} → ${kb(newSize).padStart(8)}  (${sign})`
    );
  }

  console.log('');
  console.log(
    `Total: ${kb(totalOriginal)} → ${kb(totalOptimized)}  (-${Math.round((1 - totalOptimized / totalOriginal) * 100)}%)`
  );
  console.log(`Originals preserved in images/originals/`);
}

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

optimizeImages().catch((err) => {
  console.error(err);
  process.exit(1);
});
