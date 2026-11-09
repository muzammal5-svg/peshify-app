import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://127.0.0.1:3000';
const OUTPUT_DIR = path.resolve(process.cwd(), 'docs/screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

async function capture() {
  console.log(`Starting capture against ${BASE_URL}...`);
  console.log(`Saving to: ${OUTPUT_DIR}`);
  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });

    const page = await context.newPage();

    // 1. Dashboard (LTR)
    await page.goto(`${BASE_URL}/?view=dashboard`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1200);
    const dashLtrFile = path.join(OUTPUT_DIR, `dashboard-${vp.width}px-ltr.png`);
    await page.screenshot({ path: dashLtrFile, fullPage: false });
    console.log(`Saved ${dashLtrFile}`);

    // 2. Dashboard (RTL)
    await page.evaluate(() => {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ur');
    });
    await page.waitForTimeout(600);
    const dashRtlFile = path.join(OUTPUT_DIR, `dashboard-${vp.width}px-rtl.png`);
    await page.screenshot({ path: dashRtlFile, fullPage: false });
    console.log(`Saved ${dashRtlFile}`);

    // 3. Landing (LTR)
    await page.evaluate(() => {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1200);
    const landingLtrFile = path.join(OUTPUT_DIR, `landing-${vp.width}px-ltr.png`);
    await page.screenshot({ path: landingLtrFile, fullPage: false });
    console.log(`Saved ${landingLtrFile}`);

    // 4. Landing (RTL)
    await page.evaluate(() => {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ur');
    });
    await page.waitForTimeout(600);
    const landingRtlFile = path.join(OUTPUT_DIR, `landing-${vp.width}px-rtl.png`);
    await page.screenshot({ path: landingRtlFile, fullPage: false });
    console.log(`Saved ${landingRtlFile}`);

    await context.close();
  }

  await browser.close();
  console.log('All 12 screenshots completed successfully!');
}

capture().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
