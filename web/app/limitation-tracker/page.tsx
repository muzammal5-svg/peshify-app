import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Bell,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  ChevronRight,
  FileCheck,
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "Court Limitation Period & Appeal Tracker",
  description:
    "Track court appeal deadlines, review petitions, and statutory limitation countdowns with automated reminders. Never miss a limitation deadline.",
  keywords: [
    "limitation period tracker for lawyers",
    "appeal deadline calculator",
    "court limitation software",
    "legal deadline alerts",
    "statutory limitation tracker",
    "advocate case management app",
  ],
  alternates: {
    canonical: "https://diarylex.com/limitation-tracker/",
  },
  openGraph: {
    title: "Court Limitation Period & Appeal Deadline Tracker | DiaryLex",
    description:
      "Automated limitation countdown timers, appeal deadlines, and revision alerts for litigation lawyers.",
    url: "https://diarylex.com/limitation-tracker/",
    siteName: "DiaryLex",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "DiaryLex Limitation Period Tracker",
      "applicationCategory": "LegalApplication",
      "operatingSystem": "Web, iOS, Android",
      "url": "https://diarylex.com/limitation-tracker/",
      "description":
        "Automated statutory limitation period calculator and countdown alerts for civil appeals, criminal revisions, and constitutional petitions.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://diarylex.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Limitation Tracker",
          "item": "https://diarylex.com/limitation-tracker/",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does the limitation tracker protect lawyers against missed deadlines?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "When a case is decided or an adverse order is passed, DiaryLex prompts counsel to set the statutory limitation deadline (e.g., 30, 60, or 90 days). The system initiates a countdown timer and delivers proactive alerts 10 days, 5 days, and 24 hours prior to expiration.",
          },
        },
        {
          "@type": "Question",
          "name": "Does DiaryLex account for certified copy application periods?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Counsel can record the certified copy application date and receipt date to calculate Section 12 Limitation Act exclusions, ensuring exact calculation of the remaining filing days.",
          },
        },
        {
          "@type": "Question",
          "name": "Can chamber associates receive limitation deadline alerts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Limitation alerts appear on the chamber dashboard cause board and can be sent as automated reminders to assigned junior advocates, filing clerks, and senior partners.",
          },
        },
      ],
    },
  ],
};

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";

