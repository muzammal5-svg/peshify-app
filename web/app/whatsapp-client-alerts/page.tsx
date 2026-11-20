import type { Metadata } from "next";
import Link from "next/link";
import {
  MessageSquare,
  CheckCheck,
  Send,
  Users,
  Clock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  Bell,
  Scale,
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "WhatsApp Client Alerts & Court Reminders",
  description:
    "Send instant court hearing summaries, next date alerts, and case status updates to clients via 1-click WhatsApp messaging. Built for litigation lawyers.",
  keywords: [
    "client WhatsApp alerts for lawyers",
    "court date reminder app for lawyers",
    "law firm client updates",
    "wakeel case diary app",
    "automated court date notification",
    "lawyer client communication",
  ],
  alternates: {
    canonical: "https://diarylex.com/whatsapp-client-alerts/",
  },
  openGraph: {
    title: "WhatsApp Client Alerts & Court Reminders | DiaryLex",
    description:
      "Send professional court date notices and hearing summaries directly to clients via 1-click WhatsApp.",
    url: "https://diarylex.com/whatsapp-client-alerts/",
    siteName: "DiaryLex",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "DiaryLex WhatsApp Client Alerts",
      "applicationCategory": "CommunicationApplication, LegalApplication",
      "operatingSystem": "Web, iOS, Android",
      "url": "https://diarylex.com/whatsapp-client-alerts/",
      "description":
        "1-click WhatsApp case progress notifications and court date reminders for litigation counsel and law practices.",
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
          "name": "WhatsApp Client Alerts",
          "item": "https://diarylex.com/whatsapp-client-alerts/",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does 1-click WhatsApp messaging work without a third-party bot?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "DiaryLex formats a professional legal notice with your chamber branding, case title, court name, interim order summary, and next date. Clicking 'Send WhatsApp' opens your WhatsApp Web or mobile app with the pre-formatted text ready to review and send.",
          },
        },
        {
          "@type": "Question",
          "name": "Does DiaryLex share my client contact numbers with external parties?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Never. Client phone numbers and confidential case records are protected by PostgreSQL Row-Level Security (RLS). DiaryLex never sells, transfers, or shares lawyer or client contact information.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I customize the wording of the WhatsApp court update?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. While DiaryLex provides structured legal templates in English and Urdu, you can edit and personalize any message before sending.",
          },
        },
      ],
    },
  ],
};

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";

