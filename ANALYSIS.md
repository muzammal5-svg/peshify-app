# Peshify — Codebase Analysis & Product Roadmap Report
**Tareekh:** November 2026  
**Auditor / Reviewer:** Senior Product Manager + Full-Stack Engineer + UI/UX Reviewer  
**Product:** Peshify (Pakistani Advocates & Law Chambers SaaS)  
**Target Platform:** Web (Next.js 14) + Mobile Apps (Capacitor Android & iOS)  
**Live URL:** https://peshify-app.vercel.app/

---

## 1. PROJECT SUMMARY

### 1.1 Tech Stack & Architecture Overview
* **Frontend Framework:** Next.js 14.2.29 (App Router) + React 18.3.1.
* **Build Architecture:** Static Export (`output: "export"`, `trailingSlash: true`, `images: { unoptimized: true }`). Next.js server runtime / Server Actions use nahi ho rahay; poori app Client-Side Single Page Application (SPA) ki tarah statically compile hoti hai. Is se web hosting Vercel/Netlify par fast ho jati hai aur Capacitor ke zariye native Android/iOS bundle me pack hoti hai.
* **Backend & Database:** Supabase (PostgreSQL 15+, Supabase Auth, PostgreSQL Row Level Security [RLS], Database RPC Functions, Triggers, aur Supabase Storage). Direct browser-to-Supabase communication through `@supabase/supabase-js`.
* **State Management & Data Fetching:** TanStack React Query (`@tanstack/react-query` v5.59). Har entity ke liye custom hooks bane hue hain (`useCases`, `useHearings`, `useClients`, `useReminders`, etc.) jo optimistic cache updates aur automatic invalidation handle kartay hain.
* **Form Handling & Validation:** `react-hook-form` + `zod` + `@hookform/resolvers/zod`.
* **Styling & Design System:** Tailwind CSS v3.4.14 + `tailwind-merge` + `clsx`. Theme tokens: Deep Navy `#0B1B3A`, Emerald `#10B981`, Slate neutrals, aur Noto Nastaliq Urdu typography.
* **Icons:** Lucide React icons (`lucide-react` v0.453).
* **Document & PDF Generation:** `jspdf` + `jspdf-autotable` (Cause List export ke liye).
* **Mobile Runtime:** Capacitor 6 (`@capacitor/core`, `@capacitor/android`, `@capacitor/ios`, `@capacitor/push-notifications`, `@capacitor/splash-screen`, `@capacitor/status-bar`).

### 1.2 Folder Structure Breakdown
```
d:\peshify-app/
├── android/                         # Capacitor Android native studio project
├── ios/                             # Capacitor iOS native XCode project
├── supabase/                        # Local Supabase setup, migrations & functions
│   ├── functions/                   # Supabase Edge Functions (e.g. generate-cause-list)
│   └── migrations/                  # Database migration SQL files
├── web/                             # Next.js web application root
│   ├── app/                         # App Router (57 page routes & layouts)
│   │   ├── (marketing)/             # Landing, Features, Pricing, About, Contact, etc.
│   │   ├── admin/                   # Chamber / Super-Admin management portal
│   │   ├── auth/                    # Login, Register, Forgot Password, Reset Password
│   │   ├── cases/                   # Case listing, Case Details, New Case, Hearing New
│   │   ├── cause-list/              # Daily Cause List generation, Print view
│   │   ├── clients/                 # Client Directory, Add Client, Client Profile
│   │   ├── dashboard/               # Core Advocate Dashboard
│   │   ├── documents/               # Chamber Documents repository
│   │   ├── important-forms/         # Pakistani legal templates (Vakalatnama, etc.)
│   │   ├── notifications/           # In-app notifications center
│   │   ├── reminders/               # Limitation & hearing reminders
│   │   └── settings/                # Profile, Firm, Court Preferences, Subscription
│   ├── components/                  # Domain & Shared UI components
│   │   ├── billing/                 # Subscription & payment management UI
│   │   ├── cases/                   # CaseCards, CaseForms, CaseHistory, HearingModal
│   │   ├── clients/                 # ClientTable, ClientForm, WhatsAppModal
│   │   ├── dashboard/               # TodayHearings, QuickActions, StatCards, Timeline
│   │   ├── documents/               # DocumentViewer, UploadModal, FilePicker
│   │   ├── layout/                  # AppShell, DesktopSidebar, MobileBottomNav, Header
│   │   ├── marketing/               # LandingHero, FeatureGrid, HonestPricing, Navbar
│   │   ├── shared/                  # LanguageToggle, UrduText, DatePicker, SearchBar
│   │   └── ui/                      # Base primitives (Button, Card, Modal, Input, Badge)
│   ├── context/                     # AuthContext, LanguageContext (Urdu/English)
│   ├── hooks/                       # Custom TanStack Query hooks (useCases, useHearings, etc.)
│   ├── lib/                         # Supabase client, phone sanitizer, PDF generators, court data
│   ├── public/                      # Static assets, fonts, icons, manifest.json
│   └── types/                       # TypeScript definitions (database schema, SaaS models)
└── setup-new-database.sql           # Complete PostgreSQL master schema script
```

