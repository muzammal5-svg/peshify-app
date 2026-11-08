"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import {
  Check, ArrowRight, MessageSquare, Scale, Gavel, ShieldCheck, BookOpen,
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { whatsappLink } from "@/lib/siteConfig";
import { REVIEWS } from "@/lib/reviews";
import { HeroDashboard } from "@/components/marketing/HeroDashboard";
import { ReviewSlider } from "@/components/marketing/ReviewSlider";
import { useLang } from "@/providers/LangProvider";

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";

export function Landing() {
  const { t } = useTranslation();
  const { lang } = useLang();

  return (
    <div className="min-h-dvh bg-[#050505] text-[#EDE8E0] selection:bg-[rgba(237,232,224,0.25)]">
      <PublicHeader overDark />

      {/* ── 1. PRESTIGIOUS LAW FIRM HERO SECTION ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#070604] pt-28 pb-20 md:pt-36 md:pb-28">
        {/* Authentic Law Firm Chambers / Scales of Justice Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <Image
            src="/logo/hero.jpg"
            alt="Law Firm Library, Scales of Justice & Gavel"
            fill
            priority
            quality={95}
            className="object-cover object-center scale-[1.03] opacity-60 md:opacity-65 brightness-[0.72] contrast-[1.12]"
          />

          {/* Warm Chamber Ambient Lighting */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18)_0%,transparent_70%)] blur-3xl" />

          {/* Targeted darkening scrim behind text: keeps scales, books & gavel visible around edges while text stays razor sharp */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_45%,rgba(7,6,4,0.82)_0%,rgba(7,6,4,0.60)_55%,rgba(7,6,4,0.92)_100%)]" />

          {/* Top navigation subtle fade */}
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#070604] via-[#070604]/75 to-transparent" />

          {/* Bottom transition blend fade */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050505] via-[#050505]/85 to-transparent" />
        </div>

        {/* Centered Law Firm Chamber Hero Content */}
        <div className={`${CONTAINER} relative z-10 text-center max-w-4xl mx-auto px-2 sm:px-6`}>
          {/* Law Firm Eyebrow Badge */}
          <div className="mb-5 sm:mb-7 flex justify-center">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-[rgba(212,175,55,0.35)] bg-[rgba(15,12,8,0.85)] backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.6)] max-w-full">
              <Scale className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="text-[9.5px] xs:text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.10em] xs:tracking-[0.16em] sm:tracking-[0.22em] text-[#E8DCC2] truncate">
                PAKISTAN LEGAL CHAMBERS &amp; ADVOCATES PLATFORM
              </span>
            </div>
          </div>

          {/* 3-Line Display Headline */}
          {lang === "ur" ? (
            <h1 className="font-heading font-bold text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.28] tracking-normal text-[#EDE8E0] mb-5 sm:mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              پیشی لسٹ سنبھالیں۔<br />
              مقدمات ٹریک کریں۔<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5EADB] via-[#D4AF37] to-[#C59B3F]">
                وکالت آسان بنائیں۔
              </span>
            </h1>
          ) : (
            <h1 className="font-heading font-bold text-[2rem] xs:text-[2.35rem] sm:text-[3.35rem] md:text-[4.35rem] lg:text-[4.85rem] leading-[1.12] sm:leading-[1.10] tracking-tight text-[#EDE8E0] mb-5 sm:mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              Manage cases.<br />
              Track hearings.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5EADB] via-[#D4AF37] to-[#C59B3F]">
                Automate chambers.
              </span>
            </h1>
          )}

          {/* Subtitle with high contrast legal bone grey text */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#D8D2C7] max-w-2xl mx-auto leading-relaxed font-normal mb-6 sm:mb-8 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] px-1 sm:px-0">
            Built specifically for Pakistani advocates, High Court practitioners, and chambers. Manage daily cause lists, case diaries, court notifications, and client updates in one unified legal workspace.
          </p>

          {/* CTA Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-3.5 mb-6 w-full max-w-xs sm:max-w-none mx-auto">
            <Link
              href="/register"
              className="btn-primary w-full sm:w-auto min-w-[200px] text-center shadow-[0_4px_24px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.4)] transition-all py-3 sm:py-3.5 text-sm"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
            </Link>
            <Link
              href="/features"
              className="btn-secondary w-full sm:w-auto min-w-[160px] text-center bg-[rgba(15,12,8,0.7)] border-[rgba(212,175,55,0.25)] text-[#EDE8E0] hover:border-[rgba(212,175,55,0.45)] transition-all py-3 sm:py-3.5 text-sm"
            >
              <span>Explore Features</span>
            </Link>
          </div>

          {/* WhatsApp Direct Line */}
          <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-[#A8A298]">
            <a
              href={whatsappLink("Assalam-o-Alaikum, I want to learn more about Peshify Case Management for my legal practice.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#EDE8E0] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>Chamber Onboarding &amp; Support via WhatsApp (24/7)</span>
            </a>
          </div>

          {/* Stately Law Firm Trust Bar */}
          <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-[rgba(212,175,55,0.18)] grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-[10.5px] sm:text-xs font-medium text-[#CFC8BC]">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
              <Scale className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#D4AF37] shrink-0" />
              <span>Supreme &amp; High Courts</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
              <Gavel className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#D4AF37] shrink-0" />
              <span>Automated Cause Lists</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
              <BookOpen className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#D4AF37] shrink-0" />
              <span>Urdu &amp; English (RTL)</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
              <ShieldCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#D4AF37] shrink-0" />
              <span>Chamber-Grade Security</span>
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
              Peshify synchronizes your cause lists, court diary dates, and client communications—then gives your associates and clerks clear action items.
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
                  <Link href="/register" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#EDE8E0] hover:underline underline-offset-4">
                    <span>Get Started Free</span>
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

      {/* ── 8. 100% FREE SECTION ── */}
      <section className="py-20 md:py-32 bg-[#050505] border-t border-[rgba(237,232,224,0.10)]">
        <div className={CONTAINER}>
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="section-label">100% Free Platform</span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#EDE8E0]">
              Free For Pakistani Advocates
            </h2>
            <p className="text-base sm:text-lg text-[#C8C2B8] leading-relaxed">
              Full, unrestricted access to case management, automated cause lists, daily court diaries, client directories, and document vaults. 100% free with no credit card required and no locked features.
            </p>
            <div className="pt-4">
              <Link href="/register" className="btn-primary min-w-[220px]">
                <span>Create Your Free Account</span>
                <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. CLOSE CTA (See It With Your Own Eyes) ── */}
      <section className="py-24 md:py-36 bg-[#050505] border-t border-[rgba(237,232,224,0.10)] text-center">
        <div className={`${CONTAINER} max-w-3xl`}>
          <span className="section-label mb-3">Try Peshify</span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#EDE8E0] mb-5">
            See it with your own eyes
          </h2>
          <p className="text-base sm:text-lg text-[#C8C2B8] mb-8 max-w-xl mx-auto leading-relaxed">
            Full access for your chamber today. No credit card required. Experience automated cause lists, daily court diaries, and instant client updates.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/register" className="btn-primary min-w-[220px]">
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
            </Link>
            <Link href="/features" className="btn-secondary min-w-[160px]">
              <span>Chamber Features</span>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
