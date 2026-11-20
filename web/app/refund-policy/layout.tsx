import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription & Refund Policy | DiaryLex",
  description: "Subscription policies, free early access terms, and refund policy for DiaryLex legal practice software.",
  alternates: { canonical: "https://diarylex.com/refund-policy/" },
};

export default function L({ children }: { children: React.ReactNode }) { return children; }
