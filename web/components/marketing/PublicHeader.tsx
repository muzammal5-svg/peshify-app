"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ArrowRight, Menu, X, Phone } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useLang } from "@/providers/LangProvider";
import { cn } from "@/lib/utils";
import type { SupportedLang } from "@/i18n/config";
import { SITE, phoneLink } from "@/lib/siteConfig";
import { Logo } from "@/components/shared/Logo";

interface PublicHeaderProps {
  /** Kept for backwards compatibility — header is styled with editorial glass obsidian. */
  overDark?: boolean;
}

export function PublicHeader({ overDark = false }: PublicHeaderProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const NAV = [
    { href: "/",         label: t("nav.home") },
    { href: "/features", label: t("marketing.navFeatures") },
    { href: "/faq",      label: t("marketing.navFaq") },
    { href: "/contact",  label: t("marketing.navContact") },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300 ease-in-out",
          scrolled
            ? "bg-[#050505]/95 backdrop-blur-md border-b border-[rgba(237,232,224,0.12)] shadow-[0_12px_32px_rgba(0,0,0,0.85)]"
            : "bg-[#050505]/75 backdrop-blur-sm border-b border-[rgba(237,232,224,0.08)]"
        )}
      >
        <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 md:px-10 h-16 md:h-[80px] flex items-center justify-between safe-top">
          {/* Brand (Left) */}
          <div className="flex items-center flex-shrink-0 z-10">
            <Link href="/" className="flex items-center gap-3 group" aria-label={t("brand.name")}>
              <Logo size="sm" variant="full" inverted />
            </Link>
          </div>

          {/* Desktop Navigation Links — Centered */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-2 absolute left-1/2 -translate-x-1/2 pointer-events-auto"
            aria-label={t("common.mainNavigation")}
          >
            {NAV.map((n) => {
              const active = pathname === n.href || (n.href !== "/" && pathname?.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "relative px-3.5 py-2 text-[11.5px] uppercase tracking-[0.08em] transition-colors duration-200 select-none",
                    active
                      ? "text-[#EDE8E0] font-semibold"
                      : "text-[#C8C2B8] font-medium hover:text-[#EDE8E0] hover:bg-white/[0.04]"
                  )}
                >
                  {n.label}
                  {active && (
                    <span
                      className="absolute bottom-0 inset-x-3.5 h-[1.5px] bg-[#EDE8E0] shadow-[0_0_8px_rgba(237,232,224,0.6)]"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions (Right) */}
          <div className="hidden lg:flex items-center gap-3 z-10 flex-shrink-0">
            <LangPill />

            <a
              href={phoneLink()}
              dir="ltr"
              className="hidden min-[1600px]:inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#C8C2B8] hover:text-[#EDE8E0] transition-colors px-2 py-1"
            >
              <Phone className="h-3 w-3 opacity-60" aria-hidden="true" />
              <span>{SITE.phone}</span>
            </a>

            {user ? (
              <Link
                href="/"
                className="btn-secondary min-h-[44px] h-11 px-4 text-xs font-semibold whitespace-nowrap inline-flex items-center gap-2 rounded-xl"
              >
                {t("marketing.goToDashboard")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  className="inline-flex items-center justify-center min-h-[44px] h-11 px-4 text-xs font-semibold uppercase tracking-[0.10em] text-[#EDE8E0] border border-[rgba(237,232,224,0.22)] hover:border-[#EDE8E0] hover:text-white rounded-xl transition-colors"
                >
                  {t("marketing.signIn")}
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] h-11 px-5 text-xs font-bold uppercase tracking-[0.10em] bg-[#EDE8E0] text-[#050505] hover:bg-white rounded-xl transition-colors active:scale-[0.99] shadow-xs"
                >
                  {t("marketing.signUp")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile & Tablet controls */}
          <div className="flex lg:hidden items-center gap-2 z-10">
            <LangPill />
            <button
              type="button"
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-[rgba(237,232,224,0.18)] text-[#EDE8E0] transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none"
              onClick={() => setOpen(true)}
              aria-label={t("marketing.menu")}
              aria-expanded={open}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" id="public-mobile-menu">
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default bg-black/85 backdrop-blur-sm animate-fade-in pointer-events-auto"
            onClick={() => setOpen(false)}
            aria-label={t("marketing.close")}
            tabIndex={-1}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("marketing.menu")}
            className="drawer-panel absolute inset-y-0 end-0 z-50 flex w-[86%] max-w-sm flex-col border-s border-[rgba(237,232,224,0.12)] bg-[#050505] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <Logo size="sm" variant="full" inverted />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#9A958C] hover:text-[#EDE8E0] hover:bg-white/10 transition-colors"
                aria-label={t("marketing.close")}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-1" aria-label={t("common.mainNavigation")}>
              {NAV.map((n) => {
                const active = pathname === n.href || (n.href !== "/" && pathname?.startsWith(n.href));
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-3 py-3 text-sm font-semibold uppercase tracking-[0.10em] border-b border-[rgba(237,232,224,0.06)] transition-colors flex items-center justify-between",
                      active
                        ? "text-[#EDE8E0] bg-white/[0.04] ps-4"
                        : "text-[#9A958C] hover:text-[#EDE8E0]"
                    )}
                  >
                    <span>{n.label}</span>
                    {active && <span className="h-1.5 w-1.5 bg-[#EDE8E0]" />}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-4 border-t border-[rgba(237,232,224,0.12)] pt-6">
              <a
                href={phoneLink()}
                dir="ltr"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#9A958C] hover:text-[#EDE8E0] transition-colors"
              >
                <Phone className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
                <span>{SITE.phone}</span>
              </a>
              {user ? (
                <Link href="/" onClick={() => setOpen(false)} className="btn-secondary w-full text-center">
                  {t("marketing.goToDashboard")}
                </Link>
              ) : (
                <>
                  <Link href="/auth/sign-in" onClick={() => setOpen(false)} className="btn-secondary w-full text-center">
                    {t("marketing.signIn")}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="btn-primary w-full text-center flex items-center justify-center gap-2"
                  >
                    {t("marketing.signUp")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Language pill (EN / UR) with sliding active indicator ─────────────────── */
function LangPill({ className }: { className?: string }) {
  const { lang, setLang, languages } = useLang();
  const { t } = useTranslation();
  const index = Math.max(0, languages.findIndex((l) => l.code === lang));

  return (
    <div
      className={cn(
        "relative inline-flex items-center min-h-[44px] h-11 rounded-xl border border-[rgba(237,232,224,0.18)] bg-[#0A0A0A] p-1",
        className
      )}
      role="group"
      aria-label={t("settings.language")}
    >
      {/* Sliding active indicator */}
      <span
        className="absolute top-1 bottom-1 rounded-lg bg-[#EDE8E0] transition-all duration-200 ease-out"
        style={{
          width: `calc((100% - 0.5rem) / ${languages.length})`,
          insetInlineStart: `calc(0.25rem + ${index} * ((100% - 0.5rem) / ${languages.length}))`,
        }}
        aria-hidden="true"
      />
      {languages.map((l) => {
        const active = lang === l.code;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code as SupportedLang)}
            aria-pressed={active}
            aria-label={l.label}
            className={cn(
              "relative z-10 min-w-[44px] min-h-[36px] h-full flex items-center justify-center rounded-lg px-3 text-xs font-bold uppercase tracking-[0.08em] transition-colors duration-200 focus-visible:outline-none select-none",
              active ? "text-[#050505]" : "text-[#C8C2B8] hover:text-[#EDE8E0]"
            )}
          >
            {l.code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