export default function WhatsAppClientAlertsPage() {
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
              <span className="text-zinc-200 font-medium">WhatsApp Client Alerts</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-gradient-to-b from-[#061811] via-[#040D0A] to-[#050505] border-b border-white/[0.08]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-emerald-500/10 blur-[120px] pointer-events-none" />
          <div className={CONTAINER}>
            <div className="max-w-3xl mx-auto text-center space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-xs font-semibold text-emerald-300">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>1-Click Court Progress Dispatch for Litigation Lawyers</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                WhatsApp Client Alerts &amp; Court Date Reminders
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                Keep clients informed without endless phone calls during court hours. Generate clean, professional WhatsApp updates with case stage, courtroom orders, and next hearing dates in seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
                <Link
                  href="/register/"
                  className="btn-primary btn-sheen btn-tactile w-full sm:w-auto min-w-[220px] py-3.5 text-sm font-semibold rounded-xl text-center shadow-lg hover:shadow-2xl hover:shadow-primary/25"
                >
                  <span>Start Sending Client Alerts</span>
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

            {/* WhatsApp Message Preview Mockup */}
            <div className="mt-14 max-w-2xl mx-auto rounded-2xl bg-gradient-to-b from-emerald-500/10 to-transparent p-1 border border-emerald-500/20 shadow-2xl">
              <div className="rounded-xl bg-[#07130F] p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      DL
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Client Notice Preview</span>
                      <span className="text-[10px] text-zinc-400">Recipient: Tariq Mahmood (+92 300 •••••••)</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Ready to Send
                  </span>
                </div>

                {/* WhatsApp Chat Bubble */}
                <div className="max-w-md bg-[#0D241D] p-4 rounded-2xl rounded-tl-sm border border-emerald-500/20 text-xs text-zinc-200 space-y-2 font-sans shadow-md">
                  <div className="font-bold text-emerald-300 pb-1 border-b border-emerald-500/20 flex items-center justify-between">
                    <span>DiaryLex Law Chamber Update</span>
                    <span className="text-[10px] text-zinc-400">Today, 11:42 AM</span>
                  </div>
                  <p className="leading-relaxed">
                    Dear Tariq Mahmood,<br />
                    Here is the court update regarding your case:
                  </p>
                  <div className="p-2.5 rounded-lg bg-black/30 border border-emerald-500/15 space-y-1 font-mono text-[11px]">
                    <p><strong className="text-white">Case:</strong> WP 1042/2024</p>
                    <p><strong className="text-white">Court:</strong> Lahore High Court (Courtroom 02)</p>
                    <p><strong className="text-white">Bench:</strong> Hon. Justice M. Farooq</p>
                    <p><strong className="text-white">Outcome:</strong> Interim stay extension granted. Notice issued to respondent.</p>
                    <p><strong className="text-emerald-300">Next Hearing:</strong> 18 December 2024</p>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-400">
                    <span>Sent via DiaryLex Chamber OS</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCheck className="w-3.5 h-3.5" /> Delivered
                    </span>
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
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Client Communication Solved
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                How WhatsApp Updates Transform Law Chamber Client Relations
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Litigants want reassurance, but answering 30 separate phone calls while walking between court benches disrupts counsel&apos;s concentration. DiaryLex turns post-hearing communication into a 10-second task.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-card/60 border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">1-Click Immediate Dispatch</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  The moment a hearing ends, mark the outcome and click &apos;Send WhatsApp Update&apos;. The case title, bench name, interim orders, and next date are pre-filled automatically.
                </p>
                <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Zero manual retyping of case details</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Works directly with WhatsApp Web &amp; Mobile</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-card/60 border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Automated Next Date Reminders</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Send reminder notices to clients 24 hours prior to upcoming hearings. Ensure witnesses are prepared, evidence documents are signed, and clients arrive on time.
                </p>
                <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Courtroom location &amp; reporting instructions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Prevent last-minute client no-shows</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-card/60 border border-white/[0.08] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Professional Chamber Boundaries</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Establish a structured communication cadence. Clients receive clear written notices, keeping your personal phone line free for focused legal research and court appearances.
                </p>
                <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Consistent professional chamber branding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Client numbers never exposed to third parties</span>
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
                <p className="text-xs text-zinc-400">Streamline your litigation practice</p>
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
                href="/limitation-tracker/"
                className="p-4 rounded-xl bg-card border border-white/[0.08] hover:border-amber-400/40 transition-colors group block"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Limitation Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Never miss an appeal deadline, civil revision, or review filing.
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
                  Track client retainers, court fee stamp receipts, and disbursements.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 border-b border-white/[0.08]">
          <div className={CONTAINER}>
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Frequently Asked Questions</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">WhatsApp Client Alerts Questions Answered</h2>
            </div>

            <div className="max-w-2xl mx-auto space-y-3 text-xs">
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">How does 1-click WhatsApp messaging work without a third-party bot?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  DiaryLex formats a professional legal notice with your chamber branding, case title, court name, interim order summary, and next date. Clicking &apos;Send WhatsApp&apos; opens your WhatsApp Web or mobile app with the pre-formatted text ready to review and send.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">Does DiaryLex share my client contact numbers with external parties?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Never. Client phone numbers and confidential case records are protected by PostgreSQL Row-Level Security (RLS). DiaryLex never sells, transfers, or shares lawyer or client contact information.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-white/[0.08] space-y-2">
                <h3 className="font-bold text-white text-sm">Can I customize the wording of the WhatsApp court update?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Yes. While DiaryLex provides structured legal templates in English and Urdu, you can edit and personalize any message before sending.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 text-center bg-gradient-to-b from-[#06140F] to-[#04060C]">
          <div className={`${CONTAINER} max-w-2xl`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Delight Your Clients With Modern Court Updates
            </h2>
            <p className="text-sm text-zinc-300 mb-8 leading-relaxed">
              Equip your chamber with instant WhatsApp case progress notifications. Free during early advocate beta.
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
