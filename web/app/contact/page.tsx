import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Sparkles, MessageSquare } from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";
import { ContactClient } from "@/components/marketing/ContactClient";

export const metadata: Metadata = {
  title: "Contact Chamber Support & Sales",
  description:
    "Get in touch with DiaryLex chamber onboarding specialists. Reach us via WhatsApp, direct phone, or email for law firm setup and custom migration.",
  keywords: [
    "contact DiaryLex",
    "legal software support",
    "chamber onboarding assistance",
    "law firm software demo",
  ],
  alternates: {
    canonical: "https://diarylex.com/contact/",
  },
  openGraph: {
    title: "Contact Chamber Support & Sales | DiaryLex",
    description:
      "Get in touch with DiaryLex chamber onboarding specialists. Reach us via WhatsApp, phone, or email.",
    url: "https://diarylex.com/contact/",
    siteName: "DiaryLex",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://diarylex.com/contact/#contact",
      "url": "https://diarylex.com/contact/",
      "name": "Contact DiaryLex",
      "description": "Contact DiaryLex chamber onboarding and customer support.",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://diarylex.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Contact",
          "item": "https://diarylex.com/contact/",
        },
      ],
    },
  ],
};

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#EDE8E0] selection:bg-amber-400/20 selection:text-amber-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicHeader />

      <main>
        {/* Breadcrumb Bar */}
        <section className="border-b border-white/[0.08] bg-black/40 py-3 text-xs text-zinc-400">
          <div className={CONTAINER}>
            <nav className="flex items-center gap-2" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-amber-300 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-zinc-200 font-medium">Contact</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative pt-16 pb-16 md:pt-24 md:pb-20 overflow-hidden bg-gradient-to-b from-[#0B1526] via-[#060B14] to-[#050505] border-b border-white/[0.08]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-amber-500/10 blur-[120px] pointer-events-none" />
          <div className={CONTAINER}>
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-300">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Advocate Onboarding &amp; Chamber Support</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Get in Touch With Our Chamber Team
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl mx-auto">
                Have questions about DiaryLex setup, firm migration, or multi-associate permissions? Our legal ops team is ready to assist.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24 border-b border-white/[0.08]">
          <div className={CONTAINER}>
            <ContactClient />
          </div>
        </section>
      </main>

      <PublicFooter />
      <FloatingWhatsApp />
    </div>
  );
}
