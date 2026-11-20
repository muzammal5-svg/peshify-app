import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider }  from "@/providers/ThemeProvider";
import { QueryProvider }  from "@/providers/QueryProvider";
import { I18nProvider }   from "@/providers/I18nProvider";
import { AuthProvider }   from "@/providers/AuthProvider";
import { SubscriptionProvider } from "@/providers/SubscriptionProvider";
import { LangProvider }   from "@/providers/LangProvider";
import { ToastProvider }  from "@/components/ui/Toast";
import { ErrorBoundary }  from "@/components/shared/ErrorBoundary";
import { OfflineBanner }  from "@/components/shared/OfflineBanner";
import { ScrollAnimationProvider } from "@/components/shared/ScrollAnimationProvider";
import { BRAND }          from "@/lib/brand";

export const metadata: Metadata = {
  metadataBase: new URL("https://diarylex.com"),
  title: {
    template: `%s | ${BRAND.name}`,
    default: "Court Hearing Diary & Case Management Software | DiaryLex",
  },
  description:
    "Legal case management software & court hearing diary for lawyers: track court dates, limitation countdowns, client WhatsApp alerts, and chamber accounts.",
  keywords: [
    "court hearing diary software",
    "legal case management software Pakistan",
    "lawyer case diary app",
    "law firm software Pakistan",
    "limitation period tracker for lawyers",
    "chamber ledger software",
    "advocate case management app",
    "court cause list tracker",
    "client WhatsApp alerts for lawyers",
    "wakeel case diary app",
    "court date reminder app for lawyers",
    "DiaryLex",
  ],
  alternates: {
    canonical: "https://diarylex.com/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google-site-verification-diarylex",
  },
  openGraph: {
    title: "Court Hearing Diary & Case Management Software | DiaryLex",
    description:
      "Legal case management software & court hearing diary for lawyers: track court dates, limitation countdowns, client WhatsApp alerts, and chamber accounts.",
    url: "https://diarylex.com/",
    siteName: "DiaryLex",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "DiaryLex Legal Case Management Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Court Hearing Diary & Case Management Software | DiaryLex",
    description:
      "Legal case management software & court hearing diary for lawyers: track court dates, limitation countdowns, client WhatsApp alerts, and chamber accounts.",
    images: ["/og.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: BRAND.shortName,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
};

export const viewport: Viewport = {
  themeColor:   "#0B1B3A",
  width:        "device-width",
  initialScale: 1,
  viewportFit:  "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://diarylex.com/#website",
      "url": "https://diarylex.com/",
      "name": "DiaryLex",
      "alternateName": ["DiaryLex Legal", "DiaryLex Case Management"],
      "description": "Intelligent Legal Case Management & Court Hearing Diary for Modern Law Practices",
      "publisher": {
        "@id": "https://diarylex.com/#organization",
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://diarylex.com/cases/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://diarylex.com/#organization",
      "name": "DiaryLex Technologies Ltd.",
      "url": "https://diarylex.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://diarylex.com/logo/diarylex-logo.webp",
        "caption": "DiaryLex Logo",
      },
      "sameAs": [
        "https://twitter.com/diarylex",
        "https://linkedin.com/company/diarylex",
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+92-332-3055502",
        "contactType": "customer support",
        "email": "support@diarylex.com",
        "availableLanguage": ["en"],
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://diarylex.com/#application",
      "name": "DiaryLex",
      "url": "https://diarylex.com/",
      "applicationCategory": "BusinessApplication, LegalApplication",
      "applicationSubCategory": "Legal Practice Management",
      "operatingSystem": "Web, iOS, Android",
      "description":
        "Intelligent case management platform for litigation counsel, advocates, and law practices worldwide: automated daily cause lists, hearing diary, limitation tracking, and chamber ledger.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
      },
      "featureList": [
        "Automated Morning Cause List Docketing",
        "Hearing Timeline & Court Action Diary",
        "10-Day Limitation & Appeal Due Reminders",
        "1-Click Client Progress Updates via WhatsApp",
        "Chamber File & Pleadings Vault",
        "Chamber Financial Ledger & Fee Tracking",
        "Role-Based Multi-Associate Access",
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://diarylex.com/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://diarylex.com/",
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // lang + dir are set dynamically by LangProvider on the client via useEffect
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('peshify_theme_mode') || 'dark';
                  var resolved = mode;
                  if (mode === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  var html = document.documentElement;
                  html.classList.remove('light', 'dark');
                  html.classList.add(resolved);
                  html.setAttribute('data-theme', resolved);

                  var accent = localStorage.getItem('peshify_theme_accent') || 'indigo';
                  html.setAttribute('data-accent', accent);
                  html.style.colorScheme = resolved;
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-body bg-background text-foreground antialiased" suppressHydrationWarning>
        <ErrorBoundary>
          <ThemeProvider>
            <I18nProvider>
              <QueryProvider>
                <AuthProvider>
                  <SubscriptionProvider>
                    <LangProvider>
                      <ToastProvider>
                        <ScrollAnimationProvider>
                          {children}
                        </ScrollAnimationProvider>
                        <OfflineBanner />
                      </ToastProvider>
                    </LangProvider>
                  </SubscriptionProvider>
                </AuthProvider>
              </QueryProvider>
            </I18nProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
