import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Scale,
  Users,
  Building,
  HelpCircle,
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "Affordable Pricing Plans for Lawyers",
  description:
    "Simple, transparent pricing for solo advocates, chambers, and law firms. Start free with full court hearing diary and case management features.",
  keywords: [
    "law firm software pricing",
    "court hearing diary cost",
    "legal practice management software pricing",
    "advocate case diary app free",
    "lawyer billing app Pakistan",
  ],
  alternates: {
    canonical: "https://diarylex.com/pricing/",
  },
  openGraph: {
    title: "Affordable Pricing Plans for Lawyers | DiaryLex",
    description:
      "Start free with full litigation management, court hearing diary, limitation countdowns, and chamber ledger.",
    url: "https://diarylex.com/pricing/",
    siteName: "DiaryLex",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "name": "DiaryLex Legal Practice Management Software",
      "description":
        "Intelligent case management, automated court cause lists, hearing diary, limitation tracker, and chamber ledger for litigation lawyers.",
      "brand": {
        "@type": "Brand",
        "name": "DiaryLex",
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "category": "Early Advocate Beta - 100% Free",
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
          "name": "Pricing",
          "item": "https://diarylex.com/pricing/",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is DiaryLex genuinely free during early access?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! DiaryLex is 100% free with unrestricted access to all court hearing diary tools, automated cause lists, limitation tracking, and WhatsApp client alerts during our rollout.",
          },
        },
        {
          "@type": "Question",
          "name": "Do I need to enter credit card details to sign up?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No credit card or payment information is required to create your chamber account and start managing cases.",
          },
        },
        {
          "@type": "Question",
          "name": "What happens to my data if pricing changes in the future?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All early beta advocates receive grandfathered benefits. Furthermore, your data is always 100% yours and can be exported at any time to PDF and CSV formats without restriction.",
          },
        },
      ],
    },
  ],
};

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";

export default function PricingPage() {
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
              <span className="text-zinc-200 font-medium">Pricing</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-gradient-to-b from-[#0B1526] via-[#060B14] to-[#050505] border-b border-white/[0.08]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-amber-500/10 blur-[120px] pointer-events-none" />
          <div className={CONTAINER}>
            <div className="max-w-3xl mx-auto text-center space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Transparent &amp; Accessible Practice Software</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Simple, Predictable Plans for Modern Law Chambers
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                Start completely free with full access to daily cause lists, limitation tracking, and client WhatsApp alerts. No credit card required.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <section className="py-20 md:py-28 border-b border-white/[0.08]">
          <div className={CONTAINER}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
              {/* Plan 1: Early Beta (Active) */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-amber-400/[0.08] via-card to-card border-2 border-amber-400/40 relative shadow-2xl flex flex-col justify-between">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-amber-400 text-black text-[11px] font-bold uppercase tracking-wider shadow-sm">
                  Most Popular &bull; Free Now
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-amber-400" />
                    <h2 className="text-xl font-bold text-white">Early Advocate Beta</h2>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Unrestricted full access for litigation advocates participating in our global rollout.
                  </p>
                  <div className="pt-2 pb-4 border-b border-white/[0.08]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-white font-mono">$0</span>
                      <span className="text-xs text-zinc-400">/ completely free</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                      No credit card required
                    </span>
                  </div>

                  <ul className="space-y-3 text-xs text-zinc-300 pt-2">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Unlimited active case dockets &amp; briefs</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Automated daily cause list board</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>10-Day limitation &amp; appeal countdown alerts</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>1-Click client updates via WhatsApp</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Chamber financial ledger &amp; expense tracking</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Export case summaries &amp; hearing lists to PDF</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href="/register/"
                    className="btn-primary btn-sheen btn-tactile w-full py-3.5 text-sm font-semibold rounded-xl text-center block shadow-lg hover:shadow-2xl hover:shadow-primary/25"
                  >
                    Join Free Early Beta
                  </Link>
                </div>
              </div>

              {/* Plan 2: Solo Advocate Pro */}
              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-white/[0.08] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <h2 className="text-xl font-bold text-white">Solo Advocate Pro</h2>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Designed for independent litigation counsel requiring advanced custom reports.
                  </p>
                  <div className="pt-2 pb-4 border-b border-white/[0.08]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white font-mono">$19</span>
                      <span className="text-xs text-zinc-400">/ mo [Future Tier]</span>
                    </div>
                    <span className="text-[11px] text-amber-400 font-semibold block mt-1">
                      Free during Early Advocate Beta
                    </span>
                  </div>

                  <ul className="space-y-3 text-xs text-zinc-300 pt-2">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Everything in Early Advocate Beta</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Custom chamber letterhead PDF reports</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>SMS &amp; Email automated client notifications</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Priority support via WhatsApp Chamber Helpdesk</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href="/register/"
                    className="btn-secondary btn-tactile w-full py-3.5 text-sm font-semibold rounded-xl text-center block bg-white/[0.05] border-white/[0.12] text-zinc-200 hover:text-white"
                  >
                    Start Free (Early Access)
                  </Link>
                </div>
              </div>

              {/* Plan 3: Chamber & Firm */}
              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-white/[0.08] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-xl font-bold text-white">Chamber Partnership</h2>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    For multi-lawyer practices, partner chambers, and corporate litigation firms.
                  </p>
                  <div className="pt-2 pb-4 border-b border-white/[0.08]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white font-mono">$49</span>
                      <span className="text-xs text-zinc-400">/ mo [Future Tier]</span>
                    </div>
                    <span className="text-[11px] text-amber-400 font-semibold block mt-1">
                      Free during Early Advocate Beta
                    </span>
                  </div>

                  <ul className="space-y-3 text-xs text-zinc-300 pt-2">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Everything in Solo Advocate Pro</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Multi-associate role permissions &amp; delegation</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Centralized chamber financial ledger &amp; audit trail</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Dedicated chamber onboarding concierge</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href="/contact/"
                    className="btn-secondary btn-tactile w-full py-3.5 text-sm font-semibold rounded-xl text-center block bg-white/[0.05] border-white/[0.12] text-zinc-200 hover:text-white"
                  >
                    Contact for Firm Setup
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 border-b border-white/[0.08]">
          <div className={CONTAINER}>
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Frequently Asked Questions</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Pricing &amp; Account Questions</h2>
            </div>

            <div className="max-w-2xl mx-auto space-y-3 text-xs">
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">Is DiaryLex genuinely free during early access?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Yes! DiaryLex is 100% free with unrestricted access to all court hearing diary tools, automated cause lists, limitation tracking, and WhatsApp client alerts during our rollout.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">Do I need to enter credit card details to sign up?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  No credit card or payment information is required to create your chamber account and start managing cases.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">What happens to my data if pricing changes in the future?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  All early beta advocates receive grandfathered benefits. Furthermore, your data is always 100% yours and can be exported at any time to PDF and CSV formats without restriction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 text-center bg-gradient-to-b from-[#080E1C] to-[#04060C]">
          <div className={`${CONTAINER} max-w-2xl`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Get Started In Under 2 Minutes
            </h2>
            <p className="text-sm text-zinc-300 mb-8 leading-relaxed">
              Create your chamber workspace and add your first court hearing today.
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
