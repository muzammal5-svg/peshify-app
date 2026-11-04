# Kontrora Design System Tokens & Specifications
Reference: https://www.kontrora.com/
Extracted directly from live assets (`style.css` and DOM hierarchy).

---

## 1. Typography & Hierarchy
- **Display / Heading Font:** `'Syne', sans-serif`
  - Weights: `700` (Bold), `800` (ExtraBold)
  - Letter-spacing: `-0.03em` for display/h1/h2, `-0.02em` for h3
  - Line-height: `1.05` to `1.15` (tight, crisp, editorial)
  - Text-transform: Normal case / sentence case (never all caps for main headings)
- **Body / Primary UI Font:** `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - Weights: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold)
  - Sizes: Body desktop `15px`–`17px` (`1rem`–`1.0625rem`), mobile `14px`–`15px`
  - Line-height: `1.65`
  - Letter-spacing: `normal` or `-0.01em`
- **Navigation, Eyebrows & Meta Labels:**
  - Font: `'DM Sans', sans-serif`
  - Sizes: `11px`–`13px` (`0.7rem`–`0.8125rem`)
  - Weight: `600` to `700`
  - Text-transform: `uppercase`
  - Letter-spacing: `0.10em` to `0.14em`
- **Urdu Font Preservation:**
  - Font: `'Noto Nastaliq Urdu', 'Noto Sans Arabic', serif`
  - Direction: `rtl` with `leading-relaxed` (line-height `1.85`–`2.0`) to avoid diacritic clipping.

### Type Scale Breakdown
| Element | Desktop Size | Mobile Size | Weight | Line Height | Letter Spacing | Font Family |
|---|---|---|---|---|---|---|
| H1 (Hero) | `clamp(2.8rem, 7vw, 5.5rem)` | `2.75rem` (`44px`) | `800` | `1.05` | `-0.03em` | Syne |
| H2 (Section) | `clamp(2rem, 4.5vw, 3.4rem)` | `1.85rem` (`30px`) | `700` | `1.1` | `-0.03em` | Syne |
| H3 (Card/Spotlight) | `clamp(1.25rem, 2vw, 1.55rem)` | `1.2rem` (`19px`) | `700` | `1.2` | `-0.02em` | Syne |
| Section Eyebrow | `0.75rem` (`12px`) | `0.7rem` (`11px`) | `700` | `1.4` | `0.12em` (caps) | DM Sans |
| Body Text | `1.0rem` (`16px`) | `0.9375rem` (`15px`) | `400` | `1.65` | `normal` | DM Sans |
| Small / Caption | `0.8125rem` (`13px`) | `0.75rem` (`12px`) | `400` / `500` | `1.5` | `0.02em` | DM Sans |
| Button Label | `0.72rem`–`0.8125rem` | `0.72rem` | `700` | `1` | `0.12em` (caps) | DM Sans |

---

## 2. Color Palette & Surfaces

```css
:root {
  /* True Black Canvas & Editorial Dark Tones */
  --black: #050505;          /* Main canvas background */
  --dark: #0A0A0A;           /* Deep section backgrounds */
  --surface: #111111;        /* Cards & containers */
  --elevated: #171717;       /* Hover states & dropdowns */
  --elevated-hover: #1E1E1E; /* Elevated hover */

  /* Hairline Borders */
  --border: rgba(237, 232, 224, 0.12);        /* 1px hairline border */
  --border-strong: rgba(237, 232, 224, 0.22); /* Focus / hover hairline */
  --border-subtle: rgba(237, 232, 224, 0.06);

  /* Bone / Off-White Brand Accent */
  --bone: #EDE8E0;           /* Primary button background & hero text */
  --bone-hover: #FFFFFF;     /* Primary button hover */
  --bone-dim: rgba(237, 232, 224, 0.08);

  /* Typography Colors */
  --text-primary: #EDE8E0;   /* High-contrast off-white bone */
  --text-secondary: #9A958C; /* Crisp readable gray */
  --text-muted: #5C5852;     /* Subtle captions, numbers, labels */

  /* Semantic Tones (Muted luxury tint) */
  --success: #6B8F71;        /* Sage green */
  --warning: #C4A574;        /* Warm wheat/gold (sparingly for warnings) */
  --error: #C45C5C;          /* Muted crimson */
  --info: #EDE8E0;
}
```

---

## 3. Button Specifications
- **Geometry:** Sharp rectangular corners (`border-radius: 0;` or `max 2px`). No pills, no round circles, no rounded-xl.
- **Primary Button (`.btn-primary` / `.btn-hero-primary`):**
  - Background: `#EDE8E0` (Bone)
  - Color: `#050505` (Black)
  - Typography: `font-size: 0.72rem`, `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 0.12em` to `0.14em`
  - Padding: `14px 28px` (Hero: `16px 32px`)
  - Border: `1px solid #EDE8E0`
  - Hover: `background: #FFFFFF; color: #050505; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(237, 232, 224, 0.12);`
