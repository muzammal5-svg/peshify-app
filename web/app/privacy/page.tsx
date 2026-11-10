"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ShieldCheck, MessageSquare, Mail, Scale } from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";
import { LegalDocument } from "@/components/marketing/LegalDocument";
import { SITE, whatsappLink } from "@/lib/siteConfig";

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh bg-[#070A12] text-[#EDE8E0] selection:bg-primary/30 selection:text-white overflow-x-clip font-sans">
      <PublicHeader overDark />

      <main className="py-20 md:py-28">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
              <span>{t("legal.backHome") || "Back to Home"}</span>
            </Link>
          </div>

          {/* Stately Header Card */}
          <div className="mb-10 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0B1B3A] via-[#0E234A] to-[#081329] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-2.5 text-amber-300 mb-3">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Legal &amp; Privacy Compliance
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Last Updated: October 2026 &bull; Compliant with attorney-client confidentiality and data privacy standards under the laws of the Islamic Republic of Pakistan.
            </p>
          </div>

          {/* Document Content */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 md:p-14 shadow-2xl backdrop-blur-md">
            <LegalDocument doc="privacy" hideHeader />

            {/* Questions / Chamber Inquiries Box */}
            <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/[0.03] p-6 rounded-2xl border border-white/5">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Have questions about your chamber&apos;s data privacy?</h4>
                <p className="text-xs text-slate-400">Our compliance team is available 24/7 to address any data protection concerns.</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={whatsappLink("Assalam-o-Alaikum, I have a question regarding Peshify Privacy Policy.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs py-2.5 px-4 min-h-[44px] rounded-xl inline-flex items-center gap-2 justify-center"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Support</span>
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="btn-secondary text-xs py-2.5 px-4 min-h-[44px] rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 inline-flex items-center gap-2 justify-center"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
      <FloatingWhatsApp />
    </div>
  );
}
