"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/layout/AppShell";
import { RouteGuard } from "@/components/shared/RouteGuard";
import { useAuth } from "@/providers/AuthProvider";
import { useStoredSession } from "@/hooks/useStoredSession";
import { Landing } from "@/components/marketing/Landing";
import { ExecutiveDashboard } from "@/components/dashboard/ExecutiveDashboard";

// ── Dashboard Page ──────────────────────────────────────────────────────────
function DashboardPage() {
  const { t } = useTranslation();
  return (
    <AppShell
      pageTitle={t("nav.home") || "Dashboard"}
      pageSubtitle="Chamber Practice & Litigation Overview"
    >
      <ExecutiveDashboard />
    </AppShell>
  );
}

function HomeContent() {
  const { user, loading, configured } = useAuth();
  const stored = useStoredSession();
  const searchParams = useSearchParams();

  // Allow previewing the dashboard with mock chamber data when ?view=dashboard
  if (searchParams?.get("view") === "dashboard") {
    return <DashboardPage />;
  }

  // Session resolved (or impossible) with no user → landing for everyone,
  // including stale/revoked stored tokens.
  const loggedOut = !configured || (!loading && !user);
  if (!stored || loggedOut) return <Landing />;

  // Visitor has a stored session: show a neutral skeleton while the session
  // resolves, then hand over to the dashboard.
  if (!user) {
    return (
      <div className="min-h-dvh bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <div className="h-2 w-32 bg-slate-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <RouteGuard>
      <DashboardPage />
    </RouteGuard>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-slate-950" />}>
      <HomeContent />
    </Suspense>
  );
}
