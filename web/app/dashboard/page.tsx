"use client";

import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/layout/AppShell";
import { RouteGuard } from "@/components/shared/RouteGuard";
import { ExecutiveDashboard } from "@/components/dashboard/ExecutiveDashboard";

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <RouteGuard>
      <AppShell
        pageTitle={t("nav.home") || "Dashboard"}
        pageSubtitle="Chamber Practice & Litigation Overview"
      >
        <ExecutiveDashboard />
      </AppShell>
    </RouteGuard>
  );
}
