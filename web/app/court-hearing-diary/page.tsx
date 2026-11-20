import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  ArrowRight,
  ShieldCheck,
  Search,
  Scale,
  Sparkles,
  Layers,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "Court Hearing Diary & Daily Cause List App",
  description:
    "Organize daily court cause lists, hearing proceedings, and next dates across High Courts and District Benches. Free digital case diary for lawyers.",
  keywords: [
    "court hearing diary software",
    "lawyer case diary app",
    "court cause list tracker",
    "wakeel case diary app",
    "court date reminder app for lawyers",
    "legal case management software Pakistan",
  ],
  alternates: {
    canonical: "https://diarylex.com/court-hearing-diary/",
  },
  openGraph: {
    title: "Court Hearing Diary & Daily Cause List App | DiaryLex",
    description:
      "Replace paper court diaries with automated daily cause lists, hearing history, and next date tracking across all court benches.",
    url: "https://diarylex.com/court-hearing-diary/",
    siteName: "DiaryLex",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "DiaryLex Court Hearing Diary",
      "applicationCategory": "LegalApplication",
      "operatingSystem": "Web, iOS, Android",
      "url": "https://diarylex.com/court-hearing-diary/",
      "description":
        "Digital court hearing diary and automated cause list software for litigation advocates and law firms.",
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
          "name": "Court Hearing Diary",
          "item": "https://diarylex.com/court-hearing-diary/",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does DiaryLex replace a paper court diary (wakeel case diary)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "DiaryLex allows advocates to log daily court fixtures, courtroom numbers, presiding judges, interim orders, and next hearing dates digitally. It generates morning cause lists automatically and syncs across mobile and desktop devices.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I filter hearings by specific courts, benches, and judges?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. You can filter your daily court calendar by Supreme Court, High Court benches (Principal Seat or Circuits), District & Sessions Courts, or specialized tribunals, allowing junior associates and senior partners to coordinate effortlessly.",
          },
        },
        {
          "@type": "Question",
          "name": "Does the hearing diary work when internet connection is intermittent?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "DiaryLex caches your day's hearing diary locally in your browser session so you can check your courtroom schedule inside courthouse corridors with weak connectivity.",
          },
        },
      ],
    },
  ],
};

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";

