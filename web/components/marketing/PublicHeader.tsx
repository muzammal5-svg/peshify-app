"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Calendar,
  Clock,
  MessageSquare,
  Receipt,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { SITE, phoneLink } from "@/lib/siteConfig";
import { Logo } from "@/components/shared/Logo";

interface PublicHeaderProps {
  /** Kept for backwards compatibility */
  overDark?: boolean;
}

const FEATURE_DROPDOWN_ITEMS = [
  {
    href: "/court-hearing-diary/",
    title: "Court Hearing Diary",
    desc: "Daily cause lists, courtroom schedules & next dates",
    icon: Calendar,
    badge: "Most Used",
  },
  {
    href: "/limitation-tracker/",
    title: "Limitation Tracker",
    desc: "Statutory appeal countdown timers & revision alerts",
    icon: Clock,
  },
  {
    href: "/whatsapp-client-alerts/",
    title: "WhatsApp Client Alerts",
    desc: "1-Click hearing summaries & notices directly to clients",
    icon: MessageSquare,
  },
  {
    href: "/chamber-ledger/",
    title: "Chamber Ledger",
    desc: "Client retainers, court fee stamps & expense vouchers",
    icon: Receipt,
  },
];

export function PublicHeader({ overDark = false }: PublicHeaderProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFeaturesOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setFeaturesOpen(false);
    setOpen(false);
  }, [pathname]);

  const isFeatureActive =
    pathname?.startsWith("/court-hearing-diary") ||
    pathname?.startsWith("/limitation-tracker") ||
    pathname?.startsWith("/whatsapp-client-alerts") ||
    pathname?.startsWith("/chamber-ledger") ||
    pathname === "/features" ||
    pathname === "/features/";

  const MAIN_NAV = [
    { href: "/pricing/", label: "Pricing" },
    { href: "/about/",   label: "About" },
    { href: "/blog/",    label: "Blog" },
    { href: "/faq/",     label: t("marketing.navFaq") || "FAQ" },
    { href: "/contact/", label: t("marketing.navContact") || "Contact" },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300 ease-in-out",
          scrolled
            ? "bg-[#050505]/95 backdrop-blur-md border-b border-[rgba(237,232,224,0.12)] shadow-[0_12px_32px_rgba(0,0,0,0.85)]"
            : "bg-[#050505]/85 backdrop-blur-sm border-b border-[rgba(237,232,224,0.08)]"
        )}
      >
        <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[76px] flex items-center justify-between safe-top">
          {/* Brand Logo (Left) */}
          <div className="flex items-center shrink-0 z-10">
            <Link href="/" className="flex items-center gap-3 group" aria-label={t("brand.name") || "DiaryLex"}>
              <Logo size="sm" variant="full" inverted />
            </Link>
          </div>

          {/* Desktop Navigation Links (Dead-center of the entire screen & container) */}
          <nav
            className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 absolute left-1/2 -translate-x-1/2 pointer-events-auto"
            aria-label={t("common.mainNavigation") || "Main Navigation"}
          >
            {/* Features Dropdown Menu */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setFeaturesOpen((prev) => !prev)}
                aria-expanded={featuresOpen}
                className={cn(
                  "relative inline-flex items-center justify-center h-9 px-3.5 text-[11.5px] uppercase tracking-[0.08em] transition-colors duration-200 select-none whitespace-nowrap gap-1.5 rounded-lg",
                  isFeatureActive || featuresOpen
                    ? "text-[#EDE8E0] font-semibold bg-white/[0.04]"
                    : "text-[#C8C2B8] font-medium hover:text-[#EDE8E0] hover:bg-white/[0.04]"
                )}
              >
                <span>Features</span>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200 opacity-70",
                    featuresOpen && "rotate-180 text-amber-400 opacity-100"
                  )}
                />
                {isFeatureActive && (
                  <span
                    className="absolute bottom-0 inset-x-3.5 h-[1.5px] bg-[#EDE8E0] shadow-[0_0_8px_rgba(237,232,224,0.6)]"
                    aria-hidden="true"
                  />
                )}
              </button>

              {/* Dropdown Card (Centered beneath Features trigger) */}
              {featuresOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[400px] pt-2 z-50 animate-fade-in-down">
                  <div className="rounded-2xl border border-white/10 bg-[#0A0E18]/95 backdrop-blur-xl p-3 shadow-2xl space-y-1">
                    <div className="px-3 py-1.5 border-b border-white/[0.06] flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        Chamber Operations
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">Core Capabilities</span>
                    </div>

                    <div className="pt-1 space-y-0.5">
                      {FEATURE_DROPDOWN_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-start gap-3 p-2.5 rounded-xl transition-all duration-150 group",
                              active
                                ? "bg-amber-400/10 border border-amber-400/20"
                                : "hover:bg-white/[0.05] border border-transparent"
                            )}
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/[0.05] text-amber-400 border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 group-hover:border-amber-400/40 transition-all">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-white group-hover:text-amber-300 transition-colors">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-zinc-400 leading-snug line-clamp-1">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-white/[0.06]">
                      <Link
                        href="/features/"
                        className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] flex items-center justify-between text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>All Platform Features &amp; Comparison</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Standard Nav Items with Identical Height & Baseline */}
            {MAIN_NAV.map((n) => {
              const active = pathname === n.href || (n.href !== "/" && pathname?.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "relative inline-flex items-center justify-center h-9 px-3.5 text-[11.5px] uppercase tracking-[0.08em] transition-colors duration-200 select-none whitespace-nowrap rounded-lg",
                    active
                      ? "text-[#EDE8E0] font-semibold bg-white/[0.04]"
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
          <div className="hidden lg:flex items-center gap-2.5 shrink-0 z-10">
            {user ? (
              <Link
                href="/dashboard/"
                className="btn-secondary min-h-[42px] h-10 px-4 text-xs font-semibold whitespace-nowrap inline-flex items-center gap-2 rounded-xl btn-tactile"
              >
                {t("marketing.goToDashboard") || "Go to Dashboard"}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/sign-in/"
                  className="inline-flex items-center justify-center min-h-[42px] h-10 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#EDE8E0] border border-[rgba(237,232,224,0.22)] hover:border-[#EDE8E0] hover:text-white rounded-xl transition-all duration-200 btn-tactile whitespace-nowrap"
                >
                  {t("marketing.signIn") || "Sign In"}
                </Link>
                <Link
                  href="/register/"
                  className="inline-flex items-center justify-center gap-1.5 min-h-[42px] h-10 px-5 text-xs font-bold uppercase tracking-[0.08em] bg-[#EDE8E0] text-[#050505] hover:bg-white rounded-xl transition-all duration-200 shadow-xs btn-tactile btn-sheen whitespace-nowrap"
                >
                  {t("marketing.signUp") || "Sign Up"}
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile & Tablet controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-[rgba(237,232,224,0.18)] text-[#EDE8E0] transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none"
              onClick={() => setOpen(true)}
              aria-label={t("marketing.menu") || "Menu"}
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
            aria-label={t("marketing.close") || "Close"}
            tabIndex={-1}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("marketing.menu") || "Menu"}
            className="drawer-panel absolute inset-y-0 end-0 z-50 flex w-[88%] max-w-sm flex-col border-s border-[rgba(237,232,224,0.12)] bg-[#050505] p-6 shadow-2xl overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <Logo size="sm" variant="full" inverted />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-[#9A958C] hover:text-[#EDE8E0] hover:bg-white/10 transition-colors"
                aria-label={t("marketing.close") || "Close"}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Mobile Nav Groups */}
            <div className="mt-6 space-y-6">
              {/* Core Features */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-3">
                  Practice Features
                </span>
                <nav className="flex flex-col gap-0.5">
                  {FEATURE_DROPDOWN_ITEMS.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "px-3 py-2.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-between",
                          active
                            ? "text-amber-300 bg-white/[0.06]"
                            : "text-[#EDE8E0] hover:bg-white/[0.04]"
                        )}
                      >
                        <span>{item.title}</span>
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
                      </Link>
                    );
                  })}
                  <Link
                    href="/features/"
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <span>All Features Overview &rarr;</span>
                  </Link>
                </nav>
              </div>

              {/* Main Links */}
              <div className="space-y-1.5 pt-4 border-t border-white/[0.06]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3">
                  Chamber &amp; Support
                </span>
                <nav className="flex flex-col gap-0.5">
                  {MAIN_NAV.map((n) => {
                    const active = pathname === n.href || (n.href !== "/" && pathname?.startsWith(n.href));
                    return (
                      <Link
                        key={n.href}
                        href={n.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] rounded-lg transition-colors flex items-center justify-between",
                          active
                            ? "text-[#EDE8E0] bg-white/[0.06]"
                            : "text-[#9A958C] hover:text-[#EDE8E0] hover:bg-white/[0.04]"
                        )}
                      >
                        <span>{n.label}</span>
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-[#EDE8E0]" />}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Mobile Actions Bottom */}
            <div className="mt-auto pt-6 border-t border-[rgba(237,232,224,0.12)] space-y-3">
              {user ? (
                <Link
                  href="/dashboard/"
                  onClick={() => setOpen(false)}
                  className="btn-secondary w-full text-center py-3 text-xs"
                >
                  {t("marketing.goToDashboard") || "Go to Dashboard"}
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/sign-in/"
                    onClick={() => setOpen(false)}
                    className="btn-secondary w-full text-center py-3 text-xs"
                  >
                    {t("marketing.signIn") || "Sign In"}
                  </Link>
                  <Link
                    href="/register/"
                    onClick={() => setOpen(false)}
                    className="btn-primary w-full text-center flex items-center justify-center gap-2 py-3 text-xs"
                  >
                    {t("marketing.signUp") || "Sign Up"}
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
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
