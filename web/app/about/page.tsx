import type { Metadata } from "next";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  Lock,
  Users,
  Award,
  ArrowRight,
  ChevronRight,
  Globe,
  Briefcase,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "About Us | Mission & Chamber Security",
  description:
    "DiaryLex empowers litigation counsel, advocates, and law chambers with intelligent case management, automated cause lists, and confidential record security.",
  keywords: [
    "about DiaryLex",
    "legal tech Pakistan",
    "court hearing diary software",
    "law practice management",
    "advocate case diary app",
  ],
  alternates: {
    canonical: "https://diarylex.com/about/",
  },
  openGraph: {
    title: "About DiaryLex | Modern Court Diary & Practice OS",
    description:
      "DiaryLex is the intelligent case management platform built for litigation counsel, barristers, and law chambers worldwide.",
    url: "https://diarylex.com/about/",
    siteName: "DiaryLex",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://diarylex.com/about/#about",
      "url": "https://diarylex.com/about/",
      "name": "About DiaryLex",
      "description":
        "DiaryLex was founded to modernize litigation practice across Pakistan and global court jurisdictions through intelligent hearing docketing and strict client confidentiality.",
      "publisher": {
        "@id": "https://diarylex.com/#organization",
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
          "name": "About",
          "item": "https://diarylex.com/about/",
        },
      ],
    },
  ],
};

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";

export default function AboutPage() {
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
              <span className="text-zinc-200 font-medium">About</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-gradient-to-b from-[#0B1526] via-[#060B14] to-[#050505] border-b border-white/[0.08]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-amber-500/10 blur-[120px] pointer-events-none" />
          <div className={CONTAINER}>
            <div className="max-w-3xl mx-auto text-center space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-300">
                <Scale className="w-3.5 h-3.5" />
                <span>Our Mission &amp; Chamber Commitment</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Modernizing Litigation Practice for Advocates Everywhere
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                Litigation is fast-paced, high-stakes, and unforgiving of administrative oversights. DiaryLex exists to give lawyers an executive workspace that preserves time, prevents missed deadlines, and protects attorney-client privilege.
              </p>
            </div>
          </div>
        </section>

        {/* The Story & Mission */}
        <section className="py-20 md:py-28 border-b border-white/[0.08]">
          <div className={CONTAINER}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  The Legal Challenge
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Born Out of Real Courthouse Realities
                </h2>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  For decades, litigation chambers across Pakistan and worldwide have relied on handwritten leatherbound diaries (&apos;wakeel diaries&apos;), scribbled cause lists, and ad-hoc phone calls to track court fixtures.
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  When an advocate manages dozens of active briefs spanning High Court benches, District Courts, and specialized tribunals, paper systems break down. Associates miss order pronouncements, clients make anxious phone calls during courtroom arguments, and statutory appeal limitation periods are calculated on sticky notes.
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  DiaryLex was engineered to replace this chaos with seamless digital order: an automated morning cause list, live court action timeline, statutory limitation countdown alerts, and 1-click WhatsApp client notifications.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-card/70 border border-white/[0.08] space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Our Core Commitments to the Legal Profession
                </h3>
                <ul className="space-y-4 text-xs text-zinc-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-sm">Attorney-Client Privilege Above All</strong>
                      <span>Your case files, pleadings, and client notes are never mined, sold, or shared with third parties. Multi-tenant Row-Level Security ensures total chamber isolation.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-sm">Zero Feature Bloat</strong>
                      <span>We do not build generic corporate software. Every feature is specifically tailored to courtroom fixtures, case stages, limitation rules, and advocate billing.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-sm">Free Early Beta Accessibility</strong>
                      <span>All litigation features, cause boards, and client tools are free during early access so solo advocates and junior counsel have the same advantages as large corporate firms.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Confidentiality */}
        <section className="py-20 md:py-28 bg-white/[0.02] border-b border-white/[0.08]">
          <div className={CONTAINER}>
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Data Security &amp; Trust
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                How We Protect Confidential Chamber Data
              </h2>
              <p className="text-sm text-zinc-400">
                We know that confidentiality is counsel&apos;s primary ethical obligation. Here is how DiaryLex safeguards your practice.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-white/[0.08] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Database Row-Level Security (RLS)</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Every query executed against the PostgreSQL database validates the active lawyer or chamber identifier at the kernel level. It is architecturally impossible for one advocate to view another chamber&apos;s clients or dockets.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-white/[0.08] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Encrypted Cloud Storage</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Uploaded chamber pleadings, vakalatnamas, and interim order PDFs are stored in private cloud buckets with authenticated signed URLs, preventing public or unauthenticated web access.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-white/[0.08] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Chamber Data Ownership</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  You own your data completely. You can export complete case summaries, client registers, and financial ledgers to PDF or CSV at any time with a single click.
                </p>
              </div>
            </div>

            {/* Owner Verification Notice */}
            <div className="mt-10 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center max-w-2xl mx-auto">
              <p className="text-[11px] text-zinc-400">
                [Note: Hosting network configurations such as dedicated SSL cipher suites are managed under production edge infrastructure. Specific regional data residency compliance certifications: TODO: confirm with owner].
              </p>
            </div>
          </div>
        </section>

        {/* Leadership & Chamber Team Placeholder */}
        <section className="py-20 border-b border-white/[0.08]">
          <div className={CONTAINER}>
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Our Team</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Engineered by Legal Tech Innovators</h2>
              <p className="text-xs text-zinc-400">
                Developed in close consultation with practicing litigation advocates and senior bar members.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-xl bg-card border border-white/[0.08] text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-400/10 text-amber-300 flex items-center justify-center font-bold text-lg border border-amber-400/20">
                  LP
                </div>
                <h3 className="font-bold text-white text-sm">Chamber Legal Product Advisory</h3>
                <p className="text-[11px] text-amber-400 font-medium">Practicing Litigation Counsel</p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Advises on courtroom procedure, cause list docketing workflows, and statutory limitation compliance.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card border border-white/[0.08] text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-400/10 text-blue-300 flex items-center justify-center font-bold text-lg border border-blue-400/20">
                  SE
                </div>
                <h3 className="font-bold text-white text-sm">Systems Architecture &amp; RLS</h3>
                <p className="text-[11px] text-blue-400 font-medium">Enterprise Software Engineering</p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Specializes in high-security multi-tenant PostgreSQL architecture and real-time offline synchronization.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card border border-white/[0.08] text-center space-y-2 sm:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-400/10 text-emerald-300 flex items-center justify-center font-bold text-lg border border-emerald-400/20">
                  CS
                </div>
                <h3 className="font-bold text-white text-sm">Chamber Support &amp; Onboarding</h3>
                <p className="text-[11px] text-emerald-400 font-medium">Advocate Experience Team</p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Ensures smooth onboarding, historical case data migration, and personalized staff training.
                </p>
              </div>
            </div>
            <p className="text-center text-[11px] text-zinc-500 mt-6">
              [Chamber Advisory &amp; Leadership profiles: TODO: confirm with owner for specific public partner names].
            </p>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 text-center bg-gradient-to-b from-[#080E1C] to-[#04060C]">
          <div className={`${CONTAINER} max-w-2xl`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Join the Future of Law Practice Management
            </h2>
            <p className="text-sm text-zinc-300 mb-8 leading-relaxed">
              Experience the clarity and control of DiaryLex in your chamber today.
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
