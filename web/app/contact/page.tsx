"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MessageSquare, Mail, MapPin, Check, Phone,
  Clock, ShieldCheck, Send, Sparkles, AlertCircle
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";
import { Reveal } from "@/components/marketing/Reveal";
import { SITE, whatsappLink, phoneLink } from "@/lib/siteConfig";

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";
const SECTION = "py-16 md:py-24";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ur";

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "Chamber Onboarding & Multi-Lawyer Setup",
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
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Chamber Onboarding & Multi-Lawyer Setup",
        message: ""
      });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#070A12] text-[#EDE8E0] selection:bg-primary/30 selection:text-white overflow-x-clip font-sans">
      <PublicHeader overDark />

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 text-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-amber-500/10 via-primary/15 to-transparent blur-3xl pointer-events-none" />
        </div>

        <div className={`${CONTAINER} relative z-10 max-w-3xl mx-auto space-y-4`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-amber-400/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isRTL ? "چیمبر سپورٹ و رہنمائی" : "Advocate Onboarding & Chamber Inquiries"}</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            {isRTL ? "ہم سے رابطہ کریں" : "Get in Touch With Our Team"}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            {isRTL
              ? "پیشی فائی سیٹ اپ، چیمبر مائیگریشن یا ملٹی وکیل اکاؤنٹ سے متعلق رہنمائی کے لیے ہمارے نمائندے سے رابطہ کریں۔"
              : "Have questions about Peshify setup, chamber migration, or multi-associate permissions? Our legal ops team is ready to assist."}
          </p>
        </div>
      </section>

      {/* ── CONTACT CHANNELS ── */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* WhatsApp */}
            <Reveal>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 text-center h-full flex flex-col justify-between hover:border-emerald-400/40 hover:-translate-y-1 transition-all duration-300 shadow-xl">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-xs">
                    <MessageSquare className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white mb-2">
                    {t("contact.whatsapp") || "WhatsApp Chamber Help"}
                  </h3>
                  <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                    {isRTL
                      ? "فوری رہنمائی اور آن بورڈنگ کے لیے 24 گھنٹے براہ راست واٹس ایپ پر رابطہ کریں۔"
                      : "Chat directly with our chamber support team for immediate setup assistance and live onboarding."}
                  </p>
                </div>
                <a
                  href={whatsappLink("Assalam-o-Alaikum, I am an advocate inquiring about Peshify chamber setup.")}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary w-full min-h-[46px] rounded-xl flex items-center justify-center gap-2 text-xs font-semibold"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t("contact.chatNow") || "Open WhatsApp (24/7)"}</span>
                </a>
              </div>
            </Reveal>

            {/* Email */}
            <Reveal>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 text-center h-full flex flex-col justify-between hover:border-amber-400/40 hover:-translate-y-1 transition-all duration-300 shadow-xl">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-6 shadow-xs">
                    <Mail className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white mb-2">
                    {t("contact.email") || "Email Inquiries"}
                  </h3>
                  <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                    {isRTL
                      ? "چیمبر کی تفصیلی ضروریات، ڈیٹا درآمد یا تکنیکی سوالات کے لیے ای میل بھیجیں۔"
                      : "Send detailed chamber requirements, bar association procurement questions, or data queries."}
                  </p>
                </div>
                <a
                  href={`mailto:${SITE.email}`}
                  className="btn-secondary w-full min-h-[46px] rounded-xl flex items-center justify-center gap-2 text-xs font-semibold bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>{SITE.email}</span>
                </a>
              </div>
            </Reveal>

            {/* Phone & Office */}
            <Reveal>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 text-center h-full flex flex-col justify-between hover:border-sky-400/40 hover:-translate-y-1 transition-all duration-300 shadow-xl">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-6 shadow-xs">
                    <MapPin className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white mb-2">
                    {t("contact.office") || "Chamber Office"}
                  </h3>
                  <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                    {isRTL
                      ? "پشاور ہائی کورٹ بار اور اسلام آباد بار ایسوسی ایشن کے وکلاء کے لیے براہ راست سروس۔"
                      : "Supporting counsel across Peshawar High Court Bar, Islamabad Bar, and Lahore High Court benches."}
                  </p>
                </div>
                <a
                  href={phoneLink()}
                  className="w-full min-h-[46px] rounded-xl flex items-center justify-center gap-2 text-xs font-semibold border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
                >
                  <Phone className="w-4 h-4 text-sky-400" />
                  <span>{SITE.phone}</span>
                </a>
              </div>
            </Reveal>
          </div>

          {/* ── CONTACT FORM ── */}
          <div className="max-w-2xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-400/5 blur-3xl pointer-events-none" />

            <div className="mb-8 space-y-2 text-center sm:text-start">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {isRTL ? "براہ راست پیغام" : "Direct Chamber Message"}
              </span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">
                {t("contact.sendMessage") || "Send our team a message"}
              </h2>
              <p className="text-xs text-slate-300">
                {isRTL
                  ? "فارم پر کریں، ہماری ٹیم 24 گھنٹے کے اندر آپ سے رابطہ کرے گی۔"
                  : "Fill out the inquiry form below and an advocate coordinator will reply within a few hours."}
              </p>
            </div>

            {submitted && (
              <div className="p-4 mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {isRTL ? "پیغام کامیابی سے موصول ہو گیا ہے!" : "Message received successfully!"}
                  </p>
                  <p className="text-slate-300 mt-0.5">
                    {isRTL ? "ہم جلد آپ کے چیمبر سے رابطہ کریں گے۔" : "We will review your inquiry and get in touch shortly."}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t("contact.name") || "Full Name / Advocate Title"} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Barrister / Advocate M. Aslam"
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 text-white rounded-xl text-sm px-4 py-3 min-h-[46px] outline-none transition-all placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t("contact.email") || "Email Address"} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="advocate@chamber.pk"
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 text-white rounded-xl text-sm px-4 py-3 min-h-[46px] outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t("contact.phone") || "WhatsApp / Mobile Number"}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0300 1234567"
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 text-white rounded-xl text-sm px-4 py-3 min-h-[46px] outline-none transition-all placeholder:text-slate-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t("contact.subject") || "Inquiry Topic"}
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 text-white rounded-xl text-sm px-3.5 py-3 min-h-[46px] outline-none transition-all"
                  >
                    <option value="Chamber Onboarding & Multi-Lawyer Setup">Chamber &amp; Multi-Lawyer Setup</option>
                    <option value="Request Chamber Demo">Request Chamber Live Demo</option>
                    <option value="Technical Support">Technical Support / Question</option>
                    <option value="Bar Association Partnership">Bar Association Partnership</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t("contact.message") || "Message / Chamber Requirements"} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 text-white rounded-xl text-sm p-4 outline-none transition-all placeholder:text-slate-600 resize-none"
                  placeholder="Tell us about your chamber needs (number of associates, court benchmarks, current workflow)..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full min-h-[48px] rounded-xl flex items-center justify-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl mt-4"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? "Sending Message..." : "Submit Chamber Message"}</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <PublicFooter />
      <FloatingWhatsApp />
    </div>
  );
}
