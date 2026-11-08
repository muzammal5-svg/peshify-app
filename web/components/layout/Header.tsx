"use client";

import { type ReactNode } from "react";
import { useRouter }      from "next/navigation";
import { ArrowLeft, Bell } from "lucide-react";
import Link   from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  /** Page title shown in centre on mobile */
  title?:      string;
  /** Show back button (mobile) */
  showBack?:   boolean;
  /** Extra actions rendered on right side */
  actions?:    ReactNode;
  className?:  string;
}

/**
 * Mobile top header. Hidden on md+ (Sidebar handles branding on desktop).
 */
export function Header({ title, showBack = false, actions, className }: HeaderProps) {
  const router = useRouter();
  const { t }  = useTranslation();

  return (
    <header
      className={cn(
        "md:hidden sticky top-0 z-20 bg-card/90 backdrop-blur-xl border-b border-border",
        "flex items-center justify-between px-4 gap-2 text-foreground",
        className
      )}
      style={{
        minHeight: "56px",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      {/* Left: back button or logo */}
      <div className="flex items-center min-w-[44px]">
        {showBack ? (
          <button
            onClick={() => router.back()}
            aria-label={t("common.back")}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors -ms-2"
          >
            <ArrowLeft className="w-5 h-5 text-foreground rtl:rotate-180" />
          </button>
        ) : (
          <Logo size="xs" variant="mark" />
        )}
      </div>

      {/* Centre: title */}
      {title && (
        <span className="absolute start-1/2 -translate-x-1/2 text-sm font-semibold text-foreground truncate max-w-[45vw]">
          {title}
        </span>
      )}

      {/* Right: custom actions or bell */}
      <div className="flex items-center gap-1 min-w-[44px] justify-end">
        {actions ?? (
          <Link
            href="/reminders"
            aria-label={t("nav.reminders")}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
          >
            <Bell className="w-5 h-5 text-foreground" />
          </Link>
        )}
      </div>
    </header>
  );
}

// ─── Desktop page header (inside main content area) ──────────────────────────

interface PageHeaderProps {
  title:      string;
  subtitle?:  string;
  actions?:   ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}
