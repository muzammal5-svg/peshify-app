"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Mail, MessageCircle, Phone, MapPin, ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { LegalDrawer } from "@/components/marketing/LegalDrawer";
import { SITE, whatsappLink, phoneLink } from "@/lib/siteConfig";
import type { LegalDocId } from "@/lib/legalDocs";

export function PublicFooter() {
  const { t } = useTranslation();
  const [doc, setDoc] = useState<LegalDocId | null>(null);
  const [formSent, setFormSent] = useState(false);

  const openLegal = (d: LegalDocId) => setDoc(d);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 5000);
  };

  return (
    <footer className="relative bg-[#050505] text-[#EDE8E0] border-t border-[rgba(237,232,224,0.12)]">
      <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-24">
        {/* 3-column Kontrora Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Column 1: Contact Us (4.5 cols) */}
          <div className="md:col-span-5 lg:col-span-4 space-y-6">
            <h4 className="font-heading text-xl font-bold tracking-tight text-[#EDE8E0]">
              Contact Us
            </h4>

            <div className="space-y-4 text-sm text-[#9A958C]">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#EDE8E0] shrink-0 opacity-70" />
                <a href={phoneLink()} className="hover:text-[#EDE8E0] transition-colors font-medium">
                  {SITE.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#EDE8E0] shrink-0 opacity-70" />
                <a href={`mailto:${SITE.email}`} className="hover:text-[#EDE8E0] transition-colors font-medium">
                  {SITE.email}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-[#6B8F71] shrink-0" />
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-[#EDE8E0] transition-colors font-medium">
                  WhatsApp Support (24/7)
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#EDE8E0] shrink-0 opacity-70 mt-0.5" />
                <span>
                  High Court Bar Association &amp; District Courts, Peshawar &bull; Islamabad, Pakistan
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Logo size="md" variant="full" inverted />
            </div>
          </div>

          {/* Column 2: Quick Links (3.5 cols) */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="font-heading text-xl font-bold tracking-tight text-[#EDE8E0] mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-[#9A958C]">
              <li>
                <Link href="/" className="hover:text-[#EDE8E0] transition-colors">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-[#EDE8E0] transition-colors">
                  {t("marketing.navFeatures")}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#EDE8E0] transition-colors">
                  {t("marketing.navPricing")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#EDE8E0] transition-colors">
                  {t("marketing.navFaq")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#EDE8E0] transition-colors">
                  {t("marketing.navContact")}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegal("terms")}
                  className="hover:text-[#EDE8E0] transition-colors text-start"
                >
                  {t("marketing.footerTerms")}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegal("privacy")}
                  className="hover:text-[#EDE8E0] transition-colors text-start"
                >
                  {t("marketing.footerPrivacy")}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegal("refund")}
                  className="hover:text-[#EDE8E0] transition-colors text-start"
                >
                  {t("marketing.footerRefund")}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Send Us A Message (4 cols) */}
          <div className="md:col-span-4 lg:col-span-5">
            <h3 className="font-heading text-2xl lg:text-3xl font-bold tracking-tight text-[#EDE8E0] leading-none mb-2">
              Send Us<br />A Message
            </h3>
            <p className="text-xs text-[#9A958C] mb-6">
              Kindly fill this form. Average chamber response is within 24 hours.
            </p>

            {formSent ? (
              <div className="p-4 border border-[#6B8F71]/30 bg-[#6B8F71]/10 text-[#6B8F71] text-xs font-semibold">
                Thank you. Your message has been received. Our team will contact you shortly.
              </div>
            ) : (
              <form onSubmit={handleMessageSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  name="name"
                  required
                  className="input-underline"
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  name="email"
                  required
                  className="input-underline"
                />
                <select
                  name="subject"
                  defaultValue=""
                  className="input-underline bg-[#050505] text-[#EDE8E0]"
                >
                  <option value="" disabled className="text-[#5C5852]">Select subject...</option>
                  <option value="demo">Request a chamber demo</option>
                  <option value="support">Technical support</option>
                  <option value="pricing">Pricing &amp; multi-lawyer license</option>
                  <option value="other">Other inquiry</option>
                </select>
                <textarea
                  placeholder="Your message..."
                  name="message"
                  required
                  rows={3}
                  className="input-underline resize-none"
                />
                <button
                  type="submit"
                  className="w-full mt-2 py-3.5 bg-[#EDE8E0] text-[#050505] font-bold text-xs uppercase tracking-[0.14em] hover:bg-white transition-colors"
                >
                  Submit Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[rgba(237,232,224,0.10)] px-6 py-6 text-xs text-[#5C5852]">
        <div className="mx-auto max-w-[1240px] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => openLegal("privacy")}
              className="hover:text-[#EDE8E0] transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => openLegal("terms")}
              className="hover:text-[#EDE8E0] transition-colors"
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() => openLegal("refund")}
              className="hover:text-[#EDE8E0] transition-colors"
            >
              Refund Policy
            </button>
          </div>
        </div>
      </div>

      <LegalDrawer
        open={doc !== null}
        doc={doc ?? "terms"}
        onClose={() => setDoc(null)}
      />
    </footer>
  );
}
