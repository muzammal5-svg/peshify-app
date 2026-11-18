import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("web");
const outOg = path.join(root, "public/og.png");
const logoPath = path.join(root, "public/logo/diarylex-logo-white-text.png");
const iconPath = path.join(root, "public/logo/app-icon.png");

async function generateOgImage() {
  console.log("Generating 1200x630 high-resolution OpenGraph preview card...");

  // Base SVG for 1200x630 canvas
  const width = 1200;
  const height = 630;

  // Read app icon as base64 for embedding if needed
  const iconBuf = await sharp(iconPath).resize(140, 140).png().toBuffer();
  const iconBase64 = `data:image/png;base64,${iconBuf.toString("base64")}`;

  const svgCard = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background Gradients -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#060913"/>
        <stop offset="50%" stop-color="#0A1024"/>
        <stop offset="100%" stop-color="#0F1B3B"/>
      </linearGradient>

      <!-- Glow Orbs -->
      <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="blueGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>
      </radialGradient>

      <!-- Border Gradient -->
      <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.4"/>
        <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#1E293B" stop-opacity="0.8"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

    <!-- Ambient Glows -->
    <circle cx="1050" cy="120" r="380" fill="url(#goldGlow)" />
    <circle cx="150" cy="500" r="420" fill="url(#blueGlow)" />

    <!-- Inner Card Border -->
    <rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="28" fill="none" stroke="url(#borderGrad)" stroke-width="1.5" />

    <!-- Top Badge -->
    <g transform="translate(80, 80)">
      <rect width="320" height="38" rx="19" fill="#1E293B" fill-opacity="0.8" stroke="#334155" stroke-width="1"/>
      <circle cx="20" cy="19" r="6" fill="#10B981"/>
      <text x="36" y="24" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" letter-spacing="1.5">LEGAL TECH PLATFORM • LIVE</text>
    </g>

    <!-- App Icon Graphic -->
    <g transform="translate(80, 150)">
      <!-- Squircle Shadow & Border -->
      <rect width="124" height="124" rx="28" fill="#0B162C" stroke="#D97706" stroke-width="2"/>
      <image href="${iconBase64}" x="6" y="6" width="112" height="112" preserveAspectRatio="xMidYMid meet" clip-path="inset(0% round 24px)"/>
    </g>

    <!-- Main Title & Brand -->
    <g transform="translate(230, 205)">
      <text x="0" y="0" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="62" font-weight="800" letter-spacing="-1.5">
        Diary<tspan fill="#F59E0B">Lex</tspan>
      </text>
      <text x="0" y="38" fill="#CBD5E1" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" letter-spacing="2.5">
        COURT HEARING DIARY &amp; LITIGATION MANAGEMENT
      </text>
    </g>

    <!-- Headline Tagline -->
    <g transform="translate(80, 335)">
      <text x="0" y="0" fill="#F8FAFC" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="700" letter-spacing="-0.5">
        Intelligent Case Tracking for Modern Law Practices
      </text>
      <text x="0" y="44" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="400">
        Automated cause lists, limitation countdowns, client WhatsApp alerts, and firm ledger.
      </text>
    </g>

    <!-- Feature Pills -->
    <g transform="translate(80, 440)">
      <!-- Pill 1 -->
      <g transform="translate(0, 0)">
        <rect width="210" height="44" rx="12" fill="#1E293B" fill-opacity="0.9" stroke="#334155" stroke-width="1"/>
        <text x="105" y="27" fill="#E2E8F0" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle">⚖️ Daily Cause Lists</text>
      </g>
      <!-- Pill 2 -->
      <g transform="translate(225, 0)">
        <rect width="210" height="44" rx="12" fill="#1E293B" fill-opacity="0.9" stroke="#334155" stroke-width="1"/>
        <text x="105" y="27" fill="#E2E8F0" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle">🔔 Limitation Alerts</text>
      </g>
      <!-- Pill 3 -->
      <g transform="translate(450, 0)">
        <rect width="220" height="44" rx="12" fill="#1E293B" fill-opacity="0.9" stroke="#334155" stroke-width="1"/>
        <text x="110" y="27" fill="#E2E8F0" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle">💬 WhatsApp Notices</text>
      </g>
      <!-- Pill 4 -->
      <g transform="translate(685, 0)">
        <rect width="200" height="44" rx="12" fill="#1E293B" fill-opacity="0.9" stroke="#334155" stroke-width="1"/>
        <text x="100" y="27" fill="#E2E8F0" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle">📊 Chamber Ledger</text>
      </g>
    </g>

    <!-- Bottom Domain Bar -->
    <g transform="translate(80, 550)">
      <text x="0" y="0" fill="#38BDF8" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" letter-spacing="0.5">
        https://diarylex.com
      </text>
      <text x="1040" y="0" fill="#64748B" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="500" text-anchor="end">
        Global Common Law &amp; Appellate Docketing
      </text>
    </g>
  </svg>
  `;

  await sharp(Buffer.from(svgCard))
    .png({ quality: 95 })
    .toFile(outOg);

  console.log(`✓ Generated optimized 1200x630 OpenGraph card at ${outOg}`);
}

generateOgImage().catch(err => {
  console.error("OG generation error:", err);
  process.exitCode = 1;
});
