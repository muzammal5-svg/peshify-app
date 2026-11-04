"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import {
  Check, ArrowRight, MessageSquare,
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { whatsappLink } from "@/lib/siteConfig";
import { REVIEWS } from "@/lib/reviews";
import { saasDb } from "@/lib/supabase/saas";
import { PlanCard, DEFAULT_PLANS, type PlanView } from "@/components/marketing/PlanCard";
import { HeroDashboard } from "@/components/marketing/HeroDashboard";
import { ReviewSlider } from "@/components/marketing/ReviewSlider";
import { useLang } from "@/providers/LangProvider";

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";

export function Landing() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const [plans, setPlans] = useState<PlanView[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    Promise.resolve(
      saasDb
        .plans()
        .select("id, code, name, price_pkr, duration_months, max_users")
        .eq("is_active", true)
        .order("sort_order")
    )
      .then((result) => {
        if (!mounted) return;
        const rows = (result.data as unknown as PlanView[]) ?? [];
        if (rows.length > 0) {
          setPlans(rows);
          const yearly = rows.find((p) => p.duration_months >= 12) ?? rows[0];
          if (yearly) setSelectedPlan(yearly.id);
        } else {
          setPlans(DEFAULT_PLANS);
          setSelectedPlan(DEFAULT_PLANS[2].id);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setPlans(DEFAULT_PLANS);
        setSelectedPlan(DEFAULT_PLANS[2].id);
      });
    return () => { mounted = false; };
  }, []);

  const displayPlans = useMemo(() => {
    return plans.length > 0 ? plans : DEFAULT_PLANS;
  }, [plans]);

  const baselineMonthly = useMemo(() => {
    return Math.min(
      ...displayPlans.map((p) => Math.round(Number(p.price_pkr) / Math.max(1, p.duration_months)))
    );
  }, [displayPlans]);

  return (
    <div className="min-h-dvh bg-[#050505] text-[#EDE8E0] selection:bg-[rgba(237,232,224,0.25)]">
      <PublicHeader overDark />

      {/* ── 1. KONTRORA HERO SECTION ── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#050505] pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Authentic Kontrora 3D matrix floor perspective background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <Image
            src="/kontrora-hero-bg.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-65 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,rgba(5,5,5,0.2)_0%,#050505_80%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>

        {/* Centered Hero Content */}
        <div className={`${CONTAINER} relative z-10 text-center max-w-4xl mx-auto`}>
          {/* Brand Eyebrow - Clean borderless kicker matching Kontrora */}
          <div className="mb-6 flex justify-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A958C]">
              AI-POWERED LEGAL PRACTICE PLATFORM
            </span>
          </div>

          {/* 3-Line Display Headline (Syne 700 bold, fluid responsive, no clipping) */}
          {lang === "ur" ? (
            <h1 className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl leading-[1.25] tracking-normal text-[#EDE8E0] mb-6">
              پیشی لسٹ سنبھالیں۔<br />
              مقدمات ٹریک کریں۔<br />
              وکالت آسان بنائیں۔
            </h1>
          ) : (
            <h1 className="font-heading font-bold text-[2.25rem] sm:text-[3.25rem] md:text-[4.25rem] lg:text-[4.75rem] leading-[1.10] tracking-tight text-[#EDE8E0] mb-6">
              Manage cases.<br />
              Track hearings.<br />
              Automate chambers.
            </h1>
          )}

          {/* Subtitle with high contrast bone grey text */}
          <p className="text-base sm:text-lg md:text-xl text-[#C8C2B8] max-w-2xl mx-auto leading-relaxed font-normal mb-8">
            <strong className="text-[#EDE8E0] font-semibold">MZM &amp; Associates</strong> is the legal practice management platform built specifically for Pakistani advocates, chambers, and corporate legal teams.
          </p>

          {/* CTA Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-6">
            <Link
              href="/register"
              className="btn-primary w-full sm:w-auto min-w-[210px] text-center"
            >
              <span>Start 7-Day Free Trial</span>
              <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
            </Link>
            <Link
              href="/pricing"
              className="btn-secondary w-full sm:w-auto min-w-[170px] text-center"
            >
              <span>View Pricing</span>
            </Link>
          </div>

          {/* WhatsApp Direct Line */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#9A958C]">
            <a
              href={whatsappLink("Assalam-o-Alaikum, I want to learn more about MZM Case Management for my legal practice.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#EDE8E0] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#6B8F71]" />
              <span>Or speak with our onboarding team via WhatsApp (24/7)</span>
            </a>
          </div>

          {/* Trust Hairline Divider */}
          <div className="mt-12 pt-8 border-t border-[rgba(237,232,224,0.10)] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-[#C8C2B8]">
            <div className="flex items-center justify-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#EDE8E0]" />
              <span>Supreme &amp; High Courts</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#EDE8E0]" />
              <span>Automated Cause Lists</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#EDE8E0]" />
              <span>Full Urdu &amp; English (RTL)</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#EDE8E0]" />
              <span>Bank-Grade Encryption</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. THE PRODUCT (Framed Interactive Preview) ── */}
      <section className="py-16 md:py-24 bg-[#050505] border-t border-[rgba(237,232,224,0.10)]" id="product-preview">
        <div className={CONTAINER}>
          {/* Caption bar: Label left, description right */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[rgba(237,232,224,0.10)]">
            <span className="section-label">The product</span>
            <p className="text-sm md:text-base text-[#C8C2B8] max-w-xl md:text-end">
              Your chamber&apos;s operating system—daily cause lists, hearing diary, client directory, and automated client alerts in one unified view.
            </p>
          </div>

          {/* Framed product preview */}
          <div className="relative">
            <HeroDashboard />
          </div>
        </div>
      </section>

      {/* ── 3. THE PAIN (Editorial Metric/Problem Rows) ── */}
      <section className="py-20 md:py-32 bg-[#050505] border-t border-[rgba(237,232,224,0.10)]" id="the-pain">
        <div className={CONTAINER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Copy (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="section-label">The pain</span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#EDE8E0] leading-[1.12]">
                Your chamber is quietly losing billable hours
              </h2>
              <p className="text-base text-[#C8C2B8] leading-relaxed pt-2">
                Scattered paper registers, unverified cause list calls, and manual WhatsApp follow-ups mean every court morning begins with anxiety, scrambling, and guessing.
              </p>
            </div>

            {/* Right Metrics / Rows (7 cols) */}
            <div className="lg:col-span-7 divide-y divide-[rgba(237,232,224,0.12)] border-y border-[rgba(237,232,224,0.12)]">
              <div className="py-8 flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-8">
                <span className="font-heading font-bold text-4xl sm:text-5xl text-[#EDE8E0] w-24 shrink-0">
                  5+
                </span>
                <span className="text-base sm:text-lg text-[#C8C2B8] leading-relaxed">
                  Disconnected notebooks, paper diaries, and court boards your chamber checks before 9:00 AM.
                </span>
              </div>

              <div className="py-8 flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-8">
                <span className="font-heading font-bold text-4xl sm:text-5xl text-[#EDE8E0] w-24 shrink-0">
                  Slow
                </span>
                <span className="text-base sm:text-lg text-[#C8C2B8] leading-relaxed">
                  Scrambling across courtrooms and benches to locate call numbers and urgent stay hearings.
                </span>
              </div>

              <div className="py-8 flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-8">
                <span className="font-heading font-bold text-4xl sm:text-5xl text-[#EDE8E0] w-24 shrink-0">
                  30+
                </span>
                <span className="text-base sm:text-lg text-[#C8C2B8] leading-relaxed">
                  Handwritten register pages nobody updates, risking missed limitation periods and delayed recoveries.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. THE SHIFT (Numbered Editorial Rows 01 / 02 / 03) ── */}
      <section className="py-20 md:py-32 bg-[#050505] border-t border-[rgba(237,232,224,0.10)]" id="the-shift">
        <div className={CONTAINER}>
          <div className="max-w-2xl mb-14 space-y-3">
            <span className="section-label">The shift</span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#EDE8E0] leading-[1.12]">
              From manual paperwork to automated practice intelligence
            </h2>
            <p className="text-base text-[#C8C2B8] leading-relaxed">
              MZM synchronizes your cause lists, court diary dates, and client communications—then gives your associates and clerks clear action items.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(237,232,224,0.12)] border border-[rgba(237,232,224,0.12)]">
            {/* Item 01 */}
            <div className="bg-[#050505] p-8 sm:p-10 flex flex-col justify-between h-full space-y-8">
              <span className="font-heading text-4xl sm:text-5xl font-bold text-[#5C5852]">
                01
              </span>
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#EDE8E0]">
                  Daily cause lists, organized automatically
                </h3>
                <p className="text-sm text-[#C8C2B8] leading-relaxed">
                  Generate instant morning schedules categorized by Court No, Bench, Judge, and Case Category. No manual cross-referencing needed.
                </p>
              </div>
            </div>

            {/* Item 02 */}
            <div className="bg-[#050505] p-8 sm:p-10 flex flex-col justify-between h-full space-y-8">
              <span className="font-heading text-4xl sm:text-5xl font-bold text-[#5C5852]">
                02
              </span>
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#EDE8E0]">
                  Intelligent hearing diary &amp; limitation alerts
                </h3>
                <p className="text-sm text-[#C8C2B8] leading-relaxed">
                  Never miss an interim injunction or limitation date. Smart reminders alert senior counsel and associates ahead of time.
                </p>
              </div>
            </div>

            {/* Item 03 */}
            <div className="bg-[#050505] p-8 sm:p-10 flex flex-col justify-between h-full space-y-8">
              <span className="font-heading text-4xl sm:text-5xl font-bold text-[#5C5852]">
                03
              </span>
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#EDE8E0]">
                  Client updates that dispatch themselves
                </h3>
                <p className="text-sm text-[#C8C2B8] leading-relaxed">
                  One click informs clients of their next hearing date, court proceedings, and fee balances in both Urdu and English via WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SPOTLIGHT (Alternating Feature Rows) ── */}
      <section className="py-20 md:py-32 bg-[#050505] border-t border-[rgba(237,232,224,0.10)]" id="spotlight">
        <div className={CONTAINER}>
          <div className="space-y-24 md:space-y-32">
            {/* Spotlight Row 1 */}
            <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="section-label">Cause List Management</span>
                <h3 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#EDE8E0] leading-tight">
                  Cause lists that tell you exactly where to be
                </h3>
                <p className="text-base text-[#C8C2B8] leading-relaxed">
                  Advocates open the cause list and instantly see their daily appearances sorted by court hierarchy, courtroom number, and call order.
                </p>
                <div className="pt-2">
                  <Link href="/features" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#EDE8E0] hover:underline underline-offset-4">
                    <span>Explore Cause List Features</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="border border-[rgba(237,232,224,0.12)] bg-[#111111] p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-[rgba(237,232,224,0.10)] pb-4">
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#9A958C]">Today&apos;s Cause Board</span>
                    <span className="text-xs font-mono text-[#EDE8E0]">Peshawar High Court</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-[#0A0A0A] border border-[rgba(237,232,224,0.08)] flex justify-between items-center text-xs">
                      <div>
                        <p className="font-semibold text-[#EDE8E0]">WP 1042/2024 &bull; Tariq vs Federation</p>
                        <p className="text-[#9A958C]">Court 02 &bull; Hon. Justice S. Ali</p>
                      </div>
                      <span className="px-2 py-0.5 border border-[#6B8F71]/30 bg-[#6B8F71]/10 text-[#6B8F71] font-bold text-[10px]">
                        RUNNING
                      </span>
                    </div>
                    <div className="p-3 bg-[#0A0A0A] border border-[rgba(237,232,224,0.08)] flex justify-between items-center text-xs">
                      <div>
                        <p className="font-semibold text-[#EDE8E0]">Crl. Misc 421/2024 &bull; State vs Bilal</p>
                        <p className="text-[#9A958C]">Court 04 &bull; Regular Cause List</p>
                      </div>
                      <span className="px-2 py-0.5 border border-[rgba(237,232,224,0.15)] bg-white/[0.04] text-[#9A958C] font-bold text-[10px]">
                        11:30 AM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Spotlight Row 2 (Reverse) */}
            <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-5 lg:order-2 space-y-4">
                <span className="section-label">Bilingual &amp; RTL Ready</span>
                <h3 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#EDE8E0] leading-tight">
                  Seamless Urdu typography for Pakistani court practice
                </h3>
                <p className="text-base text-[#C8C2B8] leading-relaxed">
                  Switch the entire chamber workspace into clean, properly-spaced Urdu with full right-to-left layout preservation. Perfect for junior associates, legal clerks, and regional client communications.
                </p>
                <div className="pt-2">
                  <Link href="/features" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#EDE8E0] hover:underline underline-offset-4">
                    <span>Learn About Urdu Support</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 lg:order-1">
                <div className="border border-[rgba(237,232,224,0.12)] bg-[#111111] p-6 sm:p-8 space-y-4" dir="rtl">
                  <div className="flex items-center justify-between border-b border-[rgba(237,232,224,0.10)] pb-4">
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#9A958C]">روزانہ پیشی لسٹ اور عدالتی ڈائری</span>
                    <span className="text-xs font-mono text-[#EDE8E0]">مورخہ 24 اکتوبر</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-[#0A0A0A] border border-[rgba(237,232,224,0.08)] flex justify-between items-center text-xs">
                      <div>
                        <p className="font-semibold text-[#EDE8E0]">مقدمہ نمبر 412/2024 &bull; احمد خان بنام سرکار</p>
                        <p className="text-[#9A958C]">عدالت عالیہ، پشاور &bull; برائے بحث ضمانت</p>
                      </div>
                      <span className="px-2 py-0.5 border border-[#6B8F71]/30 bg-[#6B8F71]/10 text-[#6B8F71] font-bold text-[10px]">
                        زیرِ سماعت
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Spotlight Row 3 */}
            <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="section-label">Client Portal &amp; Billing</span>
                <h3 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#EDE8E0] leading-tight">
                  Transparent client accounting and automated receipts
                </h3>
                <p className="text-base text-[#C8C2B8] leading-relaxed">
                  Record professional fees, court expenses, and received payments. Send automated WhatsApp payment confirmations and balance statements in seconds.
                </p>
                <div className="pt-2">
                  <Link href="/pricing" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#EDE8E0] hover:underline underline-offset-4">
                    <span>View Chamber Pricing</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="border border-[rgba(237,232,224,0.12)] bg-[#111111] p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-[rgba(237,232,224,0.10)] pb-4">
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#9A958C]">Chamber Invoicing &amp; Recovery</span>
                    <span className="text-xs font-mono text-[#6B8F71]">Verified Ledger</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-[#0A0A0A] border border-[rgba(237,232,224,0.08)]">
                      <p className="text-[#9A958C]">Total Retainers</p>
                      <p className="font-heading text-xl font-bold text-[#EDE8E0] mt-1">Rs 450,000</p>
                    </div>
                    <div className="p-3 bg-[#0A0A0A] border border-[rgba(237,232,224,0.08)]">
                      <p className="text-[#9A958C]">Recovered This Month</p>
                      <p className="font-heading text-xl font-bold text-[#6B8F71] mt-1">Rs 380,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── 6. STATS BAR ── */}
      <section className="py-16 md:py-20 bg-[#050505] border-t border-[rgba(237,232,224,0.10)]">
        <div className={CONTAINER}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(237,232,224,0.12)] border border-[rgba(237,232,224,0.12)] text-center">
            <div className="bg-[#050505] p-8 sm:p-10 space-y-2">
              <div className="font-heading font-bold text-4xl sm:text-5xl text-[#EDE8E0]">
                500+
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-[#9A958C]">
                Active Advocates &amp; Chambers
              </div>
            </div>
            <div className="bg-[#050505] p-8 sm:p-10 space-y-2">
              <div className="font-heading font-bold text-4xl sm:text-5xl text-[#EDE8E0]">
                50,000+
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-[#9A958C]">
                Litigation Cases Managed
              </div>
            </div>
            <div className="bg-[#050505] p-8 sm:p-10 space-y-2">
              <div className="font-heading font-bold text-4xl sm:text-5xl text-[#EDE8E0]">
                98%
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-[#9A958C]">
                Chamber Retention Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS SLIDER ── */}
      <section className="py-20 md:py-32 bg-[#050505] border-t border-[rgba(237,232,224,0.10)]">
        <div className={CONTAINER}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="section-label">Advocate Feedback</span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#EDE8E0]">
              What Senior Advocates &amp; Chamber Heads Say
            </h2>
            <p className="text-base text-[#C8C2B8]">
              Real feedback from advocates managing litigation, cause lists, and client matters across Pakistan.
            </p>
          </div>

          <ReviewSlider reviews={REVIEWS} />
        </div>
      </section>

      {/* ── 8. PRICING SECTION ── */}
      <section className="py-20 md:py-32 bg-[#050505] border-t border-[rgba(237,232,224,0.10)]" id="pricing">
        <div className={CONTAINER}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="section-label">Chamber Plans</span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#EDE8E0]">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base text-[#C8C2B8]">
              Start with a 7-day free trial. Choose a plan that matches your practice size when you are ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(237,232,224,0.12)] border border-[rgba(237,232,224,0.12)]">
            {displayPlans.slice(0, 3).map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={plan.id === (selectedPlan || displayPlans[2].id)}
                popular={plan.duration_months >= 12}
                baselineMonthly={baselineMonthly}
                ctaHref="/register"
                ctaLabel="Start 7-Day Free Trial"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CLOSE CTA (See It With Your Own Eyes) ── */}
      <section className="py-24 md:py-36 bg-[#050505] border-t border-[rgba(237,232,224,0.10)] text-center">
        <div className={`${CONTAINER} max-w-3xl`}>
          <span className="section-label mb-3">Try MZM &amp; Associates</span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#EDE8E0] mb-5">
            See it with your own eyes
          </h2>
          <p className="text-base sm:text-lg text-[#C8C2B8] mb-8 max-w-xl mx-auto leading-relaxed">
            Start a 7-day full access trial for your chamber today. No credit card required. Experience automated cause lists, daily court diaries, and instant client updates.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/register" className="btn-primary min-w-[220px]">
              <span>Start 7-Day Free Trial</span>
              <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
            </Link>
            <Link href="/features" className="btn-secondary min-w-[160px]">
              <span>Explore Features</span>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
