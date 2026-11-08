"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Search } from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { Reveal } from "@/components/marketing/Reveal";
import Link from "next/link";

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";
const SECTION = "py-20 md:py-32";

interface FAQItem {
  category: string;
  questions: Array<{
    q: string;
    a: string;
  }>;
}

export default function FAQPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      category: "General",
      questions: [
        {
          q: t("faq.q1") || "What is Peshify?",
          a: t("faq.a1") || "Peshify is a comprehensive law practice management platform designed specifically for Pakistani law firms."
        },
        {
          q: t("faq.q2") || "Who can use Peshify?",
          a: t("faq.a2") || "Peshify is perfect for solo practitioners, small law firms, and large chambers managing multiple cases and clients."
        },
        {
          q: t("faq.q3") || "Is Peshify free?",
          a: t("faq.a3") || "Yes! Peshify is 100% free with full access to all features. No payment, fees, or credit card is required."
        },
      ]
    },
    {
      category: "Features",
      questions: [
        {
          q: t("faq.q4") || "What is case management?",
          a: t("faq.a4") || "Case management in Peshify lets you organize all case details, documents, and deadlines in one secure location."
        },
        {
          q: t("faq.q5") || "How do reminders work?",
          a: t("faq.a5") || "Peshify sends automated reminders via push notifications, email, and SMS for important dates and deadlines."
        },
        {
          q: t("faq.q6") || "Can clients see their cases?",
          a: t("faq.a6") || "Yes, clients have secure access to a portal showing their case status, documents, and communication history."
        },
        {
          q: t("faq.q7") || "Does it support Urdu?",
          a: t("faq.a7") || "Yes! Peshify has full Urdu language support with proper RTL formatting and culturally adapted features."
        },
      ]
    },
    {
      category: "Pricing & Plans",
      questions: [
        {
          q: t("faq.q8") || "Are there any hidden costs or limits?",
          a: t("faq.a8") || "None. You get unlimited cases, cause lists, hearings, documents, and client records completely free."
        },
        {
          q: t("faq.q9") || "Can my entire chamber use Peshify?",
          a: t("faq.a9") || "Yes! You can invite partners, associates, and chamber staff with zero seat restrictions."
        },
        {
          q: t("faq.q10") || "Do I need to submit payment slips or receipts?",
          a: t("faq.a10") || "No. There are no payment requirements or paywalls. Simply register and start managing your cases immediately."
        },
        {
          q: t("faq.q11") || "Will my data stay private and secure?",
          a: t("faq.a11") || "Yes! All case files, notes, and records are isolated and encrypted with strict role-based access control."
        },
      ]
    },
    {
      category: "Security & Support",
      questions: [
        {
          q: t("faq.q12") || "How secure is my data?",
          a: t("faq.a12") || "We use bank-level encryption, regular backups, and comply with international security standards."
        },
        {
          q: t("faq.q13") || "What support do you offer?",
          a: t("faq.a13") || "We provide 24/7 support via WhatsApp, email, and our help center for all chambers."
        },
        {
          q: t("faq.q14") || "Can I export my data?",
          a: t("faq.a14") || "Yes, you can export all your data anytime in standard formats. Your data belongs to you."
        },
      ]
    }
  ];

  const filteredFaqs = faqs.map(item => ({
    ...item,
    questions: item.questions.filter(
      q => q.q.toLowerCase().includes(search.toLowerCase()) ||
           q.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(item => item.questions.length > 0);

  return (
    <div className="min-h-dvh bg-[#050505] text-[#EDE8E0]">
      <PublicHeader overDark />

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 text-center overflow-hidden bg-[#050505] border-b border-[rgba(237,232,224,0.10)]">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `linear-gradient(rgba(237,232,224,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(237,232,224,0.12) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,0.4)_0%,#050505_80%)]" />
        </div>

        <div className={`${CONTAINER} relative z-10 max-w-3xl mx-auto space-y-4`}>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A958C]">Knowledge Base</span>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#EDE8E0]">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-[#C8C2B8] max-w-xl mx-auto leading-relaxed">
            Find immediate answers about cause lists, diary alerts, pricing, and data security.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A958C]" />
              <input
                type="text"
                placeholder={t("faq.search") || "Search questions..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#111111] border border-[rgba(237,232,224,0.14)] py-3.5 ps-11 pe-4 text-sm text-[#EDE8E0] placeholder:text-[#5C5852] focus:outline-none focus:border-[#EDE8E0] rounded-none transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQS ── */}
      <section className={`${SECTION} bg-[#050505]`}>
        <div className={`${CONTAINER} max-w-4xl`}>
          <div className="space-y-12">
            {filteredFaqs.map((category, catIdx) => (
              <div key={catIdx}>
                <h2 className="font-heading text-xl font-bold uppercase tracking-[0.1em] text-[#EDE8E0] mb-6 pb-3 border-b border-[rgba(237,232,224,0.10)]">
                  {category.category}
                </h2>

                <div className="space-y-3">
                  {category.questions.map((faq, idx) => {
                    const id = `${catIdx}-${idx}`;
                    const isOpen = openId === id;

                    return (
                      <Reveal key={idx}>
                        <div className="border border-[rgba(237,232,224,0.12)] bg-[#050505] transition-colors duration-200">
                          <button
                            onClick={() => setOpenId(isOpen ? null : id)}
                            className="w-full p-5 sm:p-6 text-start flex items-center justify-between gap-4 transition-colors hover:bg-[#0A0A0A]"
                          >
                            <span className="font-semibold text-sm sm:text-base text-[#EDE8E0]">
                              {faq.q}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-[#9A958C] shrink-0 transition-transform duration-200 ${
                                isOpen ? "rotate-180 text-[#EDE8E0]" : ""
                              }`}
                            />
                          </button>

                          {isOpen && (
                            <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-[#C8C2B8] border-t border-[rgba(237,232,224,0.08)] pt-4 leading-relaxed bg-[#0A0A0A]">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STILL HAVE QUESTIONS ── */}
      <section className="py-20 md:py-28 bg-[#050505] border-t border-[rgba(237,232,224,0.10)] text-center">
        <div className={`${CONTAINER} max-w-2xl`}>
          <div className="border border-[rgba(237,232,224,0.12)] bg-[#0A0A0A] p-10 sm:p-14 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A958C]">Still Have Questions?</span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#EDE8E0]">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="text-sm text-[#C8C2B8]">
              Our chamber support specialists are available on WhatsApp and email.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link
                href="/contact"
                className="btn-primary"
              >
                Contact Support
              </Link>
              <Link
                href="/register"
                className="btn-secondary"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