### 1.3 List of All Pages/Routes & Current Status
| Route | Purpose / Description | Status |
|---|---|---|
| `/` | Landing page (Hero, features, honest pricing, FAQs, footer) | **Working** (recently overhauled) |
| `/dashboard` | Daily hearings overview, stats, quick actions, cause list hero | **Working** |
| `/cases` | Case list with search, status filters (Pending, Running, Decided) | **Working** |
| `/cases/new` | Multi-step/complete form to create a new case + first hearing | **Working** |
| `/cases/[id]` | Case 360 view (Hearings diary, orders, notes, documents, client info) | **Working** |
| `/cases/[id]/edit` | Edit case details, court, party names, institution date | **Working** |
| `/cases/[id]/hearings/new` | Add next date of hearing (Peshishi), stage, judge, court room | **Working** |
| `/cause-list` | Daily Cause List filterable by date, court, and lawyer | **Working** |
| `/cause-list/print` | Clean printer-friendly cause list view with print button | **Working** |
| `/clients` | Client directory with contact numbers, CNIC, active case counts | **Working** (mobile email overflow issue) |
| `/clients/new` | Add client modal/page (Name, Mobile, CNIC, Address, Urdu Name) | **Working** |
| `/clients/[id]` | Client profile showing associated cases and contact links | **Working** |
| `/clients/[id]/edit` | Edit client demographic and contact details | **Working** |
| `/reminders` | Deadline alerts, limitation warnings, custom lawyer reminders | **Half-Done** (add reminder bug) |
| `/documents` | File management bucket for chamber docs and court orders | **Working** (basic storage) |
| `/important-forms` | Downloadable legal draft templates (Vakalatnama, Stay App, Bail) | **Working** |
| `/notifications` | Notification logs (hearings, subscription alerts, system msgs) | **Working** |
| `/settings` | Hub for all firm, user, preferences, and subscription settings | **Working** |
| `/settings/account` | User profile update (Name, phone, bar council registration) | **Working** |
| `/settings/firm` | Chamber details, logo, address, letterhead settings | **Working** |
| `/settings/court-preferences` | Custom court benches, judges, city preferences | **Working** |
| `/settings/notifications` | Push and WhatsApp alert settings | **Working** |
| `/settings/subscription` | Current plan status, billing tier, payment receipt upload | **Working** |
| `/settings/users` | Firm team members / juniors / munshi management | **Half-Done** (invitations simple) |
| `/billing` | Dedicated route for subscription billing | **Dead / Placeholder** (redirects to `/`) |
| `/pricing` | Dedicated marketing pricing page | **Dead / Placeholder** (redirects to `/`) |
| `/admin/*` | Super admin portal (Users, Firms, Payments verification, Logs) | **Working** (admin role restricted) |
| `/auth/login` | Email/password sign-in with Urdu/English toggle | **Working** |
| `/auth/register` | New firm & advocate onboarding registration | **Working** |
| `/auth/forgot-password` | Password recovery via email reset link | **Working** |
| `/auth/reset-password` | Set new password token callback page | **Working** |
| `/offline` | PWA offline fallback UI | **Placeholder** (basic screen) |
| Legal Pages (`/terms`, `/privacy`, `/refund`, `/contact`, `/about`) | Marketing and compliance policy pages | **Working** |

