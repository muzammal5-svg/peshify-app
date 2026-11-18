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
    default: `${BRAND.name} — Intelligent Case Management & Court Hearing Diary`,
  },
  description:
    "Intelligent case management, automated court hearing diary, client communication, limitation tracking, and chamber ledger for litigation attorneys, law firms, and legal counsel worldwide.",
  keywords: [
    "DiaryLex",
    "Legal Case Management",
    "Court Hearing Diary",
    "Law Practice Management",
    "Litigation Management Software",
    "Docket Management",
    "Law Firm Software",
    "Attorney Case Tracking",
    "Court Calendar Software",
    "Multilingual Legal CMS",
  ],
  alternates: {
    canonical: "https://diarylex.com",
  },
  openGraph: {
    title: "DiaryLex | Intelligent Case Management & Court Hearing Diary",
    description:
      "Intelligent case management, automated court hearing diary, client updates, limitation alerts, and chamber ledger for law practices worldwide.",
    url: "https://diarylex.com",
    siteName: "DiaryLex",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "DiaryLex Case Management Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DiaryLex | Intelligent Case Management & Court Hearing Diary",
    description:
      "Intelligent case management, automated court hearing diary, client updates, and chamber ledger for law practices worldwide.",
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
  "@type": "SoftwareApplication",
  name: "DiaryLex",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  description:
    "Intelligent case management platform for litigation attorneys, barristers, and law firms: daily court cause lists, hearing diary, client directory, and multilingual RTL support.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  publisher: {
    "@type": "Organization",
    name: "DiaryLex Technologies Ltd",
    url: "https://diarylex.com",
  },
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
