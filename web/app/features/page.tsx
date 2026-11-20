import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Clock,
  FileText,
  BarChart3,
  Lock,
  Globe,
  Zap,
  Check,
  ArrowRight,
  Sparkles,
  Scale,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "Features Overview | Legal Case Management",
  description:
    "Explore DiaryLex features: court hearing diary, daily cause lists, limitation countdown alerts, WhatsApp client notices, and chamber financial ledger.",
  keywords: [
    "court hearing diary software",
    "legal case management software Pakistan",
    "lawyer case diary app",
    "chamber ledger software",
    "limitation period tracker for lawyers",
    "client WhatsApp alerts for lawyers",
  ],
  alternates: {
    canonical: "https://diarylex.com/features/",
  },
  openGraph: {
    title: "Features Overview | Legal Case Management & Diary | DiaryLex",
    description:
      "From automated court cause lists to client hearing notices and limitation countdowns — engineered for litigation attorneys worldwide.",
    url: "https://diarylex.com/features/",
    siteName: "DiaryLex",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "DiaryLex Legal Practice Platform",
      "applicationCategory": "BusinessApplication, LegalApplication",
      "operatingSystem": "Web, iOS, Android",
      "url": "https://diarylex.com/features/",
      "description":
        "Comprehensive litigation management, court hearing diary, limitation alerts, and chamber ledger for litigation advocates and law firms.",
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
          "name": "Features",
          "item": "https://diarylex.com/features/",
        },
      ],
    },
  ],
};

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";
const SECTION = "py-20 md:py-28";