### 1.4 Database Models & Relationships
Peshify database me **17 Core Law Chamber Tables** hain aur **7 SaaS Subscription Tables** hain, jo RLS (Row Level Security) ke tehat `firm_id` ke zariye isolate hain:

1. **`firms`** (Core Tenant): Har advocate chamber ka master record.
   * *Fields:* `id, name, name_ur, city, phone, email, max_users, max_cases, subscription_status, trial_ends_at, is_active`.
2. **`profiles`** (Users): Chamber ke andar advocates, juniors aur munshi.
   * *Foreign Key:* `firm_id -> firms.id`, `id -> auth.users.id`.
   * *Roles:* `admin` (Senior Partner / Sole Practitioner), `lawyer` (Associate), `clerk` (Munshi).
3. **`clients`**: Law chamber ke clients.
   * *Foreign Key:* `firm_id -> firms.id`.
   * *Fields:* `name, name_ur, phone, email, cnic, address, city, notes, is_active`.
4. **`cases`**: Master case diary record.
   * *Foreign Keys:* `firm_id -> firms.id`, `client_id -> clients.id`, `assigned_to -> profiles.id`, `court_id -> courts.id`, `case_type_id -> case_types.id`.
   * *Fields:* `case_number, year, title, title_ur, court_name, judge_name, court_room, client_role (petitioner/respondent/appellant/accused), opponent_name, opponent_advocate, status (running/pending/decided/abandoned), institution_date, decision_date`.
5. **`hearings`**: Case ki daily tareekh-e-peshi (Hearing diary history).
   * *Foreign Keys:* `case_id -> cases.id`, `firm_id -> firms.id`.
   * *Fields:* `hearing_date, hearing_time, stage, judge_name, court_room, bench, notes, notes_ur, order_passed, is_adjourned, next_hearing_date`.
6. **`case_notes`**: Advocate ke internal running notes.
   * *Foreign Key:* `case_id -> cases.id`, `created_by -> profiles.id`.
7. **`documents`**: Cases aur firm ke uploaded files (Vakalatnama, Stay order, FIR, Plaint).
   * *Foreign Keys:* `case_id -> cases.id`, `firm_id -> firms.id`.
   * *Storage:* Supabase Storage bucket `documents` (with file_path, file_size, mime_type).
8. **`reminders`**: Hearing date aur limitation period ke auto-generated ya manual alerts.
   * *Foreign Keys:* `case_id -> cases.id`, `hearing_id -> hearings.id`, `user_id -> profiles.id`.
9. **`notifications` & `push_subscriptions` / `device_tokens`**: In-app and browser/mobile web push notifications.
10. **SaaS Tables (`plans`, `subscriptions`, `payments`, `payment_accounts`)**: Peshify ke monthly/annual license packages aur EasyPaisa/JazzCash/Bank slip verification workflows.

---

## 2. WHAT IS WORKING WELL

1. **Multi-Tenant Security Architecture (PostgreSQL RLS):**
   * Multi-tenancy implement karne ka tareeqa nihayat safe hai. Har query me `firm_id` filter database-level RLS policies ke through enforced hai. Junior ya doosre chamber ka lawyer kisi doosre chamber ke case ya client ka data intercept nahi kar sakta.
