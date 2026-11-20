import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Early Access | DiaryLex Law Software",
  description:
    "Explore DiaryLex practice plans. Free during Early Access with full litigation case management, court hearing diary alerts, and chamber accounts.",
  keywords: [
    "Legal Software Pricing",
    "Law Practice Management Cost",
    "Free Legal Case Management",
    "Law Firm Software Plans",
    "Court Diary Pricing",
  ],
  alternates: {
    canonical: "https://diarylex.com/pricing/",
  },
  openGraph: {
    title: "Pricing & Early Access | DiaryLex",
    description:
      "Explore practice plans. Free during Early Access for litigation advocates and law firms.",
    url: "https://diarylex.com/pricing/",
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
          "item": "https://diarylex.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Pricing",
          "item": "https://diarylex.com/pricing/",
        },
      ],
    },
    {
      "@type": "Product",
      "name": "DiaryLex Early Access Subscription",
      "description": "Litigation case management, automated daily cause lists, hearing diaries, and chamber ledger.",
      "image": "https://diarylex.com/og.png",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free during early access",
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
