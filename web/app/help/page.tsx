"use client";

import { useTranslation } from "react-i18next";
import { AppShell }   from "@/components/layout/AppShell";
import { RouteGuard } from "@/components/shared/RouteGuard";
import { Card }       from "@/components/ui/Card";
import { HelpCircle, MessageCircle, Mail, Phone, BookOpen, ExternalLink } from "lucide-react";
import { SITE, whatsappLink, phoneLink } from "@/lib/siteConfig";
import Link from "next/link";

export default function HelpPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ur";

  return (
    <RouteGuard>
      <AppShell pageTitle={t("more.help") || "Chamber Help & Support"} showBack>
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Hero Chamber Support Card */}
          <Card className="flex flex-col items-center gap-4 py-10 px-6 text-center border-border/80 shadow-md">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-500 shadow-xs">
              <HelpCircle className="w-8 h-8" strokeWidth={1.75} />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h1 className="font-heading font-bold text-foreground text-xl">
                {t("more.helpTitle") || "How can we help your chamber today?"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t("more.helpText") || "Our chamber legal ops team provides 24/7 dedicated assistance to Pakistani advocates and law firms."}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={whatsappLink("Assalam-o-Alaikum, I need assistance with Peshify chamber application.")}
                target="_blank"
                rel="noreferrer"
                className="btn-primary min-h-[44px] px-5 text-xs font-semibold rounded-xl inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Helpline (24/7)</span>
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="btn-secondary min-h-[44px] px-5 text-xs font-semibold rounded-xl inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-primary" />
                <span>{SITE.email}</span>
              </a>
            </div>
          </Card>

          {/* Quick Help Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/faq" className="block group">
              <Card hover className="p-5 flex items-start gap-3.5 border-border/80 group-hover:border-primary/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                    <span>Knowledge Base &amp; FAQ</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    Instant answers regarding cause lists, limitation calculators, and WhatsApp notifications.
                  </p>
                </div>
              </Card>
            </Link>

            <a href={phoneLink()} className="block group">
              <Card hover className="p-5 flex items-start gap-3.5 border-border/80 group-hover:border-primary/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    Direct Chamber Phone
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug font-mono">
                    {SITE.phone} &bull; 9 AM - 6 PM PKT
                  </p>
                </div>
              </Card>
            </a>
          </div>

        </div>
      </AppShell>
    </RouteGuard>
  );
}
