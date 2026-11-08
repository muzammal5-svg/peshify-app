"use client";

import Link               from "next/link";
import Image              from "next/image";
import { usePathname }    from "next/navigation";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Calendar, Briefcase, Users,
  FolderOpen, Bell, CheckSquare, BellRing,
  Settings, LogOut, ChevronRight, List, ShieldCheck, FileText, BookOpen,
  Phone, PanelLeftClose, PanelLeft, Sparkles,
} from "lucide-react";
import { Logo }           from "@/components/shared/Logo";
import { LangSwitcher }   from "@/components/shared/LangSwitcher";
import { ThemeCustomizer } from "@/components/shared/ThemeCustomizer";
import { RoleBadge }      from "@/components/ui/Badge";
import { useAuth }        from "@/providers/AuthProvider";
import { SITE, phoneLink } from "@/lib/siteConfig";
import { cn }             from "@/lib/utils";
import { SIDEBAR_NAV }    from "./navItems";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Calendar, Briefcase, Users,
  FolderOpen, Bell, CheckSquare, BellRing, Settings, List, FileText, BookOpen, Sparkles,
};

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isCollapsed: controlledCollapsed, onToggleCollapse }: SidebarProps = {}) {
  const { t }                             = useTranslation();
  const pathname                          = usePathname();
  const { profile, firm, unreadCount, reminderCount, signOut } = useAuth();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (controlledCollapsed === undefined) {
      const saved = localStorage.getItem("sidebar-collapsed");
      if (saved !== null) {
        try { setInternalCollapsed(JSON.parse(saved)); } catch {}
      }
    }
  }, [controlledCollapsed]);

  useEffect(() => {
    if (mounted && controlledCollapsed === undefined) {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(internalCollapsed));
    }
  }, [internalCollapsed, mounted, controlledCollapsed]);

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse ?? (() => setInternalCollapsed(!internalCollapsed));

  const mainItems = SIDEBAR_NAV.filter(i => i.sidebarSection === "main");
  const moreItems = SIDEBAR_NAV.filter(i => i.sidebarSection === "more");

  function NavLink({ item }: { item: typeof SIDEBAR_NAV[0] }) {
    const Icon = ICON_MAP[item.icon];
    const isActive =
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
    const badge =
      item.key === "notifications" ? unreadCount :
      item.key === "reminders"     ? reminderCount : 0;

    return (
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        title={isCollapsed ? t(`nav.${item.key}`) : undefined}
        className={cn(
          "group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 relative select-none",
          isActive
            ? "bg-primary/12 text-primary font-semibold shadow-xs"
            : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground font-medium"
        )}
      >
        {Icon && (
          <span className="relative flex-shrink-0 flex items-center justify-center">
            <Icon className={cn(
              "w-4 h-4 transition-colors duration-150",
              isActive ? "text-primary stroke-[2.25]" : "text-muted-foreground group-hover:text-foreground stroke-[1.75]"
            )} />
            {badge > 0 && isCollapsed && (
              <span aria-hidden="true" className="absolute -top-1 -end-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-2 ring-card" />
            )}
          </span>
        )}
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate text-xs">{t(`nav.${item.key}`)}</span>
            {badge > 0 && (
              <span className="text-[10px] font-bold bg-rose-500/15 text-rose-500 border border-rose-500/25 rounded-full px-1.5 py-0.2 leading-tight flex-shrink-0">
                {badge > 99 ? "99+" : badge}
              </span>
            )}
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            )}
          </>
        )}
      </Link>
    );
  }

  if (!mounted) return null;

  return (
    <aside className={cn(
      "hidden md:flex flex-col h-screen bg-card/95 text-foreground fixed start-0 top-0 z-30",
      "border-e border-border/80 transition-all duration-300",
      isCollapsed ? "w-[72px]" : "w-[256px]"
    )}>
      {/* ── Top Header: Brand & Collapse Toggle ── */}
      <div className={cn(
        "h-16 px-4 border-b border-border/80 flex items-center justify-between gap-2.5 transition-all duration-300 flex-shrink-0",
        isCollapsed ? "justify-center px-2" : ""
      )}>
        <Link href="/" className="flex items-center gap-3 min-w-0 group">
          {profile?.photo_url ? (
            <Image
              src={profile.photo_url}
              alt={profile.full_name}
              width={34}
              height={34}
              className="rounded-full object-cover flex-shrink-0 border border-border/80 w-8.5 h-8.5"
              unoptimized
            />
          ) : firm?.logo_url ? (
            <Image
              src={firm.logo_url}
              alt={firm.name}
              width={34}
              height={34}
              className="rounded-lg object-contain flex-shrink-0 w-8.5 h-8.5"
              unoptimized
            />
          ) : (
            <Logo size="sm" variant="mark" />
          )}
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-xs font-bold tracking-tight truncate leading-tight group-hover:text-primary transition-colors">
                {firm?.name ?? "Peshify Advocates"}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium truncate mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {profile?.role === "super_admin" ? "Platform Admin" : "Active Practice"}
              </span>
            </div>
          )}
        </Link>

        {/* Collapse button (expanded view) */}
        {!isCollapsed && (
          <button
            onClick={toggleCollapse}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent hover:border-border/80 transition-all flex-shrink-0"
          >
            <PanelLeftClose className="w-4 h-4 rtl:rotate-180" />
          </button>
        )}
      </div>

      {/* Expand button (collapsed view) */}
      {isCollapsed && (
        <div className="pt-2 px-2 flex justify-center flex-shrink-0">
          <button
            onClick={toggleCollapse}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/60 hover:border-border transition-all"
          >
            <PanelLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      )}

      {/* ── Main Nav - Scrollable ── */}
      <nav className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 py-3",
        isCollapsed ? "px-2 space-y-1.5" : "px-3 space-y-0.5"
      )} aria-label={t("common.mainNavigation")}>
        {/* MAIN section label */}
        {!isCollapsed && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-2.5 mb-1.5">
            {t("nav.main")}
          </p>
        )}
        {mainItems.map(item => <NavLink key={item.href} item={item} />)}

        {/* MORE section */}
        {!isCollapsed && moreItems.length > 0 && (
          <div className="pt-3 pb-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-2.5 mb-1.5">
              {t("nav.more")}
            </p>
          </div>
        )}
        {moreItems.map(item => <NavLink key={item.href} item={item} />)}

        {/* Admin section */}
        {profile?.role === "super_admin" && (
          <>
            {!isCollapsed && (
              <div className="pt-3 pb-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-2.5 mb-1.5">
                  Admin
                </p>
              </div>
            )}
            <Link
              href="/admin"
              title={isCollapsed ? "Admin Control" : undefined}
              className={cn(
                "group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap text-xs",
                "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/25 font-semibold"
              )}
            >
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate">{t("nav.admin") || "Admin"}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 flex-shrink-0 rtl:rotate-180" />
                </>
              )}
            </Link>
          </>
        )}
      </nav>

      {/* ── Preferences Utility Row (Theme & Language) ── */}
      {!isCollapsed ? (
        <div className="px-3 pt-2 pb-1.5 border-t border-border/80 flex items-center gap-2 flex-shrink-0">
          <ThemeCustomizer dropup align="left" className="flex-1 min-w-0" />
          <LangSwitcher compact className="flex-shrink-0" />
        </div>
      ) : (
        <div className="px-2 pt-2 pb-1.5 border-t border-border/80 flex flex-col items-center gap-1.5 flex-shrink-0">
          <ThemeCustomizer compact dropup align="left" />
          <LangSwitcher singleToggle className="flex-shrink-0" />
        </div>
      )}

      {/* ── User Footer Card (Profile + Support + Sign Out) ── */}
      <div className={cn(
        "px-3 pb-3 pt-1 flex-shrink-0",
        isCollapsed ? "px-2" : ""
      )}>
        <div className={cn(
          "p-1.5 rounded-xl bg-secondary/40 hover:bg-secondary/70 border border-border/70 transition-all",
          isCollapsed ? "p-1 bg-transparent border-0" : ""
        )}>
          <div className={cn(
            "flex items-center gap-2.5",
            isCollapsed ? "justify-center" : ""
          )}>
            {/* User avatar linking to /profile */}
            <Link
              href="/profile"
              title={profile ? profile.full_name : "Profile"}
              className="relative flex-shrink-0 group"
            >
              {profile?.photo_url ? (
                <Image
                  src={profile.photo_url}
                  alt={profile.full_name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover border border-border/80 flex-shrink-0"
                  unoptimized
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 text-primary text-xs font-bold">
                  {profile?.full_name?.charAt(0).toUpperCase() ?? "U"}
                </div>
              )}
              <span className="absolute -bottom-0.5 -end-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-card" />
            </Link>

            {/* User details */}
            {!isCollapsed && (
              <Link href="/profile" className="min-w-0 flex-1 group">
                <p className="text-foreground text-xs font-semibold truncate leading-tight group-hover:text-primary transition-colors">
                  {profile?.full_name ?? "User"}
                </p>
                <span className="text-[10px] text-muted-foreground truncate block capitalize mt-0.5">
                  {profile?.role ? profile.role.replace("_", " ") : "Advocate"}
                </span>
              </Link>
            )}

            {/* Quick Actions (Support Phone + Sign Out) */}
            {!isCollapsed && (
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <a
                  href={phoneLink()}
                  title={`${SITE.phone} (${t("common.support") || "Support"})`}
                  aria-label="Call support"
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-card border border-transparent hover:border-border/80 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={signOut}
                  title={t("auth.signOut") || "Sign Out"}
                  aria-label="Sign out"
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Collapsed Sign Out button */}
        {isCollapsed && (
          <button
            onClick={signOut}
            title={t("auth.signOut") || "Sign Out"}
            className="mt-1.5 w-8 h-8 mx-auto flex items-center justify-center rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
          >
            <LogOut className="w-4 h-4 rtl:rotate-180" />
          </button>
        )}
      </div>
    </aside>
  );
}