2. **Pakistani Legal Workflow Localization:**
   * Pakistani adalatein (Supreme Court, High Courts, Sessions/Civil Courts, Family, Banking, Anti-Terrorism) aur case types (Writ Petition, Civil Revision, Criminal Appeal, Family Suit, Bail Application) pre-seeded hain.
   * Party roles (Petitioner, Respondent, Appellant, Complainant, Accused) bilkul Pakistani procedural law (CPC & CrPC) ke mutabiq hain.
3. **True Dual-Language Urdu & English (RTL Support):**
   * App me `Noto Nastaliq Urdu` font ka integrated use hai. Har case aur client ke sath `name_ur` aur `title_ur` ki support mojood hai, jo Cause List aur court me Peshishi ke waqt local advocates ke liye bohot mufeed hai.
4. **WhatsApp Automation Shortcut:**
   * `web/lib/phone.ts` aur `components/clients/WhatsAppModal.tsx` me client ke mobile number ko sanitize kar ke (+92 format) seedha WhatsApp Web / WhatsApp App ka pre-drafted message (aglay peshi ki tareekh, adalat, aur hidayat) 1-click me open karne ka system bohot practical aur fast hai.
5. **Modern Frontend Stack & Cache Reactivity:**
   * TanStack React Query v5 ke zariye client-side caching behtareen hai. Jab advocate koi hearing update karta hai ya naya case add karta hai, background refetching aur cache invalidation smooth chalti hai, screen flickering nahi hoti.
6. **Clean Capacitor Mobile Foundation:**
   * App ko shuru se hi responsive aur mobile wrapper ke liye configure kiya gaya hai (`@capacitor/android` aur `@capacitor/ios` packages configured hain), jisse same code ko Play Store app me convert karna aasan hai.

---

## 3. PROBLEMS FOUND (BUGS, RISKS & GAPS)

### 3.1 Bugs & Broken Flows
1. **Reminder Creation Failure Bug (`web/components/reminders/` & `web/hooks/useReminders.ts`):**
   * Advocates jab naya custom reminder add karte hain, wo aksar save nahi hota ya table me show nahi hota. Wajah: `reminders` table me `firm_id` foreign key mandatory hai, lekin frontend se `firm_id` pass nahi ho rahi ya Supabase schema me `user_id` vs `firm_id` RLS policy conflict create karti hai.
2. **Client Email Text-Overflow Breaking Mobile Layout (`web/components/clients/`):**
   * Jab kisi client ka email thora lamba ho (e.g. `choudhary.advocate.chamber@gmail.com`), mobile screens (360px - 390px) par client card aur client detail header horizontal overflow kar jata hai aur container se bahir nikal jata hai (`break-all` ya `truncate` missing hai).
3. **Dead / Broken Redirect Routes (`web/app/billing/page.tsx` & `web/app/pricing/page.tsx`):**
   * `/billing` aur `/pricing` pages par code me direct `router.replace("/")` likha hua hai. Agar koi advocate settings se ya direct URL se `/billing` par jata hai, wo seedha home page par drop ho jata hai bina kisi notification ke. Billing ki asli UI `/settings/subscription` aur `/admin/billing` me bikhri hui hai.
4. **Cause List PDF Urdu Rendering Breakdown (`web/lib/exportPdf.ts`):**
   * Standard `jspdf` core engine Urdu Nastaliq unicode characters (Right-to-Left Arabic glyph reshaping) ko support nahi karta. Jab advocate Cause List ka PDF download karta hai, English text theek print hota hai lekin Urdu alfaz toote hue aur ultay print hotay hain.

### 3.2 Security & Data Validation
1. **Storage Bucket Upload File-Type & Size Vulnerability:**
   * Documents section me advocate ya staff koi bhi extension upload kar sakta hai. Client-side validation to hai, lekin Supabase Storage RLS policy par strict MIME-type whitelist (sirf PDF, DOCX, JPG, PNG) aur virus/executable blocking check nahi hai.
