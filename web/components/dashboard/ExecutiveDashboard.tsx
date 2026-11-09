"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Calendar, Briefcase, Users, Bell, AlertTriangle,
  Plus, ChevronRight, CalendarCheck, Clock, ShieldCheck,
  CheckCircle2, ArrowUpRight, Scale, Gavel, FileText,
  MessageSquare, UserPlus, FileSpreadsheet, Sparkles, AlertCircle
} from "lucide-react";

import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge, HearingStatusBadge, CaseStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { QueryErrorState } from "@/components/ui/QueryErrorState";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { useDashboardView } from "@/hooks/useDashboardView";
import { useAuth } from "@/providers/AuthProvider";
import { fmtDate, todayKarachi, isUrdu, textDir } from "@/lib/utils";
import { toZonedTime } from "date-fns-tz";
import { BRAND } from "@/lib/brand";
import { whatsappLink } from "@/lib/siteConfig";

function getTimeOfDay(t: (k: string) => string): string {
  const hour = toZonedTime(new Date(), BRAND.timezone).getHours();
  if (hour < 12) return t("dashboard.morning") || "Good morning";
  if (hour < 17) return t("dashboard.afternoon") || "Good afternoon";
  return t("dashboard.evening") || "Good evening";
}

export function ExecutiveDashboard() {
  const { t } = useTranslation();
  const { profile, firm } = useAuth();
  const { data, isLoading, isError, refetch } = useDashboardView();

  const timeOfDay = getTimeOfDay(t);
  const firstName = profile?.full_name?.split(" ")[0] ?? (firm?.name ? firm.name.split(" ")[0] : "Counsel");
  const todayFormatted = fmtDate(todayKarachi());

  const todayHearings = data?.todayHearings ?? [];
  const upcomingWeekHearings = data?.upcomingWeekHearings ?? [];
  const urgentDeadlines = data?.urgentDeadlines ?? [];
  const recentClients = data?.recentClients ?? [];
  const recentPayments = data?.recentPayments ?? [];
  const counts = data?.counts;

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* ── SECTION (a): Greeting + Date + Today's Hearings Summary Banner ── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card/95 to-secondary border border-border/80 p-5 md:p-8 shadow-xs text-foreground">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 end-0 -translate-y-1/2 translate-x-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/25">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {profile?.role === "super_admin" ? "Platform Administrator" : (firm?.name ?? "Chamber Practice")}
              </span>
              <span className="text-muted-foreground text-xs flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-md bg-secondary border border-border/60">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.75} />
                <span>{todayFormatted}</span>
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              {timeOfDay}, <span className="text-primary">{firstName}</span>
            </h1>

            <p className="text-muted-foreground text-xs md:text-sm max-w-xl leading-relaxed">
              {todayHearings.length > 0 ? (
                <>
                  You have <span className="font-semibold text-foreground">{todayHearings.length} court {todayHearings.length === 1 ? "appearance" : "appearances"}</span> scheduled for today across courtrooms.
                </>
              ) : (
                "Your court calendar is clear for today. Review upcoming hearings and pending chamber client updates below."
              )}
            </p>
          </div>

          {/* Quick Header Metric Badges */}
          <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">
            <Link
              href="/cause-list"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/40 text-xs md:text-sm font-medium transition-all shadow-2xs hover:shadow-xs min-h-[44px]"
            >
              <CalendarCheck className="w-4 h-4 text-amber-500" strokeWidth={1.75} />
              <span>Cause List ({todayHearings.length})</span>
            </Link>

            <Link
              href="/cases/new"
              className="btn-primary text-xs md:text-sm font-semibold flex items-center gap-2 px-4 py-2.5 rounded-xl min-h-[44px] shadow-xs hover:shadow-md"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              <span>{t("cases.newCase") || "New Case"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION (b): Stat Cards (4 KPI Cards Grid) ── */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-sm md:text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Chamber Practice Overview</span>
          </h2>
          <span className="text-[11px] text-muted-foreground font-medium">Real-time sync</span>
        </div>

        {isError ? (
          <QueryErrorState onRetry={() => void refetch()} />
        ) : isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary" />
                  <div className="w-16 h-5 rounded-full bg-secondary" />
                </div>
                <div className="h-4 w-20 bg-secondary rounded mb-2" />
                <div className="h-8 w-14 bg-secondary rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
            <StatCard
              label={t("dashboard.runningCases") || "Active Litigation"}
              value={counts?.runningCases ?? 0}
              trend="In Progress"
              trendVariant="info"
              icon={Briefcase}
              iconBg="bg-primary/10 text-primary border-primary/20"
              href="/cases/running"
            />
            <StatCard
              label={t("dashboard.todayCases") || "Listed Today"}
              value={counts?.todayHearings ?? 0}
              trend={(counts?.todayHearings ?? 0) > 0 ? "Appearing" : "None"}
              trendVariant={(counts?.todayHearings ?? 0) > 0 ? "warning" : "neutral"}
              icon={CalendarCheck}
              iconBg="bg-amber-500/10 text-amber-500 border-amber-500/20"
              href="/cause-list"
            />
            <StatCard
              label={t("dashboard.totalClients") || "Retained Clients"}
              value={counts?.totalClients ?? 0}
              trend="Verified"
              trendVariant="success"
              icon={Users}
              iconBg="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              href="/clients"
            />
            <StatCard
              label={t("dashboard.upcoming") || "Urgent Deadlines"}
              value={counts?.upcomingReminders ?? 0}
              trend={(counts?.upcomingReminders ?? 0) > 0 ? "Action Required" : "Up to Date"}
              trendVariant={(counts?.upcomingReminders ?? 0) > 0 ? "danger" : "neutral"}
              icon={Bell}
              iconBg="bg-rose-500/10 text-rose-500 border-rose-500/20"
              href="/reminders"
            />
          </div>
        )}
      </section>

      {/* ── SECTION (c): Hero Widget — Today's Cause List ── */}
      <section className="bg-card border border-border/80 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/80 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Gavel className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span>Today&apos;s Cause List</span>
                  <Badge variant="gold" size="sm">Hero Board</Badge>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {todayHearings.length} {todayHearings.length === 1 ? "matter" : "matters"} listed for hearing on {todayFormatted}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/cause-list"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 border border-primary/25 px-3 py-2 rounded-xl transition-colors min-h-[40px]"
            >
              <span>Full Cause Board</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" strokeWidth={1.75} />
            </Link>
          </div>
        </div>

        {/* Content: Skeletons, Empty State, or Responsive Table/Cards */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        ) : todayHearings.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No Court Appearances Listed Today"
            description="You have no cases scheduled on today's cause lists. You can schedule hearings or add new matters anytime."
            action={
              <Link href="/hearings/new">
                <Button size="sm" leftIcon={<Plus className="w-4 h-4" strokeWidth={2} />}>
                  Schedule Hearing
                </Button>
              </Link>
            }
            className="py-8"
          />
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-start text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3 text-start w-16">Sr #</th>
                    <th className="py-3 px-3 text-start w-36">Case Ref</th>
                    <th className="py-3 px-3 text-start">Litigation Parties</th>
                    <th className="py-3 px-3 text-start w-40">Court / Judge</th>
                    <th className="py-3 px-3 text-start w-28">Status</th>
                    <th className="py-3 px-3 text-end w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {todayHearings.map((h, idx) => {
                    const serial = h.serial_no ? (h.serial_no.startsWith("#") ? h.serial_no : `#${h.serial_no}`) : `#${idx + 1}`;
                    return (
                      <tr key={h.hearing_id ?? idx} className="hover:bg-secondary/50 transition-colors group">
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-primary px-2 py-1 rounded bg-primary/10 border border-primary/20 text-[11px]">
                            {serial}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-foreground truncate max-w-[150px]">
                          {h.case_ref_no || "Pending Ref"}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-foreground leading-snug truncate max-w-sm" dir={isUrdu(h.plaintiff_name ?? "") ? "rtl" : "ltr"}>
                            {h.plaintiff_name} <span className="text-muted-foreground font-normal text-xs mx-1">vs</span> {h.defendant_name}
                          </p>
                          {h.current_proceeding && (
                            <p className="text-[11px] text-muted-foreground truncate max-w-sm mt-0.5">
                              {h.current_proceeding}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">
                          {h.hearing_court_no ? (
                            <span className="font-medium text-foreground block">Court {h.hearing_court_no}</span>
                          ) : (
                            <span className="text-muted-foreground italic">Court TBD</span>
                          )}
                          <span className="text-[11px] truncate block text-muted-foreground max-w-[140px]">
                            {h.hearing_judge ?? "Hon. Bench"}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <HearingStatusBadge status={h.case_status ?? "running"} />
                        </td>
                        <td className="py-3 px-3 text-end">
                          <Link
                            href={`/cases/view?id=${h.case_id}`}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors min-w-[36px] min-h-[36px]"
                            title="Open Case File"
                          >
                            <ArrowUpRight className="w-4 h-4 rtl:rotate-90" strokeWidth={1.75} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards (Zero horizontal scroll) */}
            <div className="md:hidden space-y-2.5">
              {todayHearings.map((h, idx) => {
                const serial = h.serial_no ? (h.serial_no.startsWith("#") ? h.serial_no : `#${h.serial_no}`) : `#${idx + 1}`;
                return (
                  <Link
                    key={h.hearing_id ?? idx}
                    href={`/cases/view?id=${h.case_id}`}
                    className="block p-4 rounded-xl bg-secondary/60 hover:bg-secondary border border-border/80 transition-all shadow-2xs active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                          {serial}
                        </span>
                        <span className="font-mono text-xs font-semibold text-foreground truncate max-w-[140px]">
                          {h.case_ref_no || "Pending Ref"}
                        </span>
                      </div>
                      <HearingStatusBadge status={h.case_status ?? "running"} />
                    </div>

                    <p className="text-sm font-semibold text-foreground leading-snug mb-1.5" dir={isUrdu(h.plaintiff_name ?? "") ? "rtl" : "ltr"}>
                      {h.plaintiff_name} <span className="text-muted-foreground font-normal text-xs mx-1">vs</span> {h.defendant_name}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-2 mt-2">
                      <span className="flex items-center gap-1 font-medium">
                        <Gavel className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.75} />
                        {h.hearing_court_no ? `Court ${h.hearing_court_no}` : "Court Room TBD"}
                      </span>
                      <span className="text-primary font-medium flex items-center gap-1">
                        <span>View File</span>
                        <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" strokeWidth={1.75} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ── SECTION (d) & (e): Two-Column Grid — Upcoming 7 Days + Limitation Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION (d): Upcoming Hearings (Next 7 Days) */}
        <section className="bg-card border border-border/80 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-border/80 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500">
                  <Calendar className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold tracking-tight text-foreground">
                    Next 7 Days Hearings
                  </h3>
                  <p className="text-xs text-muted-foreground">Advance court appearance diary</p>
                </div>
              </div>
              <Link href="/cause-list" className="text-xs text-primary font-semibold hover:underline">
                View Diary
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}
              </div>
            ) : upcomingWeekHearings.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No Upcoming Hearings"
                description="No court appearances scheduled in the next 7 days."
                className="py-6"
              />
            ) : (
              <div className="space-y-2.5">
                {upcomingWeekHearings.map((h, i) => (
                  <Link
                    key={h.hearing_id ?? i}
                    href={`/cases/view?id=${h.case_id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/70 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="px-2.5 py-1.5 rounded-lg bg-card border border-border text-center flex-shrink-0 min-w-[54px]">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                          {h.hearing_date ? fmtDate(h.hearing_date).split(" ")[1] : "TBD"}
                        </span>
                        <span className="text-sm font-bold text-foreground font-mono leading-none block">
                          {h.hearing_date ? fmtDate(h.hearing_date).split(" ")[0] : "—"}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {h.plaintiff_name} vs {h.defendant_name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {h.case_ref_no ? <span className="font-mono text-primary font-medium me-1.5">{h.case_ref_no}</span> : null}
                          {h.hearing_court_no ? `• Court ${h.hearing_court_no}` : ""}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 rtl:rotate-180 flex-shrink-0" strokeWidth={1.75} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION (e): Limitation & Deadline Alerts */}
        <section className="bg-card border border-border/80 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-border/80 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                  <AlertTriangle className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold tracking-tight text-foreground">
                    Limitation &amp; Deadline Alerts
                  </h3>
                  <p className="text-xs text-muted-foreground">Urgent filings, appeals &amp; stays</p>
                </div>
              </div>
              <Link href="/reminders" className="text-xs text-primary font-semibold hover:underline">
                All Alerts
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}
              </div>
            ) : urgentDeadlines.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="All Deadlines Up to Date"
                description="No pending limitation expiries or critical court alerts recorded."
                className="py-6"
              />
            ) : (
              <div className="space-y-2.5">
                {urgentDeadlines.map((r, i) => (
                  <div
                    key={r.id ?? i}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/70 gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0 animate-pulse" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {r.title || "Court Deadline Reminder"}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          Due: <span className="font-medium text-foreground">{fmtDate(r.remind_date)}</span>
                          {r.case?.case_ref_no ? ` • ${r.case.case_ref_no}` : ""}
                        </p>
                      </div>
                    </div>
                    <Badge variant="danger" size="sm">
                      Urgent
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── SECTION (f): Recent Clients & Financial Ledger ── */}
      <section className="bg-card border border-border/80 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-border/80 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Users className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-foreground">
                Recent Clients &amp; Retainer Matters
              </h3>
              <p className="text-xs text-muted-foreground">Active chamber representation directory</p>
            </div>
          </div>
          <Link
            href="/clients"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span>View All Clients</span>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" strokeWidth={1.75} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        ) : recentClients.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Clients Registered Yet"
            description="Add your first client to track cases, generate receipts, and send WhatsApp updates."
            action={
              <Link href="/clients/new">
                <Button size="sm" leftIcon={<UserPlus className="w-4 h-4" strokeWidth={2} />}>
                  Add Client
                </Button>
              </Link>
            }
            className="py-6"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentClients.slice(0, 3).map((c) => (
              <Link
                key={c.id}
                href={`/clients/view?id=${c.id}`}
                className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/80 hover:border-primary/40 transition-all flex items-start justify-between gap-3 group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors" dir={textDir(c.full_name)}>
                    {c.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {c.phone || c.whatsapp || "No phone recorded"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="success" size="sm">Active</Badge>
                    {c.city && <span className="text-[11px] text-muted-foreground">{c.city}</span>}
                  </div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-card flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-90" strokeWidth={1.75} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── SECTION (g): Quick Actions Bar ── */}
      <section className="bg-card border border-border/80 rounded-2xl p-5 md:p-6 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Chamber Quick Operations
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/cases/new"
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/80 hover:border-primary/40 transition-all text-center min-h-[56px] group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
              Add New Case
            </span>
          </Link>

          <Link
            href="/hearings/new"
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/80 hover:border-amber-500/40 transition-all text-center min-h-[56px] group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <span className="text-xs font-semibold text-foreground group-hover:text-amber-500 transition-colors">
              Add Hearing
            </span>
          </Link>

          <Link
            href="/clients/new"
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/80 hover:border-emerald-500/40 transition-all text-center min-h-[56px] group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform">
              <UserPlus className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <span className="text-xs font-semibold text-foreground group-hover:text-emerald-500 transition-colors">
              Add Client
            </span>
          </Link>

          <a
            href={whatsappLink("Assalam-o-Alaikum, this is an automated court hearing update from your legal counsel via Peshify.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/80 hover:border-emerald-500/40 transition-all text-center min-h-[56px] group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <span className="text-xs font-semibold text-foreground group-hover:text-emerald-500 transition-colors">
              Send WhatsApp Update
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
