import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Scale,
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";
import { BLOG_POSTS } from "@/lib/blogData";

export const metadata: Metadata = {
  title: "Legal Practice & Litigation Tech Blog",
  description:
    "Practical guides and insights on court hearing management, limitation tracking, chamber accounting, and legal tech for advocates and law practices.",
  keywords: [
    "legal practice blog",
    "court hearing diary guide",
    "limitation period tracking",
    "law chamber management Pakistan",
    "legal tech insights",
  ],
  alternates: {
    canonical: "https://diarylex.com/blog/",
  },
  openGraph: {
    title: "Legal Practice & Litigation Tech Blog | DiaryLex",
    description:
      "Actionable insights on digitizing court diaries, calculating limitation deadlines, chamber accounting, and client communication.",
    url: "https://diarylex.com/blog/",
    siteName: "DiaryLex",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Blog",
      "@id": "https://diarylex.com/blog/#blog",
      "url": "https://diarylex.com/blog/",
      "name": "DiaryLex Legal Practice & Litigation Tech Blog",
      "description":
        "In-depth guides for litigation lawyers on court docketing, limitation countdowns, chamber accounting, and practice automation.",
      "publisher": {
        "@id": "https://diarylex.com/#organization",
      },
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
          "name": "Blog",
          "item": "https://diarylex.com/blog/",
        },
      ],
    },
  ],
};

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";

export default function BlogIndexPage() {
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
              <span className="text-zinc-200 font-medium">Blog</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative pt-16 pb-16 md:pt-24 md:pb-20 overflow-hidden bg-gradient-to-b from-[#0B1526] via-[#060B14] to-[#050505] border-b border-white/[0.08]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-amber-500/10 blur-[120px] pointer-events-none" />
          <div className={CONTAINER}>
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-300">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Litigation Insights &amp; Practice Guides</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Chamber Practice &amp; Legal Tech Articles
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                Practical guides for litigation counsel, advocates, and chamber managers on court docketing, limitation rules, client communication, and law firm finance.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 md:py-24 border-b border-white/[0.08]">
          <div className={CONTAINER}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {BLOG_POSTS.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-2xl border border-white/10 bg-card p-6 flex flex-col justify-between hover:border-amber-400/40 transition-all duration-300 card-hover-elevate group shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 font-semibold">
                        {post.category}
                      </span>
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                      <Link href={`/blog/${post.slug}/`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white block text-[11px]">{post.author.name}</span>
                      <span className="text-[10px] text-zinc-400">{post.author.role}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}/`}
                      className="text-xs font-semibold text-amber-400 group-hover:text-amber-300 flex items-center gap-1 group/btn"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 text-center bg-gradient-to-b from-[#080E1C] to-[#04060C]">
          <div className={`${CONTAINER} max-w-2xl`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Put These Practice Principles to Work
            </h2>
            <p className="text-sm text-zinc-300 mb-8 leading-relaxed">
              Equip your chamber with the intelligent case management platform built for litigation advocates. Free during early beta.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register/"
                className="btn-primary btn-sheen btn-tactile w-full sm:w-auto min-w-[220px] py-3.5 text-sm font-semibold rounded-xl"
              >
                <span>Create Free Chamber Account</span>
                <ArrowRight className="w-4 h-4 ms-2 inline rtl:rotate-180" />
              </Link>
              <Link
                href="/features/"
                className="btn-secondary btn-tactile w-full sm:w-auto min-w-[160px] py-3.5 text-sm font-semibold rounded-xl bg-card border-white/[0.12] text-zinc-200 hover:text-white"
              >
                <span>Explore Features</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
      <FloatingWhatsApp />
    </div>
  );
}
