import type { Metadata } from "next";
import Link from "next/link";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Receipt,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  ChevronRight,
  Scale,
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "Chamber Ledger & Law Firm Accounting App",
  description:
    "Manage chamber accounts, client retainer fees, court stamp expenses, and advocate invoicing with DiaryLex chamber ledger software for litigation counsel.",
  keywords: [
    "chamber ledger software",
    "law firm accounting software",
    "advocate case management app",
    "lawyer fee tracking",
    "court expense disbursements",
    "lawyer cashbook software",
  ],
  alternates: {
    canonical: "https://diarylex.com/chamber-ledger/",
  },
  openGraph: {
    title: "Chamber Ledger & Law Firm Accounting App | DiaryLex",
    description:
      "Chamber ledger, case expense logging, and client retainer accounting engineered for litigation advocates and law firms.",
    url: "https://diarylex.com/chamber-ledger/",
    siteName: "DiaryLex",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "DiaryLex Chamber Ledger",
      "applicationCategory": "BusinessApplication, LegalApplication",
      "operatingSystem": "Web, iOS, Android",
      "url": "https://diarylex.com/chamber-ledger/",
      "description":
        "Chamber ledger and client fee accounting software for advocates, barristers, and litigation law firms.",
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
          "name": "Chamber Ledger",
          "item": "https://diarylex.com/chamber-ledger/",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does the chamber ledger keep advocate finances separate and private?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Every financial entry, retainer agreement, and expense voucher in DiaryLex is secured by PostgreSQL Row-Level Security (RLS). No other advocate, chamber, or external user can access your fee structures or financial transactions.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I track court filing expenses separately from legal professional fees?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. DiaryLex categorizes transactions into Professional Fees, Out-of-Pocket Court Expenses (court fee stamps, summoning, process fees, paper book binding), and Associate Disbursements for clean billing.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I generate printable client fee summaries?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. With a single click, you can generate professional Chamber Statement PDFs showing payments received, pending balances, and line-item disbursements.",
          },
        },
      ],
    },
  ],
};

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";

