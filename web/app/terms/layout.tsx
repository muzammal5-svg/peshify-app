import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service & Practice Governance — DiaryLex",
  description: "Terms of service, platform license, and professional practice governance for DiaryLex.",
  alternates: { canonical: "https://diarylex.com/terms" },
};

export default function L({ children }: { children: React.ReactNode }) { return children; }
