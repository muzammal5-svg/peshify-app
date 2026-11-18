"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Scale,
  Sparkles,
  ArrowRight,
  Gavel,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { LangSwitcher } from "@/components/shared/LangSwitcher";
import { SITE, whatsappLink, phoneLink } from "@/lib/siteConfig";

export function PublicFooter() {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-gradient-to-b from-[#0B1B3A] via-[#071329] to-[#040A17] text-slate-200 border-t border-amber-400/20 shadow-[0_-1px_30px_rgba(197,155,39,0.06)] font-sans overflow-hidden">
      {/* Subtle background ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-amber-400/5 blur-3xl pointer-events-none" />

      {/* Main 4-Column Grid */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Col 1: Brand & Chamber Mission (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <Logo size="md" variant="full" inverted />
            </Link>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              The intelligent case management operating system built for litigation advocates, barristers, and law firms across global court hierarchies.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-medium text-amber-300 border border-amber-400/20">
                <Scale className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.75} />
                <span>Engineered for Global & Regional Courts</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-medium text-emerald-300 border border-emerald-400/20">
                <Lock className="w-3 h-3 text-emerald-400" strokeWidth={1.75} />
                <span>TLS 1.3 &bull; Chamber RLS</span>
              </span>
            </div>
          </div>

          {/* Col 2: Platform Capabilities (2 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Chamber Operations
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/features" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Automated Daily Cause List</span>
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Hearing Diary & Limitation Alerts</span>
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>WhatsApp & Email Client Notices</span>
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Court Dockets & Hearing Diary</span>
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Fee Ledger & Client Invoicing</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Court Jurisdictions (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Court Coverage
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5">
                <Gavel className="w-3 h-3 text-amber-400 shrink-0" strokeWidth={1.75} />
                <span>Apex & Supreme Courts</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Gavel className="w-3 h-3 text-amber-400 shrink-0" strokeWidth={1.75} />
                <span>High & Appellate Courts</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Gavel className="w-3 h-3 text-amber-400 shrink-0" strokeWidth={1.75} />
                <span>Commercial Courts</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Gavel className="w-3 h-3 text-amber-400 shrink-0" strokeWidth={1.75} />
                <span>District & Circuit Courts</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Gavel className="w-3 h-3 text-amber-400 shrink-0" strokeWidth={1.75} />
                <span>Arbitration Tribunals</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Gavel className="w-3 h-3 text-amber-400 shrink-0" strokeWidth={1.75} />
                <span>Specialized Benches</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Legal (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Chamber Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a
                  href={whatsappLink("Hello, I am inquiring about DiaryLex law practice setup.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2 group p-1.5 rounded-lg hover:bg-white/5"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={1.75} />
                  <span className="font-semibold text-emerald-400 group-hover:underline">
                    WhatsApp Chamber Support
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={phoneLink()}
                  className="hover:text-white transition-colors flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" strokeWidth={1.75} />
                  <span>{SITE.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="hover:text-white transition-colors flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 truncate"
                >
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" strokeWidth={1.75} />
                  <span className="truncate">{SITE.email}</span>
                </a>
              </li>
            </ul>

            {/* Free early access badge */}
            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-200 mt-2">
              <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                100% Free During Early Access
              </span>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                All litigation tools, cause lists, and client alerts are free for advocates and law practices worldwide.
              </p>
            </div>
          </div>

        </div>

        {/* Data Protection Pledge Strip */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-semibold text-white">
                Attorney-Client Privilege & Strict Data Segregation
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed mt-0.5 max-w-3xl">
                DiaryLex never sells, monetizes, or shares your case records, pleadings, or client contacts. PostgreSQL Row-Level Security (RLS) ensures total multi-tenant isolation.
              </p>
            </div>
          </div>
          <Link
            href="/privacy"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4 shrink-0 p-2 min-h-[44px] flex items-center"
          >
            Read Security Policy &rarr;
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 px-4 sm:px-6 lg:px-8 py-5 text-xs text-slate-400 bg-black/20">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center sm:text-start">
            &copy; {new Date().getFullYear()} {SITE.name} Technologies Ltd. Intelligent Legal Case Management.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-1">
            <Link href="/privacy" className="hover:text-white transition-colors py-2 px-1 min-h-[44px] flex items-center">
              {t("legal.privacyTitle") || "Privacy"}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors py-2 px-1 min-h-[44px] flex items-center">
              {t("legal.termsTitle") || "Terms"}
            </Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors py-2 px-1 min-h-[44px] flex items-center">
              {t("legal.refundTitle") || "Refund Policy"}
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors py-2 px-1 min-h-[44px] flex items-center">
              {t("marketing.navContact") || "Contact"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
