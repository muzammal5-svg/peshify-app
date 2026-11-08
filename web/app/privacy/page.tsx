"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ShieldCheck, MessageSquare, Mail, Scale } from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { LegalDocument } from "@/components/marketing/LegalDocument";
import { SITE, whatsappLink } from "@/lib/siteConfig";

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh bg-[#050505] text-[#EDE8E0] selection:bg-[rgba(237,232,224,0.25)]">
      <PublicHeader overDark />

      <main className="py-24 md:py-32">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#9A958C] hover:text-[#EDE8E0] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
              <span>{t("legal.backHome") || "Back to Home"}</span>
            </Link>
          </div>

          {/* Stately Header Card */}
          <div className="mb-10 rounded-xl border border-[rgba(237,232,224,0.12)] bg-[#0B0B0B] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="flex items-center gap-2.5 text-[#D4AF37] mb-3">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
                Legal &amp; Privacy Compliance
              </span>
            </div>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-[#EDE8E0] tracking-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-xs text-[#9A958C] max-w-2xl leading-relaxed">
              Last Updated: October 2026 &bull; Compliant with attorney-client confidentiality and data privacy standards under the laws of the Islamic Republic of Pakistan.
            </p>
          </div>

          {/* Document Content */}
          <div className="rounded-xl border border-[rgba(237,232,224,0.12)] bg-[#0B0B0B] p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <LegalDocument doc="privacy" hideHeader />

            {/* Questions / Chamber Inquiries Box */}
            <div className="mt-14 pt-8 border-t border-[rgba(237,232,224,0.12)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/[0.02] p-6 rounded-lg">
              <div>
                <h4 className="text-sm font-bold text-[#EDE8E0] mb-1">Have questions about your chamber&apos;s data privacy?</h4>
                <p className="text-xs text-[#9A958C]">Our compliance team is available 24/7 to address any data protection concerns.</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={whatsappLink("Assalam-o-Alaikum, I have a question regarding Peshify Privacy Policy.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-2 justify-center"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Support</span>
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="btn-secondary text-xs py-2.5 px-4 inline-flex items-center gap-2 justify-center"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
