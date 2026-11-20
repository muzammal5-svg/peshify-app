import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Your Law Practice | Free Early Access",
  description:
    "Register your law practice on DiaryLex in minutes. Free during Early Access: court cause lists, hearing diary, and limitation alerts. No card required.",
  alternates: {
    canonical: "https://diarylex.com/register/",
  },
  openGraph: {
    title: "Register Your Law Practice | DiaryLex",
    description: "Start managing litigation cases, cause lists, and client alerts with DiaryLex.",
    url: "https://diarylex.com/register/",
    siteName: "DiaryLex",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Register on DiaryLex" }],
    type: "website",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
