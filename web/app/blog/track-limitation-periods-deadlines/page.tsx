import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  Scale,
  CheckCircle2,
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "How to Track Limitation Periods & Deadlines",
  description:
    "A complete guide for litigation lawyers on calculating and tracking statutory limitation periods, civil revision deadlines, and appellate countdowns.",
  keywords: [
    "limitation period tracker for lawyers",
    "appeal deadline calculator",
    "Section 12 Limitation Act",
    "court limitation software",
    "civil revision deadline",
    "advocate case diary app",
  ],
  alternates: {
    canonical: "https://diarylex.com/blog/track-limitation-periods-deadlines/",
  },
  openGraph: {
    title: "How to Track Limitation Periods & Deadlines | DiaryLex",
    description:
      "A complete guide for litigation lawyers on calculating and tracking statutory limitation periods, civil revision deadlines, and appellate countdowns.",
    url: "https://diarylex.com/blog/track-limitation-periods-deadlines/",
    siteName: "DiaryLex",
    type: "article",
    publishedTime: "2024-11-16T00:00:00.000Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": "https://diarylex.com/blog/track-limitation-periods-deadlines/#article",
      "headline": "How to Track Limitation Periods and Never Miss a Deadline",
      "description":
        "A complete guide for litigation lawyers on calculating and tracking statutory limitation periods, civil revision deadlines, and appellate countdowns.",
      "url": "https://diarylex.com/blog/track-limitation-periods-deadlines/",
      "datePublished": "2024-11-16T00:00:00.000Z",
      "dateModified": "2024-11-20T00:00:00.000Z",
      "author": {
        "@type": "Organization",
        "name": "DiaryLex Appellate Practice Group",
      },
      "publisher": {
        "@id": "https://diarylex.com/#organization",
      },
      "mainEntityOfPage": "https://diarylex.com/blog/track-limitation-periods-deadlines/",
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
          "name": "Blog",
          "item": "https://diarylex.com/blog/",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Track Limitation Periods",
          "item": "https://diarylex.com/blog/track-limitation-periods-deadlines/",
        },
      ],
    },
  ],
};

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";

