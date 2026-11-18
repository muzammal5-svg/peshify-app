export const SITE = {
  name: "DiaryLex",
  legalName: "DiaryLex Technologies Ltd.",
  tagline: "Intelligent Case Management & Court Hearing Diary for Modern Law Practices",
  domain: "diarylex.com",
  whatsapp: "+1 (800) 539-3427", // International legal operations help line / WhatsApp
  phone: "+1 (800) 539-3427",
  email: "support@diarylex.com",
  trialDays: 0,
  social: { twitter: "https://twitter.com/diarylex", linkedin: "https://linkedin.com/company/diarylex" },
  /** Set to true only after real reviews are added */
  SHOW_REVIEWS: false,
};

export function whatsappLink(msg = "Hello") {
  const num = SITE.whatsapp.replace(/[^0-9]/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

export function phoneLink() {
  const num = SITE.phone.replace(/[^0-9]/g, "");
  return `tel:${num}`;
}
