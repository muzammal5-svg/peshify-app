import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Chamber Support — DiaryLex Legal Technologies",
  description:
    "Connect with DiaryLex legal operations team for chamber onboarding, technical support, enterprise inquiries, and feedback.",
  keywords: [
    "Contact DiaryLex",
    "Legal Tech Support",
    "Law Practice Software Help",
    "Chamber Onboarding Support",
  ],
  alternates: {
    canonical: "https://diarylex.com/contact/",
  },
  openGraph: {
    title: "Contact DiaryLex Legal Technologies",
    description: "Get in touch with our legal tech support and chamber onboarding team.",
    url: "https://diarylex.com/contact/",
    siteName: "DiaryLex",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Contact DiaryLex" }],
    type: "website",
  },
};

const contactLd = {
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
          "name": "Contact",
          "item": "https://diarylex.com/contact/",
        },
      ],
    },
    {
      "@type": "ContactPage",
      "@id": "https://diarylex.com/contact/#webpage",
      "url": "https://diarylex.com/contact/",
      "name": "Contact DiaryLex Support",
      "description": "Customer support and chamber onboarding help desk for DiaryLex.",
    },
  ],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }}
      />
      {children}
    </>
  );
}