export default function TrackLimitationPeriodsArticle() {
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
              <Link href="/blog/" className="hover:text-amber-300 transition-colors">
                Blog
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-zinc-200 font-medium">Track Limitation Periods</span>
            </nav>
          </div>
        </section>

        {/* Article Header */}
        <article className="py-16 md:py-24 border-b border-white/[0.08]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="space-y-4 mb-10 pb-8 border-b border-white/[0.08]">
              <div className="flex items-center gap-3 text-xs">
                <span className="px-3 py-1 rounded-full bg-red-400/10 text-red-300 border border-red-400/20 font-semibold">
                  Legal Deadlines
                </span>
                <span className="text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  8 min read
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400">Updated November 2024</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                How to Track Limitation Periods and Never Miss a Deadline
              </h1>

              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
                Under the law of limitation, equity aids the vigilant, not the indolent. Here is how modern litigation chambers systematize appellate countdowns and certified copy exclusions.
              </p>
            </div>

            {/* Article Content */}
            <div className="prose prose-invert prose-amber max-w-none space-y-6 text-sm sm:text-base text-zinc-300 leading-relaxed">
              <p>
                In the practice of law, there are few disasters more devastating to an advocate than having a meritorious appeal or civil revision petition dismissed at the threshold solely on the grounds of being barred by limitation.
              </p>
              <p>
                Under Section 3 of the Limitation Act, courts are under an absolute statutory duty to dismiss any suit, appeal, or application instituted after the prescribed period of limitation, even when the opposing party does not raise limitation as a preliminary defense. While Section 5 permits condonation of delay in certain appeals and applications upon proof of &quot;sufficient cause,&quot; appellate courts scrutinize every single day of delay with rigorous precision.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-white pt-6">
                The Core Statutory Limitation Periods in Litigation
              </h2>
              <p>
                Litigation counsel regularly navigate distinct limitation windows depending on the nature of the impugned order and the target forum:
              </p>
              <div className="rounded-xl border border-white/10 overflow-hidden bg-card/60 my-4 text-xs">
                <div className="grid grid-cols-12 bg-white/[0.04] p-3 font-bold text-white border-b border-white/10">
                  <div className="col-span-6">Proceeding &amp; Forum</div>
                  <div className="col-span-3">Statutory Period</div>
                  <div className="col-span-3">Governing Provision</div>
                </div>
                <div className="divide-y divide-white/[0.06]">
                  <div className="grid grid-cols-12 p-3">
                    <div className="col-span-6 text-white font-medium">Appeal to District Judge from Civil Decree</div>
                    <div className="col-span-3 text-amber-300 font-mono">30 Days</div>
                    <div className="col-span-3 text-zinc-400">Art. 152, Limitation Act</div>
                  </div>
                  <div className="grid grid-cols-12 p-3">
                    <div className="col-span-6 text-white font-medium">First Appeal to High Court (RFA / FAO)</div>
                    <div className="col-span-3 text-amber-300 font-mono">90 Days / 30 Days</div>
                    <div className="col-span-3 text-zinc-400">Art. 156, Limitation Act</div>
                  </div>
                  <div className="grid grid-cols-12 p-3">
                    <div className="col-span-6 text-white font-medium">Civil Revision under Section 115 CPC</div>
                    <div className="col-span-3 text-amber-300 font-mono">90 Days</div>
                    <div className="col-span-3 text-zinc-400">Sec. 115, CPC 1908</div>
                  </div>
                  <div className="grid grid-cols-12 p-3">
                    <div className="col-span-6 text-white font-medium">Supreme Court Petition for Leave to Appeal (CPLA)</div>
                    <div className="col-span-3 text-amber-300 font-mono">60 Days (30 Days in Interlocutory)</div>
                    <div className="col-span-3 text-zinc-400">Supreme Court Rules</div>
                  </div>
                  <div className="grid grid-cols-12 p-3">
                    <div className="col-span-6 text-white font-medium">Review Petition before High Court / Supreme Court</div>
                    <div className="col-span-3 text-amber-300 font-mono">30 Days</div>
                    <div className="col-span-3 text-zinc-400">Order XLVII CPC / SC Rules</div>
                  </div>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white pt-6">
                Mastering Section 12: Certified Copy Time Deductions
              </h2>
              <p>
                One of the most frequent areas of calculation error arises from Section 12(2) of the Limitation Act, which states that in computing the limitation period for an appeal or application for revision/review, the day on which the judgment complained of was pronounced, and the time requisite for obtaining a copy of the decree, sentence, or order appealed from, shall be excluded.
              </p>
              <p>
                However, courts have consistently held that <em>&quot;time requisite&quot;</em> is strictly bounded:
              </p>
              <ul className="space-y-2 ps-4">
                <li>The exclusion begins on the exact date counsel or the litigant files the copying application before the Copying Agency.</li>
                <li>The exclusion ceases on the date the certified copy is prepared and notified as ready for delivery by the agency — not when the litigant casually collects it weeks later.</li>
                <li>If the litigant fails to provide required stamp paper or copying fees upon requisition, those delayed days are not excluded.</li>
              </ul>

              <h2 className="text-xl sm:text-2xl font-bold text-white pt-6">
                How Modern Software Eliminates Human Limitation Errors
              </h2>
              <p>
                Relying on manual calendar counting or desk blotters to track limitation is fraught with risk, particularly when multiple associates are handling heavy cause lists across High Court and District benches.
              </p>
              <p>
                By using a dedicated <Link href="/limitation-tracker/" className="text-amber-400 font-semibold underline underline-offset-4 hover:text-amber-300">limitation period tracker</Link>, counsel inputs:
              </p>
              <ol className="space-y-2 ps-4">
                <li>Date of impugned order or decree announcement.</li>
                <li>Target forum and action type (e.g. High Court Revision or Supreme Court CPLA).</li>
                <li>Date of application for certified copy and date of readiness.</li>
              </ol>
              <p>
                The system automatically calculates the net remaining statutory days and initiates a persistent visual countdown timer on the chamber cause board.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-white pt-6">
                The 10-5-1 Escalation Rule for Law Chambers
              </h2>
              <p>
                Leading litigation chambers implement an automated 10-5-1 escalation protocol:
              </p>
              <ul className="space-y-3 ps-4">
                <li>
                  <strong className="text-white">10 Days Remaining:</strong> The draft appeal or revision grounds must be assigned to an associate and chamber research completed.
                </li>
                <li>
                  <strong className="text-white">5 Days Remaining:</strong> The senior advocate reviews and approves final grounds. The vakalatnama and affidavit are executed by the client.
                </li>
                <li>
                  <strong className="text-white">24 Hours Remaining (Critical Red Alert):</strong> The filing clerk submits the paper book to the High Court filing branch / institution counter and receives the diary number.
                </li>
              </ul>

              <h2 className="text-xl sm:text-2xl font-bold text-white pt-6">
                Integration with Daily Court Hearing Diaries
              </h2>
              <p>
                Limitation tracking must never exist in a silo disconnected from your daily court schedule. When a case is marked as &quot;Decided&quot; in your <Link href="/court-hearing-diary/" className="text-amber-400 font-semibold underline underline-offset-4 hover:text-amber-300">court hearing diary</Link>, DiaryLex automatically prompts counsel to determine whether an appeal or review is contemplated, initiating the limitation clock immediately.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-white pt-6">
                Conclusion: Zero Tolerance for Missed Deadlines
              </h2>
              <p>
                Your advocacy in the courtroom can only be as effective as your chamber&apos;s administrative discipline. By systematizing limitation calculations and establishing multi-tier warnings, litigation counsel can represent clients with absolute certainty that every appeal and revision is instituted within time.
              </p>
            </div>

            {/* In-Article CTA Box */}
            <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-red-500/10 via-card to-card border border-red-500/30 text-center space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Never Miss a Limitation Deadline Again
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
                Activate DiaryLex automated limitation countdown timers for your chamber briefs. Free during Early Access.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/register/"
                  className="btn-primary btn-sheen btn-tactile w-full sm:w-auto min-w-[200px] py-3 text-xs font-semibold rounded-xl"
                >
                  <span>Start Free Early Access</span>
                  <ArrowRight className="w-3.5 h-3.5 ms-2 inline rtl:rotate-180" />
                </Link>
                <Link
                  href="/limitation-tracker/"
                  className="btn-secondary btn-tactile w-full sm:w-auto min-w-[160px] py-3 text-xs font-semibold rounded-xl bg-card border-white/10 text-zinc-200 hover:text-white"
                >
                  <span>Explore Limitation Module</span>
                </Link>
              </div>
            </div>

            {/* Cross-Article Navigation */}
            <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <Link href="/blog/digitize-court-diary/" className="text-zinc-400 hover:text-white flex items-center gap-1">
                &larr; Previous: How Lawyers Can Digitize Court Diaries
              </Link>
              <Link
                href="/blog/managing-law-chamber-accounts-ledger/"
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <span>Next: Managing Law Chamber Accounts &amp; Ledger</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </article>
      </main>

      <PublicFooter />
      <FloatingWhatsApp />
    </div>
  );
}
