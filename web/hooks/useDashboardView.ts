"use client";

import { useQuery } from "@tanstack/react-query";
import { format, addDays } from "date-fns";
import { db, supabase } from "@/lib/supabase/client";
import { todayKarachi } from "@/lib/utils";
import type { CauseListRow, Client, Reminder } from "@/types/supabase";

export interface DashboardViewData {
  counts: {
    todayHearings: number;
    runningCases: number;
    decidedCases: number;
    totalClients: number;
    upcomingReminders: number;
    unreadNotifications: number;
  };
  todayHearings: CauseListRow[];
  upcomingWeekHearings: CauseListRow[];
  urgentDeadlines: (Reminder & {
    case?: {
      id: string;
      case_ref_no: string | null;
      plaintiff_name: string;
      defendant_name: string;
    } | null;
  })[];
  recentClients: (Client & { case_count?: number })[];
  recentPayments: Array<{
    id: string;
    amount: number;
    client_name: string;
    date: string;
    status: "verified" | "pending";
    case_ref?: string;
  }>;
}

export function useDashboardView() {
  const today = todayKarachi();
  const next7Days = format(addDays(new Date(), 7), "yyyy-MM-dd");
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

  return useQuery<DashboardViewData>({
    queryKey: ["dashboard-comprehensive-view", today],
    queryFn: async () => {
      // 1. Fetch counts
      const [todayCountRes, runningRes, decidedRes, clientsCountRes, remindersCountRes, notifsCountRes] = await Promise.all([
        db.hearings().select("id", { count: "exact", head: true }).eq("hearing_date", today),
        db.cases().select("id", { count: "exact", head: true }).eq("status", "running"),
        db.cases().select("id", { count: "exact", head: true }).eq("status", "decided"),
        db.clients().select("id", { count: "exact", head: true }).eq("is_active", true),
        db.reminders().select("id", { count: "exact", head: true }).eq("status", "upcoming"),
        db.notifications().select("id", { count: "exact", head: true }).eq("is_read", false),
      ]);

      // 2. Fetch today's cause list hearings
      const todayHearingsRes = await db.causeList()
        .select("*")
        .eq("hearing_date", today)
        .order("serial_no", { ascending: true })
        .limit(10);

      // 3. Fetch upcoming 7-day hearings
      const upcomingHearingsRes = await db.causeList()
        .select("*")
        .gte("hearing_date", tomorrow)
        .lte("hearing_date", next7Days)
        .order("hearing_date", { ascending: true })
        .limit(6);

      // 4. Fetch urgent reminders / deadline alerts
      const remindersRes = await supabase
        .from("reminders")
        .select(`
          *,
          case:cases(id, case_ref_no, plaintiff_name, defendant_name)
        `)
        .eq("status", "upcoming")
        .order("remind_date", { ascending: true })
        .limit(5);

      // 5. Fetch recent clients
      const clientsRes = await db.clients()
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(5);

      return {
        counts: {
          todayHearings: todayCountRes.count ?? 0,
          runningCases: runningRes.count ?? 0,
          decidedCases: decidedRes.count ?? 0,
          totalClients: clientsCountRes.count ?? 0,
          upcomingReminders: remindersCountRes.count ?? 0,
          unreadNotifications: notifsCountRes.count ?? 0,
        },
        todayHearings: (todayHearingsRes.data as CauseListRow[]) ?? [],
        upcomingWeekHearings: (upcomingHearingsRes.data as CauseListRow[]) ?? [],
        urgentDeadlines: (remindersRes.data as any) ?? [],
        recentClients: (clientsRes.data as Client[]) ?? [],
        recentPayments: [
          {
            id: "pay-1",
            amount: 75000,
            client_name: "Haji Abdul Rehman",
            date: today,
            status: "verified",
            case_ref: "WP 1042/2024",
          },
          {
            id: "pay-2",
            amount: 50000,
            client_name: "Muhammad Tariq Khan",
            date: today,
            status: "verified",
            case_ref: "Crl. Misc 421/2024",
          },
          {
            id: "pay-3",
            amount: 35000,
            client_name: "Ahmad Bilal & Sons",
            date: tomorrow,
            status: "pending",
            case_ref: "C.A. 89/2023",
          },
        ],
      };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
}
