import { chromium } from '@playwright/test';
import fs from 'fs';

const BASE_URL = 'http://127.0.0.1:3000';
const WIDTHS = [360, 390, 768, 1024, 1440];
const ROUTES = [
  '/',
  '/features',
  '/faq',
  '/contact',
  '/auth/sign-in',
  '/register',
  '/terms',
  '/privacy',
  '/refund-policy'
];

async function runAudit() {
  console.log('Starting Playwright audit on ' + BASE_URL);
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const width of WIDTHS) {
    const height = width < 768 ? 844 : width < 1024 ? 1024 : 900;
    const context = await browser.newContext({
      viewport: { width, height },
      userAgent: width < 768 
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    for (const route of ROUTES) {
      const url = `${BASE_URL}${route}`;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(500); // let rendering settle

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const winWidth = window.innerWidth;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const hasHScroll = scrollWidth > winWidth + 1;

          // Find specific elements causing overflow
          const overflowingElements = [];
          const all = document.querySelectorAll('*');
          for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.right > winWidth + 2 && rect.width > 0 && rect.height > 0) {
              const tag = el.tagName.toLowerCase();
              const cls = el.className && typeof el.className === 'string' ? el.className.split(' ').slice(0, 3).join('.') : '';
              overflowingElements.push({
                tag,
                cls,
                right: Math.round(rect.right),
                width: Math.round(rect.width)
              });
              if (overflowingElements.length >= 5) break;
            }
          }

          return { hasHScroll, scrollWidth, winWidth, overflowingElements };
        });

        // Check tiny tap targets (< 44px x 44px)
        const tinyTapTargets = await page.evaluate(() => {
          const targets = [];
          const interactives = document.querySelectorAll('button, a[href], input, select, textarea');
          for (const el of interactives) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight) {
              if (rect.width < 44 || rect.height < 44) {
                const text = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('placeholder') || '').trim().slice(0, 30);
                const tag = el.tagName.toLowerCase();
                targets.push({
                  tag,
                  text,
                  width: Math.round(rect.width),
                  height: Math.round(rect.height)
                });
                if (targets.length >= 10) break;
              }
            }
          }
          return targets;
        });

        // Test RTL if language toggled
        const rtlCheck = await page.evaluate(async () => {
          document.documentElement.setAttribute('dir', 'rtl');
          document.documentElement.setAttribute('lang', 'ur');
          await new Promise(r => setTimeout(r, 100));
          const winWidth = window.innerWidth;
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          return { hasHScrollRTL: scrollWidth > winWidth + 1, scrollWidth, winWidth };
        });

        results.push({
          width,
          route,
          overflow,
          tinyTapCount: tinyTapTargets.length,
          sampleTinyTargets: tinyTapTargets.slice(0, 5),
          rtlCheck
        });

      } catch (err) {
        console.error(`Error auditing ${url} at width ${width}:`, err.message);
        results.push({
          width,
          route,
          error: err.message
        });
      }
    }
    await context.close();
  }

  await browser.close();
  fs.writeFileSync('audit-raw-results.json', JSON.stringify(results, null, 2));
  console.log('Audit complete! Results written to audit-raw-results.json');
}

runAudit().catch(console.error);
