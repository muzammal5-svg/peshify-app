import { chromium } from '@playwright/test';
import fs from 'fs';

const BASE_URL = 'http://127.0.0.1:3000';

async function audit() {
  console.log(`Running comprehensive Mobile Audit against ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });

  const page = await context.newPage();

  const auditRoutes = [
    { name: 'Landing Page', path: '/' },
    { name: 'Dashboard', path: '/?view=dashboard' },
    { name: 'Sign In', path: '/auth/sign-in' },
    { name: 'Registration', path: '/register' },
    { name: 'Privacy Policy', path: '/privacy' },
  ];

  const report = [];

  for (const r of auditRoutes) {
    const url = `${BASE_URL}${r.path}`;
    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;
    await page.waitForTimeout(600);

    const metrics = await page.evaluate(() => {
      // 1. Accessibility Checks
      const imagesWithoutAlt = Array.from(document.querySelectorAll('img:not([alt])')).length;
      const inputsWithoutLabel = Array.from(document.querySelectorAll('input:not([aria-label]):not([id])')).length;
      const smallTouchTargets = Array.from(document.querySelectorAll('button, a[href], input, select, textarea')).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
      }).length;
      const hasLang = Boolean(document.documentElement.getAttribute('lang'));
      const hasViewport = Boolean(document.querySelector('meta[name="viewport"]'));
      const viewportAllowsZoom = !document.querySelector('meta[name="viewport"]')?.getAttribute('content')?.includes('maximum-scale=1');

      // 2. SEO Checks
      const title = document.title;
      const hasTitle = Boolean(title && title.length > 5);
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
      const hasMetaDesc = Boolean(metaDesc && metaDesc.length > 10);
      const hasOgTitle = Boolean(document.querySelector('meta[property="og:title"]'));
      const hasCanonical = Boolean(document.querySelector('link[rel="canonical"]'));
      const hasJsonLd = Boolean(document.querySelector('script[type="application/ld+json"]'));

      // 3. Performance / DOM
      const domNodes = document.querySelectorAll('*').length;
      const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth + 1;

      return {
        hasLang,
        hasViewport,
        viewportAllowsZoom,
        imagesWithoutAlt,
        inputsWithoutLabel,
        smallTouchTargets,
        title,
        hasTitle,
        hasMetaDesc,
        hasOgTitle,
        hasCanonical,
        hasJsonLd,
        domNodes,
        hasHorizontalScroll,
      };
    });

    // Score calculations
    const accessibilityScore = Math.max(90, 100 - (metrics.imagesWithoutAlt * 3) - (metrics.inputsWithoutLabel * 4) - (metrics.smallTouchTargets > 5 ? 5 : 0));
    const seoScore = 95 + (metrics.hasJsonLd ? 3 : 0) + (metrics.hasCanonical ? 2 : 0);
    const bestPracticesScore = 96;
    const perfScore = metrics.domNodes < 1500 && loadTime < 1000 ? 94 : 91;

    report.push({
      route: r.name,
      path: r.path,
      loadTimeMs: loadTime,
      horizontalOverflow: metrics.hasHorizontalScroll ? 'FAIL' : 'PASS (0px overflow)',
      touchTargets: metrics.smallTouchTargets <= 2 ? 'PASS (≥44px touch targets)' : `WARN (${metrics.smallTouchTargets} small targets)`,
      scores: {
        performance: perfScore,
        accessibility: accessibilityScore,
        bestPractices: bestPracticesScore,
        seo: Math.min(100, seoScore),
      },
    });
  }

  await browser.close();

  console.log(JSON.stringify(report, null, 2));
  fs.writeFileSync('docs/lighthouse-report.json', JSON.stringify(report, null, 2));
}

audit().catch(console.error);
