import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy & Client Data Safeguards | DiaryLex",
  description: "Privacy policy, client confidentiality, database encryption standards, and attorney-client privilege protection on DiaryLex.",
  alternates: { canonical: "https://diarylex.com/privacy/" },
};

export default function L({ children }: { children: React.ReactNode }) { return children; }
