"use client";

import { useState } from "react";
import {
  ChevronDown,
  Search,
  HelpCircle,
  MessageCircle,
  Mail,
  ArrowRight,
  Sparkles,
  X,
  ShieldCheck,
} from "lucide-react";
import { whatsappLink, SITE } from "@/lib/siteConfig";
import Link from "next/link";

export interface FAQItem {
  category: string;
  questions: Array<{
    q: string;
    a: string;
  }>;
}

export function FAQClient({ faqs }: { faqs: FAQItem[] }) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [openId, setOpenId] = useState<string | null>("0-0");

  const categories = ["All", ...faqs.map((f) => f.category)];

  const filteredFaqs = faqs
    .map((cat, catIdx) => ({
      category: cat.category,
      questions: cat.questions
        .map((q, qIdx) => ({ ...q, id: `${catIdx}-${qIdx}` }))
        .filter(
          (q) =>
            (selectedCat === "All" || cat.category === selectedCat) &&
            (search === "" ||
              q.q.toLowerCase().includes(search.toLowerCase()) ||
              q.a.toLowerCase().includes(search.toLowerCase()))
        ),
    }))
    .filter((cat) => cat.questions.length > 0);

  const toggleOpen = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      {/* Search and Category filter */}
      <div className="max-w-2xl mx-auto mb-10 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions (e.g. cause list, WhatsApp, limitation, pricing)..."
            className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-card border border-white/10 text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-amber-400/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCat === cat
                  ? "bg-amber-400 text-black shadow-sm"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordions */}
      <div className="max-w-3xl mx-auto space-y-8">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-card border border-white/10 space-y-2">
            <HelpCircle className="w-8 h-8 text-zinc-400 mx-auto" />
            <p className="text-white font-semibold text-sm">No matching questions found</p>
            <p className="text-xs text-zinc-400">Try adjusting your search terms or view all categories.</p>
          </div>
        ) : (
          filteredFaqs.map((cat) => (
            <div key={cat.category} className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 px-1">
                {cat.category}
              </h2>
              <div className="space-y-2.5">
                {cat.questions.map((q) => {
                  const isOpen = openId === q.id;
                  return (
                    <div
                      key={q.id}
                      className="rounded-xl bg-card border border-white/10 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleOpen(q.id)}
                        className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-white hover:text-amber-300 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span>{q.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-amber-400" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-zinc-300 leading-relaxed border-t border-white/[0.04]">
                          {q.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Still Have Questions Box */}
      <div className="mt-16 max-w-xl mx-auto p-6 rounded-2xl bg-card border border-white/10 text-center space-y-3">
        <h3 className="text-base font-bold text-white">Still Have Questions?</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Our chamber onboarding team is available via WhatsApp or email to answer any procedural or technical queries.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={whatsappLink("Hello DiaryLex, I have a question about chamber setup.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary py-2.5 px-4 text-xs font-semibold inline-flex items-center gap-2 rounded-xl"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Support</span>
          </a>
          <Link
            href="/contact/"
            className="btn-secondary py-2.5 px-4 text-xs font-semibold inline-flex items-center gap-2 rounded-xl bg-white/[0.04] text-zinc-200 hover:text-white"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Chamber Team</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
