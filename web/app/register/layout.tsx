import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Free Chamber Workspace — Join Early Advocate Access",
  description:
    "Register your law practice on DiaryLex in minutes. 100% free early access: automated court cause lists, hearing diary, limitation alerts, and unlimited associate seats.",
  alternates: {
    canonical: "https://diarylex.com/register",
  },
  openGraph: {
    title: "Create Free Chamber Account — DiaryLex",
    description: "Start managing litigation cases, cause lists, and client alerts with DiaryLex.",
    url: "https://diarylex.com/register",
    siteName: "DiaryLex",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Register on DiaryLex" }],
    type: "website",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
