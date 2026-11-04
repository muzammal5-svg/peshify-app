"use client";

import { type ReactNode }  from "react";
import { useState, useEffect } from "react";
import { SubscriptionBanner } from "@/components/shared/SubscriptionBanner";
import { Sidebar }         from "./Sidebar";
import { BottomNav }       from "./BottomNav";
import { MobileHeader }    from "./MobileHeader";
import { DesktopTopBar }   from "./DesktopTopBar";
import { cn }              from "@/lib/utils";

interface AppShellProps {
  children:      ReactNode;
  pageTitle?:    string;
  pageSubtitle?: string;
  showBack?:     boolean;
  headerActions?: ReactNode;
  className?:    string;
  hideTopBar?:   boolean;
}

export function AppShell({
  children,
  pageTitle,
  pageSubtitle,
  showBack,
  headerActions,
  className,
  hideTopBar = false,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setSidebarCollapsed(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleStorageChange = () => {
      const saved = localStorage.getItem("sidebar-collapsed");
      if (saved !== null) {
        setSidebarCollapsed(JSON.parse(saved));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [mounted]);

  const sidebarWidth = sidebarCollapsed ? "md:ms-[80px]" : "md:ms-[280px]";

  return (
    <div className="min-h-dvh bg-[#090A0F] text-zinc-100 relative selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* ── Ambient subtle top background glow ── */}
      <div
        className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(99,102,241,0.08),rgba(9,10,15,0))] z-0"
        aria-hidden="true"
      />

      {/* ── Desktop sidebar (fixed, left) ── */}
      <Sidebar />

      {/* ── Mobile header (sticky, top) ── */}
      <MobileHeader
        title={showBack ? pageTitle : undefined}
        showBack={showBack}
        actions={headerActions}
      />

      {/* ── Main content ── */}
      <main
        className={cn(
          "min-h-dvh transition-all duration-300",
          sidebarWidth,
          // Mobile: pad bottom for nav bar + safe area
          "pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-0",
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-8">
          {/* Desktop page header */}
          {!hideTopBar && (
            <DesktopTopBar
              title={pageTitle}
              subtitle={pageSubtitle}
              actions={headerActions}
            />
          )}
          <SubscriptionBanner />
          <div className="animate-slide-down">
            {children}
          </div>
        </div>
      </main>

      {/* ── Mobile bottom nav ── */}
      <BottomNav />
    </div>
  );
}