- **Secondary / Outline Button (`.btn-outline` / `.btn-hero-ghost`):**
  - Background: `transparent` (or `rgba(5,5,5,0.55)` in hero)
  - Color: `#EDE8E0`
  - Typography: `font-size: 0.72rem`, `font-weight: 600`, `text-transform: uppercase`, `letter-spacing: 0.12em`
  - Padding: `14px 28px`
  - Border: `1px solid rgba(237, 232, 224, 0.22)`
  - Hover: `background: #EDE8E0; color: #050505; border-color: #EDE8E0; transform: translateY(-2px);`
- **Ghost Button:**
  - Background: `transparent`
  - Color: `#9A958C`
  - Hover: `#EDE8E0`

---

## 4. Header Specifications
- **Height:** `68px`–`72px`
- **Position:** Fixed / sticky at top (`z-50`)
- **Background:** `rgba(5, 5, 5, 0.85)` with `backdrop-blur-md`
- **Bottom Border:** `1px solid rgba(237, 232, 224, 0.12)`
- **Container:** `max-w-7xl` or `1280px` centered with `px-6`
- **Navigation Links:**
  - Size: `0.75rem` (`12px`)
  - Weight: `600`
  - Letter-spacing: `0.08em`
  - Text-transform: `uppercase`
  - Color: `#9A958C`, hover: `#EDE8E0`
- **Actions (Right):**
  - Language switcher: Clean pill / text button
  - Contact / Phone: Clean muted link
  - Sign In: Secondary outline button
  - Start Free Trial: Bone primary button

---

## 5. Hero Specifications
- **Layout:** Centered single-column layout with vertical flow.
- **Background:** Deep obsidian `#050505` with subtle perspective grid lines and central soft radial mask (`rgba(5, 5, 5, 0.62)`).
- **Brand Eyebrow:** Centered uppercase kicker (e.g. `LEGAL PRACTICE MANAGEMENT PLATFORM`), `0.72rem`, `font-bold`, `letter-spacing: 0.14em`, `text-[#9A958C]`.
- **H1 Headline:** 3-line stacked high-contrast display heading in Syne:
  ```
  Draft updates.
  Staff capacity.
  Surface insights.
  ```
  (Adapted for MZM: "Manage cases. Track hearings. Automate client updates.")
- **Subtitle:** Centered max-width `580px`, `#9A958C`, line-height `1.65`.
- **Action Buttons:** Centered flex row (`gap-3`):
  1. Bone Primary Button with arrow (`Start 7-Day Free Trial →`)
  2. Outline Secondary Button (`View Pricing` or `Explore Features`)
- **Sub-row CTA:** WhatsApp or Direct Support link.

---

## 6. Section Rhythm & Layout Blocks
Kontrora structures its narrative into distinct editorial blocks:

1. **The Product (`.ed-product`):**
   - Caption bar: Left `The product` eyebrow, Right 1-line description.
   - Framed UI Mockup: Full-width framed container with `1px border border-[rgba(237,232,224,0.12)]`, no floating neon chips.
2. **The Pain (`.ed-pain`):**
   - 2-column layout. Left: Heading ("Your practice is quietly losing billable hours") + paragraph.
   - Right: 3 big metric / pain rows (`5+`, `Slow`, `30+`) stacked with 1px border dividers.
3. **The Shift (`.ed-shift`):**
   - Section header ("From guessing to AI-backed decisions").
   - 3 numbered editorial rows (`01`, `02`, `03`) with large numbers on left and bold title + explanation on right.
4. **Spotlight / Feature Rows (`.ed-spot`):**
   - Alternating zig-zag rows (Text left + Image right, then Image left + Text right).
   - Kicker uppercase eyebrow + H3 display heading + body copy.
5. **Stats Bar:**
   - 3-column hairline-bordered stats grid (`500+ Active Advocates`, `50,000+ Cases Managed`, `98% Retention`).
6. **Reviews / Social Proof:**
   - Sharp rectangular cards with `1px border border-[rgba(237,232,224,0.12)]`, bone typography, quote and advocate attribution.
7. **Pricing Grid:**
   - 3 columns with `gap: 1px`, `background: rgba(237,232,224,0.12)`, cards have `background: #050505`, sharp corners, rectangular bone CTA buttons.
8. **Close CTA (`.ed-close`):**
   - Centered block ("See it with your own eyes"), primary bone button + outline buttons.
9. **Footer (`.fnw`):**
   - 3-column layout:
     - Col 1: Contact info, phone, email, address, MZM branding.
     - Col 2: Quick Links in clean vertical list.
     - Col 3: "Send Us A Message" with clean underline form inputs (`border-b border-[rgba(237,232,224,0.15)] bg-transparent`) and full-width bone submit button.
   - Bottom row: Hairline top border with copyright and policy links.
