import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service & Practice Governance | DiaryLex",
  description: "Terms of service, early access terms, platform license, and practice governance for DiaryLex legal practice management software.",
  alternates: { canonical: "https://diarylex.com/terms/" },
};

export default function L({ children }: { children: React.ReactNode }) { return children; }
