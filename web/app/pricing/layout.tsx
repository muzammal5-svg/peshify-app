import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Early Access — Transparent Plans for Law Practices",
  description:
    "Explore DiaryLex practice tiers. Transparent plans with 100% free early access: unlimited cases, court cause lists, hearing diary alerts, and associate seats.",
  keywords: [
    "Legal Software Pricing",
    "Law Practice Management Cost",
    "Free Legal Case Management",
    "Law Firm Software Plans",
    "Court Diary Pricing",
  ],
  alternates: {
    canonical: "https://diarylex.com/pricing",
  },
  openGraph: {
    title: "Pricing — DiaryLex Legal Case Management Platform",
    description:
      "Transparent practice plans with 100% free early access for litigation advocates and law firms.",
    url: "https://diarylex.com/pricing",
    siteName: "DiaryLex",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "DiaryLex Pricing" }],
    type: "website",
  },
};

const pricingLd = {
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
          "name": "Pricing",
          "item": "https://diarylex.com/pricing",
        },
      ],
    },
    {
      "@type": "Product",
      "name": "DiaryLex Early Access Subscription",
      "description": "Unlimited litigation case management, automated daily cause lists, hearing diaries, and chamber ledger.",
      "image": "https://diarylex.com/og.png",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
      },
    },
  ],
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingLd) }}
      />
      {children}
    </>
  );
}