2. **Missing Granular Permissions for "Munshi" (Clerk):**
   * Database role `clerk` mojood hai, lekin frontend par Clerk aur Senior Advocate me koi khaas farq nahi hai. Munshi kisi bhi case ko delete kar sakta hai ya sensitive client details edit kar sakta hai. Advocate chambers me Munshi ko sirf tareekh dekhnay aur note karnay ki ijazat honi chahiye, case delete ya client fees edit karne ki nahi.

### 3.3 Performance & Bundle Size
1. **Unoptimized Static Export Assets:**
   * `next.config.js` me `images: { unoptimized: true }` set hai. Is ka matlab Next.js ka automatic WebP conversion aur responsive image resizing disable hai. Agar chamber ka logo ya scanned documents 5MB ke hon to wo as-is browser me download honge, jis se mobile internet (3G/4G in courts) par page slow hoga.
2. **Heavy PDF Bundle on Initial Load:**
   * `jspdf` aur `jspdf-autotable` ko dynamically import (`React.lazy` ya dynamic import) karne ke bajaye static imports use ho rahay hain, jis se core bundle size ~400KB barh jata hai.

### 3.4 Mobile Responsiveness & Accessibility
1. **Table vs Stacked Cards Inconsistency:**
   * Kuch views (jaise `/cases` aur `/cause-list`) me responsive cards ban chukay hain, lekin `/admin` aur `/settings/users` me tables mobile par horizontal scroll bar create karte hain jo screen se out of bounds hotay hain.
2. **Court Room Tap Targets:**
   * Mobile phone par quick actions ke buttons aur table action menus (3 dots menu) ka tap target 32px se chota hai, jis se chalte-phirte ungli se click karna mushkil hota hai (minimum 44px hona zaroori hai).

### 3.5 Urdu / RTL Flaws
1. **Mixed English & Urdu Numbers (Numerals Inconsistency):**
   * Numbers (case numbers jaise `W.P. 1245/2024`) jab Urdu Nastaliq view me show hote hain to RTL bidirectional text algorithm (BiDi) slash aur number ko ulta kar deta hai (`2024/1245 .P.W`). Inhein `dir="ltr"` aur `unicode-bidi: isolate` me wrap karna zaroori hai.

---

## 4. MISSING FEATURES (PAKISTANI ADVOCATE SPECIFIC)

Pakistani kachehri (District Courts aur High Courts) ke rozmarrah ke kaam ke mutabiq darj zail features critical hain:

| Feature Name | Why it Matters (Pakistani Legal Context) | Difficulty | Affected Files & DB Tables |
|---|---|---|---|
| **1. Client Fee & Chamber Ledger (Vakalat Fee + Kharcha)** | Pakistani wakeel ka sab se bara dard: kis client se kitni fees tay hui, kitni advance aai, kitni baqi hai, aur adalat ka kharcha (court fee, stamp paper, munshiana). Currently app me client fee tracking bilkul nahi hai! | **Medium** | `new table: client_fees, fee_installments, chamber_expenses` / `web/app/clients/[id]/fees/`, `web/components/billing/` |
| **2. Pakistani Limitation Act 1908 Calculator** | Appeal, Revision, Review, aur Writ file karne ke din mehdood hotay hain (e.g. High Court First Appeal: 30 din, Supreme Court: 60 din). Date of certified copy nikalte hi automated alert chahiye ke aakhri tareekh kab hai. | **Easy** | `web/lib/limitationCalculator.ts`, `web/components/cases/LimitationWidget.tsx`, `cases` table |
| **3. Offline Diary / Local SQLite Cache** | Kachehri ke session courts aur purani imaraton me mobile internet signals 0 ho jatay hain. Advocate ko apna daily cause list aur diary offline har waqt open milni chahiye. | **Medium** | `@tanstack/query-persist-client-core`, `idb-keyval` (IndexedDB), Service Worker offline cache |
| **4. Case Order Sheet / Scanned Orders Multi-Image to PDF** | Wakeel daily court se peshi ka order sheet mobile se photo khenchtay hain. App me camera se multiple images scan kar ke ek click me PDF bana kar case me attach karne ka feature hona chahiye. | **Medium** | `web/components/cases/OrderScannerModal.tsx`, `documents` table & Supabase bucket |
| **5. Munshi (Clerk) Restricted View & Attendance** | Munshi ko subah cause list aur judges ki peshishi note karne ke liye login diya jaye, lekin wo client fee aur confidential chamber notes na dekh sakay. | **Easy** | `web/lib/permissions.ts`, `profiles` role checks, Supabase RLS |
| **6. Monthly / Weekly Cause List Calendar View** | Abhi sirf list view hai. Advocates ko Month Grid view chahiye taakay dekh sakein kis tareekh par 10 peshiyan hain aur kis din adalat khali hai. | **Medium** | FullCalendar / custom grid in `web/app/cause-list/calendar/page.tsx` |
| **7. Urdu Fee Receipt Voucher (PDF / WhatsApp)** | Client ko peshgi fees lete waqt chamber ki raseed (PDF voucher with chamber seal) WhatsApp par send karna. | **Easy** | `web/lib/exportReceiptPdf.ts`, `web/components/clients/ReceiptModal.tsx` |
| **8. Kachehri Holiday Calendar (Gazetted & High Court Vacations)** | High Court Summer vacations, Winter vacations, Eid holidays auto-highlight hon jab tareekh-e-peshi dali ja rahi ho. | **Easy** | `web/lib/pakistanHolidays.ts`, `DatePicker` component |