export default function LimitationTrackerPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#EDE8E0] selection:bg-amber-400/20 selection:text-amber-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicHeader />

      <main>
        {/* Breadcrumb Bar */}
        <section className="border-b border-white/[0.08] bg-black/40 py-3 text-xs text-zinc-400">
          <div className={CONTAINER}>
            <nav className="flex items-center gap-2" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-amber-300 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/features/" className="hover:text-amber-300 transition-colors">
                Features
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-zinc-200 font-medium">Limitation Tracker</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-gradient-to-b from-[#180F08] via-[#0D0805] to-[#050505] border-b border-white/[0.08]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-amber-500/10 blur-[120px] pointer-events-none" />
          <div className={CONTAINER}>
            <div className="max-w-3xl mx-auto text-center space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Zero Missed Appeals &amp; Statutory Deadlines</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Limitation Period Tracker for Litigation Lawyers
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                Statutory limitation is unforgiving. DiaryLex calculates appeal deadlines, tracks certified copy delivery dates, and triggers automated countdown alerts before the limitation clock runs out.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
                <Link
                  href="/register/"
                  className="btn-primary btn-sheen btn-tactile w-full sm:w-auto min-w-[220px] py-3.5 text-sm font-semibold rounded-xl text-center shadow-lg hover:shadow-2xl hover:shadow-primary/25"
                >
                  <span>Activate Limitation Alerts</span>
                  <ArrowRight className="w-4 h-4 ms-2 inline rtl:rotate-180" />
                </Link>
                <Link
                  href="/court-hearing-diary/"
                  className="btn-secondary btn-tactile w-full sm:w-auto min-w-[180px] py-3.5 text-sm font-semibold rounded-xl bg-card border-white/[0.12] text-zinc-200 hover:text-white text-center"
                >
                  <span>View Court Diary</span>
                </Link>
              </div>
            </div>

            {/* Countdown Mockup */}
            <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-1 border border-white/[0.1] shadow-2xl">
              <div className="rounded-xl bg-[#120B06] p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      Active Appeal &amp; Limitation Countdown Timers
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Chamber statutory appeal tracker — 3 time-sensitive matters flagged
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 w-fit">
                    1 Critical Warning
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">First Appeal from Order (FAO) 94/2024</span>
                        <span className="text-red-400 font-semibold">• 4 Days Remaining</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Order passed: 22 Oct 2024 • Target: High Court Division Bench • Expiration: 25 Nov 2024
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-mono font-bold text-xs">
                        T - 04 Days
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">Civil Revision Petition (Sec 115 CPC)</span>
                        <span className="text-amber-300 font-semibold">• 14 Days Remaining</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        District Judge decree passed: 01 Nov 2024 • Certified Copy received: 10 Nov 2024
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs">
                        T - 14 Days
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">Supreme Court Civil Petition for Leave to Appeal (CPLA)</span>
                        <span className="text-emerald-400 font-semibold">• 48 Days Remaining</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        High Court judgment passed: 12 Nov 2024 • 60-day limitation window active
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold text-xs">
                        T - 48 Days
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="py-20 md:py-28 border-b border-white/[0.08]">
          <div className={CONTAINER}>
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Limitation Law Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                How DiaryLex Protects Your Practice From Limitation Dismissals
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Under limitation statutes worldwide, even a single day of delay requires strict Section 5 condonation applications. DiaryLex ensures counsel is alerted well before drafting deadlines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-card/60 border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Automated Countdown Engines</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Select your action type — High Court Appeal (30 days), Supreme Court CPLA (60 or 90 days), or Review Petition (30 days). The system instantly calculates the exact last filing date.
                </p>
                <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Preset limitation templates for civil and criminal law</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Real-time color-coded badges (Green, Amber, Red)</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-card/60 border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Certified Copy Time Exclusion</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Log the day you applied for certified copies and the day they were delivered. DiaryLex automatically deducts qualifying days under Section 12 to provide the true legal deadline.
                </p>
                <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Record copying agency receipt and dispatch slips</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Export mathematical deduction sheets for pleadings</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-card/60 border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Multi-Tier Escalation Alerts</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Reminders are dispatched at 10-day, 5-day, and 24-hour milestones. If an associate hasn&apos;t marked the appeal as drafted, the senior partner is immediately notified.
                </p>
                <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Dashboard cause banner reminders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Optional WhatsApp urgent alerts for counsel</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cross Link Modules */}
        <section className="py-16 border-b border-white/[0.08]">
          <div className={CONTAINER}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold text-white">Connected Chamber Modules</h3>
                <p className="text-xs text-zinc-400">Streamline your entire litigation lifecycle</p>
              </div>
              <Link href="/features/" className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <span>View all features</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/court-hearing-diary/"
                className="p-4 rounded-xl bg-card border border-white/[0.08] hover:border-amber-400/40 transition-colors group block"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Court Hearing Diary</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Manage morning cause lists and courtroom fixtures seamlessly.
                </p>
              </Link>

              <Link
                href="/whatsapp-client-alerts/"
                className="p-4 rounded-xl bg-card border border-white/[0.08] hover:border-amber-400/40 transition-colors group block"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>WhatsApp Client Alerts</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Keep clients updated on filing progress and next hearing calls.
                </p>
              </Link>

              <Link
                href="/chamber-ledger/"
                className="p-4 rounded-xl bg-card border border-white/[0.08] hover:border-amber-400/40 transition-colors group block"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Chamber Ledger & Billing</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Track court filing fee disbursements and client account balances.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 border-b border-white/[0.08]">
          <div className={CONTAINER}>
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Frequently Asked Questions</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Limitation Tracker Questions Answered</h2>
            </div>

            <div className="max-w-2xl mx-auto space-y-3 text-xs">
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">How does the limitation tracker protect lawyers against missed deadlines?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  When a case is decided or an adverse order is passed, DiaryLex prompts counsel to set the statutory limitation deadline (e.g., 30, 60, or 90 days). The system initiates a countdown timer and delivers proactive alerts 10 days, 5 days, and 24 hours prior to expiration.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">Does DiaryLex account for certified copy application periods?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Yes. Counsel can record the certified copy application date and receipt date to calculate Section 12 Limitation Act exclusions, ensuring exact calculation of the remaining filing days.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">Can chamber associates receive limitation deadline alerts?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Yes. Limitation alerts appear on the chamber dashboard cause board and can be sent as automated reminders to assigned junior advocates, filing clerks, and senior partners.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 text-center bg-gradient-to-b from-[#0F0A06] to-[#04060C]">
          <div className={`${CONTAINER} max-w-2xl`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Protect Your Clients From Limitation Expiration
            </h2>
            <p className="text-sm text-zinc-300 mb-8 leading-relaxed">
              Equip your chamber with the limitation tracking platform built specifically for litigation attorneys. Free during Early Access.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register/"
                className="btn-primary btn-sheen btn-tactile w-full sm:w-auto min-w-[220px] py-3.5 text-sm font-semibold rounded-xl"
              >
                <span>Start Free Early Access</span>
                <ArrowRight className="w-4 h-4 ms-2 inline rtl:rotate-180" />
              </Link>
              <Link
                href="/contact/"
                className="btn-secondary btn-tactile w-full sm:w-auto min-w-[160px] py-3.5 text-sm font-semibold rounded-xl bg-card border-white/[0.12] text-zinc-200 hover:text-white"
              >
                <span>Contact Chamber Support</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
      <FloatingWhatsApp />
    </div>
  );
}
