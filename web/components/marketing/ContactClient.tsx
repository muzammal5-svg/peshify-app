"use client";

import { useState } from "react";
import {
  MessageSquare,
  Mail,
  MapPin,
  Check,
  Phone,
  Clock,
  ShieldCheck,
  Send,
  Sparkles,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { SITE, whatsappLink, phoneLink } from "@/lib/siteConfig";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function ContactClient() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "Chamber Onboarding & Multi-Lawyer Setup",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Chamber Onboarding & Multi-Lawyer Setup",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Contact Information & Channels */}
      <div className="lg:col-span-5 space-y-6">
        <div className="rounded-2xl border border-white/10 bg-card p-6 sm:p-8 space-y-6 shadow-xl">
          <h2 className="text-xl font-bold text-white">Chamber Support Desk</h2>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Reach out through our direct channels for immediate assistance with case docket setup, data import, or staff onboarding.
          </p>

          <div className="space-y-4 text-xs">
            {/* WhatsApp */}
            <a
              href={whatsappLink("Hello DiaryLex, I would like to inquire about chamber onboarding.")}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/40 transition-colors flex items-center gap-3.5 group block"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white group-hover:text-emerald-300 block">
                  WhatsApp Chamber Helpdesk
                </span>
                <span className="text-[11px] text-zinc-400">Instant responses during court hours</span>
              </div>
            </a>

            {/* Direct Phone */}
            <a
              href={phoneLink()}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-400/40 transition-colors flex items-center gap-3.5 group block"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white group-hover:text-amber-300 block" dir="ltr">
                  {SITE.phone}
                </span>
                <span className="text-[11px] text-zinc-400">Direct advocate hotline</span>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${SITE.email}`}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-400/40 transition-colors flex items-center gap-3.5 group block"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white group-hover:text-blue-300 block">
                  {SITE.email}
                </span>
                <span className="text-[11px] text-zinc-400">Inquiries &amp; partnership proposals</span>
              </div>
            </a>
          </div>

          <div className="pt-2 border-t border-white/[0.06] text-[11px] text-zinc-400 space-y-1.5">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Court Support Hours: Monday &ndash; Saturday, 8:00 AM &ndash; 7:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Strict attorney-client confidentiality respected on all communications</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-white/10 bg-card p-6 sm:p-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-2">Send Chamber Message</h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Fill in your details below and our chamber onboarding specialist will get back to you within 2 business hours.
          </p>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <Check className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-white font-bold text-sm">Message Sent Successfully</p>
              <p className="text-xs text-zinc-300">
                Thank you for contacting DiaryLex. Our team will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-zinc-300 font-semibold">Your Name / Title</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Advocate Tariq Mahmood"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contact-phone" className="text-zinc-300 font-semibold">Phone / WhatsApp</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-zinc-300 font-semibold">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="counsel@chamber.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contact-subject" className="text-zinc-300 font-semibold">Inquiry Type</label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                  >
                    <option value="Chamber Onboarding & Multi-Lawyer Setup">Chamber Onboarding &amp; Multi-Lawyer Setup</option>
                    <option value="Data Migration from Paper / Excel">Data Migration from Paper / Excel</option>
                    <option value="Feature Request or High Court Cause List Query">Feature Request / High Court Cause List Query</option>
                    <option value="General Support">General Support</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-zinc-300 font-semibold">Message &amp; Court Practice Details</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your practice (e.g. city, primary court benches, active case volume)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 btn-sheen btn-tactile shadow-lg"
              >
                {loading ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