export default function ChamberLedgerPage() {
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
              <span className="text-zinc-200 font-medium">Chamber Ledger</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-gradient-to-b from-[#0B1526] via-[#060B14] to-[#050505] border-b border-white/[0.08]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-amber-500/10 blur-[120px] pointer-events-none" />
          <div className={CONTAINER}>
            <div className="max-w-3xl mx-auto text-center space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-300">
                <Receipt className="w-3.5 h-3.5" />
                <span>Transparent Law Practice Accounting &amp; Retainers</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Chamber Ledger &amp; Legal Billing Software
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                Track client retainers, court expense disbursements, process server costs, and advocate invoices. Maintain strict financial clarity for every litigation brief.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
                <Link
                  href="/register/"
                  className="btn-primary btn-sheen btn-tactile w-full sm:w-auto min-w-[220px] py-3.5 text-sm font-semibold rounded-xl text-center shadow-lg hover:shadow-2xl hover:shadow-primary/25"
                >
                  <span>Start Chamber Ledger</span>
                  <ArrowRight className="w-4 h-4 ms-2 inline rtl:rotate-180" />
                </Link>
                <Link
                  href="/court-hearing-diary/"
                  className="btn-secondary btn-tactile w-full sm:w-auto min-w-[180px] py-3.5 text-sm font-semibold rounded-xl bg-card border-white/[0.12] text-zinc-200 hover:text-white text-center"
                >
                  <span>Explore Hearing Diary</span>
                </Link>
              </div>
            </div>

            {/* Ledger Preview Mockup */}
            <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-1 border border-white/[0.1] shadow-2xl">
              <div className="rounded-xl bg-[#080E1A] p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                      Chamber Account Summary • WP 1042/2024
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Client: Tariq Mahmood • Matter: Constitutional Writ Petition (LHC)
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 w-fit">
                    Balance Settled 75%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                    <span className="text-[11px] text-zinc-400">Agreed Legal Fee</span>
                    <p className="text-lg font-bold text-white font-mono">PKR 350,000</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                    <span className="text-[11px] text-zinc-400">Retainer Received</span>
                    <p className="text-lg font-bold text-emerald-400 font-mono">PKR 250,000</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                    <span className="text-[11px] text-zinc-400">Remaining Balance</span>
                    <p className="text-lg font-bold text-amber-300 font-mono">PKR 100,000</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
                  <div className="flex items-center justify-between text-zinc-400 text-[11px] px-2 font-mono">
                    <span>Recent Case Ledger Entries</span>
                    <span>Type &bull; Amount</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">Initial Filing Retainer Payment</span>
                      <span className="text-[11px] text-zinc-400">Direct Bank Transfer • Receipt #0104</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-semibold">+ PKR 250,000</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">Court Fee Stamp &amp; Process Vouchers</span>
                      <span className="text-[11px] text-zinc-400">High Court Treasury Receipt #9841</span>
                    </div>
                    <span className="font-mono text-zinc-300">- PKR 15,200</span>
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
                Chamber Financial Control
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Built Around How Litigation Chambers Actually Operate
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Generic accounting apps fail in legal practices because they don&apos;t connect transactions to specific court case numbers, client retainers, and court fee receipts. DiaryLex solves this.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-card/60 border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Case-Linked Retainer Tracking</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Tie agreed fees directly to case dockets. Automatically track initial retainers, hearing-stage milestone fees, and final judgment balance settlements without confusing spreadsheets.
                </p>
                <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Fixed fee, milestone, or hourly billing models</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Real-time receivables &amp; aging balance dashboard</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-card/60 border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Court Expense Disbursements</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Log every out-of-pocket expenditure as it occurs: court stamp papers, bailiff fees, registered post notices, and specialized research reports. Reconcile with clients seamlessly.
                </p>
                <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Attach expense receipt snapshots to case files</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Export itemized disbursement statements</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-card/60 border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Strict Multi-Tenant Confidentiality</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Financial numbers are strictly confidential. DiaryLex enforces PostgreSQL Row-Level Security (RLS) so chamber ledgers are completely invisible to any other account.
                </p>
                <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Granular permissions for partners vs associates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Audit trail of all invoice updates and balance changes</span>
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
                <h3 className="text-xl font-bold text-white">Integrated Practice Modules</h3>
                <p className="text-xs text-zinc-400">Connected with your chamber ledger</p>
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
                  Connect billing milestones directly to court hearing dates.
                </p>
              </Link>

              <Link
                href="/limitation-tracker/"
                className="p-4 rounded-xl bg-card border border-white/[0.08] hover:border-amber-400/40 transition-colors group block"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Limitation Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Track statutory appeal windows and drafting milestones.
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
                  Send payment receipt acknowledgments and fee reminders.
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
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Chamber Ledger Questions Answered</h2>
            </div>

            <div className="max-w-2xl mx-auto space-y-3 text-xs">
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">How does the chamber ledger keep advocate finances separate and private?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Every financial entry, retainer agreement, and expense voucher in DiaryLex is secured by PostgreSQL Row-Level Security (RLS). No other advocate, chamber, or external user can access your fee structures or financial transactions.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">Can I track court filing expenses separately from legal professional fees?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Yes. DiaryLex categorizes transactions into Professional Fees, Out-of-Pocket Court Expenses (court fee stamps, summoning, process fees, paper book binding), and Associate Disbursements for clean billing.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">Can I generate printable client fee summaries?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Yes. With a single click, you can generate professional Chamber Statement PDFs showing payments received, pending balances, and line-item disbursements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 text-center bg-gradient-to-b from-[#080E1C] to-[#04060C]">
          <div className={`${CONTAINER} max-w-2xl`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Take Command of Chamber Accounting
            </h2>
            <p className="text-sm text-zinc-300 mb-8 leading-relaxed">
              Equip your law firm with clear retainer ledgers and expense tracking. Start free today.
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
