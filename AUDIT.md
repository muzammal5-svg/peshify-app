# Peshify Platform Comprehensive Design & Technical Audit
**Date:** November 2026  
**Auditor:** Senior Product Designer & Frontend Engineer  
**Target URL:** https://peshify-app.vercel.app/  
**Viewports Audited:** 360px, 390px, 768px, 1024px, 1440px (Mobile, Tablet, Desktop)  
**Locales Audited:** English (LTR) & Urdu (RTL)

---

## Executive Summary
Peshify is an ambitious, purpose-built case management platform for Pakistani legal advocates and chambers. While its core domain logic (cause lists, court diaries, Urdu RTL support, WhatsApp integration) is sound, the frontend UI suffered from inconsistent component design, hardcoded miniature radii (2px), broken mobile drawers (where every navigation item was mapped to a `Menu` icon), horizontal overflow on small screens (360px and 390px), tiny touch targets (< 44px), fabricated marketing social proof, and an unoptimized dashboard layout that did not deliver a cohesive, premium SaaS experience (Linear / Notion / Clio grade).

This document catalogs every critical defect identified across the 5 target viewports and outlines the systematic resolution roadmap.

---

## 1. Breakpoint & Viewport Analysis

### A. Mobile Viewports (360px & 390px)
- **Horizontal Overflow (`scrollWidth > clientWidth`)**:
  - `360px`: `scrollWidth = 384px` on route `/` (+24px overflow)
  - `390px`: `scrollWidth = 399px` on route `/` (+9px overflow)
  - **Root Causes**:
    - Ambient glow element (`div.absolute.top-1/4.left-1/2` with fixed `width: 800px`) overflowing without `overflow-x: clip` on its wrapper.
    - Hero image scaling (`scale-[1.03]`) overflowing outer bounds.
    - Law firm eyebrow badge `PAKISTAN LEGAL CHAMBERS & ADVOCATES PLATFORM` with `tracking-[0.22em]` exceeding screen width (measured 398px).
    - Review slider track extending outside container.
- **RTL Overflow (Urdu mode on 360px)**:
  - When `dir="rtl"` was enabled, all public marketing pages experienced `scrollWidth = 373px` due to unmirrored margins and asymmetrical paddings.
- **Mobile Drawer Critical Bug**:
  - In `MobileHeader.tsx`, all sidebar navigation icons were mapped to `Menu` instead of their specific Lucide icons (`LayoutDashboard: Menu, Calendar: Menu, Briefcase: Menu, Users: Menu, ...`).
- **Bottom Navigation Items Mismatch**:
  - Current slots: `Home`, `Cases`, `Clients`, `Reminders`, `More`.
  - Required slots: `Home`, `Cause List`, `Cases`, `Clients`, `More` (+ slide-over drawer).

### B. Tablet Viewport (768px)
- Sidebar currently remains fully expanded or pops open unexpectedly, crushing the main dashboard content area down to ~500px width.
- Needs a clean collapsed icon-only sidebar mode at 768px-1023px, expanding to full sidebar at 1024px+.
- Grid columns for stats and cause cards stretch awkwardly into single wide columns instead of an organized 2-column layout.

### C. Desktop Viewports (1024px & 1440px)
- Fixed left sidebar lacked smooth collapse animation and state persistence.
- Top bar did not provide integrated advocate quick search, clear bilingual switch (EN/UR), notifications counter, and profile management in a unified bar.
- Stat cards were visually flat with sharp 2px borders, lacking tabular numerals and the subtle depth typical of modern SaaS platforms.

---

## 2. Touch Target & Accessibility Audit (< 44px)
WCAG 2.1 Success Criterion 2.5.5 (Target Size) and 2.5.8 (Pointer Target Spacing) require a minimum tap target of 44×44px for touch interfaces. The following violations were captured:

| Element | Current Size | Required Minimum | Location |
| :--- | :--- | :--- | :--- |
| `LangPill` (EN / UR toggle) | 36px × 30px | 44px × 44px | Header, Footer, TopBar |
| Drawer close button | 32px × 32px | 44px × 44px | MobileHeader drawer |
| Quick edit & update buttons | 28px × 28px | 44px × 44px | CauseListView cards |
| Action buttons (`size="xs"`) | 28px height | 44px tap target | Case lists, modals |
| Action buttons (`size="sm"`) | 36px height | 44px tap target | Forms, toolbars |
| Form inputs (Sign in / Register) | 43px height | ≥ 44px (48px ideal) | Auth forms |
| "Remember Me" checkbox | 16px × 16px | 44px × 44px label area | Sign in page |
| Mobile bottom nav icon tabs | 38px touch box | 48px × 56px touch box | BottomNav |
| Viewport `maximumScale: 1` | Zoom disabled | Allow user pinch-to-zoom | `layout.tsx` viewport meta |

---

## 3. Design System & Component Inconsistencies

### A. Border Radius Overrides
- `tailwind.config.ts` previously overrode standard Tailwind radii:
  ```ts
  borderRadius: {
    DEFAULT: "2px",
    md: "2px",
    lg: "2px",
    xl: "2px",
    "2xl": "4px",
  }
  ```
- This resulted in harsh, brittle box borders across cards, modals, and buttons instead of the 12–16px card radius and 8–10px button radius expected of modern executive SaaS apps.

