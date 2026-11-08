export const SITE = {
  name: "Peshify",
  tagline: "Run your law practice with clarity",
  whatsapp: "+92 341 7359571",
  phone: "+92 341 7359571",
  email: "support@peshify.com",
  trialDays: 0,
  social: { twitter: "", linkedin: "" },
  /** Set to true only after real reviews are added (see docs/landing-content.md). */
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