export default function CourtHearingDiaryPage() {
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
              <span className="text-zinc-200 font-medium">Court Hearing Diary</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-gradient-to-b from-[#080E1C] via-[#05070D] to-[#050505] border-b border-white/[0.08]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-amber-500/10 blur-[120px] pointer-events-none" />
          <div className={CONTAINER}>
            <div className="max-w-3xl mx-auto text-center space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-300">
                <Scale className="w-3.5 h-3.5" />
                <span>The Modern Wakeel Case Diary Operating System</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Court Hearing Diary Software for Litigation Lawyers
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                Eliminate missed calls and paper confusion. Generate automated daily cause lists, log courtroom proceedings in real time, and organize every past and future hearing date across all court jurisdictions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
                <Link
                  href="/register/"
                  className="btn-primary btn-sheen btn-tactile w-full sm:w-auto min-w-[220px] py-3.5 text-sm font-semibold rounded-xl text-center shadow-lg hover:shadow-2xl hover:shadow-primary/25"
                >
                  <span>Start Free Court Diary</span>
                  <ArrowRight className="w-4 h-4 ms-2 inline rtl:rotate-180" />
                </Link>
                <Link
                  href="/features/"
                  className="btn-secondary btn-tactile w-full sm:w-auto min-w-[180px] py-3.5 text-sm font-semibold rounded-xl bg-card border-white/[0.12] text-zinc-200 hover:text-white text-center"
                >
                  <span>Compare Features</span>
                </Link>
              </div>
            </div>

            {/* Interactive Diary Preview Mockup */}
            <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-1 border border-white/[0.1] shadow-2xl">
              <div className="rounded-xl bg-[#090D16] p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      Daily Cause List • Lahore High Court & District Benches
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Showing 4 active fixtures scheduled for hearing today
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 w-fit">
                    Morning Roster Active
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">WP 4102/2024</span>
                        <span className="text-zinc-400">• Ahmad Textiles vs Province of Punjab</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        High Court Single Bench 03 • Justice M. Farooq • Stage: Interim Stay Extension
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[11px]">
                        Running Now
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">Civil Appeal 210/2023</span>
                        <span className="text-zinc-400">• Malik Brothers vs Capital Development Authority</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Appellate Bench II • Courtroom 05 • Stage: Final Arguments
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold text-[11px]">
                        Pending (Item #14)
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">Crl. Rev. 88/2024</span>
                        <span className="text-zinc-400">• State vs Zafarullah & Others</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Sessions Court Room 12 • Stage: Examination of Prosecution Witness
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold text-[11px]">
                        Adjourned to 15 Dec
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Capabilities Section */}
        <section className="py-20 md:py-28 border-b border-white/[0.08]">
          <div className={CONTAINER}>
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Engineered for Advocates
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Why Litigation Counsel Choose DiaryLex Over Paper Diaries
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Traditional paper diaries get lost, torn, or misplaced when multiple associates need to attend different courts simultaneously. DiaryLex brings synchronized certainty to your practice.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-card/60 border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Automated Morning Cause List</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Start every morning with a clear map of every hearing scheduled for your chamber. Filter by courtroom, judge, and priority so junior associates know exactly where to appear first.
                </p>
                <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Filter by High Court or District courtroom</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Instant status toggle: Running, Adjourned, Decided</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-card/60 border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Complete Hearing Chronology</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Maintain an unbroken audit trail of every past order, interim relief extension, courtroom remark, and witness testimony recorded chronologically from institution to final judgment.
                </p>
                <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Record judge notes and next purpose of hearing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Instant export to Chamber Hearing Summary PDF</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-card/60 border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Chamber Multi-Lawyer Sync</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Senior counsel, junior advocates, and court clerks work from the same live docket. When an associate marks an adjournment in Court 4, the senior partner sees it instantly.
                </p>
                <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Role-based access controls for chamber staff</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Zero duplicate entries or scheduling conflicts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Paper Diary vs DiaryLex Comparison Table */}
        <section className="py-20 md:py-28 bg-white/[0.02] border-b border-white/[0.08]">
          <div className={CONTAINER}>
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Direct Comparison
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Paper Case Diary vs DiaryLex Digital Platform
              </h2>
              <p className="text-sm text-zinc-400">
                See how digitizing your court diary saves up to 8 hours every week in chamber administrative overhead.
              </p>
            </div>

            <div className="max-w-3xl mx-auto rounded-2xl border border-white/[0.08] overflow-hidden bg-card/40">
              <div className="grid grid-cols-12 bg-white/[0.04] p-4 text-xs font-bold text-white border-b border-white/[0.08]">
                <div className="col-span-5 sm:col-span-6">Capability</div>
                <div className="col-span-3 sm:col-span-3 text-zinc-400">Paper Register</div>
                <div className="col-span-4 sm:col-span-3 text-amber-400">DiaryLex App</div>
              </div>
              <div className="divide-y divide-white/[0.06] text-xs">
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5 sm:col-span-6 font-medium text-white">Simultaneous Multi-Court Access</div>
                  <div className="col-span-3 sm:col-span-3 text-red-400">Impossible (1 physical book)</div>
                  <div className="col-span-4 sm:col-span-3 text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Cloud Sync Across Devices
                  </div>
                </div>
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5 sm:col-span-6 font-medium text-white">Cause List Search & Filter</div>
                  <div className="col-span-3 sm:col-span-3 text-zinc-400">Manual page-by-page flipping</div>
                  <div className="col-span-4 sm:col-span-3 text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Instant 1-Second Search
                  </div>
                </div>
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5 sm:col-span-6 font-medium text-white">Limitation Countdown Reminders</div>
                  <div className="col-span-3 sm:col-span-3 text-red-400">Easy to overlook deadlines</div>
                  <div className="col-span-4 sm:col-span-3 text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Automatic Due Countdown
                  </div>
                </div>
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5 sm:col-span-6 font-medium text-white">Client Progress Communication</div>
                  <div className="col-span-3 sm:col-span-3 text-zinc-400">Repetitive phone calls</div>
                  <div className="col-span-4 sm:col-span-3 text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> 1-Click WhatsApp Alert
                  </div>
                </div>
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5 sm:col-span-6 font-medium text-white">Historical Record Retention</div>
                  <div className="col-span-3 sm:col-span-3 text-zinc-400">Damaged, lost, or waterlogged</div>
                  <div className="col-span-4 sm:col-span-3 text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Lifetime Encrypted Vault
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Feature Cross-Links */}
        <section className="py-16 border-b border-white/[0.08]">
          <div className={CONTAINER}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold text-white">Explore Integrated Practice Modules</h3>
                <p className="text-xs text-zinc-400">Seamlessly connected to your court hearing diary</p>
              </div>
              <Link href="/features/" className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <span>View all features</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/limitation-tracker/"
                className="p-4 rounded-xl bg-card border border-white/[0.08] hover:border-amber-400/40 transition-colors group block"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Limitation Period Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Never miss an appeal deadline, civil revision, or review filing window.
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
                  Dispatch 1-click hearing outcomes and next dates directly to clients.
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
                  Track client retainers, court fee stamp receipts, and expense disbursements.
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
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Court Hearing Diary Questions Answered</h2>
            </div>

            <div className="max-w-2xl mx-auto space-y-3 text-xs">
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">How does DiaryLex replace a paper court diary (wakeel case diary)?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  DiaryLex logs court fixtures, courtroom numbers, presiding judges, interim orders, and next hearing dates digitally. It generates morning cause lists automatically and syncs across mobile and desktop devices for your whole chamber.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">Can I filter hearings by specific courts, benches, and judges?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Yes. You can filter your daily court calendar by Supreme Court, High Court benches (Principal Seat or Circuits), District &amp; Sessions Courts, or specialized tribunals, allowing junior associates and senior partners to coordinate effortlessly.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">Does the hearing diary work when internet connection is intermittent?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  DiaryLex caches your day&apos;s hearing diary locally in your browser session so you can check your courtroom schedule inside courthouse corridors with weak connectivity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 text-center bg-gradient-to-b from-[#060A14] to-[#04060C]">
          <div className={`${CONTAINER} max-w-2xl`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Step Into the Modern Courtroom
            </h2>
            <p className="text-sm text-zinc-300 mb-8 leading-relaxed">
              Join litigation advocates, chamber associates, and law practices who rely on DiaryLex for organized court appearances every single day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register/"
                className="btn-primary btn-sheen btn-tactile w-full sm:w-auto min-w-[220px] py-3.5 text-sm font-semibold rounded-xl"
              >
                <span>Create Free Chamber Account</span>
                <ArrowRight className="w-4 h-4 ms-2 inline rtl:rotate-180" />
              </Link>
              <Link
                href="/contact/"
                className="btn-secondary btn-tactile w-full sm:w-auto min-w-[160px] py-3.5 text-sm font-semibold rounded-xl bg-card border-white/[0.12] text-zinc-200 hover:text-white"
              >
                <span>Request Chamber Demo</span>
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