---

## 5. UI/UX IMPROVEMENTS (SCREEN-BY-SCREEN)

### 5.1 Global App Shell & Navigation
* **Mobile Bottom Bar:** Mobile par 5 primary tabs hone chahiye: **Home (Dashboard)**, **Cause List**, **Cases**, **Clients**, aur **More (Drawer)**. Safe-area-inset-bottom (iPhone home bar) ka padding standard karna hoga taakay buttons cut na hon.
* **Header Bar:** Top bar par date format Pakistani style me (`12 Nov, 2026 - Budh / Wednesday`) ho, sath hi Language Switcher (EN/UR) aur quick "Add" (+) floating speed-dial button ho.

### 5.2 Dashboard (`/dashboard`)
* **Today's Hearings Hero Widget:** Subah subah wakeel ko sirf ek cheez chahiye: *"Aaj meri kitni peshiyan hain aur kis court me pehle pohanchana hai?"*
  * Courtroom aur bench badge ko high-contrast visual tag dena (e.g. `Court #4 - Civil Judge`).
  * Har case ke aage 1-tap WhatsApp alert aur 1-tap "Adjourn / Disposed" status toggle button.
* **Quick Stats:** 4 cards (Today's Cases, Active Clients, Pending Orders, Overdue Reminders) ko mobile par 2x2 grid me 16px radius ke sath elegant card view dena.

### 5.3 Case 360 Screen (`/cases/[id]`)
* **Tabs Layout:** Case screen par information zyada ho rahi hai. Isay clean tabs me organize karein:
  1. *Hearings History (Peshishi Diary)*
  2. *Case Documents & Order Sheets*
  3. *Client Details & Legal Fees*
  4. *Lawyer Notes & Strategy*
* **Sticky "Add Hearing" CTA:** Case page par neechay mobile screen par fixed "+ Agli Tareekh (Next Date)" button hona chahiye jo one-tap bottom sheet open karay.

### 5.4 Clients Directory (`/clients`)
* Long email address ko `truncate` ya `break-all` de kar 2-line layout dena taakay card stretch na ho.
* Har client card par direct Call button (`tel:+92...`) aur direct WhatsApp button prominently show ho.

---

## 6. PRIORITIZED ROADMAP

### Phase 1: Critical Fixes & Stability (Is Hafta - 3 to 4 Days)
| Task / Feature | Description | Effort | Impact |
|---|---|---|---|
| **1. Fix Reminder Save Bug** | `reminders` table RLS aur `useReminders` hook me `firm_id` logic theek karna taakay notification save ho sakay | 2 Hours | **Critical (High)** |
| **2. Fix Mobile Layout Breakages** | Client email text truncation, 360px viewport overflow, bottom safe-area insets fix karna | 3 Hours | **Critical (High)** |
| **3. Fix Cause List Urdu PDF Export** | Urdu font glyph reshaping embed karna ya clear formatted printable HTML view provide karna | 4 Hours | **High** |
| **4. Restore Billing & Pricing Routes** | `/billing` aur `/pricing` ke dead redirects khatam kar ke proper subscription and pricing views connect karna | 2 Hours | **High** |
| **5. Client Fee & Expense Ledger (MVP)** | Case/Client ke sath Total Fee, Received Amount, aur Pending Balance add karne ki basic functionality | 6 Hours | **High (Game Changer)** |

### Phase 2: Core Advocate Workflow Enhancements (Is Mahinay - 2 Weeks)
| Task / Feature | Description | Effort | Impact |
|---|---|---|---|
| **1. Pakistani Limitation Act Calculator** | Appeal/Writ deadline calculation engine with calendar alerts | 1 Day | High |
| **2. Offline Read-Only Diary** | TanStack Query IndexedDB persister lagana taakay offline kachehri me case list khul sake | 2 Days | High |
| **3. Scanned Order Sheet Uploader** | Mobile camera se multiple orders photos upload kar ke order sheet gallery banana | 1.5 Days | High |
| **4. Munshi / Clerk Restricted Access** | Munshi login par fees aur delete operations hide karna | 1 Day | Medium |
| **5. WhatsApp Fee Receipt Voucher** | Client ke liye 1-click printable / shareable payment receipt | 1 Day | High |

### Phase 3: Advanced Ecosystem (Future)
* High Court e-Courts automated cause-list scraper (Lahore High Court, Islamabad High Court, Sindh High Court daily cause list search).
* Pakistan Law Site / Case Law citation bookmarking and cross-linking.
* Chamber Multi-Branch expansion (Islamabad + Rawalpindi / Lahore + Multan sub-chambers).

---

## 7. QUESTIONS FOR ME (DECISIONS NEEDED FROM YOU)

Agay kaam shuru karne se pehle darj zail 4 baaton par aap ka faisla zaroori hai:

1. **Client Fee Ledger Feature:**  
   Kya aap chahtay hain ke hum Client page par aik **"Chamber Ledger / Fees"** tab add karein jahan wakeel client ki Total Tay Shuda Fees (Agreed Fee), Vasool Shuda (Received Payments), aur Baqiya (Balance) track kar sakay? (Pakistani wakeelon ke liye yeh sab se demanded feature hota hai).
2. **Cause List PDF vs Printable Web View:**  
   `jspdf` me Urdu Nastaliq font embed karna bundle size ko 2-3MB heavy kar deta hai. Doosra behtar option yeh hai ke hum browser ka native print engine (`window.print()` with a specialized CSS print stylesheet) use karein jo 100% crystal-clear Urdu fonts aur A4 court format print karta hai without any heavy library. Kya yeh approach behtar hai?
3. **Munshi (Clerk) Permissions:**  
   Kya Munshi ke role ko sirf "Hearings Read & Add" tak mehdood karna hai, ya Munshi naya Case bhi file/register kar sakta hai?
4. **Offline Mode Scope:**  
   Kya filhal hum **Read-Only Offline Diary** (aaj ki peshiyan aur cases list offline dekh sakay) target karein, ya offline me naya case add karne ke baad background sync bhi chahiye? (Read-only fast aur 100% reliable hai).

---
*Report mukammal tayyar hai aur project root me `ANALYSIS.md` ke tor par save kar di gayi hai.*  
*Main aap ke faislay aur instructions ka muntazir hoon. Jab aap kahain ge, tab aglay step ka implementation shuru karein ge.*
