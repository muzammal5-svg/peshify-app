"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { BellRing, CheckCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RouteGuard } from "@/components/shared/RouteGuard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { QueryErrorState } from "@/components/ui/QueryErrorState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { db, supabase, supabaseRaw, update } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { fmtDate } from "@/lib/utils";
import type { Notification } from "@/types/supabase";

const FILTERS = [
  { value: "all", label: "notifications.all" },
  { value: "reminder", label: "notifications.remindersFilter" },
  { value: "daily_summary", label: "notifications.dailySummary" },
  { value: "case_update", label: "notifications.caseUpdates" },
  { value: "system", label: "notifications.system" },
] as const;

function NotificationsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");
  const { user, refreshCounts } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data: rows, error } = await db.notifications()
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (rows as Notification[]) ?? [];
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`notification-inbox:${user.id}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${user.id}`,
      }, () => {
        void queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
        void refreshCounts();
      })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [user, queryClient, refreshCounts]);

  const rows = data ?? [];
  const visible = filter === "all" ? rows : rows.filter(item => item.type === filter);
  const unread = rows.filter(item => !item.is_read).length;

  async function markAllRead() {
    const { error } = await update.notificationsAll({ is_read: true }, { is_read: false });
    if (error) {
      toast.error(t("notifications.markReadError"), error.message);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    await refreshCounts();
  }

  async function openNotification(item: Notification) {
    if (!item.is_read) {
      const { error } = await update.notification(item.id, { is_read: true });
      if (error) {
        toast.error(t("notifications.updateError"), error.message);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
      await refreshCounts();
    }

    if (item.ref_type === "case" && item.ref_id) {
      router.push(`/cases/view?id=${encodeURIComponent(item.ref_id)}`);
      return;
    }
    if (item.ref_type === "hearing" && item.ref_id) {
      const { data: hearing, error } = await supabaseRaw
        .from("hearings")
        .select("case_id")
        .eq("id", item.ref_id)
        .maybeSingle();
      if (error) {
        toast.error(t("notifications.hearingError"), error.message);
        return;
      }
      if (hearing?.case_id) {
        router.push(`/cases/view?id=${encodeURIComponent(hearing.case_id)}`);
        return;
      }
    }
    router.push(item.ref_type === "reminder" ? "/reminders" : "/cases");
  }

  return (
    <AppShell pageTitle={t("notifications.title")} showBack>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map(item => (
              <button
                key={item.value}
                aria-pressed={filter === item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-none border px-3 py-1.5 text-xs font-semibold whitespace-nowrap uppercase tracking-[0.08em] transition-all duration-200 ${
                  filter === item.value
                    ? "border-[#EDE8E0] bg-[#EDE8E0] text-[#050505] shadow-xs"
                    : "border-[rgba(237,232,224,0.14)] bg-[#111111] text-[#9A958C] hover:text-[#EDE8E0] hover:bg-[#171717]"
                }`}
              >{t(item.label)}</button>
            ))}
          </div>
          {unread > 0 && (
            <Button size="sm" variant="secondary" leftIcon={<CheckCheck className="h-4 w-4" />} onClick={() => void markAllRead()}>
              {t("notifications.markAll")}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>
        ) : isError ? (
          <QueryErrorState onRetry={() => void refetch()} />
        ) : visible.length === 0 ? (
          <Card>
            <EmptyState icon={BellRing} title={t("notifications.empty")} message={t("notifications.emptyMessage")} className="py-10" />
          </Card>
        ) : (
          <div className="space-y-2">
            {visible.map(item => (
              <button
                key={item.id}
                onClick={() => void openNotification(item)}
                className={`block w-full rounded-none border text-start transition-colors ${
                  item.is_read
                    ? "border-[rgba(237,232,224,0.10)] bg-[#111111] hover:bg-[#171717]"
                    : "border-[rgba(237,232,224,0.25)] bg-[#171717] hover:bg-[#1E1E1E]"
                }`}
              >
                <div className="flex items-start gap-3 p-4">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.is_read ? "bg-transparent" : "bg-[#EDE8E0]"}`} aria-label={item.is_read ? "Read" : "Unread"} />
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm font-semibold ${item.is_read ? "text-[#C8C2B8] font-normal" : "text-[#EDE8E0] font-bold"}`}>{item.title}</span>
                    <span className={`mt-0.5 block text-xs ${item.is_read ? "text-[#9A958C]" : "text-[#C8C2B8]"}`}>{item.body}</span>
                    <span className="mt-1 block text-[10px] text-[#5C5852] font-medium">{fmtDate(item.created_at)} · {t(`notifications.type.${item.type}`, { defaultValue: item.type.replace(/_/g, " ") })}</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function NotificationsPageRoute() {
  return <RouteGuard><NotificationsPage /></RouteGuard>;
}
