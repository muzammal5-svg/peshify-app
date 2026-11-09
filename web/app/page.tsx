"use client";

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

export default function HomePage() {
  const { user, loading, configured } = useAuth();
  const stored = useStoredSession();

  // Session resolved (or impossible) with no user → landing for everyone,
  // including stale/revoked stored tokens.
  const loggedOut = !configured || (!loading && !user);
  if (!stored || loggedOut) return <Landing />;

  // Visitor has a stored session: show a neutral skeleton while the session
  // resolves, then hand over to the dashboard.
  if (!user) {
    return (
      <div className="min-h-dvh bg-[#090A0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0F1117] border border-white/[0.08] flex items-center justify-center">
            <span className="text-zinc-100 font-bold">M</span>
          </div>
          <div className="h-2 w-32 bg-zinc-800 rounded animate-shimmer" />
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



