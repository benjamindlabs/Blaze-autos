const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processFolder({ srcDir, desktopDir, mobileDir, name }) {
  console.log(`\n========================================`);
  console.log(`Starting optimization for: ${name}`);
  console.log(`Source: ${srcDir}`);
  console.log(`========================================`);

  if (!fs.existsSync(desktopDir)) fs.mkdirSync(desktopDir, { recursive: true });
  if (!fs.existsSync(mobileDir)) fs.mkdirSync(mobileDir, { recursive: true });

  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));
  console.log(`Found ${files.length} frames.`);

  let origTotalBytes = 0;
  let desktopTotalBytes = 0;
  let mobileTotalBytes = 0;

  const BATCH_SIZE = 8;
  const startTime = Date.now();

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (file) => {
        const srcPath = path.join(srcDir, file);
        const webpName = file.replace(/\.jpe?g$/i, '.webp');
        const deskPath = path.join(desktopDir, webpName);
        const mobPath = path.join(mobileDir, webpName);

        const origStat = fs.statSync(srcPath);
        origTotalBytes += origStat.size;

        // Desktop: 1920x1080 WebP Q80
        await sharp(srcPath)
          .webp({ quality: 80, effort: 4 })
          .toFile(deskPath);
        const deskStat = fs.statSync(deskPath);
        desktopTotalBytes += deskStat.size;

        // Mobile: 960x540 WebP Q75 (lightweight, rapid mobile GPU decode)
        await sharp(srcPath)
          .resize(960, 540, { fit: 'cover' })
          .webp({ quality: 75, effort: 4 })
          .toFile(mobPath);
        const mobStat = fs.statSync(mobPath);
        mobileTotalBytes += mobStat.size;
      })
    );

    const doneCount = Math.min(i + BATCH_SIZE, files.length);
    process.stdout.write(`\rProgress: ${doneCount} / ${files.length} frames (${Math.round((doneCount / files.length) * 100)}%)`);
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nCompleted ${name} in ${durationSec}s!`);
  console.log(`Original JPEG total:    ${(origTotalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Desktop WebP total:     ${(desktopTotalBytes / 1024 / 1024).toFixed(2)} MB (${Math.round((1 - desktopTotalBytes / origTotalBytes) * 100)}% reduction)`);
  console.log(`Mobile WebP total:      ${(mobileTotalBytes / 1024 / 1024).toFixed(2)} MB (${Math.round((1 - mobileTotalBytes / origTotalBytes) * 100)}% reduction)`);
}

async function run() {
  const root = path.join(__dirname, '../public/frames');

  // 1. Garage Walkin
  await processFolder({
    srcDir: path.join(root, 'walkin'),
    desktopDir: path.join(root, 'walkin-webp'),
    mobileDir: path.join(root, 'walkin-mobile'),
    name: 'Garage Walk-in Sequence',
  });

  // 2. Interior Benz
  await processFolder({
    srcDir: path.join(root, 'interior'),
    desktopDir: path.join(root, 'interior-webp'),
    mobileDir: path.join(root, 'interior-mobile'),
    name: 'Mercedes-Benz Interior Sequence',
  });

  console.log(`\nAll assets successfully optimized!`);
}

run().catch((err) => {
  console.error('Error during asset optimization:', err);
  process.exit(1);
});