export default function FeaturesPage() {
  const features = [
    {
      icon: Calendar,
      title: "Court Hearing Diary & Cause List",
      desc: "Organize scheduled hearings across Supreme Courts, High Courts, and District Benches. Instant status toggles for Running, Adjourned, or Decided.",
      link: "/court-hearing-diary/",
      linkText: "Explore Hearing Diary",
      benefits: [
        "Automated morning cause list roster",
        "Filter by court room, bench & judge",
        "Complete historical hearing orders",
        "Export Chamber Hearing Summary PDF",
      ],
    },
    {
      icon: Clock,
      title: "Limitation & Appeal Countdown",
      desc: "Record critical appeal deadlines and filing dates. Get countdown alerts at 10-day, 5-day, and 1-day milestones so your chamber stays ahead of court cutoffs.",
      link: "/limitation-tracker/",
      linkText: "Explore Limitation Tracker",
      benefits: [
        "Custom statutory filing countdown timers",
        "Appellate and revision deadline reminders",
        "Proactive alerts on chamber cause board",
        "Color-coded urgency status badges",
      ],
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Client Alerts",
      desc: "Dispatch clean, professional hearing summaries and next dates directly to clients via 1-click WhatsApp messaging without repetitive phone calls.",
      link: "/whatsapp-client-alerts/",
      linkText: "Explore WhatsApp Alerts",
      benefits: [
        "1-Click pre-formatted legal notices",
        "Case progress, bench & next date details",
        "Works with WhatsApp Web & mobile",
        "Strict client contact confidentiality",
      ],
    },
    {
      icon: BarChart3,
      title: "Chamber Financial Ledger",
      desc: "Manage client retainers, milestone payments, court fee stamp expenses, and associate fee disbursements tied directly to case files.",
      link: "/chamber-ledger/",
      linkText: "Explore Chamber Ledger",
      benefits: [
        "Case-linked retainer balance tracking",
        "Out-of-pocket court expense vouchers",
        "Instant client billing statement PDF",
        "PostgreSQL RLS multi-tenant protection",
      ],
    },
    {
      icon: Briefcase,
      title: "Case Docket & Record Vault",
      desc: "Maintain complete digital litigation dockets including party particulars, opposing counsel notes, certified orders, and pleadings.",
      benefits: [
        "Centralized case repository per brief",
        "Pleadings draft & vakalatnama storage",
        "Instant search across running & decided cases",
        "Firm-level folder & permissions isolation",
      ],
    },
    {
      icon: Users,
      title: "Multi-Associate Chamber Collaboration",
      desc: "Connect senior partners, junior advocates, and filing clerks under one live docket with role-based permissions.",
      benefits: [
        "Real-time docket updates across chambers",
        "Associate task assignment & reminders",
        "Zero duplicate entries or court overlaps",
        "Granular access controls per team member",
      ],
    },
    {
      icon: Lock,
      title: "Strict Chamber Data Isolation",
      desc: "Engineered around attorney-client privilege. PostgreSQL Row-Level Security (RLS) ensures complete multi-tenant isolation.",
      benefits: [
        "Kernel-level data boundary enforcement",
        "Private authenticated cloud storage",
        "Complete data export to PDF and CSV",
        "Encrypted backups and audit trails",
      ],
    },
    {
      icon: Globe,
      title: "Multi-Jurisdiction Adaptability",
      desc: "Engineered to adapt seamlessly across Supreme Courts, Appellate Benches, District Courts, and Commercial Arbitration Tribunals.",
      benefits: [
        "Appellate & High Court docketing",
        "Commercial tribunal & arbitration tracking",
        "Time-zone aware court hearing calendars",
        "Universal access across desktop & mobile",
      ],
    },
  ];

  return (
    <div className="min-h-dvh bg-[#070A12] text-[#EDE8E0] selection:bg-amber-400/20 selection:text-white overflow-x-clip font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicHeader overDark />

      {/* Breadcrumb Bar */}
      <section className="border-b border-white/[0.08] bg-black/40 py-3 text-xs text-zinc-400">
        <div className={CONTAINER}>
          <nav className="flex items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-amber-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-200 font-medium">Features</span>
          </nav>
        </div>
      </section>

      {/* ── HERO ── */}
      <section className="relative pt-16 pb-16 md:pt-24 md:pb-24 text-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-amber-400/5 to-transparent blur-3xl pointer-events-none" />
        </div>

        <div className={`${CONTAINER} relative z-10 max-w-3xl mx-auto space-y-5`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-amber-400/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Platform Capabilities &amp; Courtroom Workflows</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            Intelligent Legal Case Management Built For Modern Counsel
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From automated court cause lists to client hearing notices and limitation alerts — engineered for litigation attorneys, law firms, and counsel worldwide.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/register/"
              className="btn-primary min-w-[200px] py-3.5 text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl btn-sheen btn-tactile"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
            </Link>
            <Link
              href="/contact/"
              className="btn-secondary min-w-[160px] py-3.5 text-sm font-semibold rounded-xl bg-card border-white/10 text-slate-200 hover:text-white btn-tactile"
            >
              <span>Request Chamber Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4 CORE SPECIALIZED CAPABILITIES ── */}
      <section className="py-12 border-b border-white/10 bg-white/[0.02]">
        <div className={CONTAINER}>
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Deep-Dive Feature Guides
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Explore Our Dedicated Practice Modules
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/court-hearing-diary/"
              className="p-5 rounded-2xl bg-card border border-white/10 hover:border-amber-400/40 transition-colors group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white group-hover:text-amber-300 transition-colors text-sm">
                  Court Hearing Diary
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Daily cause lists, courtroom schedules, and next hearing date recording.
                </p>
              </div>
              <div className="pt-3 text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/limitation-tracker/"
              className="p-5 rounded-2xl bg-card border border-white/10 hover:border-amber-400/40 transition-colors group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-red-400/10 text-red-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white group-hover:text-amber-300 transition-colors text-sm">
                  Limitation Tracker
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Court filing countdown timers, appeal deadlines &amp; milestone alerts.
                </p>
              </div>
              <div className="pt-3 text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/whatsapp-client-alerts/"
              className="p-5 rounded-2xl bg-card border border-white/10 hover:border-amber-400/40 transition-colors group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white group-hover:text-amber-300 transition-colors text-sm">
                  WhatsApp Client Alerts
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  1-Click court hearing summaries dispatched directly to clients via WhatsApp.
                </p>
              </div>
              <div className="pt-3 text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/chamber-ledger/"
              className="p-5 rounded-2xl bg-card border border-white/10 hover:border-amber-400/40 transition-colors group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white group-hover:text-amber-300 transition-colors text-sm">
                  Chamber Ledger
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Client retainers, court expense disbursements, and advocate invoicing.
                </p>
              </div>
              <div className="pt-3 text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className={`${SECTION} relative`}>
        <div className={CONTAINER}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Complete Feature Suite
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white tracking-tight">
              Everything Needed to Run a High-Performing Chamber
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Eliminate manual paperwork with a unified operating system built for Supreme Courts, High Courts, District Benches, and Arbitration Tribunals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;

              return (
                <div
                  key={idx}
                  className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 sm:p-7 flex flex-col justify-between hover:border-amber-400/40 card-hover-elevate transition-all duration-300 shadow-xl"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-amber-400/20 group-hover:rotate-3 transition-all duration-300">
                      <Icon className="w-5 h-5" strokeWidth={1.75} />
                    </div>

                    <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-amber-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>

                  <div>
                    {feature.link && (
                      <div className="mb-4">
                        <Link
                          href={feature.link}
                          className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
                        >
                          <span>{feature.linkText}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                    <ul className="space-y-2.5 border-t border-white/10 pt-4">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2} />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className={`${SECTION} border-t border-white/10 bg-gradient-to-b from-transparent via-[#091024] to-transparent`}>
        <div className={CONTAINER}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Tier Breakdown &amp; Comparison
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white tracking-tight">
              Transparent Practice Plans
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Core litigation tools, cause lists, and client alerts are free during Early Access.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-card/60 backdrop-blur-md shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max border-collapse text-start">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="text-start py-4 px-6 text-white font-bold text-xs uppercase tracking-wider">
                      Chamber Feature
                    </th>
                    <th className="text-center py-4 px-6 text-slate-300 font-bold text-xs uppercase tracking-wider">
                      Solo Advocate
                    </th>
                    <th className="text-center py-4 px-6 text-amber-300 font-bold text-xs uppercase tracking-wider bg-amber-400/10 border-x border-amber-400/20">
                      Law Chamber (Featured)
                    </th>
                    <th className="text-center py-4 px-6 text-white font-bold text-xs uppercase tracking-wider">
                      Enterprise / Bar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-xs sm:text-sm">
                  {[
                    { label: "Cause List & Hearing Diary" },
                    { label: "Client Directory & 1-Click WhatsApp" },
                    { label: "Limitation & Appeal Due Alerts" },
                    { label: "Case Pleadings & Judgment Vault" },
                    { label: "Practice Benchmarks & Ledger" },
                    { label: "Court Rules & Hearing Calendars" },
                    { label: "Multi-Associate Role Permissions" },
                    { label: "Priority 24/7 WhatsApp Chamber Help" },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 text-white font-medium">
                        {row.label}
                      </td>
                      <td className="py-4 px-6 text-center text-emerald-400">
                        <Check className="w-4 h-4 mx-auto text-emerald-400" strokeWidth={2.5} />
                      </td>
                      <td className="py-4 px-6 text-center text-emerald-400 bg-amber-400/[0.03] border-x border-amber-400/20">
                        <Check className="w-4 h-4 mx-auto text-amber-400" strokeWidth={2.5} />
                      </td>
                      <td className="py-4 px-6 text-center text-emerald-400">
                        <Check className="w-4 h-4 mx-auto text-emerald-400" strokeWidth={2.5} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CHAMBER CTA ── */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#070A12] to-[#0A0E1C] border-t border-white/10">
        <div className={`${CONTAINER} max-w-3xl text-center relative z-10 space-y-6`}>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
            Ready For Trial-Ready Litigation?
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Equip Your Chamber With Modern Software
          </h2>
          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Experience morning cause lists organized automatically, limitation alerts that keep counsel informed, and client updates that dispatch themselves.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/register/"
              className="btn-primary min-w-[220px] py-3.5 text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl"
            >
              <span>Start Free Early Access</span>
              <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
            </Link>
            <Link
              href="/contact/"
              className="btn-secondary min-w-[160px] py-3.5 text-sm font-semibold rounded-xl bg-card border-white/10 text-slate-200 hover:text-white"
            >
              <span>Contact Chamber Support</span>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <FloatingWhatsApp />
    </div>
  );
}
