import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Legal Case Management & Court Diary",
  description:
    "Get answers about DiaryLex: daily cause list automation, court hearing diaries, limitation tracking, multi-associate chamber access, data confidentiality, and pricing.",
  keywords: [
    "Legal Tech FAQ",
    "Court Diary FAQ",
    "Case Management Help",
    "Law Practice Software Questions",
    "Law Firm Data Security",
    "DiaryLex Support",
  ],
  alternates: {
    canonical: "https://diarylex.com/faq",
  },
  openGraph: {
    title: "FAQ — DiaryLex Legal Case Management Platform",
    description:
      "Answers about automated cause lists, hearing reminders, client alerts, data privacy, and early access.",
    url: "https://diarylex.com/faq",
    siteName: "DiaryLex",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "DiaryLex FAQ" }],
    type: "website",
  },
};

const faqPageLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://diarylex.com",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "FAQ",
          "item": "https://diarylex.com/faq",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://diarylex.com/faq/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is DiaryLex?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "DiaryLex is an intelligent case management and court hearing diary platform engineered for litigation attorneys, advocates, barristers, and law firms across global court hierarchies.",
          },
        },
        {
          "@type": "Question",
          "name": "Who can use DiaryLex?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "DiaryLex is built for solo counsel, chamber associates, senior advocates, and law partnerships managing active litigation cases, court dockets, hearing diaries, and clients.",
          },
        },
        {
          "@type": "Question",
          "name": "Is DiaryLex free during early access?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! DiaryLex is 100% free with unrestricted access to all features during our global early access rollout. No credit card, no trial expiration, and no hidden fees.",
          },
        },
        {
          "@type": "Question",
          "name": "How does the daily cause list feature work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "DiaryLex compiles your practice's daily court fixtures into an automated hearing list sorted by case number, court, judge, and hearing stage.",
          },
        },
        {
          "@type": "Question",
          "name": "How do WhatsApp client notifications work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "With a single click from any case or hearing entry, DiaryLex formats professional court progress notices and sends them directly to your client via WhatsApp or email.",
          },
        },
        {
          "@type": "Question",
          "name": "Will my chamber's data stay confidential and secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All legal files, client notes, and case records are protected by attorney-client privilege standards, encrypted with TLS 1.3 and AES-256, and isolated via PostgreSQL Row-Level Security (RLS).",
          },
        },
        {
          "@type": "Question",
          "name": "Can multiple advocates from the same chamber share an account?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can invite partners, associates, and chamber clerks to your firm workspace with separate login credentials and role-based permissions.",
          },
        },
      ],
    },
  ],
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageLd) }}
      />
      {children}
    </>
  );
}
