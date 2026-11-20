"use client";

import { useQuery } from "@tanstack/react-query";
import { db }       from "@/lib/supabase/client";
import { todayKarachi } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

interface DashboardCounts {
  todayHearings:   number;
  runningCases:    number;
  decidedCases:    number;
  totalClients:    number;
  upcomingReminders: number;
  unreadNotifications: number;
}

async function fetchCounts(firmId?: string, isSuper?: boolean): Promise<DashboardCounts> {
  const today = todayKarachi();

  let hQ = db.hearings().select("id", { count: "exact", head: true }).eq("hearing_date", today);
  let rcQ = db.cases().select("id",    { count: "exact", head: true }).eq("status", "running");
  let dcQ = db.cases().select("id",    { count: "exact", head: true }).eq("status", "decided");
  let clQ = db.clients().select("id",  { count: "exact", head: true }).eq("is_active", true);
  let remQ = db.reminders().select("id",{ count: "exact", head: true }).eq("status", "upcoming");
  let notQ = db.notifications().select("id", { count: "exact", head: true }).eq("is_read", false);

  if (firmId && !isSuper) {
    hQ = hQ.eq("firm_id", firmId);
    rcQ = rcQ.eq("firm_id", firmId);
    dcQ = dcQ.eq("firm_id", firmId);
    clQ = clQ.eq("firm_id", firmId);
    remQ = remQ.eq("firm_id", firmId);
  }

  const [today_, running, decided, clients, reminders, notifs] = await Promise.all([
    hQ, rcQ, dcQ, clQ, remQ, notQ,
  ]);

  const failed = [today_, running, decided, clients, reminders, notifs].find(result => result.error);
  if (failed?.error) throw failed.error;

  return {
    todayHearings:       today_.count   ?? 0,
    runningCases:        running.count  ?? 0,
    decidedCases:        decided.count  ?? 0,
    totalClients:        clients.count  ?? 0,
    upcomingReminders:   reminders.count ?? 0,
    unreadNotifications: notifs.count   ?? 0,
  };
}

export function useDashboardCounts() {
  const { profile } = useAuth();
  const firmId = profile?.firm_id;
  const isSuper = profile?.role === "super_admin";

  return useQuery({
    queryKey: ["dashboard-counts", firmId],
    queryFn:  () => fetchCounts(firmId, isSuper),
    staleTime: 1000 * 60 * 2,  // 2 min
    retry: 1,
  });
}
