"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Search,
  Sparkles,
  MessageSquarePlus,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { LangSwitcher } from "@/components/shared/LangSwitcher";
import { ThemeCustomizer } from "@/components/shared/ThemeCustomizer";
import { FeedbackModal } from "@/components/shared/FeedbackModal";
import { WhatsNewModal } from "@/components/shared/WhatsNewModal";
import { cn } from "@/lib/utils";

interface DesktopTopBarProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

/**
 * Desktop-only top bar with dynamic theme support, feedback and what's new changelog.
 */
export function DesktopTopBar({ title, subtitle, actions }: DesktopTopBarProps) {
  const { t } = useTranslation();
  const { profile, firm, unreadCount, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on Escape key
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <>
      <div className="hidden md:block sticky top-0 z-30 mb-6 transition-all duration-300">
        {/* Top bar with breadcrumb, search, and user menu */}
        <div className="bg-card/85 backdrop-blur-xl border border-border/80 shadow-xs rounded-xl">
          <div className="flex items-center justify-between gap-4 px-6 py-3">
            {/* Left: Title and Breadcrumb */}
            <div className="min-w-0">
              {title && (
                <h1 className="text-xl font-bold tracking-tight text-foreground leading-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
              )}
            </div>

            {/* Center: Search bar */}
            <div className="flex-1 max-w-xs mx-4">
              <div
                className={cn(
                  "relative flex items-center px-3.5 py-1.5 bg-secondary border border-border/80 rounded-lg transition-all duration-200",
                  searchFocused
                    ? "border-primary ring-1 ring-primary/40 bg-card shadow-xs"
                    : "hover:border-border-strong"
                )}
              >
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" strokeWidth={1.75} />
                <input
                  type="text"
                  placeholder={t("common.search") || "Search cases, cause lists..."}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="flex-1 ms-2 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Right: Actions and user menu */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              {actions}

              {/* What's new pill */}
              <button
                type="button"
                onClick={() => setWhatsNewOpen(true)}
                title="What's New in v2.1"
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-500 border border-amber-400/20 text-xs font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.75} />
                <span>What&apos;s New</span>
              </button>

              {/* Language switcher */}
              <LangSwitcher compact className="w-20" />

              {/* Theme & Color switcher */}
              <ThemeCustomizer showFullLabel align="right" />

              {/* Notification bell */}
              <Link
                href="/notifications"
                aria-label={`${t("nav.notifications")}${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-secondary hover:bg-muted border border-border/80 hover:border-border-strong transition-all duration-200 group"
              >
                <Bell className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.75} />
                {unreadCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 -end-1 min-w-[18px] h-4.5 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center"
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* User menu */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                  className={cn(
                    "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all duration-200",
                    menuOpen
                      ? "bg-secondary border-primary ring-1 ring-primary/40"
                      : "bg-secondary border-border/80 hover:bg-muted hover:border-border-strong"
                  )}
                >
                  {profile?.photo_url ? (
                    <Image
                      src={profile.photo_url}
                      alt={profile.full_name}
                      width={32}
                      height={32}
                      className="w-6 h-6 rounded-full object-cover border border-border"
                      unoptimized
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                      <span className="text-primary text-xs font-bold">
                        {profile?.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                      </span>
                    </div>
                  )}
                  <span className="text-xs font-medium text-foreground max-w-[120px] truncate hidden lg:block">
                    {profile?.full_name ?? "User"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
                      menuOpen && "rotate-180"
                    )}
                    strokeWidth={1.75}
                  />
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute end-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] z-50 animate-slide-down overflow-hidden text-foreground">
                      {/* User & Firm info banner */}
                      <div className="px-4 py-3 border-b border-border bg-secondary/50">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {profile?.full_name ?? "User"}
                        </p>
                        {firm?.name && (
                          <p className="text-[11px] text-muted-foreground font-medium truncate mt-0.5">
                            {firm.name}
                          </p>
                        )}
                        {profile?.email && (
                          <p className="text-[10px] text-muted-foreground/75 truncate mt-0.5">
                            {profile.email}
                          </p>
                        )}
                      </div>

                      <div className="p-1">
                        <Link
                          href="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
                          <span>{t("profile.title")}</span>
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
                          <span>{t("nav.settings")}</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            setFeedbackOpen(true);
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground rounded-lg transition-colors text-start"
                        >
                          <MessageSquarePlus className="w-4 h-4 text-amber-500" strokeWidth={1.75} />
                          <span>Give Feedback</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            setWhatsNewOpen(true);
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground rounded-lg transition-colors text-start"
                        >
                          <Sparkles className="w-4 h-4 text-amber-500" strokeWidth={1.75} />
                          <span>What&apos;s New</span>
                        </button>
                      </div>

                      <div className="border-t border-border p-1">
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            signOut();
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors font-medium text-start"
                        >
                          <LogOut className="w-4 h-4" strokeWidth={1.75} />
                          <span>{t("auth.signOut")}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <WhatsNewModal open={whatsNewOpen} onClose={() => setWhatsNewOpen(false)} />
    </>
  );
}
