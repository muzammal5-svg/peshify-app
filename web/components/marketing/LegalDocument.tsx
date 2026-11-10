"use client";

import { useTranslation } from "react-i18next";
import { Scale, ShieldCheck, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { LEGAL_DOCS, type LegalDocId } from "@/lib/legalDocs";

const ICONS: Record<LegalDocId, typeof Scale> = {
  terms:   Scale,
  privacy: ShieldCheck,
  refund:  Wallet,
};

/**
 * Full-page rendering of a legal document. Shares the same content model
 * as the slide-over drawer so both stay in sync.
 */
export function LegalDocument({
  doc,
  className,
  hideHeader = false,
}: {
  doc: LegalDocId;
  className?: string;
  hideHeader?: boolean;
}) {
  const { t } = useTranslation();
  const definition = LEGAL_DOCS[doc];
  const Icon = ICONS[doc];

  return (
    <article className={cn("space-y-8 text-[#EDE8E0]", className)}>
      {!hideHeader && (
        <header>
          <div className="flex items-center gap-2.5 text-[#EDE8E0]">
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#9A958C]">Peshify</span>
          </div>
          <h1 className="mt-3 font-heading text-3xl font-bold text-[#EDE8E0] md:text-4xl">
            {t(definition.titleKey)}
          </h1>
          <p className="mt-1 text-xs text-[#5C5852]">{t(definition.lastUpdatedKey)}</p>
        </header>
      )}

      <div className="space-y-8">
        {definition.sections.map((s) => (
          <section key={s.id} id={s.id} className="space-y-3 pb-6 border-b border-white/[0.06] last:border-0 last:pb-0">
            <h2 className="font-heading text-lg font-bold text-white md:text-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{t(s.titleKey)}</span>
            </h2>
            {s.bodyKeys.map((k) => (
              <p key={k} className="text-sm leading-relaxed text-slate-300">{t(k)}</p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
