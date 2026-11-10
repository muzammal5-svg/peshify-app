"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown, Search, HelpCircle, MessageCircle, Mail,
  ArrowRight, Sparkles, X, ShieldCheck
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";
import { Reveal } from "@/components/marketing/Reveal";
import { whatsappLink, SITE } from "@/lib/siteConfig";
import Link from "next/link";

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";
const SECTION = "py-16 md:py-24";

interface FAQItem {
  category: string;
  questions: Array<{
    q: string;
    a: string;
  }>;
}

export default function FAQPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ur";
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [openId, setOpenId] = useState<string | null>("0-0");

  const faqs: FAQItem[] = [
    {
      category: isRTL ? "عمومی معلومات" : "General",
      questions: [
        {
          q: t("faq.q1") || "What is Peshify?",
          a: t("faq.a1") || "Peshify is a modern chamber operating system engineered specifically for Pakistani advocates, barristers, and law firms across all court hierarchies."
        },
        {
          q: t("faq.q2") || "Who can use Peshify?",
          a: t("faq.a2") || "Peshify is built for solo advocates, chamber associates, senior counsel, and large law partnerships managing daily cause lists, hearing diaries, and clients."
        },
        {
          q: t("faq.q3") || "Is Peshify really free during early access?",
          a: t("faq.a3") || "Yes! Peshify is 100% free with unrestricted access to all features during our launch period. No credit card, no trial expiration, and no hidden fees."
        },
      ]
    },
    {
      category: isRTL ? "فیچرز اور ٹولز" : "Features",
      questions: [
        {
          q: t("faq.q4") || "How does the daily cause list feature work?",
          a: t("faq.a4") || "Peshify compiles your chamber's daily court fixtures into an automated hearing list sorted by serial number, court, judge, and hearing stage."
        },
        {
          q: t("faq.q5") || "How do WhatsApp client notifications work?",
          a: t("faq.a5") || "With a single click from any case or hearing entry, Peshify formats bilingual court progress notices and sends them directly to your client via WhatsApp."
        },
        {
          q: t("faq.q6") || "Can clients or associates view case details?",
          a: t("faq.a6") || "Yes, you can configure team role permissions for associates and clerks, and share structured PDF cause lists or case summaries with clients."
        },
        {
          q: t("faq.q7") || "Does it support native Urdu and Nastaliq typography?",
          a: t("faq.a7") || "Yes! Peshify features native Urdu Nastaliq typography with right-to-left (RTL) mirroring across all screens and documents."
        },
      ]
    },
    {
      category: isRTL ? "پلان اور ارلی ایکسس" : "Pricing & Access",
      questions: [
        {
          q: t("faq.q8") || "Are there any limits on cases or documents?",
          a: t("faq.a8") || "None. Early access advocates enjoy unlimited cases, cause lists, hearings, pleadings, and client directories with zero restrictions."
        },
        {
          q: t("faq.q9") || "Can multiple advocates from the same chamber share a firm account?",
          a: t("faq.a9") || "Yes! You can invite partners, associates, and chamber clerks to your firm with separate login credentials and role-based permissions."
        },
        {
          q: t("faq.q10") || "Do I need to submit payment receipts or credit card details?",
          a: t("faq.a10") || "No. There are no credit card prompts or paywalls. Simply sign up and your chamber account is ready to use immediately."
        },
      ]
    },
    {
      category: isRTL ? "رازداری اور سیکیورٹی" : "Security & Privacy",
      questions: [
        {
          q: t("faq.q11") || "Will my chamber's data stay confidential?",
          a: t("faq.a11") || "Absolutely. All legal files, client notes, and case records are protected by attorney-client privilege standards and isolated via PostgreSQL Row-Level Security."
        },
        {
          q: t("faq.q12") || "How is data protected against loss or hardware failure?",
          a: t("faq.a12") || "All data is encrypted in transit (TLS 1.3) and at rest (AES-256), with automated daily multi-region cloud backups."
        },
        {
          q: t("faq.q13") || "What support is available if I need assistance?",
          a: t("faq.a13") || "We provide direct WhatsApp support (+92 341 7359571) and email support for all Pakistani advocates and chambers."
        },
        {
          q: t("faq.q14") || "Can I export my chamber data at any time?",
          a: t("faq.a14") || "Yes. You retain 100% data ownership and can export your cause lists, client lists, and case files at any time."
        },
      ]
    }
  ];

  const categories = ["All", ...faqs.map(f => f.category)];

  const filteredFaqs = faqs.map(item => ({
    ...item,
    questions: item.questions.filter(q => {
      const matchesSearch = !search ||
        q.q.toLowerCase().includes(search.toLowerCase()) ||
        q.a.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCat === "All" || item.category === selectedCat;
      return matchesSearch && matchesCategory;
    })
  })).filter(item => item.questions.length > 0);

  return (
    <div className="min-h-dvh bg-[#070A12] text-[#EDE8E0] selection:bg-primary/30 selection:text-white overflow-x-clip font-sans">
      <PublicHeader overDark />

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 text-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-amber-500/10 via-primary/15 to-transparent blur-3xl pointer-events-none" />
        </div>

        <div className={`${CONTAINER} relative z-10 max-w-3xl mx-auto space-y-4`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-amber-400/20 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{isRTL ? "چیمبر نالج بیس" : "Chamber Knowledge Base & FAQ"}</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            {isRTL ? "اکثر پوچھے جانے والے سوالات" : "Frequently Asked Questions"}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            {isRTL
              ? "کاز لسٹ، پیشی ڈائری، واٹس ایپ الرٹس اور ڈیٹا سیکیورٹی سے متعلق تمام معلومات حاصل کریں۔"
              : "Find immediate answers regarding daily cause lists, diary alerts, pricing, and attorney data security."}
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder={isRTL ? "سوال تلاش کریں..." : "Search questions by topic, feature, or keyword..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-card/80 border border-white/10 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 py-3.5 ps-11 pe-10 text-sm text-white placeholder:text-slate-500 rounded-2xl transition-all shadow-lg outline-none backdrop-blur-md"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => {
              const active = selectedCat === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 min-h-[36px] ${
                    active
                      ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20"
                      : "bg-white/[0.05] text-slate-300 border border-white/10 hover:bg-white/[0.1] hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQS ACCORDION ── */}
      <section className={SECTION}>
        <div className={`${CONTAINER} max-w-3xl`}>
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">
                {isRTL ? "کوئی سوال نہیں ملا" : "No matching questions found"}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {isRTL
                  ? "براہ کرم کوئی دوسرا لفظ تلاش کریں یا براہ راست سپورٹ سے رابطہ کریں۔"
                  : `We couldn't find any questions matching "${search}".`}
              </p>
              <button
                type="button"
                onClick={() => { setSearch(""); setSelectedCat("All"); }}
                className="btn-secondary text-xs px-4 py-2"
              >
                {isRTL ? "تمام سوالات دیکھیں" : "Clear filters"}
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {filteredFaqs.map((category, catIdx) => (
                <div key={catIdx} className="space-y-4">
                  <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-amber-300 pb-2 border-b border-white/10 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{category.category}</span>
                  </h2>

                  <div className="space-y-3">
                    {category.questions.map((faq, idx) => {
                      const id = `${catIdx}-${idx}`;
                      const isOpen = openId === id;

                      return (
                        <div
                          key={idx}
                          className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                            isOpen
                              ? "border-amber-400/30 bg-gradient-to-b from-white/[0.05] to-white/[0.02]"
                              : "border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.01] hover:border-white/20"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setOpenId(isOpen ? null : id)}
                            className="w-full p-5 sm:p-6 text-start flex items-center justify-between gap-4 transition-colors hover:bg-white/[0.02]"
                            aria-expanded={isOpen}
                          >
                            <span className="font-semibold text-sm sm:text-base text-white leading-snug">
                              {faq.q}
                            </span>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isOpen ? "bg-amber-400/10 text-amber-300" : "bg-white/5 text-slate-400"}`}>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </button>

                          {isOpen && (
                            <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-slate-300 border-t border-white/10 pt-4 leading-relaxed bg-black/10">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── STILL HAVE QUESTIONS BANNER ── */}
          <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0B1B3A] via-[#0E234A] to-[#081329] border border-amber-400/20 text-center shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center mx-auto">
              <MessageCircle className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">
              {isRTL ? "کیا آپ کے پاس کوئی اور سوال ہے؟" : "Still Have Questions About Setup?"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              {isRTL
                ? "ہماری چیمبر سپورٹ ٹیم 24 گھنٹے واٹس ایپ پر وکلاء اور چیمبرز کے سوالات کے جوابات دینے کے لیے حاضر ہے۔"
                : "Our chamber onboarding team is ready on WhatsApp 24/7 to walk counsel through migration, multi-associate setup, and daily cause list automation."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={whatsappLink("Assalam-o-Alaikum, I have a question regarding Peshify.")}
                target="_blank"
                rel="noreferrer"
                className="btn-primary min-h-[44px] px-6 py-2.5 text-xs font-semibold rounded-xl inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isRTL ? "واٹس ایپ سپورٹ سے بات کریں" : "Chat on WhatsApp"}</span>
              </a>
              <Link
                href="/contact"
                className="btn-secondary min-h-[44px] px-5 py-2.5 text-xs font-semibold rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{isRTL ? "رابطہ صفحہ کھولیں" : "Contact Chamber Office"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
      <FloatingWhatsApp />
    </div>
  );
}
