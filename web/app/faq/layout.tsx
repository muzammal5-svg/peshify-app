import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | DiaryLex",
  description:
    "Get answers about DiaryLex: daily cause list automation, court hearing diaries, limitation tracking, client WhatsApp updates, and early access.",
  keywords: [
    "Legal Tech FAQ",
    "Court Diary FAQ",
    "Case Management Help",
    "Law Practice Software Questions",
    "Law Firm Data Security",
    "DiaryLex Support",
  ],
  alternates: {
    canonical: "https://diarylex.com/faq/",
  },
  openGraph: {
    title: "FAQ — DiaryLex Legal Case Management Platform",
    description:
      "Answers about automated cause lists, hearing reminders, client alerts, data privacy, and early access.",
    url: "https://diarylex.com/faq/",
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
          "item": "https://diarylex.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "FAQ",
          "item": "https://diarylex.com/faq/",
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
          "name": "Is DiaryLex really free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, during Early Access DiaryLex is free for all users. You get access to court hearing diaries, daily cause lists, limitation tracking, and client WhatsApp alerts with no credit card required.",
          },
        },
        {
          "@type": "Question",
          "name": "Will DiaryLex always be free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "DiaryLex is free during Early Access. Paid subscription plans for growing law firms may be introduced later. Early users will receive advance notice before any paid plans begin.",
          },
        },
        {
          "@type": "Question",
          "name": "Will my data stay safe if pricing changes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Your case dockets and chamber records remain strictly your property and are protected under attorney-client confidentiality with database-level isolation. You can export cause lists and summary reports at any time.",
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
            "text": "All legal files, client notes, and case records are protected by attorney-client privilege standards and chamber-level access controls.",
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
