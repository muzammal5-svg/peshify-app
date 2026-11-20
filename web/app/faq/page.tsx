import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, HelpCircle, Sparkles, ArrowRight } from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";
import { FAQClient, type FAQItem } from "@/components/marketing/FAQClient";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about DiaryLex legal case management software, court hearing diary, client alerts, security, and chamber onboarding.",
  keywords: [
    "court hearing diary software FAQ",
    "legal practice management questions",
    "advocate case diary app help",
    "wakeel case diary app Pakistan",
    "DiaryLex help",
  ],
  alternates: {
    canonical: "https://diarylex.com/faq/",
  },
  openGraph: {
    title: "Frequently Asked Questions | DiaryLex Legal Software",
    description:
      "Clear answers about DiaryLex onboarding, courtroom cause lists, limitation tracking, and chamber confidentiality.",
    url: "https://diarylex.com/faq/",
    siteName: "DiaryLex",
    type: "website",
  },
};

const FAQ_DATA: FAQItem[] = [
  {
    category: "General",
    questions: [
      {
        q: "What is DiaryLex?",
        a: "DiaryLex is an intelligent case management and court hearing diary platform engineered for litigation attorneys, advocates, barristers, and law firms across global court hierarchies.",
      },
      {
        q: "Who can use DiaryLex?",
        a: "DiaryLex is built for solo counsel, chamber associates, senior advocates, and law partnerships managing active litigation cases, court dockets, hearing diaries, and clients.",
      },
      {
        q: "Is DiaryLex really free?",
        a: "Yes, during Early Access DiaryLex is free for all users. You get access to court hearing diaries, daily cause lists, limitation tracking, and client WhatsApp alerts with no credit card required.",
      },
      {
        q: "Will DiaryLex always be free?",
        a: "DiaryLex is free during Early Access. Paid subscription plans for growing law firms may be introduced later. Early users will receive advance notice before any paid plans begin.",
      },
      {
        q: "Does DiaryLex support multiple court jurisdictions?",
        a: "Yes! DiaryLex supports Apex & Supreme Courts, High Courts (Principal Seats and Circuit Benches), District & Sessions Courts, Civil Courts, and Specialized Tribunals.",
      },
    ],
  },
  {
    category: "Features & Workflows",
    questions: [
      {
        q: "How does the daily cause list feature work?",
        a: "DiaryLex compiles your practice's daily court fixtures into an automated hearing list sorted by case number, court, judge, and hearing stage.",
      },
      {
        q: "How do WhatsApp client notifications work?",
        a: "With a single click from any case or hearing entry, DiaryLex formats professional court progress notices and opens WhatsApp ready to review and send to your client.",
      },
      {
        q: "How does the limitation countdown timer alert lawyers?",
        a: "DiaryLex tracks statutory filing deadlines (e.g., 30, 60, or 90 days for civil revisions and appeals) and triggers multi-tier countdown alerts at 10-day, 5-day, and 24-hour milestones.",
      },
      {
        q: "Can I manage court filing fee disbursements and client retainers?",
        a: "Yes. The chamber ledger module logs client retainer balances, court fee stamp expenses, and associate fee disbursements tied directly to case files.",
      },
    ],
  },
  {
    category: "Security & Confidentiality",
    questions: [
      {
        q: "Will my chamber's case records stay confidential?",
        a: "Yes. All legal files, client notes, and case records are protected by attorney-client privilege standards and isolated via PostgreSQL Row-Level Security (RLS). One chamber cannot view another's data.",
      },
      {
        q: "Will my data stay safe if pricing changes?",
        a: "Yes. Your case dockets and chamber records remain strictly your property and are protected under attorney-client confidentiality with database-level isolation. You can export cause lists and summary reports at any time.",
      },
      {
        q: "How is data protected against loss or hardware failure?",
        a: "All case dockets and documents are stored in secure cloud storage with automated daily backups and export capabilities for cause lists and summaries.",
      },
      {
        q: "Can I export my cases and hearing history at any time?",
        a: "Yes. You have total ownership of your data. You can download chamber cause lists, case summaries, and client financial ledgers at any time without restriction.",
      },
    ],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": "https://diarylex.com/faq/#faq",
      "url": "https://diarylex.com/faq/",
      "mainEntity": FAQ_DATA.flatMap((cat) =>
        cat.questions.map((q) => ({
          "@type": "Question",
          "name": q.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": q.a,
          },
        }))
      ),
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
          "name": "FAQ",
          "item": "https://diarylex.com/faq/",
        },
      ],
    },
  ],
};

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";

export default function FAQPage() {
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
              <span className="text-zinc-200 font-medium">FAQ</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative pt-16 pb-16 md:pt-24 md:pb-20 overflow-hidden bg-gradient-to-b from-[#0B1526] via-[#060B14] to-[#050505] border-b border-white/[0.08]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-amber-500/10 blur-[120px] pointer-events-none" />
          <div className={CONTAINER}>
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-300">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Knowledgebase &amp; Support</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Frequently Asked Questions
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                Everything you need to know about DiaryLex court hearing diary software, cause list automation, limitation alerts, and chamber security.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24 border-b border-white/[0.08]">
          <div className={CONTAINER}>
            <FAQClient faqs={FAQ_DATA} />
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 text-center bg-gradient-to-b from-[#080E1C] to-[#04060C]">
          <div className={`${CONTAINER} max-w-2xl`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Upgrade Your Chamber?
            </h2>
            <p className="text-sm text-zinc-300 mb-8 leading-relaxed">
              Create your free chamber account and add your active court cases in minutes.
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
                href="/features/"
                className="btn-secondary btn-tactile w-full sm:w-auto min-w-[160px] py-3.5 text-sm font-semibold rounded-xl bg-card border-white/[0.12] text-zinc-200 hover:text-white"
              >
                <span>Explore Features</span>
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