### B. Brand Palette Consistency
- The platform's defining brand identity is **Deep Navy (`#0B1B3A`)** paired with soft warm off-white and refined muted slate borders.
- Various components had drifted into pure dark `#050505` obsidian or uncalibrated tints. The design system must anchor firmly on `#0B1B3A` for primary branding, navigation accents, badges, and active states.

### C. Icon Standardization
- Icons across the app were inconsistent: mixed Lucide imports, conflicting stroke widths (some `1.5`, some `2.5`), arbitrary heights (14px to 24px), and the mobile drawer bug where every item showed a hamburger menu icon.
- **Rule:** Standardize on Lucide React with `strokeWidth={1.75}`, default size 20px (16px for small badges/buttons, 24px for hero highlights).

---

## 4. Dashboard (High Priority) Architecture Deficiencies
The advocate dashboard lacked a cohesive visual and workflow hierarchy:
1. **Greeting & Today's Summary:** Lacked a prominent executive summary badge with live Karachi date and today's listed court appearances.
2. **Stat Cards:** Missing tabular-nums, consistent 12-16px radius, subtle 1px border (`border-border/80`), soft shadow, and tinted icon squares.
3. **Hero Cause List Widget:** The today's cause list was buried below service links instead of serving as the primary operational centerpiece with status badges (`Running`, `Pending`, `Adjourned`, `Decided`).
4. **Upcoming 7-Day Hearings:** Missing a dedicated 7-day lookahead calendar strip for advance preparation.
5. **Limitation & Deadline Alerts:** Missing urgent limitation countdown indicators to prevent missed appeals or interim injunction expiries.
6. **Recent Clients & Financial Ledger:** Missing quick-view retainer balances and recent payments summary.
7. **Quick Action Floating / Top Bar:** Missing rapid-access buttons for "Add Case", "Add Hearing", "Add Client", and "Send WhatsApp Update".
8. **Responsive Card Lists:** Desktop table did not elegantly fold into touch-optimized stacked cards on mobile.

---

## 5. Marketing & Landing Page Integrity
- **Fabricated Social Proof Identified:**
  - `500+ Active Advocates & Chambers`
  - `50,000+ Litigation Cases Managed`
  - `98% Chamber Retention Rate`
  - 8 fictitious advocate testimonials in `ReviewSlider`
- **Resolution:**
  - Remove all fake statistics and fictional quotes immediately.
  - Replace with authentic value statements: "Built specifically for Pakistani High Courts & District Benches", "Bilingual Urdu & English (Native RTL)", "Free Early Access for Legal Chambers", and "Join Our Early Advocate Beta".
  - Preserve a clean, unrendered `Testimonials` component ready for authentic advocate quotes post-launch.
- **Section Order Realignment:**
  - Hero (headline, subhead, primary CTA, secondary CTA, device mockup) →
  - Trust Strip (honest Pakistani court coverage) →
  - 3 Core Chamber Benefits →
  - Feature Showcase with alternating screenshots (Cause List, Hearing Diary, Urdu RTL, WhatsApp Alerts, Client Billing) →
  - How It Works (3 Steps) →
  - Security & Chamber Privacy →
  - Free Early Access / Pricing →
  - FAQ Accordion →
  - Final Chamber CTA →
  - Clean Footer (without duplicated contact form; dedicated `/contact` link).
- **Floating WhatsApp Helper:** Add an unintrusive bottom-corner WhatsApp button that never covers CTAs.

---

## 6. Auth & Onboarding Deficiencies
- Login and Register screens were centered boxes with no chamber value proposition.
- On desktop, a split-screen layout (auth form on one side, prestigious legal chamber brand panel on the other) is required.
- Missing password show/hide toggles on all password inputs.
- Missing first-login onboarding guide with progress tracker on the dashboard (Add Case, Add Client, Set Court/City, Select Language).

---

## 7. Launch Readiness & SEO Audit
- Missing metadata Open Graph images (`og:image`) and Twitter Card specifications.
- Missing canonical URLs, `sitemap.xml`, and `robots.txt`.
- Missing JSON-LD `SoftwareApplication` structured data.
- Viewport tag had `maximum-scale=1`, preventing pinch zoom.

---

## Fix Plan Roadmap
- [x] **Step 0:** Complete exhaustive audit across all 5 viewports and write `AUDIT.md`.
- [ ] **Step 1:** Complete Dashboard Redesign (AppShell, StatCards, Cause List hero, 7-day diary, quick actions, Lucide 1.75, full RTL).
- [ ] **Step 2:** Mobile responsiveness across all pages (fluid clamp typography, 44px tap targets, bottom sheets, PWA quality).
- [ ] **Step 3:** Landing page overhaul (remove fake stats/testimonials, realistic device mockups, new 10-part section order, clean footer, WhatsApp pill).
- [ ] **Step 4:** Auth & Onboarding (desktop split-layout, password toggles, dashboard onboarding checklist).
- [ ] **Step 5:** Launch readiness (SEO, sitemap, robots, legal pages, Lighthouse 90+, accessibility contrast, feedback button).
- [ ] **Step 6:** Verification, screenshots (390px, 768px, 1440px LTR & RTL), CHANGELOG.md, and final report.
