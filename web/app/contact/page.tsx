"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquare, Mail, MapPin, Check } from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { Reveal } from "@/components/marketing/Reveal";
import { SITE, whatsappLink } from "@/lib/siteConfig";

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";
const SECTION = "py-20 md:py-32";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#050505] text-[#EDE8E0]">
      <PublicHeader overDark />

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 text-center overflow-hidden bg-[#050505] border-b border-[rgba(237,232,224,0.10)]">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `linear-gradient(rgba(237,232,224,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(237,232,224,0.12) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,0.4)_0%,#050505_80%)]" />
        </div>

        <div className={`${CONTAINER} relative z-10 max-w-3xl mx-auto space-y-4`}>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A958C]">Support &amp; Inquiries</span>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#EDE8E0]">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg text-[#C8C2B8] max-w-xl mx-auto leading-relaxed">
            Have questions about MZM &amp; Associates? Our legal ops onboarding team is here to help your chamber get set up.
          </p>
        </div>
      </section>

      {/* ── CONTACT CHANNELS ── */}
      <section className={`${SECTION} bg-[#050505]`}>
        <div className={CONTAINER}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(237,232,224,0.12)] border border-[rgba(237,232,224,0.12)] mb-20">
            {/* WhatsApp */}
            <Reveal>
              <div className="bg-[#050505] p-8 sm:p-10 text-center h-full flex flex-col justify-between hover:bg-[#0A0A0A] transition-colors">
                <div>
                  <div className="w-12 h-12 border border-[rgba(237,232,224,0.14)] bg-white/[0.03] flex items-center justify-center mx-auto mb-6 text-[#6B8F71]">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-[#EDE8E0] mb-2">{t("contact.whatsapp") || "WhatsApp Support"}</h3>
                  <p className="text-xs text-[#C8C2B8] mb-6 leading-relaxed">
                    Chat with our chamber support team for immediate setup assistance.
                  </p>
                </div>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary w-full h-11 text-center"
                >
                  {t("contact.chatNow") || "Open WhatsApp (24/7)"}
                </a>
              </div>
            </Reveal>

            {/* Email */}
            <Reveal>
              <div className="bg-[#050505] p-8 sm:p-10 text-center h-full flex flex-col justify-between hover:bg-[#0A0A0A] transition-colors">
                <div>
                  <div className="w-12 h-12 border border-[rgba(237,232,224,0.14)] bg-white/[0.03] flex items-center justify-center mx-auto mb-6 text-[#EDE8E0]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-[#EDE8E0] mb-2">{t("contact.email") || "Email Inquiry"}</h3>
                  <p className="text-xs text-[#C8C2B8] mb-6 leading-relaxed">
                    Send detailed chamber requirements or procurement questions.
                  </p>
                </div>
                <a
                  href={`mailto:${SITE.email}`}
                  className="btn-secondary w-full h-11 text-center"
                >
                  {t("contact.sendEmail") || "support@mzm.associates"}
                </a>
              </div>
            </Reveal>

            {/* Office */}
            <Reveal>
              <div className="bg-[#050505] p-8 sm:p-10 text-center h-full flex flex-col justify-between hover:bg-[#0A0A0A] transition-colors">
                <div>
                  <div className="w-12 h-12 border border-[rgba(237,232,224,0.14)] bg-white/[0.03] flex items-center justify-center mx-auto mb-6 text-[#EDE8E0]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-[#EDE8E0] mb-2">{t("contact.office") || "Chamber Office"}</h3>
                  <p className="text-xs text-[#C8C2B8] mb-6 leading-relaxed">
                    Peshawar High Court Bar &bull; Islamabad Bar Association
                  </p>
                </div>
                <div className="h-11 flex items-center justify-center text-xs font-semibold text-[#EDE8E0] border border-[rgba(237,232,224,0.12)] bg-white/[0.02]">
                  Peshawar &amp; Islamabad, Pakistan
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── CONTACT FORM ── */}
          <div className="max-w-2xl mx-auto border border-[rgba(237,232,224,0.12)] bg-[#0A0A0A] p-8 sm:p-12">
            <div className="mb-8 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A958C]">Direct Message</span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#EDE8E0]">
                {t("contact.sendMessage") || "Send us a message"}
              </h2>
              <p className="text-xs text-[#C8C2B8]">
                {t("contact.formDesc") || "Fill out the form below and we will respond within 24 hours."}
              </p>
            </div>

            {submitted && (
              <div className="mb-6 p-4 border border-[#6B8F71]/30 bg-[#6B8F71]/10 text-[#6B8F71] text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{t("contact.success") || "Thank you. Your message has been received."}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A958C] mb-2">
                  {t("contact.name") || "Full Name"} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-underline"
                  placeholder="Advocate Name"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A958C] mb-2">
                  {t("contact.emailLabel") || "Email Address"} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-underline"
                  placeholder="counsel@chamber.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A958C] mb-2">
                  {t("contact.phone") || "Phone Number"}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  dir="ltr"
                  className="input-underline"
                  placeholder="0300 1234567"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A958C] mb-2">
                  {t("contact.subject") || "Subject"}
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-underline bg-[#0A0A0A] text-[#EDE8E0]"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Chamber Demo">Request Chamber Demo</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Pricing">Multi-Lawyer Pricing</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A958C] mb-2">
                  {t("contact.message") || "Message"} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="input-underline resize-none"
                  placeholder="Tell us about your chamber needs..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-12 mt-6"
              >
                {loading ? "Sending..." : "Submit Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
