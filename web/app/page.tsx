import type { Metadata } from "next";
import { Landing } from "@/components/marketing/Landing";
import { AuthRedirect } from "@/components/marketing/AuthRedirect";

export const metadata: Metadata = {
  title: "Court Hearing Diary & Case Management Software | DiaryLex",
  description:
    "Legal case management software & court hearing diary for lawyers in Pakistan & worldwide. Daily cause lists, limitation countdowns & WhatsApp client alerts.",
  alternates: {
    canonical: "https://diarylex.com/",
  },
};

export default function HomePage() {
  return (
    <>
      <AuthRedirect />
      <Landing />
    </>
  );
}
