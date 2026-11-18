import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd().endsWith("web") ? process.cwd() : path.join(process.cwd(), "web");
const iconSrc = path.join(root, "public/app-icon.jpg");
const logoSrc = path.join(root, "public/DiaryLex Legal Diary Logo.png");

const BG_HEX = "#0F1A2E"; // Exact background color of app-icon.jpg
const BG_COLOR = { r: 15, g: 26, b: 46, alpha: 1 };

function createIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirSize = 16;
  let offset = 6 + count * dirSize;

  const dirEntries = [];
  for (const img of images) {
    const entry = Buffer.alloc(dirSize);
    entry.writeUInt8(img.width === 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height === 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...images.map((b) => b.buffer)]);
}

async function run() {
  console.log("Generating DiaryLex brand assets & app icons...");

  // Verify sources
  await fs.access(iconSrc);
  await fs.access(logoSrc);
  console.log("✓ Found app-icon.jpg and DiaryLex Legal Diary Logo.png");

  // Ensure directories exist
  const dirs = [
    path.join(root, "public/logo"),
    path.join(root, "public/icons"),
    path.join(root, "app"),
    path.join(root, "android/app/src/main/res/mipmap-mdpi"),
    path.join(root, "android/app/src/main/res/mipmap-hdpi"),
    path.join(root, "android/app/src/main/res/mipmap-xhdpi"),
    path.join(root, "android/app/src/main/res/mipmap-xxhdpi"),
    path.join(root, "android/app/src/main/res/mipmap-xxxhdpi"),
    path.join(root, "android/app/src/main/res/values"),
    path.join(root, "ios/App/App/Assets.xcassets/AppIcon.appiconset"),
  ];

  for (const d of dirs) {
    await fs.mkdir(d, { recursive: true });
  }

  // ─────────────────────────────────────────────────────────────
  // 1. MASTER APP ICON GENERATION (from app-icon.jpg)
  // ─────────────────────────────────────────────────────────────
  console.log("Processing app-icon.jpg into 1024x1024 master icon...");
  
  // Resize to 1024x1024 crisp PNG
  const masterIcon1024 = await sharp(iconSrc)
    .resize(1024, 1024, { fit: "cover" })
    .png({ quality: 100 })
    .toBuffer();

  // Save master icons in public/logo
  await fs.writeFile(path.join(root, "public/logo/app-icon.png"), masterIcon1024);
  await fs.writeFile(path.join(root, "public/logo/brand-mark.png"), await sharp(masterIcon1024).resize(512, 512).png().toBuffer());
  await fs.writeFile(path.join(root, "public/logo/mzm-monogram.png"), await sharp(masterIcon1024).resize(512, 512).png().toBuffer());
  await fs.writeFile(path.join(root, "public/logo/peshify-emblem.png"), await sharp(masterIcon1024).resize(512, 512).png().toBuffer());
  await fs.writeFile(path.join(root, "public/logo/app-poster.png"), masterIcon1024);
  console.log("✓ Saved master icon PNGs in public/logo/");

  // ─────────────────────────────────────────────────────────────
  // 2. PWA MANIFEST ICONS & ROOT ICONS
  // ─────────────────────────────────────────────────────────────
  const pwaSizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];
  for (const s of pwaSizes) {
    const buf = await sharp(masterIcon1024).resize(s, s).png().toBuffer();
    await fs.writeFile(path.join(root, `public/icons/icon-${s}.png`), buf);
  }

  // Maskable icon: 80% safe zone padded with #0F1A2E
  const maskableInner = await sharp(masterIcon1024).resize(410, 410).png().toBuffer();
  await sharp(maskableInner)
    .extend({ top: 51, bottom: 51, left: 51, right: 51, background: BG_HEX })
    .png()
    .toFile(path.join(root, "public/icons/icon-512-maskable.png"));

  // Root-level icons
  await fs.writeFile(path.join(root, "public/icon-192.png"), await sharp(masterIcon1024).resize(192, 192).png().toBuffer());
  await fs.writeFile(path.join(root, "public/icon-512.png"), await sharp(masterIcon1024).resize(512, 512).png().toBuffer());
  await fs.writeFile(path.join(root, "public/favicon.png"), await sharp(masterIcon1024).resize(64, 64).png().toBuffer());
  await fs.writeFile(path.join(root, "public/apple-icon.png"), await sharp(masterIcon1024).resize(180, 180).png().toBuffer());

  // Next.js App Directory icons
  await fs.writeFile(path.join(root, "app/icon.png"), await sharp(masterIcon1024).resize(32, 32).png().toBuffer());
  await fs.writeFile(path.join(root, "app/apple-icon.png"), await sharp(masterIcon1024).resize(180, 180).png().toBuffer());
  console.log("✓ Generated PWA, root, and App directory icons");

  // ─────────────────────────────────────────────────────────────
  // 3. MULTI-RES FAVICON.ICO
  // ─────────────────────────────────────────────────────────────
  const icoSizes = [16, 32, 48];
  const icoBuffers = [];
  for (const s of icoSizes) {
    const buf = await sharp(masterIcon1024).resize(s, s).png().toBuffer();
    icoBuffers.push({ width: s, height: s, buffer: buf });
  }
  const icoFile = createIco(icoBuffers);
  await fs.writeFile(path.join(root, "public/favicon.ico"), icoFile);
  await fs.writeFile(path.join(root, "app/favicon.ico"), icoFile);
  console.log("✓ Created multi-resolution favicon.ico");

  // ─────────────────────────────────────────────────────────────
  // 4. ANDROID NATIVE MIPMAP ICONS
  // ─────────────────────────────────────────────────────────────
  const androidDensities = [
    { dir: "mipmap-mdpi", size: 48, fgSize: 108, iconInner: 72 },
    { dir: "mipmap-hdpi", size: 72, fgSize: 162, iconInner: 108 },
    { dir: "mipmap-xhdpi", size: 96, fgSize: 216, iconInner: 144 },
    { dir: "mipmap-xxhdpi", size: 144, fgSize: 324, iconInner: 216 },
    { dir: "mipmap-xxxhdpi", size: 192, fgSize: 432, iconInner: 288 },
  ];

  for (const { dir, size, fgSize, iconInner } of androidDensities) {
    const outDir = path.join(root, `android/app/src/main/res/${dir}`);

    // Standard squircle launcher icon (~20% radius)
    const radius = Math.round(size * 0.2);
    const squircleSvg = Buffer.from(
      `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff" /></svg>`
    );
    await sharp(masterIcon1024)
      .resize(size, size)
      .composite([{ input: squircleSvg, blend: "dest-in" }])
      .png()
      .toFile(path.join(outDir, "ic_launcher.png"));

    // Round circular launcher icon
    const circleSvg = Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff" /></svg>`
    );
    await sharp(masterIcon1024)
      .resize(size, size)
      .composite([{ input: circleSvg, blend: "dest-in" }])
      .png()
      .toFile(path.join(outDir, "ic_launcher_round.png"));

    // Adaptive icon foreground
    const pad = Math.round((fgSize - iconInner) / 2);
    const innerBuf = await sharp(masterIcon1024).resize(iconInner, iconInner).png().toBuffer();
    await sharp(innerBuf)
      .extend({
        top: pad,
        bottom: fgSize - iconInner - pad,
        left: pad,
        right: fgSize - iconInner - pad,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(path.join(outDir, "ic_launcher_foreground.png"));
  }

  // Update ic_launcher_background.xml
  const bgXml = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${BG_HEX}</color>\n</resources>\n`;
  await fs.writeFile(path.join(root, "android/app/src/main/res/values/ic_launcher_background.xml"), bgXml);
  console.log("✓ Generated Android mipmap icons & updated background XML");

  // ─────────────────────────────────────────────────────────────
  // 5. iOS APPICON (1024x1024 opaque)
  // ─────────────────────────────────────────────────────────────
  const iosIconPath = path.join(root, "ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png");
  await sharp(masterIcon1024).flatten({ background: BG_HEX }).resize(1024, 1024).png().toFile(iosIconPath);
  console.log("✓ Generated iOS 1024x1024 AppIcon");

  // ─────────────────────────────────────────────────────────────
  // 6. BRAND LOGO GENERATION (from DiaryLex Legal Diary Logo.png)
  // ─────────────────────────────────────────────────────────────
  console.log("Processing DiaryLex Legal Diary Logo.png...");

  // 6a. Trim whitespace and create balanced-padded logo
  const trimmedLogo = await sharp(logoSrc).trim().toBuffer({ resolveWithObject: true });
  const tInfo = trimmedLogo.info;
  console.log(`Trimmed logo bounds: ${tInfo.width}x${tInfo.height}`);

  // Create clean master logo with 5% elegant breathing room
  const padX = Math.round(tInfo.width * 0.05);
  const padY = Math.round(tInfo.height * 0.05);

  const cleanLogo = await sharp(trimmedLogo.data)
    .extend({
      top: padY,
      bottom: padY,
      left: padX,
      right: padX,
      background: { r: 254, g: 254, b: 254, alpha: 1 },
    })
    .png({ quality: 100 })
    .toBuffer();

  // Save clean master logo files
  await fs.writeFile(path.join(root, "public/logo/diarylex-logo.png"), cleanLogo);
  await fs.writeFile(path.join(root, "public/logo/diarylex-full.png"), cleanLogo);
  // Also overwrite legacy peshify references so they point to the new DiaryLex logo
  await fs.writeFile(path.join(root, "public/logo/peshify-logo.png"), cleanLogo);
  await fs.writeFile(path.join(root, "public/logo/peshify-full.png"), cleanLogo);

  // 6b. Generate transparent logo version (near-white -> transparent)
  const rawLogo = await sharp(trimmedLogo.data).raw().toBuffer({ resolveWithObject: true });
  const rawData = rawLogo.data;
  const rawW = rawLogo.info.width;
  const rawH = rawLogo.info.height;

  // Transparent (standard: dark navy text + gold emblem)
  const transRgba = Buffer.alloc(rawW * rawH * 4);
  // Darkbg version (crisp white text + gold emblem for dark navbars)
  const darkbgRgba = Buffer.alloc(rawW * rawH * 4);

  for (let i = 0, j = 0; i < rawData.length; i += 3, j += 4) {
    const r = rawData[i];
    const g = rawData[i + 1];
    const b = rawData[i + 2];
    const brightness = (r + g + b) / 3;

    // Is it gold/amber? (amber/gold tones: high red, medium green, lower blue)
    const isGold = (r > 130 && g > 85 && b < 120 && (r - b > 35));

    // Transparent version
    transRgba[j] = r;
    transRgba[j + 1] = g;
    transRgba[j + 2] = b;

    // Dark-background version
    if (isGold) {
      darkbgRgba[j] = r;
      darkbgRgba[j + 1] = g;
      darkbgRgba[j + 2] = b;
    } else {
      // Navy/dark text -> white text
      darkbgRgba[j] = 255;
      darkbgRgba[j + 1] = 255;
      darkbgRgba[j + 2] = 255;
    }

    // Alpha channel computation
    if (brightness > 248) {
      transRgba[j + 3] = 0;
      darkbgRgba[j + 3] = 0;
    } else if (brightness > 225) {
      const alpha = Math.round(255 * (248 - brightness) / 23);
      transRgba[j + 3] = alpha;
      darkbgRgba[j + 3] = alpha;
    } else {
      transRgba[j + 3] = 255;
      darkbgRgba[j + 3] = 255;
    }
  }

  // Save transparent logo
  await sharp(transRgba, { raw: { width: rawW, height: rawH, channels: 4 } })
    .png({ quality: 100 })
    .toFile(path.join(root, "public/logo/diarylex-logo-transparent.png"));

  // Save dark-background logo (white text + gold emblem)
  await sharp(darkbgRgba, { raw: { width: rawW, height: rawH, channels: 4 } })
    .png({ quality: 100 })
    .toFile(path.join(root, "public/logo/diarylex-logo-white-text.png"));

  console.log("✓ Saved diarylex-logo.png, diarylex-full.png, diarylex-logo-transparent.png, and diarylex-logo-white-text.png");

  console.log("🎉 ALL DIARYLEX BRAND ASSETS GENERATED SUCCESSFULLY!");
}

run().catch((err) => {
  console.error("Asset generation error:", err);
  process.exitCode = 1;
});
