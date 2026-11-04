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
  Phone, ChevronLeft, Sparkles,
} from "lucide-react";
import { Logo }           from "@/components/shared/Logo";
import { LangSwitcher }   from "@/components/shared/LangSwitcher";
import { RoleBadge }      from "@/components/ui/Badge";
import { useAuth }        from "@/providers/AuthProvider";
import { SITE, phoneLink } from "@/lib/siteConfig";
import { cn }             from "@/lib/utils";
import { SIDEBAR_NAV }    from "./navItems";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Calendar, Briefcase, Users,
  FolderOpen, Bell, CheckSquare, BellRing, Settings, List, FileText, BookOpen, Sparkles,
};

export function Sidebar() {
  const { t }                             = useTranslation();
  const pathname                          = usePathname();
  const { profile, firm, unreadCount, reminderCount, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) setIsCollapsed(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, mounted]);

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
          "group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative whitespace-nowrap",
          isActive
            ? "bg-indigo-500/10 text-indigo-400 border-s-2 border-indigo-500 shadow-[inset_0_0_15px_rgba(99,102,241,0.08)] font-medium"
            : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100"
        )}
      >
        {Icon && (
          <span className="relative flex-shrink-0">
            <Icon className={cn(
              "w-5 h-5 transition-colors duration-200",
              isActive ? "text-indigo-400" : "text-zinc-400 group-hover:text-zinc-100"
            )} />
            {badge > 0 && (
              <span aria-hidden="true" className="absolute -top-1.5 -end-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </span>
        )}
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate text-xs font-medium">{t(`nav.${item.key}`)}</span>
            {badge > 0 && (
              <span className="text-[9px] font-bold bg-rose-500 text-white rounded-full px-1.5 py-0.5 leading-none flex-shrink-0">
                {badge > 99 ? "99+" : badge}
              </span>
            )}
            {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60 flex-shrink-0 rtl:rotate-180" />}
          </>
        )}
      </Link>
    );
  }

  if (!mounted) return null;

  return (
    <aside className={cn(
      "hidden md:flex flex-col h-screen bg-[#0A0C12] fixed start-0 top-0 z-30",
      "border-e border-white/[0.08] transition-all duration-300 overflow-hidden",
      isCollapsed ? "w-[80px]" : "w-[280px]"
    )}>
      {/* Logo / firm header - Fixed height, flex-shrink-0 */}
      <div className={cn(
        "px-4 py-5 border-b border-white/[0.08] flex items-center gap-3 transition-all duration-300 flex-shrink-0",
        isCollapsed ? "justify-center" : ""
      )}>
        {profile?.photo_url ? (
          <Image src={profile.photo_url} alt={profile.full_name} width={40} height={40}
            className="rounded-full object-cover flex-shrink-0 border border-white/10 w-10 h-10" unoptimized />
        ) : firm?.logo_url ? (
          <Image src={firm.logo_url} alt={firm.name} width={40} height={40}
            className="rounded-lg object-contain flex-shrink-0 w-10 h-10" unoptimized />
        ) : (
          <Logo size="sm" variant="mark" />
        )}
        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-zinc-50 text-xs font-semibold tracking-tight truncate leading-tight">
              {firm?.name ?? "MZM"}
            </p>
            <p className="text-zinc-500 text-[9px] uppercase tracking-wider truncate">{t("nav.dashboard")}</p>
          </div>
        )}
      </div>

      {/* Search box (expanded only) */}
      {!isCollapsed && (
        <div className="px-3 py-3 border-b border-white/[0.08] flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder={t("common.search") || "Search..."}
              className="w-full ps-3 pe-9 py-2 bg-[#161922] border border-white/[0.08] rounded-lg text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all"
            />
            <svg className="absolute end-3 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}

      {/* Main nav - Scrollable */}
      <nav className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300",
        isCollapsed ? "px-2 py-4 space-y-1" : "px-3 py-4 space-y-0.5"
      )} aria-label={t("common.mainNavigation")}>
        {/* MAIN section label */}
        {!isCollapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-3 mb-2.5">
            {t("nav.main")}
          </p>
        )}
        {mainItems.map(item => <NavLink key={item.href} item={item} />)}

        {/* MORE section */}
        {!isCollapsed && mainItems.length > 0 && (
          <>
            <div className="pt-3 pb-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-3">
                {t("nav.more")}
              </p>
            </div>
          </>
        )}
        {moreItems.map(item => <NavLink key={item.href} item={item} />)}

        {/* Admin section */}
        {profile?.role === "super_admin" && (
          <>
            {!isCollapsed && (
              <div className="pt-3 pb-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-3">
                  Admin
                </p>
              </div>
            )}
            <Link
              href="/admin"
              title={isCollapsed ? "Admin Control" : undefined}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap",
                "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20"
              )}
            >
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate text-xs font-semibold">{t("nav.admin") || "Admin"}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 flex-shrink-0 rtl:rotate-180" />
                </>
              )}
            </Link>
          </>
        )}
      </nav>

      {/* Collapse toggle & theme (expanded view) */}
      {!isCollapsed && (
        <div className="px-3 pb-3 border-t border-white/[0.08] pt-3 flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsCollapsed(true)}
            title="Collapse sidebar"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100 transition-all"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            {t("common.collapse") || "Collapse"}
          </button>
        </div>
      )}

      {/* Collapse toggle (collapsed view - icon only) */}
      {isCollapsed && (
        <div className="px-2 pb-3 border-t border-white/[0.08] pt-3 flex-shrink-0">
          <button
            onClick={() => setIsCollapsed(false)}
            title="Expand sidebar"
            className="w-full flex items-center justify-center p-2.5 rounded-lg text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100 transition-all"
          >
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>
      )}

      {/* Language switcher (expanded only) */}
      {!isCollapsed && (
        <div className="px-3 pb-2 flex-shrink-0">
          <LangSwitcher compact className="w-full text-xs" />
        </div>
      )}

      {/* User footer */}
      <div className={cn(
        "px-3 pb-4 border-t border-white/[0.08] pt-3 space-y-2 transition-all duration-300 flex-shrink-0",
        isCollapsed ? "flex flex-col items-center gap-2" : ""
      )}>
        {profile && (
          <Link href="/profile"
            title={isCollapsed ? profile.full_name : undefined}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-all group text-xs whitespace-nowrap",
              isCollapsed ? "justify-center" : ""
            )}
          >
            {profile.photo_url ? (
              <Image src={profile.photo_url} alt={profile.full_name}
                width={32} height={32}
                className="w-8 h-8 rounded-full object-cover border border-white/20 flex-shrink-0"
                unoptimized
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-400 text-xs font-bold leading-none">
                  {profile.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-zinc-200 text-xs font-medium truncate leading-tight group-hover:text-indigo-400 transition-colors">
                  {profile.full_name}
                </p>
                <RoleBadge role={profile.role} />
              </div>
            )}
          </Link>
        )}

        {!isCollapsed && (
          <>
            <a
              href={phoneLink()}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.08] text-xs font-medium text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100 hover:border-white/[0.15] transition-all whitespace-nowrap"
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{SITE.phone}</span>
            </a>

            <button
              onClick={signOut}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100 transition-all"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{t("auth.signOut")}</span>
            </button>
          </>
        )}

        {isCollapsed && (
          <button
            onClick={signOut}
            title={t("auth.signOut")}
            className="w-full flex items-center justify-center p-2.5 rounded-lg text-zinc-400 hover:bg-white/[0.04] hover:text-rose-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
}
