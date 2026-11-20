const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

async function convert() {
  const tasks = [
    {
      in: path.join(publicDir, 'app-icon.jpg'),
      out: path.join(publicDir, 'app-icon.webp'),
      width: 512,
      height: 512,
      quality: 85,
    },
    {
      in: path.join(publicDir, 'DiaryLex Legal Diary Logo.png'),
      out: path.join(publicDir, 'DiaryLex Legal Diary Logo.webp'),
      width: 1200,
      quality: 85,
    },
    {
      in: path.join(publicDir, 'logo', 'app-poster.png'),
      out: path.join(publicDir, 'logo', 'app-poster.webp'),
      width: 1200,
      quality: 85,
    },
    {
      in: path.join(publicDir, 'logo', 'app-icon.png'),
      out: path.join(publicDir, 'logo', 'app-icon.webp'),
      width: 512,
      height: 512,
      quality: 85,
    },
    {
      in: path.join(publicDir, 'logo', 'diarylex-logo.png'),
      out: path.join(publicDir, 'logo', 'diarylex-logo.webp'),
      width: 600,
      quality: 90,
    },
    {
      in: path.join(publicDir, 'logo', 'diarylex-logo-transparent.png'),
      out: path.join(publicDir, 'logo', 'diarylex-logo-transparent.webp'),
      width: 600,
      quality: 90,
    },
    {
      in: path.join(publicDir, 'logo', 'diarylex-logo-white-text.png'),
      out: path.join(publicDir, 'logo', 'diarylex-logo-white-text.webp'),
      width: 600,
      quality: 90,
    },
    {
      in: path.join(publicDir, 'kontrora-hero-bg.jpg'),
      out: path.join(publicDir, 'kontrora-hero-bg.webp'),
      width: 1600,
      quality: 80,
    },
  ];

  for (const t of tasks) {
    if (!fs.existsSync(t.in)) {
      console.log('Skipping missing:', t.in);
      continue;
    }
    const beforeSize = fs.statSync(t.in).size;
    let pipeline = sharp(t.in);
    if (t.width && t.height) {
      pipeline = pipeline.resize(t.width, t.height, { fit: 'cover' });
    } else if (t.width) {
      pipeline = pipeline.resize({ width: t.width, withoutEnlargement: true });
    }
    await pipeline.webp({ quality: t.quality }).toFile(t.out);
    const afterSize = fs.statSync(t.out).size;
    console.log(`Converted ${path.basename(t.in)} -> ${path.basename(t.out)}: ${(beforeSize/1024).toFixed(1)} KB -> ${(afterSize/1024).toFixed(1)} KB (-${((1 - afterSize/beforeSize)*100).toFixed(1)}%)`);
  }
}

convert().catch(console.error);
