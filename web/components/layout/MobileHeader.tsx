"use client";

import Link               from "next/link";
import Image              from "next/image";
import { useState }       from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, Bell, Menu, X, ChevronRight, ShieldCheck, LogOut, Phone,
  LayoutDashboard, Calendar, Briefcase, Users, FolderOpen, CheckSquare, BellRing, Settings, List, FileText, BookOpen, Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useRouter }      from "next/navigation";
import { usePathname }    from "next/navigation";
import { useAuth }        from "@/providers/AuthProvider";
import { Logo }           from "@/components/shared/Logo";
import { RoleBadge }      from "@/components/ui/Badge";
import { LangSwitcher }   from "@/components/shared/LangSwitcher";
import { ThemeCustomizer } from "@/components/shared/ThemeCustomizer";
import { cn }             from "@/lib/utils";
import { SITE, phoneLink } from "@/lib/siteConfig";
import { SIDEBAR_NAV }    from "./navItems";

const ICON_MAP: Record<string, LucideIcon | React.ComponentType<any>> = {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Users,
  FolderOpen,
  Bell,
  CheckSquare,
  BellRing,
  Settings,
  List,
  FileText,
  BookOpen,
  Sparkles,
};

interface MobileHeaderProps {
  title?:     string;
  showBack?:  boolean;
  actions?:   React.ReactNode;
  className?: string;
}

export function MobileHeader({ title, showBack, actions, className }: MobileHeaderProps) {
  const { t }                           = useTranslation();
  const { profile, firm, unreadCount, signOut } = useAuth();
  const router                          = useRouter();
  const pathname                        = usePathname();
  const [menuOpen, setMenuOpen]         = useState(false);

  const mainItems = SIDEBAR_NAV.filter(i => i.sidebarSection === "main");
  const moreItems = SIDEBAR_NAV.filter(i => i.sidebarSection === "more");

  return (
    <>
      {/* Mobile navigation slide-over drawer */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="fixed inset-y-0 start-0 z-50 w-[84%] max-w-xs bg-card border-e border-border/80 flex flex-col text-foreground shadow-2xl animate-drawer-in"
            aria-label={t("common.mainNavigation")}
          >
            {/* Drawer header */}
            <div className="px-5 py-4 border-b border-border/80 flex items-center gap-3">
              {profile?.photo_url ? (
                <Image
                  src={profile.photo_url}
                  alt={profile.full_name}
                  width={38}
                  height={38}
                  className="rounded-full object-cover flex-shrink-0 border border-border"
                  unoptimized
                />
              ) : firm?.logo_url ? (
                <Image
                  src={firm.logo_url}
                  alt={firm.name}
                  width={38}
                  height={38}
                  className="rounded-lg object-contain flex-shrink-0"
                  unoptimized
                />
              ) : (
                <Logo size="xs" variant="mark" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-semibold tracking-tight truncate leading-tight">
                  {firm?.name ?? "Peshify"}
                </p>
                <p className="text-muted-foreground text-[10px] uppercase tracking-wider truncate">
                  {t("nav.dashboard")}
                </p>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            {/* Navigation items */}
            <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Main
              </div>
              {mainItems.map((item) => {
                const Icon = ICON_MAP[item.icon] || LayoutDashboard;
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 min-h-[44px]",
                      isActive
                        ? "bg-primary/10 text-primary border-s-2 border-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}
                      strokeWidth={1.75}
                    />
                    <span className="flex-1 truncate">{t(`nav.${item.key}`)}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" strokeWidth={1.75} />
                  </Link>
                );
              })}

              <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                More
              </div>
              {moreItems.map((item) => {
                const Icon = ICON_MAP[item.icon] || LayoutDashboard;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 min-h-[44px]",
                      isActive
                        ? "bg-primary/10 text-primary border-s-2 border-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}
                      strokeWidth={1.75}
                    />
                    <span className="flex-1 truncate">{t(`nav.${item.key}`)}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" strokeWidth={1.75} />
                  </Link>
                );
              })}

              {profile?.role === "super_admin" && (
                <div className="pt-2">
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 min-h-[44px]"
                  >
                    <ShieldCheck className="w-5 h-5 text-primary" strokeWidth={1.75} />
                    <span className="flex-1 truncate">Admin Control</span>
                  </Link>
                </div>
              )}
            </nav>

            {/* Language & theme quick settings */}
            <div className="px-3 py-2 border-t border-border/80 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <LangSwitcher compact className="flex-1" />
                <ThemeCustomizer align="left" dropup />
              </div>
            </div>

            {/* User footer */}
            <div className="px-3 pb-4 pt-2 border-t border-border/80 space-y-1">
              {profile && (
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors group min-h-[44px]"
                >
                  {profile.photo_url ? (
                    <Image
                      src={profile.photo_url}
                      alt={profile.full_name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border border-border flex-shrink-0"
                      unoptimized
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-sm font-bold leading-none">
                        {profile.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-medium truncate leading-tight group-hover:text-primary transition-colors">
                      {profile.full_name}
                    </p>
                    <RoleBadge role={profile.role} />
                  </div>
                </Link>
              )}
              <a
                href={phoneLink()}
                className="flex items-center gap-3 px-3 py-2 rounded-xl border border-border/80 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors min-h-[44px]"
              >
                <Phone className="w-4 h-4" strokeWidth={1.75} />
                <span>{SITE.phone}</span>
              </a>
              <button
                onClick={() => { setMenuOpen(false); signOut(); }}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors min-h-[44px]"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.75} />
                {t("auth.signOut")}
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Mobile top bar */}
      <header
        className={cn(
          "md:hidden sticky top-0 z-20 bg-card/90 backdrop-blur-xl border-b border-border/80 shadow-xs",
          "flex items-center justify-between gap-2 px-3 text-foreground",
          className
        )}
        style={{ minHeight: 56, paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        {/* Left: Burger or Back Button */}
        <div className="flex items-center min-w-[44px]">
          {showBack ? (
            <button
              onClick={() => router.back()}
              aria-label={t("common.back")}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" strokeWidth={1.75} />
            </button>
          ) : (
            <button
              onClick={() => setMenuOpen(true)}
              aria-label={t("common.mainNavigation")}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" strokeWidth={1.75} />
            </button>
          )}
        </div>

        {/* Center: Brand / Title */}
        <div className="flex-1 min-w-0 text-center px-1">
          {title ? (
            <span className="text-sm font-semibold text-foreground truncate block">{title}</span>
          ) : (
            <div className="flex flex-col items-center leading-tight">
              <span className="text-sm font-semibold tracking-tight text-foreground truncate">
                {firm?.name ?? "Peshify"}
              </span>
              {profile && (
                <span className="text-[10px] text-muted-foreground truncate">
                  {profile.full_name}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions or Notification Bell + Profile */}
        <div className="flex items-center gap-1 min-w-[44px] justify-end">
          {actions ?? (
            <Link
              href="/notifications"
              aria-label={`${t("nav.notifications")}${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
              className="relative w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell className="w-5 h-5" strokeWidth={1.75} />
              {unreadCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-2 end-2 min-w-[16px] h-4 px-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center leading-none"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          )}

          <Link
            href="/profile"
            aria-label={t("profile.title")}
            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full overflow-hidden border border-border/80 hover:border-primary transition-colors flex-shrink-0 ms-1"
          >
            {profile?.photo_url ? (
              <Image
                src={profile.photo_url}
                alt={profile.full_name}
                width={36}
                height={36}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                <span className="text-primary text-xs font-bold leading-none">
                  {profile?.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                </span>
              </div>
            )}
          </Link>
        </div>
      </header>
    </>
  );
}
