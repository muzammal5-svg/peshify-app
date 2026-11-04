"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  X, Scale, ShieldCheck, Wallet, Search, ArrowRight, List, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LEGAL_DOCS, type LegalDocId } from "@/lib/legalDocs";

const DOC_ICONS: Record<LegalDocId, typeof Scale> = {
  terms:   Scale,
  privacy: ShieldCheck,
  refund:  Wallet,
};

interface LegalDrawerProps {
  open:     boolean;
  doc:      LegalDocId;
  onClose:  () => void;
}

export function LegalDrawer({ open, doc, onClose }: LegalDrawerProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef  = useRef<HTMLButtonElement>(null);

  const definition = LEGAL_DOCS[doc];
  const Icon = DOC_ICONS[doc];

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return definition.sections;
    return definition.sections.filter((s) => {
      const title = t(s.titleKey).toLowerCase();
      const body  = s.bodyKeys.map((k) => t(k).toLowerCase()).join(" ");
      return title.includes(q) || body.includes(q);
    });
  }, [definition.sections, query, t]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveId(definition.sections[0]?.id ?? "");
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [open, onClose, definition.sections]);

  useEffect(() => {
    if (!open) return;
    const root = scrollRef.current;
    if (!root) return;
    const onScroll = () => {
      const candidates = definition.sections
        .map((s) => root.querySelector<HTMLElement>(`#${s.id}`))
        .filter((el): el is HTMLElement => Boolean(el));
      let current = candidates[0]?.id ?? "";
      for (const el of candidates) {
        if (el.offsetTop - root.scrollTop <= 96) current = el.id;
      }
      setActiveId(current);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => root.removeEventListener("scroll", onScroll);
  }, [open, definition.sections]);

  const jumpTo = (id: string) => {
    const root = scrollRef.current;
    const el = root?.querySelector<HTMLElement>(`#${id}`);
    if (!root || !el) return;
    root.scrollTo({ top: el.offsetTop - 24, behavior: "smooth" });
    setActiveId(id);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default bg-black/85 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-label={t("common.close")}
        tabIndex={-1}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-drawer-title"
        className="drawer-panel absolute inset-y-0 end-0 flex w-full max-w-2xl flex-col bg-[#050505] text-[#EDE8E0] border-s border-[rgba(237,232,224,0.12)] shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-start gap-4 border-b border-[rgba(237,232,224,0.12)] bg-[#0A0A0A] px-5 py-5 sm:px-7">
          <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#EDE8E0] text-[#050505]">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A958C]">MZM &amp; Associates</p>
            <h2 id="legal-drawer-title" className="mt-1 font-heading text-xl font-bold text-[#EDE8E0] sm:text-2xl">
              {t(definition.titleKey)}
            </h2>
            <p className="mt-0.5 text-[11px] text-[#5C5852]">{t(definition.lastUpdatedKey)}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t("common.close")}
            className="grid h-9 w-9 shrink-0 place-items-center border border-[rgba(237,232,224,0.18)] text-[#9A958C] transition-colors duration-200 hover:text-[#EDE8E0] focus-visible:outline-none"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        {/* Search */}
        <div className="border-b border-[rgba(237,232,224,0.10)] px-5 py-4 sm:px-7 bg-[#0A0A0A]">
          <label htmlFor="legal-search" className="sr-only">{t("legal.searchPlaceholder")}</label>
          <div className="relative">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C5852]" aria-hidden="true" />
            <input
              id="legal-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("legal.searchPlaceholder")}
              className="w-full border border-[rgba(237,232,224,0.14)] bg-[#111111] py-2.5 ps-10 pe-10 text-sm text-[#EDE8E0] placeholder:text-[#5C5852] focus:outline-none focus:border-[#EDE8E0]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={t("common.clearSearch")}
                className="absolute end-3 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center text-[#9A958C] hover:text-[#EDE8E0]"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1">
          {/* Table of contents */}
          <nav
            className="hidden w-56 shrink-0 overflow-y-auto border-e border-[rgba(237,232,224,0.10)] bg-[#0A0A0A] p-4 md:block"
            aria-label={t("legal.tableOfContents")}
          >
            <p className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A958C]">
              <List className="h-3.5 w-3.5" aria-hidden="true" />
              {t("legal.tableOfContents")}
            </p>
            <ul className="space-y-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => jumpTo(s.id)}
                    className={cn(
                      "w-full px-3 py-2 text-start text-xs font-semibold uppercase tracking-[0.06em] transition-colors focus-visible:outline-none",
                      activeId === s.id
                        ? "bg-[#171717] text-[#EDE8E0] border-s-2 border-[#EDE8E0]"
                        : "text-[#9A958C] hover:text-[#EDE8E0]"
                    )}
                  >
                    {t(s.titleKey)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Document */}
          <div ref={scrollRef} className="min-w-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7 bg-[#050505]">
            {sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <FileText className="h-10 w-10 text-[#5C5852]" aria-hidden="true" />
                <p className="text-sm font-semibold text-[#EDE8E0]">{t("legal.noResults")}</p>
                <p className="text-xs text-[#5C5852]">{t("legal.noResultsHint")}</p>
              </div>
            ) : (
              <div className="space-y-8">
                {sections.map((s) => (
                  <section key={s.id} id={s.id} className="scroll-mt-4 space-y-3">
                    <h3 className="font-heading text-base font-bold text-[#EDE8E0] sm:text-lg">{t(s.titleKey)}</h3>
                    {s.bodyKeys.map((k) => (
                      <p key={k} className="text-sm leading-relaxed text-[#9A958C]">{t(k)}</p>
                    ))}
                  </section>
                ))}
              </div>
            )}

            <div className="mt-10 flex items-center justify-between gap-3 border border-[rgba(237,232,224,0.12)] bg-[#111111] p-4">
              <p className="text-xs font-medium text-[#9A958C]">{t("legal.drawerCta")}</p>
              <a
                href="/contact"
                onClick={onClose}
                className="btn-primary py-2 px-4 text-[10px]"
              >
                {t("marketing.navContact")}
                <ArrowRight className="h-3.5 w-3.5 ms-1.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
