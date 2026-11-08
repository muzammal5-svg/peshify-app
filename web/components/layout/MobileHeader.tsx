"use client";

import Link               from "next/link";
import Image              from "next/image";
import { useState }       from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Bell, Menu, X, ChevronRight, ShieldCheck, LogOut, Phone } from "lucide-react";
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

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard: Menu, Calendar: Menu, Briefcase: Menu, Users: Menu,
  FolderOpen: Menu, Bell: Menu, CheckSquare: Menu, BellRing: Menu,
  Settings: Menu, List: Menu, FileText: Menu, BookOpen: Menu,
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
      {/* Mobile navigation drawer */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-45 bg-black/95"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="fixed inset-y-0 start-0 z-50 w-[80%] max-w-xs bg-card border-e border-border flex flex-col text-foreground shadow-2xl"
            aria-label={t("common.mainNavigation")}
          >
            {/* Drawer header */}
            <div className="px-5 py-5 border-b border-border flex items-center gap-3">
              {profile?.photo_url ? (
                <Image src={profile.photo_url} alt={profile.full_name} width={36} height={36}
                  className="rounded-full object-cover flex-shrink-0 border border-border" unoptimized />
              ) : firm?.logo_url ? (
                <Image src={firm.logo_url} alt={firm.name} width={36} height={36}
                  className="rounded-lg object-contain flex-shrink-0" unoptimized />
              ) : (
                <Logo size="xs" variant="mark" />
              )}
              <div className="min-w-0">
                <p className="text-foreground text-sm font-semibold tracking-tight truncate leading-tight">
                  {firm?.name ?? "Peshify"}
                </p>
                <p className="text-muted-foreground text-[10px] uppercase tracking-wider truncate">{t("nav.dashboard")}</p>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="ms-auto w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main nav */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
              {mainItems.map(item => {
                const Icon = ICON_MAP[item.icon] || Menu;
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150",
                      isActive
                        ? "bg-primary/10 text-primary border-s-2 border-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("w-4.5 h-4.5 flex-shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    <span className="flex-1 truncate">{t(`nav.${item.key}`)}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50 flex-shrink-0 rtl:rotate-180" />}
                  </Link>
                );
              })}

              <div className="pt-3 pb-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-1">
                  {t("nav.more")}
                </p>
              </div>
              {moreItems.map(item => {
                const Icon = ICON_MAP[item.icon] || Menu;
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150",
                      isActive
                        ? "bg-primary/10 text-primary border-s-2 border-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("w-4.5 h-4.5 flex-shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    <span className="flex-1 truncate">{t(`nav.${item.key}`)}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50 flex-shrink-0 rtl:rotate-180" />}
                  </Link>
                );
              })}

              {profile?.role === "super_admin" && (
                <div className="pt-2">
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                  >
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="flex-1 truncate">Admin Control</span>
                  </Link>
                </div>
              )}
            </nav>

            {/* Theme switcher */}
            <div className="px-3 pb-2">
              <ThemeCustomizer className="w-full" align="left" dropup />
            </div>

            {/* Language switcher */}
            <div className="px-3 pb-2">
              <LangSwitcher compact className="w-full" />
            </div>

            {/* User footer */}
            <div className="px-3 pb-4 border-t border-border pt-3 space-y-1">
              {profile && (
                <Link href="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors group"
                >
                  {profile.photo_url ? (
                    <Image src={profile.photo_url} alt={profile.full_name}
                      width={32} height={32}
                      className="w-8 h-8 rounded-full object-cover border border-border flex-shrink-0"
                      unoptimized />
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
              <div className="px-3 pt-3 space-y-2">
                <a
                  href={phoneLink()}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{SITE.phone}</span>
                </a>
              </div>
              <button
                onClick={() => { setMenuOpen(false); signOut(); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t("auth.signOut")}
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Mobile header bar */}
      <header
        className={cn(
          "md:hidden sticky top-0 z-20 bg-card/90 backdrop-blur-xl border-b border-border shadow-xs",
          "flex items-center gap-2 px-4 text-foreground",
          className
        )}
        style={{ minHeight: 56, paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        {/* Left: burger menu */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label={t("common.mainNavigation")}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Centre: logo / back */}
        <div className="flex items-center min-w-[40px] flex-1">
          {showBack ? (
            <button
              onClick={() => router.back()}
              aria-label={t("common.back")}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors -ms-1 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
          ) : firm?.logo_url ? (
            <Image
              src={firm.logo_url}
              alt={firm.name}
              width={32} height={32}
              className="rounded-md object-contain"
              unoptimized
            />
          ) : (
            <Logo size="xs" variant="mark" />
          )}
          </div>

        {/* Centre: title or firm name */}
        <div className="flex-1 min-w-0 text-center">
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

        {/* Right: theme switcher, custom actions OR notification bell */}
        <div className="flex items-center gap-1.5 min-w-[40px] justify-end">
          <ThemeCustomizer compact align="right" />
          {actions ?? (
            <Link
              href="/notifications"
              aria-label={`${t("nav.notifications")}${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1 end-1 min-w-[16px] h-4 px-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center leading-none"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* Profile avatar */}
          <Link
            href="/profile"
            aria-label={t("profile.title")}
            className="w-9 h-9 rounded-full overflow-hidden border border-border hover:border-primary transition-colors flex-shrink-0"
          >
            {profile?.photo_url ? (
              <Image
                src={profile.photo_url}
                alt={profile.full_name}
                width={36} height={36}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                <span className="text-primary text-sm font-bold leading-none">
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
