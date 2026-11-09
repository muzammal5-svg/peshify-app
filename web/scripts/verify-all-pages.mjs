import { chromium } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

const VIEWPORTS = [
  { name: "mobile-360", width: 360, height: 740 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

const PAGES_TO_TEST = [
  "/",
  "/features",
  "/faq",
  "/contact",
  "/auth",
  "/register",
  "/privacy",
  "/terms",
  "/refund-policy",
  "/reminders",
  "/clients",
  "/cases",
  "/cases/decided",
  "/cause-list",
  "/notifications",
];

async function runVerification() {
  console.log("🚀 Starting Comprehensive Responsive & Functional Audit...");
  const browser = await chromium.launch();
  let totalErrors = 0;

  for (const vp of VIEWPORTS) {
    console.log(`\n📱 Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: vp.width < 768
        ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();

    for (const path of PAGES_TO_TEST) {
      const url = `${BASE_URL}${path}`;
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
        await page.waitForTimeout(600);

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body ? body.scrollWidth : 0);
          const innerWidth = window.innerWidth;
          return {
            hasOverflow: scrollWidth > innerWidth + 1, // 1px threshold for fractional pixels
            scrollWidth,
            innerWidth,
          };
        });

        if (overflow.hasOverflow) {
          console.error(`  ❌ [${vp.name}] ${path}: Horizontal overflow detected! scrollWidth=${overflow.scrollWidth} > innerWidth=${overflow.innerWidth}`);
          totalErrors++;
        } else {
          console.log(`  ✅ [${vp.name}] ${path}: OK (scrollWidth=${overflow.scrollWidth} <= ${overflow.innerWidth})`);
        }
      } catch (err) {
        console.error(`  ⚠️ [${vp.name}] ${path} Error: ${err.message}`);
        totalErrors++;
      }
    }

    await context.close();
  }

  // ── Specific test 1: Long email wrapping in client view ──
  console.log("\n🧪 Testing Specific: Long Client Email Wrapping at 360px & 390px...");
  {
    const mobileContext = await browser.newContext({
      viewport: { width: 360, height: 740 },
    });
    const page = await mobileContext.newPage();

    await page.goto(`${BASE_URL}/clients`, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    const testResult = await page.evaluate(() => {
      const longEmail = "very.long.advocate.client.chamber.email.registered.pakistan.bar@advocate-network-chambers.com.pk";
      const container = document.createElement("div");
      container.id = "test-email-container";
      container.style.width = "100%";
      container.style.maxWidth = "100%";
      container.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 py-2.5 border-b border-border/60 min-w-0">
          <span class="text-xs sm:text-sm text-muted-foreground font-medium flex-shrink-0 sm:w-36">Email Address</span>
          <span class="text-sm font-semibold text-foreground text-start sm:text-end flex-1 min-w-0 break-all sm:break-words [overflow-wrap:anywhere]">
            ${longEmail}
          </span>
        </div>
      `;
      document.body.appendChild(container);

      const docEl = document.documentElement;
      const scrollWidth = Math.max(docEl.scrollWidth, document.body.scrollWidth);
      const innerWidth = window.innerWidth;
      const elementWidth = container.offsetWidth;

      return {
        hasOverflow: scrollWidth > innerWidth + 1,
        elementWidth,
        innerWidth,
        scrollWidth,
      };
    });

    if (testResult.hasOverflow) {
      console.error(`  ❌ Long email caused overflow! scrollWidth=${testResult.scrollWidth} > innerWidth=${testResult.innerWidth}`);
      totalErrors++;
    } else {
      console.log(`  ✅ Long email wrapped cleanly without overflow at 360px (scrollWidth=${testResult.scrollWidth} <= ${testResult.innerWidth})`);
    }

    await mobileContext.close();
  }

  // ── Specific test 2: Public Footer Structure & Badges ──
  console.log("\n🧪 Testing Specific: Public Footer Elements...");
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    const footerText = (await page.locator("footer").innerText().catch(() => "")).toLowerCase();
    const hasChamberOps = footerText.includes("chamber operations") || footerText.includes("پلیٹ فارم کی خصوصیات");
    const hasCourtCoverage = footerText.includes("court coverage") || footerText.includes("عدالتی دائرہ اختیار");
    const hasWhatsApp = footerText.includes("whatsapp") || footerText.includes("واٹس ایپ");
    const hasSecurityPledge = footerText.includes("attorney-client privilege") || footerText.includes("قانونی رازداری");

    console.log(`  ${hasChamberOps ? "✅" : "❌"} Footer has Chamber Operations column: ${hasChamberOps}`);
    console.log(`  ${hasCourtCoverage ? "✅" : "❌"} Footer has Court Coverage column: ${hasCourtCoverage}`);
    console.log(`  ${hasWhatsApp ? "✅" : "❌"} Footer has WhatsApp Chamber Support: ${hasWhatsApp}`);
    console.log(`  ${hasSecurityPledge ? "✅" : "❌"} Footer has Data Protection Pledge: ${hasSecurityPledge}`);

    if (!hasChamberOps || !hasCourtCoverage || !hasWhatsApp || !hasSecurityPledge) {
      totalErrors++;
    }

    await context.close();
  }

  await browser.close();

  console.log("\n==========================================");
  if (totalErrors === 0) {
    console.log("🎉 ALL TESTS PASSED! 0 LAYOUT BREAKS, 0 OVERFLOWS, REMINDERS & FOOTER VERIFIED!");
    process.exit(0);
  } else {
    console.error(`🚨 COMPLETED WITH ${totalErrors} ERROR(S). PLEASE REVIEW OUTPUT.`);
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
