"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Mail, MessageCircle, Phone, MapPin, ArrowRight, ShieldCheck, Scale, ExternalLink
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { SITE, whatsappLink, phoneLink } from "@/lib/siteConfig";

export function PublicFooter() {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-[#050811] text-[#EDE8E0] border-t border-white/[0.08]">
      <div className="mx-auto max-w-[1240px] px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4">
            <Logo size="md" variant="full" inverted />
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              The modern legal operating system engineered specifically for Pakistani advocates, chambers, and High Court practitioners. Daily cause lists, case diaries, and client alerts.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] text-zinc-300">
              <Scale className="w-3.5 h-3.5 text-primary" strokeWidth={1.75} />
              <span>Built for Pakistani Courts</span>
            </div>
          </div>

          {/* Column 2: Platform Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Automated Daily Cause List
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Hearing Diary &amp; Limitation Alerts
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Urdu Typography &amp; Native RTL
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Automated WhatsApp Client Updates
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Chamber Billing &amp; Invoicing Ledger
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Chamber Practice
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Contact Chamber Support</span>
                  <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                </Link>
              </li>
              <li>
                <a href={phoneLink()} className="hover:text-white transition-colors flex items-center gap-2">
                  <Phone className="w-3 h-3 text-primary" />
                  <span>{SITE.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-white transition-colors flex items-center gap-2">
                  <Mail className="w-3 h-3 text-primary" />
                  <span>{SITE.email}</span>
                </a>
              </li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <MessageCircle className="w-3 h-3 text-emerald-400" />
                  <span>Direct WhatsApp Channel</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Security Statement */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Legal &amp; Privacy
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund &amp; Early-Access Policy
                </Link>
              </li>
            </ul>
            <div className="pt-2 text-[11px] text-zinc-400 leading-relaxed border-t border-white/[0.06]">
              <span className="flex items-center gap-1 text-zinc-300 font-semibold mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Data Protection Guarantee
              </span>
              Chamber matter files and client information belong 100% to your practice. Encrypted in transit and at rest.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.08] px-6 py-6 text-xs text-zinc-400">
        <div className="mx-auto max-w-[1240px] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved. Designed for Pakistani Advocates.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
