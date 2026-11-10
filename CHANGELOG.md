# Peshify Production Launch Changelog

This changelog records all design refinements, architectural upgrades, and bug fixes implemented across the entire Peshify codebase to transform it into a premium, production-ready, mobile-first SaaS product for Pakistani advocates and legal chambers.

---

## [2.3.0] - Universal SaaS Design Alignment (Features, FAQ, Contact, Help & Legal Pages)

### ✨ Marketing & Public Routes Overhaul
- **Features Page ([web/app/features/page.tsx](file:///d:/peshify-app/web/app/features/page.tsx)):**
  - Upgraded from brutalist 0-radius black blocks to the Home Page's Obsidian & Gold theme (`bg-[#070A12]`).
  - Added modern `rounded-2xl` cards with `bg-gradient-to-b from-white/[0.04] to-white/[0.01]`, tinted icon squircles (`bg-amber-400/10 text-amber-300`), and emerald checkmark benefits.
  - Redesigned the tier comparison table into a frosted glass card with sticky header and highlighted chamber tier.
  - Added the stately Deep Navy final chamber CTA banner matching the Home Page.
- **FAQ Knowledge Base ([web/app/faq/page.tsx](file:///d:/peshify-app/web/app/faq/page.tsx)):**
  - Integrated interactive category pills (`All`, `General`, `Features`, `Pricing & Access`, `Security & Privacy`).
  - Upgraded accordion cards to modern `rounded-2xl` cards with smooth chevron animations, high-contrast typography, and quick search.
  - Added a dedicated 24/7 WhatsApp chamber onboarding support banner.
- **Contact Page ([web/app/contact/page.tsx](file:///d:/peshify-app/web/app/contact/page.tsx)):**
  - Transformed into 3 stately channel cards: WhatsApp Rapid Helpline, Email Desk, and Chamber Presence.
  - Overhauled contact form into a `rounded-3xl` glass container with floating focus rings, instant validation, response time guarantees, and success states.
- **Legal Compliance Pages ([privacy](file:///d:/peshify-app/web/app/privacy/page.tsx), [terms](file:///d:/peshify-app/web/app/terms/page.tsx), [refund-policy](file:///d:/peshify-app/web/app/refund-policy/page.tsx)):**
  - Replaced flat black boxes with Deep Navy & Gold gradient hero headers, frosted glass document containers, and direct WhatsApp inquiry buttons.
  - Upgraded [web/components/marketing/LegalDocument.tsx](file:///d:/peshify-app/web/components/marketing/LegalDocument.tsx) typography and section dividers.
- **Help Center & Admin Polish:**
  - Modernized [web/app/help/page.tsx](file:///d:/peshify-app/web/app/help/page.tsx) with direct WhatsApp 24/7 helpline, FAQ shortcut card, and direct phone contact.
  - Removed remaining legacy brutalist styles from [web/app/admin/page.tsx](file:///d:/peshify-app/web/app/admin/page.tsx) (rounded pills and modern input fields).

---

## [2.2.0] - Production Hardening, Reminders DB Migration & Long-String Mobile Safety

### 🛠️ Reminders Database & UI Overhaul
- **Supabase PostgreSQL Migration Applied:** Diagnosed and executed remote database schema migration to fix reminder creation failures:
  - Dropped illegal `NOT NULL` constraint on `case_id` and `hearing_id`, allowing advocates to create general chamber reminders independent of specific litigation cases.
  - Added missing columns `title`, `"from"`, `from_party`, and `is_custom` to the public `reminders` table.
  - Reloaded PostgREST schema cache to ensure instant API synchronization.
- **Modernized Reminders Interface:** Completely overhauled [web/app/reminders/page.tsx](file:///d:/peshify-app/web/app/reminders/page.tsx) with the Navy & Gold design system, pill filter tabs (`All`, `General`, `Case-linked`), instant completion toggle, safe word-wrapping, and error-tolerant session/firm ID resolution.

### 📱 Long String & Client Email Mobile Overflow Fixes
- **Mobile Wrap Protection:** Fixed client email strings and long legal citations causing horizontal overflow on small phone screens (320px–360px):
  - Updated `DetailRow` in [web/app/clients/view/page.tsx](file:///d:/peshify-app/web/app/clients/view/page.tsx) to stack vertically on mobile (`flex-col sm:flex-row`) with `min-w-0 break-all sm:break-words [overflow-wrap:anywhere]`.
  - Updated [web/components/clients/ClientCard.tsx](file:///d:/peshify-app/web/components/clients/ClientCard.tsx) with responsive truncation boundaries (`max-w-[150px] xs:max-w-[190px] sm:max-w-[260px]`).
  - Updated [web/app/cases/view/page.tsx](file:///d:/peshify-app/web/app/cases/view/page.tsx) to protect long party names and legal descriptions from viewport blowout.
  - Updated [web/components/shared/Logo.tsx](file:///d:/peshify-app/web/components/shared/Logo.tsx) to hide the wide `"Advocates & Legal CMS"` subtitle on small screens (`hidden sm:block`), preventing 360px header overflow.
  - Added `overflow-x-clip` to all public route containers (`features`, `faq`, `contact`, `privacy`, `terms`, `refund-policy`, `register`).

### 🏛️ Public Footer Redesign
- **Deep Navy & Amber Aesthetic:** Redesigned [web/components/marketing/PublicFooter.tsx](file:///d:/peshify-app/web/components/marketing/PublicFooter.tsx) with a Deep Navy gradient (`from-[#0B1B3A] via-[#071329] to-[#040A17]`), subtle amber accent lines, and 4 structured columns:
  - **Brand & Chamber Mission:** Clear statement of purpose and Pakistani advocate focus.
  - **Chamber Operations:** Links to Cause Lists, Diary, WhatsApp Notices, Urdu RTL, and Invoicing.
  - **Court Coverage:** Supreme Court, Lahore, Islamabad, Sindh, Peshawar & Quetta High Courts, and District Judiciary.
  - **Chamber Support:** One-tap WhatsApp helpline (+92 341 7359571), direct phone, and chamber email.
- **Attorney Data Protection Pledge:** Integrated a dedicated pledge banner detailing client privilege and PostgreSQL RLS multi-tenant data segregation.
- **Accessible Tap Targets:** Elevated bottom bar legal links to `min-h-[44px]` with flex wrap protection.

### 🧪 Automated Playwright Verification Suite
- **Multi-Viewport Test Runner:** Created [web/scripts/verify-all-pages.mjs](file:///d:/peshify-app/web/scripts/verify-all-pages.mjs) verifying:
  - 15 core routes across 4 viewports (`360px`, `390px`, `768px`, `1440px`).
  - Zero horizontal overflow (`scrollWidth <= innerWidth`) on every page.
  - 100-character long email address stress test wrapping cleanly at 360px.
  - Full presence of redesigned footer columns and legal badges.
- **Passed with 0 errors, 0 layout breaks, and 0 warnings.**

---

## [2.1.0] - Production Launch Edition

### 🎨 Design Tokens & Brand System
- **Restored Deep Navy & Gold Palette:** Re-anchored all primary styling in Deep Navy (`#0B1B3A`) and warm Gold (`#C59B27`) with soft slate card surfaces (`#0E1E38` / `#16294C` / `bg-card`).
- **Modernized Border Radius & Shadows:** Replaced dated 2px/4px borders with contemporary 12–16px card radiuses and 8–10px control radiuses, matched with subtle 1px border lines and soft depth shadows (`shadow-sm`, `shadow-md`, `shadow-xl`).
- **Fluid Typography Scale:** Implemented fluid typography across heading and body elements, ensuring flawless readability from 320px screens up to 1920px wide monitors.
- **Unified Lucide Iconography:** Standardized all icons on Lucide with consistent 1.75 stroke weight, eliminating mixed emoji, generic glyphs, and inconsistent SVGs.

---

### 📊 Step 1: Executive Dashboard Redesign
- **Responsive App Shell:**
  - **Desktop (`≥1024px`):** Fixed left collapsible sidebar (`w-[256px]` or `w-[72px]`), sticky top bar with universal search, bilingual toggle, theme customizer, notification badge, user profile menu, and feedback triggers.
  - **Tablet (`768px - 1023px`):** Collapsed icon-only sidebar (`w-[72px]`) with tooltip navigation.
  - **Mobile (`<768px`):** Clean top header with chamber logo, quick drawer button, and 5-slot bottom navigation bar (`Home`, `Cause List`, `Cases`, `Clients`, `More`) with safe-area notch padding (`env(safe-area-inset-bottom)`).
- **Stat Cards:**
  - Redesigned 4-card metric grid: Active Litigation, Today's Hearings, Pending Limitation Reminders, and Active Retainers.
  - Features tabular numbers (`tabular-nums`), context tags (+/- trend indicators), and tinted icon squares.
  - Responsive 4-col desktop, 2-col tablet, and 2-col compact grid on mobile with zero horizontal overflow.
- **Today's Cause List Hero Widget:**
  - Stately courtroom hearing table on desktop displaying Hearing Time, Case Reference & Title, Court / Bench Name, and Hearing Status.
  - Responsive status badges: `Running` (amber), `Pending` (sky), `Adjourned` (zinc), and `Decided` (emerald).
  - **Automatic Mobile Card Conversion:** On mobile viewports (`<768px`), table gracefully converts into stacked cards with clear badges, court tags, and 44px+ tap targets.
- **7-Day Upcoming Hearings & Limitation Alerts:**
  - Dedicated chronological preview of upcoming chamber fixtures.
  - Limitation deadline cards with urgent visual cues (days remaining tags).
- **Recent Clients & Invoicing:**
  - Client roster summary with quick WhatsApp notice trigger and ledger status.
- **Quick Chamber Actions Bar:**
  - Floating action buttons: "New Case", "Log Hearing", "Add Client", "Send WhatsApp Notice".
- **Bilingual RTL Support:**
  - 100% mirrored layout in Urdu mode (`dir="rtl"`, `lang="ur"`), using `Noto Nastaliq Urdu` typography, mirrored chevron icons, and right-aligned data tables.

---

### 📱 Step 2: Full Mobile Responsiveness & Touch Ergonomics
- **Pinch-to-Zoom Enabled:** Removed `maximum-scale=1` from `viewport` configuration in [web/app/layout.tsx](file:///d:/peshify-app/web/app/layout.tsx) to adhere to WCAG 1.4.4 accessibility guidelines.
- **Modal to Bottom Sheet Transformation:** Upgraded [web/components/ui/Modal.tsx](file:///d:/peshify-app/web/components/ui/Modal.tsx) to render as an animated slide-up bottom sheet with grab handle on mobile screens and centered dialog on desktop.
- **Minimum 44px Tap Targets:** Expanded button hitboxes, input fields (`min-h-[46px]`), language switcher pills, and bottom navigation slots to satisfy Apple HIG and Google Material 44×44px standards.
- **Zero Horizontal Overflow:** Verified across widths 360px, 390px, 768px, 1024px, and 1440px with Playwright test automation.

---

### 🌐 Step 3: Landing Page & Marketing Overhaul
- **Realistic SaaS Product Mockups:**
  - Created [web/components/marketing/ProductMockup.tsx](file:///d:/peshify-app/web/components/marketing/ProductMockup.tsx) featuring a live Pakistani court cause list inside a Safari-style desktop browser window and an overlapping iPhone mobile view.
- **Honest Copy & Social Proof Cleanup:**
  - Removed all fabricated claims (e.g., "500+ advocates", "50,000+ cases", fake testimonials).
  - Replaced with honest positioning: "Built for Pakistani Courts (Supreme Court, High Courts, District Benches)", "Bilingual Urdu & English", "Free Early Access".
  - Created [web/components/marketing/Testimonials.tsx](file:///d:/peshify-app/web/components/marketing/Testimonials.tsx) ready for real advocate quotes post-launch (hidden when empty).
- **Restructured 11-Section Flow:**
  1. Hero with dual CTA and realistic device mockup.
  2. Honest Trust Strip with Pakistani court jurisdiction badges.
  3. 3 Core Benefits (Smart Cause Lists, Bilingual Workflows, Client WhatsApp Alerts).
  4. Feature Showcase with alternating mockups (Cause Lists, Hearing Diary, Urdu RTL, Ledger).
  5. 3-Step Chamber Onboarding.
  6. Security & Legal Confidentiality (TLS 1.3, RLS multi-tenant data isolation).
  7. Transparent Free Early Access Pricing.
  8. FAQ Accordion with common chamber questions.
  9. Final Chamber CTA.
  10. Public Footer with legal disclosures and Pakistan Bar compliance note.
  11. Floating WhatsApp quick support widget.

---

### 🔐 Step 4: Authentication & Onboarding
- **Modern Split-Layout Auth:**
  - Redesigned [web/app/auth/sign-in/page.tsx](file:///d:/peshify-app/web/app/auth/sign-in/page.tsx) with a chamber brand showcase panel on desktop (`lg:`) and a single-column streamlined form on mobile.
  - Upgraded [web/app/register/page.tsx](file:///d:/peshify-app/web/app/register/page.tsx) with Pakistan location dropdowns (Province, District, Tehsil, City) and chamber highlights.
  - Modernized [web/app/auth/forgot-password/page.tsx](file:///d:/peshify-app/web/app/auth/forgot-password/page.tsx) and [web/app/auth/reset-password/page.tsx](file:///d:/peshify-app/web/app/auth/reset-password/page.tsx).
- **Password Visibility Toggles:** Integrated `Eye` / `EyeOff` toggles on all password fields with min 44px touch targets.
- **First-Login Chamber Onboarding Checklist:** Built [web/components/dashboard/OnboardingChecklist.tsx](file:///d:/peshify-app/web/components/dashboard/OnboardingChecklist.tsx) with progress tracking (Add first case, Add first client, Set court/city, Choose language).

---

### 🚀 Step 5: Launch Readiness & Platform Polish
- **SEO & Structured Data:**
  - Configured `metadataBase`, Open Graph card (`/og.png`, 1200×630), Twitter summary cards, canonical URLs, and keywords in [web/app/layout.tsx](file:///d:/peshify-app/web/app/layout.tsx).
  - Added schema.org `SoftwareApplication` JSON-LD structured data.
  - Created production [web/public/sitemap.xml](file:///d:/peshify-app/web/public/sitemap.xml) and [web/public/robots.txt](file:///d:/peshify-app/web/public/robots.txt).
- **Legal & Data Protection Compliance:**
  - Synchronized [web/app/terms/page.tsx](file:///d:/peshify-app/web/app/terms/page.tsx), [web/app/privacy/page.tsx](file:///d:/peshify-app/web/app/privacy/page.tsx), and [web/app/refund-policy/page.tsx](file:///d:/peshify-app/web/app/refund-policy/page.tsx) with the free early access model, explicit attorney-client confidentiality, and Row-Level Security isolation.
- **Custom Error & 404 Handlers:**
  - Built custom [web/app/not-found.tsx](file:///d:/peshify-app/web/app/not-found.tsx) (404) and [web/app/error.tsx](file:///d:/peshify-app/web/app/error.tsx) (500) pages with chamber styling and recovery CTAs.
- **In-App Feedback & Changelog:**
  - Built [web/components/shared/FeedbackModal.tsx](file:///d:/peshify-app/web/components/shared/FeedbackModal.tsx) (Bug report, Feature request, Court improvement).
  - Built [web/components/shared/WhatsNewModal.tsx](file:///d:/peshify-app/web/components/shared/WhatsNewModal.tsx) for tracking chamber release notes.
  - Linked in desktop top bar, user menu, and mobile drawer.
