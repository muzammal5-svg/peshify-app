"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Scale, Gavel, Calendar, Users, Bell, ArrowRight,
  ShieldCheck, Lock, CheckCircle2, ChevronDown, MessageSquare,
  Sparkles, FileText, Smartphone, Laptop, Clock, Database, KeyRound, Server
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { ProductMockup } from "@/components/marketing/ProductMockup";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useLang } from "@/providers/LangProvider";
import { whatsappLink } from "@/lib/siteConfig";

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";

export function Landing() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(prev => prev === idx ? null : idx);
  };

  const FAQS = [
    {
      q: "Is DiaryLex really free?",
      a: "Yes. During our Early Access launch, DiaryLex is free for litigation counsel, advocates, and law practices worldwide. No credit card is required. You get full access to court hearing diaries, daily cause lists, limitation tracking, and client WhatsApp alerts.",
    },
    {
      q: "Will DiaryLex always be free?",
      a: "DiaryLex is free during Early Access. Paid subscription plans for growing firms may be introduced later, and early users will receive advance notice before any paid plans begin.",
    },
    {
      q: "Will my data stay safe if pricing changes?",
      a: "Yes. You retain total ownership and legal privilege over all your files and proceedings. Your data is kept private to your chamber with access controls. You can export cause lists and summary reports at any time.",
    },
    {
      q: "Does DiaryLex support multiple court hierarchies and jurisdictions?",
      a: "Yes. DiaryLex is engineered to adapt across diverse legal systems—including Supreme and Appellate Courts, High Courts, District Courts, Commercial Tribunals, and Arbitration Forums.",
    },
    {
      q: "Can my legal team collaborate across multiple locations?",
      a: "Yes. DiaryLex is a cloud-native platform accessible securely on desktop, tablet, and mobile. Managing partners, associates, and litigation staff can access case files, hearing calendars, and client records simultaneously with granular role-based permissions.",
    },
    {
      q: "How does the automated client notification work?",
      a: "With a single click from any case or hearing entry, DiaryLex formats professional court progress notices and sends them directly to your client via WhatsApp or email, keeping them informed without repetitive manual typing.",
    },
    {
      q: "Who owns our law firm's legal data?",
      a: "You retain 100% ownership and legal privilege over all your files, client lists, and case proceedings. Your data is isolated per firm, encrypted in transit and at rest, and can be exported as reports and cause lists at any time in standard formats.",
    },
  ];

  const homeFaqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  return (
    <div className="min-h-dvh bg-[#070A12] text-[#EDE8E0] selection:bg-primary/30 selection:text-white overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqLd) }}
      />
      {/* ── 1. NAVBAR (Sticky & Clean) ── */}
      <PublicHeader overDark />

      {/* ── 2. HERO SECTION ── */}
      <section className="relative pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden border-b border-white/[0.08]">
        {/* Subtle Ambient Radial Lighting contained inside bounds */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[380px] bg-primary/15 rounded-full blur-[100px]" />
          <div className="absolute -top-10 end-10 w-72 h-72 bg-amber-500/10 rounded-full blur-[80px]" />
        </div>

        <div className={`${CONTAINER} relative z-10 text-center`}>
          {/* Honest Early Access Pill */}
          <div className="mb-6 flex justify-center animate-fade-in-down">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary backdrop-blur-md shadow-xs animate-float-subtle">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" strokeWidth={2} />
              <span>Free Early Access for Legal Practices &amp; Counsel Worldwide</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.12] tracking-tight text-white mb-6 max-w-4xl mx-auto animate-fade-in-up">
            Manage litigation.<br />
            Automate court cause lists.<br />
            <span className="text-transparent bg-clip-text animate-gradient-text">
              Intelligent software for modern law practices.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-8 px-2 font-normal animate-fade-in-up [animation-delay:150ms]">
            Engineered for litigation counsel, advocates, barristers, and law firms across global court hierarchies. Synchronize court hearings, case dockets, limitation deadlines, and client communication in one executive workspace.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12 w-full max-w-md mx-auto animate-fade-in-up [animation-delay:250ms]">
            <Link
              href="/register/"
              className="btn-primary btn-sheen btn-tactile w-full sm:w-auto min-w-[200px] py-3.5 text-sm font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-primary/25 transition-all"
            >
              <span>Join Early Advocate Beta</span>
              <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" strokeWidth={2} />
            </Link>

            <Link
              href="/features/"
              className="btn-secondary btn-tactile w-full sm:w-auto min-w-[160px] py-3.5 text-sm font-semibold rounded-xl bg-card/60 border-white/[0.12] text-zinc-200 hover:text-white hover:bg-card transition-all"
            >
              <span>Explore Features</span>
            </Link>
          </div>

          {/* Product Screenshot & Device Mockup */}
          <div className="mt-8 animate-fade-in-up [animation-delay:350ms]">
            <ProductMockup />
          </div>
        </div>
      </section>

      {/* ── 3. TRUST STRIP (100% Honest & Factual) ── */}
      <section className="py-10 border-b border-white/[0.08] bg-[#0A0D18]">
        <div className={CONTAINER}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs text-zinc-300 font-medium">
            <div className="flex items-center justify-center gap-2">
              <Scale className="w-4 h-4 text-primary shrink-0" strokeWidth={1.75} />
              <span>Built for Global Courts</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4 text-amber-400 shrink-0" strokeWidth={1.75} />
              <span>Automated Cause Lists &amp; Dockets</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={1.75} />
              <span>Free Early Access Beta</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" strokeWidth={1.75} />
              <span>Private &amp; Encrypted Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. 3 CORE BENEFITS ── */}
      <section className="py-20 md:py-28 border-b border-white/[0.08] reveal-on-scroll">
        <div className={CONTAINER}>
          <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Core Practice Benefits
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Why Modern Law Practices Rely On DiaryLex
            </h2>
            <p className="text-sm md:text-base text-zinc-400">
              Transform chaotic paper registers and morning cause board scrambles into organized, instant intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-stagger">
            {/* Benefit 1 */}
            <div className="card-hover-elevate p-6 md:p-8 rounded-2xl bg-card/60 border border-white/[0.08] hover:border-primary/40 shadow-xs space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                Zero Morning Cause List Anxiety
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Automatically generate daily appearance schedules sorted by Courtroom, Bench, Judge, and serial order. Know exactly where counsel and associates must appear before 9:00 AM.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="card-hover-elevate p-6 md:p-8 rounded-2xl bg-card/60 border border-white/[0.08] hover:border-amber-500/40 shadow-xs space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                Never Miss A Limitation Period
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Smart countdown reminders alert you to urgent appeal deadlines, interim injunction expiries, and rejoinder submissions well in advance, protecting your clients and practice.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="card-hover-elevate p-6 md:p-8 rounded-2xl bg-card/60 border border-white/[0.08] hover:border-emerald-500/40 shadow-xs space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Automated WhatsApp Client Updates
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Stop answering repetitive &ldquo;what happened today?&rdquo; phone calls. Dispatch one-click automated hearing status, next dates, and fee receipts directly to clients via WhatsApp and email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FEATURE SHOWCASE (Alternating Rows) ── */}
      <section className="py-20 md:py-28 border-b border-white/[0.08] reveal-on-scroll" id="features">
        <div className={CONTAINER}>
          <div className="space-y-20 md:space-y-28">
            {/* Feature 1: Cause List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <Badge variant="gold">Cause Board</Badge>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Daily Cause Lists That Map Your Morning
                </h3>
                <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
                  View scheduled hearings across High Courts and District Benches. Filter by bench, court room, or judge. Easily update hearing status to Running, Pending, Adjourned, or Decided with next date recording.
                </p>
                <div className="pt-2">
                  <Link href="/register/" className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline">
                    <span>Try Cause List In Early Access</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                </div>
              </div>

              <div className="card-hover-elevate p-5 md:p-6 rounded-2xl bg-card/80 border border-white/[0.08] shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs">
                  <span className="font-bold text-zinc-200">High Court Cause List</span>
                  <span className="font-mono text-primary font-semibold">Today&apos;s Call</span>
                </div>
                <div className="p-3.5 rounded-xl bg-secondary/70 border border-white/[0.05] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">WP 1042/2024 • Tariq vs Federation</span>
                    <span className="text-zinc-400 text-[11px]">Court 02 • Justice S. Ali</span>
                  </div>
                  <Badge variant="success" size="sm" dot>Running</Badge>
                </div>
                <div className="p-3.5 rounded-xl bg-secondary/70 border border-white/[0.05] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Crl. Misc 421/2024 • State vs Bilal</span>
                    <span className="text-zinc-400 text-[11px]">Court 04 • Regular Board</span>
                  </div>
                  <Badge variant="warning" size="sm" dot>Pending</Badge>
                </div>
              </div>
            </div>

            {/* Feature 2: Multi-Jurisdiction Docketing (Reversed) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="order-2 lg:order-1 card-hover-elevate p-5 md:p-6 rounded-2xl bg-card/80 border border-white/[0.08] shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs">
                  <span className="font-bold text-zinc-200">Appellate Docket &amp; Diary</span>
                  <span className="font-mono text-primary font-semibold">Apex Benches</span>
                </div>
                <div className="p-3.5 rounded-xl bg-secondary/70 border border-white/[0.05] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Civil Appeal 412/2024 • TechCorp Inc vs Global Logistics</span>
                    <span className="text-zinc-400 text-[11px]">Commercial Appellate Division • Final Hearing</span>
                  </div>
                  <Badge variant="success" size="sm" dot>Active Hearing</Badge>
                </div>
                <div className="p-3.5 rounded-xl bg-secondary/70 border border-white/[0.05] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Arbitration 89/2023 • Horizon Energy Ltd vs Sovereign Entity</span>
                    <span className="text-zinc-400 text-[11px]">International Arbitration Tribunal • Chamber 01</span>
                  </div>
                  <Badge variant="info" size="sm" dot>Adjourned</Badge>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-4">
                <Badge variant="info">Multi-Jurisdiction</Badge>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Comprehensive Docketing Across Global Court Hierarchies
                </h3>
                <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
                  From Supreme Courts and High Benches to Commercial Divisions and International Arbitration Tribunals. Structure complex litigation matters with limitation calendars, courtroom benchmarks, and automated hearing transitions.
                </p>
                <div className="pt-2">
                  <Link href="/features/" className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline">
                    <span>Explore Platform Capabilities</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature 3: WhatsApp Client Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <Badge variant="success">WhatsApp Integration</Badge>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Instant Client Updates Dispatched To WhatsApp
                </h3>
                <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
                  Save hours of repetitive texting. When a hearing adjourns or next date is assigned, generate a ready-to-send WhatsApp message formatted in clean, professional legal notifications with court benchmarks.
                </p>
                <div className="pt-2">
                  <a
                    href={whatsappLink("Hello, I would like to see how DiaryLex client notifications work.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:underline"
                  >
                    <span>Test A WhatsApp Demo Message</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </a>
                </div>
              </div>

              <div className="card-hover-elevate p-5 md:p-6 rounded-2xl bg-card/80 border border-white/[0.08] shadow-xl space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06] text-xs font-semibold text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Client Message Preview</span>
                </div>
                <div className="p-4 rounded-xl bg-[#0B141E] border border-emerald-500/20 text-xs text-zinc-200 space-y-2">
                  <p className="font-semibold text-white">Client Hearing Update &bull; Case WP 1042/2026</p>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    This is an update regarding your case <strong>WP 1042/2026</strong> before the Court. Today&apos;s hearing proceeded and the honorable bench adjourned the matter to <strong>25 November 2026</strong> for final arguments.
                  </p>
                  <p className="text-[10px] text-zinc-400 italic">Dispatched via DiaryLex Legal Operations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. HOW IT WORKS IN 3 STEPS ── */}
      <section className="py-20 md:py-28 border-b border-white/[0.08] bg-[#0A0D18]">
        <div className={CONTAINER}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Simple 3-Step Setup
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Up and Running in 5 Minutes
            </h2>
            <p className="text-sm md:text-base text-zinc-400">
              No complex software installations or technical consultants needed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border border-white/[0.08] space-y-4">
              <span className="font-mono text-3xl font-bold text-primary">01</span>
              <h3 className="text-lg font-bold text-white">Register Chamber Free</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enter your chamber name, city, and advocate credentials to access your dedicated workspace instantly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-white/[0.08] space-y-4">
              <span className="font-mono text-3xl font-bold text-primary">02</span>
              <h3 className="text-lg font-bold text-white">Add Cases &amp; Cause Lists</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Add your active litigation matters, courtroom numbers, and scheduled hearing dates with one-click entry.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-white/[0.08] space-y-4">
              <span className="font-mono text-3xl font-bold text-primary">03</span>
              <h3 className="text-lg font-bold text-white">Automate Daily Operations</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Review morning cause boards, track limitation deadlines, and send automated client WhatsApp updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. SECURITY & PRIVACY ── */}
      <section className="py-20 md:py-28 border-b border-white/[0.08]">
        <div className={CONTAINER}>
          <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Chamber Confidentiality
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Bank-Grade Legal Data Protection
            </h2>
            <p className="text-sm md:text-base text-zinc-400">
              Legal privilege and advocate-client confidentiality are non-negotiable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-white/[0.08] space-y-3">
              <Lock className="w-6 h-6 text-emerald-400" strokeWidth={1.75} />
              <h4 className="font-bold text-white text-sm">256-bit Encryption</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                All pleadings, documents, and client contacts are encrypted in transit and at rest.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-white/[0.08] space-y-3">
              <KeyRound className="w-6 h-6 text-primary" strokeWidth={1.75} />
              <h4 className="font-bold text-white text-sm">Role-Based Access</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Control permissions strictly between Senior Counsel, Associates, and Clerks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-white/[0.08] space-y-3">
              <Database className="w-6 h-6 text-amber-400" strokeWidth={1.75} />
              <h4 className="font-bold text-white text-sm">100% Data Ownership</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your legal records belong strictly to your chamber. Export anytime in PDF/CSV.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-white/[0.08] space-y-3">
              <Server className="w-6 h-6 text-sky-400" strokeWidth={1.75} />
              <h4 className="font-bold text-white text-sm">Redundant Backups</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Continuous point-in-time database backups protect your firm from lost paperwork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. PRICING & EARLY ACCESS (Honest Model) ── */}
      <section className="py-20 md:py-28 border-b border-white/[0.08] bg-[#0A0D18] reveal-on-scroll" id="pricing">
        <div className={CONTAINER}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Transparent Access
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Free Early Access for Legal Chambers
            </h2>
            <p className="text-sm md:text-base text-zinc-400">
              We are currently in Early Access rollout. Advocates joining now enjoy full access to core litigation tools free during early access. Paid subscription plans for growing firms will be announced later, and early users will be notified in advance.
            </p>
          </div>

          <div className="card-hover-elevate max-w-xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-card via-card/90 to-primary/10 border border-primary/30 shadow-2xl relative">
            <div className="absolute top-4 end-4">
              <Badge variant="gold">Early Access Tier</Badge>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Chamber Early Advocate</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white font-sans">$0</span>
                <span className="text-sm text-zinc-400">/ free during early access</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Complete access to all case management features, automated cause boards, hearing diary alerts, and WhatsApp updates.
              </p>

              <div className="pt-4 border-t border-white/[0.08] space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Unlimited active litigation cases</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Daily automated cause list generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Automated court docketing &amp; limitation tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Automated WhatsApp client update templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Chamber document storage vault</span>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/register/"
                  className="btn-primary btn-sheen btn-tactile w-full py-3.5 text-sm font-semibold rounded-xl block text-center shadow-lg hover:shadow-2xl hover:shadow-primary/25"
                >
                  Get Early Access (Free)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. TESTIMONIALS (Hidden until real reviews collected) ── */}
      <Testimonials />

      {/* ── 10. FAQ ACCORDION ── */}
      <section className="py-20 md:py-28 border-b border-white/[0.08] reveal-on-scroll" id="faq">
        <div className={CONTAINER}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Got Questions?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-zinc-400">
              Clear answers about onboarding, security, and court compatibility.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="card-hover-subtle rounded-2xl bg-card border border-white/[0.08] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-start flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-primary transition-colors min-h-[48px]"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-zinc-400 transition-transform duration-300 flex-shrink-0",
                        isOpen && "rotate-180 text-primary"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-zinc-300 leading-relaxed border-t border-white/[0.04] animate-fade-in-down">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 11. FINAL CHAMBER CTA ── */}
      <section className="py-20 md:py-32 text-center relative overflow-hidden bg-gradient-to-b from-[#070A12] to-[#0A0E1C] reveal-on-scroll">
        <div className={`${CONTAINER} max-w-3xl relative z-10`}>
          <span className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block animate-float-subtle">
            Get Started Today
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Equip Your Chamber With Modern Software
          </h2>
          <p className="text-sm md:text-base text-zinc-300 mb-8 max-w-xl mx-auto leading-relaxed">
            Experience morning cause lists organized automatically, limitation alerts that keep counsel informed, and client updates that dispatch themselves.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/register/"
              className="btn-primary btn-sheen btn-tactile min-w-[220px] py-3.5 text-sm font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-primary/25"
            >
              <span>Create Free Chamber Account</span>
              <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
            </Link>
            <Link
              href="/contact/"
              className="btn-secondary btn-tactile min-w-[160px] py-3.5 text-sm font-semibold rounded-xl bg-card border-white/[0.12] text-zinc-200 hover:text-white"
            >
              <span>Contact Chamber Support</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 12. FOOTER & FLOATING WHATSAPP ── */}
      <PublicFooter />
      <FloatingWhatsApp />
    </div>
  );
}
