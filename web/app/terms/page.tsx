import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale, MessageSquare, Mail } from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";
import { LegalDocument } from "@/components/marketing/LegalDocument";
import { SITE, whatsappLink } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the DiaryLex Terms of Service governing access and use of our legal case management and court hearing diary platform.",
  alternates: {
    canonical: "https://diarylex.com/terms/",
  },
  openGraph: {
    title: "Terms of Service | DiaryLex Legal Platform",
    description:
      "Terms of Service governing use of DiaryLex legal practice management software.",
    url: "https://diarylex.com/terms/",
    siteName: "DiaryLex",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-[#070A12] text-[#EDE8E0] selection:bg-amber-400/20 selection:text-white overflow-x-clip font-sans">
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
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Header Card */}
          <div className="mb-10 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0B1B3A] via-[#0E234A] to-[#081329] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2.5 text-amber-300 mb-3">
              <Scale className="h-5 w-5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Chamber Terms &amp; Conditions
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-3">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Transparent terms governing chamber accounts, software access, and data ownership.
            </p>
          </div>

          {/* Document Content */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 md:p-14 shadow-2xl backdrop-blur-md">
            <LegalDocument doc="terms" hideHeader />

            {/* Questions Box */}
            <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/[0.03] p-6 rounded-2xl border border-white/5">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Questions regarding terms of use?</h4>
                <p className="text-xs text-slate-400">Our legal operations desk is available to assist.</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={whatsappLink("Hello DiaryLex, I have a question regarding Terms of Service.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary py-2.5 px-4 text-xs font-semibold flex items-center gap-2 flex-1 sm:flex-initial justify-center"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Support</span>
                </a>
                <a
                  href={`mailto:${SITE.email}?subject=Terms%20Inquiry`}
                  className="btn-secondary py-2.5 px-4 text-xs font-semibold flex items-center gap-2 flex-1 sm:flex-initial justify-center bg-card border-white/10 text-white"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Team</span>
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
