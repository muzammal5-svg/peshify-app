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
  title: "Court Limitation Period & Appeal Deadline Tracker",
  description:
    "Track court appeal deadlines and filing dates with automated countdown reminders. Set custom milestone alerts for litigation matters.",
  keywords: [
    "limitation period tracker for lawyers",
    "appeal deadline tracker",
    "court limitation software",
    "legal deadline alerts",
    "statutory deadline reminders",
    "advocate case management app",
  ],
  alternates: {
    canonical: "https://diarylex.com/limitation-tracker/",
  },
  openGraph: {
    title: "Court Limitation Period & Appeal Deadline Tracker | DiaryLex",
    description:
      "Set deadline countdown alerts, track appeal filing dates, and get milestone alerts for litigation matters.",
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
        "Deadline countdown alerts and filing reminder system for litigation counsel. Set critical appeal dates, filing cutoffs, and milestone alerts.",
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
          "name": "How does the limitation deadline reminder protect lawyers against missed deadlines?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Counsel records the target filing or appeal deadline. DiaryLex displays a real-time countdown timer on the chamber dashboard and delivers proactive visual alerts as the deadline approaches.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I track certified copy delivery periods?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Once you receive certified copies and determine your effective filing deadline, you can record that target date in DiaryLex with custom advance milestone alerts.",
          },
        },
        {
          "@type": "Question",
          "name": "Can chamber associates receive deadline reminders?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Limitation and filing deadline reminders appear prominently on the chamber dashboard cause board and reminder list for assigned associates.",
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
                Limitation Period &amp; Deadline Tracker for Lawyers
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                Statutory limitation is unforgiving. DiaryLex provides deadline reminders and countdown alerts that you configure, keeping your chamber ahead of critical court filing cutoffs.
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
                        <span className="font-bold text-white text-sm">Appellate Division Notice of Appeal</span>
                        <span className="text-red-400 font-semibold">• 4 Days Remaining</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Order passed: 22 Oct 2024 • Target: Appellate Court • Expiration: 25 Nov 2024
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
                        <span className="font-bold text-white text-sm">Civil Revision &amp; Stay Petition</span>
                        <span className="text-amber-300 font-semibold">• 14 Days Remaining</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Decree passed: 01 Nov 2024 • Certified copy received • Effective filing cutoff: 25 Nov 2024
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
                        <span className="font-bold text-white text-sm">Petition for Leave to Appeal</span>
                        <span className="text-emerald-400 font-semibold">• 48 Days Remaining</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Judgment passed: 12 Nov 2024 • 60-day limitation window active
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
                Limitation &amp; Deadline Protection
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                How DiaryLex Keeps Your Practice Ahead of Filing Deadlines
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Under court procedural rules, missing a limitation deadline can compromise an entire case. DiaryLex provides proactive countdown reminders that counsel configures for each matter.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-card/60 border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Custom Deadline Countdown Timers</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Enter your statutory filing or appeal due date. The system tracks days remaining with live countdown badges so your chamber never misses a filing cutoff.
                </p>
                <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Configure custom appeal, revision, and review due dates</span>
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
                <h3 className="text-lg font-bold text-white">Time-Sensitive Case Docketing</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Log court order dates and effective filing deadlines once certified copies or orders are received. Keep all limitation milestones attached to the case docket.
                </p>
                <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Attach deadline notes and target dates to case files</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Clear visibility across partners, associates, and clerks</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-card/60 border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Multi-Tier Milestone Alerts</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Reminders trigger at 10-day, 5-day, and 24-hour milestones on your dashboard and cause board so counsel has ample time to finalize drafts.
                </p>
                <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Dashboard cause board deadline alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Proactive advance notice for the whole litigation team</span>
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
                <h3 className="font-bold text-white text-sm">How does the limitation deadline reminder protect lawyers against missed deadlines?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Counsel records the target filing or appeal deadline. DiaryLex displays a real-time countdown timer on the chamber dashboard and delivers proactive visual alerts as the deadline approaches.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">Can I track certified copy delivery periods?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Yes. Once you receive certified copies and determine your effective filing deadline, you can record that target date in DiaryLex with custom advance milestone alerts.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">Can chamber associates receive deadline reminders?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Yes. Limitation and filing deadline reminders appear prominently on the chamber dashboard cause board and reminder list for assigned associates.
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
