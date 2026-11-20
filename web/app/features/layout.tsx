import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Case Management & Court Diary Features | DiaryLex",
  description:
    "Explore DiaryLex features: automated morning cause lists, limitation countdown alerts, WhatsApp client notices, and chamber financial ledger.",
  keywords: [
    "Legal Case Management Features",
    "Court Cause List Automation",
    "Limitation Tracking Software",
    "Hearing Diary App",
    "Client WhatsApp Notification",
    "Law Firm Document Repository",
    "Chamber Ledger",
  ],
  alternates: {
    canonical: "https://diarylex.com/features/",
  },
  openGraph: {
    title: "Features — DiaryLex Legal Case Management Platform",
    description:
      "Automated cause lists, limitation countdowns, client WhatsApp notifications, and chamber financials engineered for modern law practices.",
    url: "https://diarylex.com/features/",
    siteName: "DiaryLex",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "DiaryLex Features" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Features — DiaryLex Legal Case Management Platform",
    description:
      "Automated cause lists, limitation countdowns, client WhatsApp notifications, and chamber financials.",
    images: ["/og.png"],
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
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
      "name": "Features",
      "item": "https://diarylex.com/features/",
    },
  ],
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {children}
    </>
  );
}
