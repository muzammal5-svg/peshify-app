"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import {
  Bell,
  Check,
  ExternalLink,
  RotateCcw,
  X,
  Plus,
  Calendar,
  Briefcase,
  User,
  Clock,
  AlertCircle,
  FolderOpen,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RouteGuard } from "@/components/shared/RouteGuard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { QueryErrorState } from "@/components/ui/QueryErrorState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useMutationLock } from "@/components/shared/MutatingButton";
import { useToast } from "@/components/ui/Toast";
import { useReminders, useUpdateReminderStatus } from "@/hooks/useReminders";
import { useAuth } from "@/providers/AuthProvider";
import { supabaseRaw } from "@/lib/supabase/client";
import { fmtDate, todayKarachi, textDir, isUrdu } from "@/lib/utils";
import type { ReminderStatus } from "@/types/supabase";

type ReminderTab = Extract<ReminderStatus, "upcoming" | "done" | "dismissed">;

function RemindersPage() {
  const { t } = useTranslation();
  const { profile, user } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<ReminderTab>("upcoming");
  const { data, isLoading, isError, refetch } = useReminders();
  const updateStatus = useUpdateReminderStatus();
  const toast = useToast();
  const { lock, canMutate } = useMutationLock();

  // Add Reminder Form State
  const [showForm, setShowForm] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [fromValue, setFromValue] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch all cases of the firm for the dropdown
  const { data: casesList = [] } = useQuery({
    queryKey: ["reminders-cases-dropdown", profile?.firm_id],
    queryFn: async () => {
      if (!profile?.firm_id) return [];
      const { data, error } = await supabaseRaw
        .from("cases")
        .select("id, case_ref_no, plaintiff_name, defendant_name, representing")
        .eq("firm_id", profile.firm_id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data ?? []) as {
        id: string;
        case_ref_no: string | null;
        plaintiff_name: string;
        defendant_name: string;
        representing: string | null;
      }[];
    },
    enabled: !!profile?.firm_id,
    staleTime: 60_000,
  });

  const caseOptions = [
    { value: "", label: `-- ${t("common.optional") || "No specific case (General Reminder)"} --` },
    ...casesList.map(c => ({
      value: c.id,
      label: `${c.case_ref_no ? `[${c.case_ref_no}] ` : ""}${c.plaintiff_name} vs ${c.defendant_name}`
    }))
  ];

  function handleCaseChange(caseId: string) {
    setSelectedCaseId(caseId);
    if (caseId) {
      const selected = casesList.find(c => c.id === caseId);
      if (selected && !fromValue.trim()) {
        if (selected.representing === "plaintiff") {
          setFromValue(t("cases.plaintiff") || "Plaintiff");
        } else if (selected.representing === "defendant") {
          setFromValue(t("cases.defendant") || "Defendant");
        }
      }
    }
  }

  async function addReminder() {
    const activeFirmId = profile?.firm_id;
    const activeUserId = profile?.id || user?.id;

    if (!activeFirmId || !activeUserId) {
      toast.error(t("common.error"), "Session error: could not resolve user profile.");
      return;
    }
    if (!title.trim() || !date) {
      toast.error(t("common.error"), "Please provide a reminder title and remind date.");
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        firm_id: activeFirmId,
        user_id: activeUserId,
        case_id: selectedCaseId || null,
        title: title.trim(),
        remind_date: date,
        status: "upcoming",
        is_custom: true,
      };

      if (fromValue.trim()) {
        payload.from = fromValue.trim();
        payload.from_party = fromValue.trim();
      }

      const { error } = await supabaseRaw.from("reminders").insert(payload);
      if (error) throw error;

      toast.success(t("common.saved") || "Reminder added!");
      setTitle("");
      setDate("");
      setFromValue("");
      setSelectedCaseId("");
      setShowForm(false);
      void refetch();
      qc.invalidateQueries({ queryKey: ["reminders"] });
      qc.invalidateQueries({ queryKey: ["dashboard-counts"] });
    } catch (e) {
      toast.error("Failed", e instanceof Error ? e.message : "Could not add reminder");
    } finally {
      setSaving(false);
    }
  }

  const reminders = data ?? [];
  const counts = {
    upcoming: reminders.filter(item => item.status === "upcoming").length,
    done: reminders.filter(item => item.status === "done").length,
    dismissed: reminders.filter(item => item.status === "dismissed").length,
  };

  const visible = reminders
    .filter(item => item.status === tab)
    .sort((a, b) => ((a.next_date ?? a.remind_date ?? "")).localeCompare((b.next_date ?? b.remind_date ?? "")));

  async function setStatus(id: string, status: ReminderStatus) {
    if (!canMutate) return;
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(status === "upcoming" ? t("reminders.restored") : t("reminders.statusUpdated", { status: t(`reminders.${status}`) }));
    } catch (error) {
      toast.error(t("reminders.updateError"), error instanceof Error ? error.message : t("common.retry"));
    }
  }

  return (
    <AppShell pageTitle={t("reminders.title")} showBack>
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Top Controls: Tabs & Add Reminder */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex bg-secondary/50 p-1 rounded-xl border border-border/80 gap-1 overflow-x-auto">
            {(["upcoming", "done", "dismissed"] as const).map(status => (
              <button
                key={status}
                role="tab"
                aria-selected={tab === status}
                onClick={() => setTab(status)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 min-h-[44px] ${
                  tab === status
                    ? "bg-card text-foreground shadow-xs border border-border/80 font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <span>{t(`reminders.${status}`)}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold leading-none ${
                  tab === status ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                }`}>
                  {counts[status]}
                </span>
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={() => setShowForm(v => !v)}
            leftIcon={showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            className="self-stretch sm:self-auto min-h-[44px] px-4 font-semibold"
          >
            {showForm ? t("common.cancel") : (t("reminders.add") || "Add Reminder")}
          </Button>
        </div>

        {/* Collapsible Add Reminder Form */}
        {showForm && (
          <Card className="p-5 sm:p-6 border-border/80 bg-card rounded-2xl shadow-md space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="text-sm font-heading font-bold text-foreground flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Bell className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <span>{t("reminders.newReminder") || "Create Chamber Reminder"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={t("common.close")}
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cases Dropdown */}
              <div className="md:col-span-2">
                <Select
                  label={t("reminders.case") || "Associated Case (Optional)"}
                  options={caseOptions}
                  value={selectedCaseId}
                  onChange={e => handleCaseChange(e.target.value)}
                  placeholder={t("reminders.selectCase") || "Select a case"}
                />
              </div>

              {/* Custom "From" Input */}
              <div>
                <Input
                  label={t("reminders.From") || "Party / Originator"}
                  placeholder={t("reminders.fromPlaceholder") || "e.g. Plaintiff, Defendant, Senior Advocate"}
                  value={fromValue}
                  onChange={e => setFromValue(e.target.value)}
                />
              </div>

              {/* Remind Date */}
              <div>
                <Input
                  type="date"
                  label={t("hearings.nextDate") || "Remind Date"}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Reminder Title / Action */}
              <div className="md:col-span-2">
                <Input
                  label={t("reminders.reminder") || "Reminder Action / Note"}
                  placeholder="e.g. Prepare rejoinder, file Vakalatnama, inspect case record, send notice"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
                disabled={saving}
                className="min-h-[44px]"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={addReminder}
                loading={saving}
                className="min-h-[44px] px-5"
              >
                {t("common.save") || "Save Reminder"}
              </Button>
            </div>
          </Card>
        )}

        {/* List of Reminders */}
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>
        ) : isError ? (
          <QueryErrorState onRetry={() => void refetch()} />
        ) : visible.length === 0 ? (
          <Card className="rounded-2xl border-border/80">
            <EmptyState
              icon={Bell}
              title={tab === "upcoming" ? t("reminders.noUpcoming") : t("reminders.noStatus", { status: t(`reminders.${tab}`) })}
              message={tab === "upcoming" ? t("reminders.emptyUpcoming") : undefined}
              className="py-12"
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {visible.map(reminder => {
              const nextDate = reminder.next_date ?? reminder.hearing?.next_date ?? reminder.remind_date;
              const daysLeft = nextDate
                ? differenceInCalendarDays(parseISO(nextDate), parseISO(todayKarachi()))
                : null;
              const urgent = daysLeft === 0
                ? "border-rose-500/40 bg-rose-500/5 shadow-xs"
                : daysLeft !== null && daysLeft <= 3
                  ? "border-amber-500/30 bg-amber-500/5 shadow-xs"
                  : "border-border/80 bg-card hover:border-border";
              const timing = daysLeft === null
                ? "Date unavailable"
                : daysLeft < 0
                  ? t("reminders.overdue")
                  : daysLeft === 0
                      ? t("reminders.today")
                    : daysLeft === 1
                        ? t("reminders.tomorrow")
                        : t("reminders.inDays", { count: daysLeft });
              const caseUrl = reminder.case?.id
                ? `/cases/view?id=${encodeURIComponent(reminder.case.id)}`
                : "/cases";

              const customFrom = (reminder as any).from || (reminder as any).from_party;

              return (
                <Card
                  key={reminder.id}
                  className={`border ${urgent} rounded-2xl p-4 sm:p-5 transition-all duration-200`}
                >
                  {/* Reminder custom title / action */}
                  {(reminder as any).title && (
                    <div className="mb-2.5">
                      <p className="font-semibold text-foreground text-sm sm:text-base leading-snug break-words [overflow-wrap:anywhere]">
                        {(reminder as any).title}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    {/* Date Pill */}
                    <div className={`w-full sm:w-[84px] shrink-0 rounded-xl p-2.5 text-center flex sm:flex-col items-center justify-between sm:justify-center ${
                      daysLeft === 0
                        ? "bg-rose-500 text-white"
                        : daysLeft !== null && daysLeft <= 3
                          ? "bg-amber-400 text-slate-950 font-bold"
                          : "bg-secondary text-foreground border border-border"
                    }`}>
                      <p className="text-xs sm:text-sm font-bold leading-tight font-mono">
                        {nextDate ? fmtDate(nextDate) : t("reminders.dateUnavailable")}
                      </p>
                      <p className="sm:mt-1 text-[10px] leading-tight font-medium opacity-90 uppercase tracking-wider">
                        {timing}
                      </p>
                    </div>

                    {/* Details Column */}
                    <div className="min-w-0 flex-1 space-y-1.5 w-full">
                      {reminder.case ? (
                        <>
                          <p
                            className="text-sm font-semibold text-foreground truncate"
                            dir={textDir(reminder.case.plaintiff_name)}
                          >
                            {reminder.case.plaintiff_name}{" "}
                            <span className="text-muted-foreground font-normal text-xs mx-1">{t("cases.vs")}</span>{" "}
                            {reminder.case.defendant_name}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                            {reminder.case.case_ref_no && (
                              <span className="font-mono text-primary font-semibold">
                                {reminder.case.case_ref_no}
                              </span>
                            )}
                            {(reminder.hearing?.court_no ?? reminder.case?.court_no) && (
                              <span>
                                &bull; {t("reminders.court")} {reminder.hearing?.court_no ?? reminder.case?.court_no}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <FolderOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" strokeWidth={1.75} />
                          <span>General Chamber Matter (No specific case attached)</span>
                        </div>
                      )}

                      {/* Custom "From" Display */}
                      {(customFrom || reminder.case?.representing) && (
                        <div className="pt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                          <span className="font-medium">{t("reminders.From") || "From"}:</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary text-foreground border border-border text-[11px] font-medium truncate max-w-full">
                            {customFrom || (reminder.case?.representing === "plaintiff" ? t("cases.plaintiff") : reminder.case?.representing === "defendant" ? t("cases.defendant") : reminder.case?.representing)}
                          </span>
                        </div>
                      )}

                      {reminder.case?.client?.full_name && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                          <User className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                          <span className="truncate">{t("reminders.client")}: {reminder.case.client.full_name}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-border/80 pt-3">
                    {tab === "upcoming" ? (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          leftIcon={<Check className="h-3.5 w-3.5" strokeWidth={2} />}
                          loading={updateStatus.isPending}
                          {...lock}
                          onClick={() => void setStatus(reminder.id, "done")}
                          className="min-h-[44px]"
                        >
                          {t("reminders.markDone")}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          leftIcon={<X className="h-3.5 w-3.5" strokeWidth={2} />}
                          disabled={updateStatus.isPending}
                          {...lock}
                          onClick={() => void setStatus(reminder.id, "dismissed")}
                          className="min-h-[44px]"
                        >
                          {t("reminders.dismiss")}
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={<RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />}
                        loading={updateStatus.isPending}
                        {...lock}
                        onClick={() => void setStatus(reminder.id, "upcoming")}
                        className="min-h-[44px]"
                      >
                        {t("reminders.undo")}
                      </Button>
                    )}

                    {reminder.case?.id && (
                      <Link href={caseUrl} className="ms-auto">
                        <Button
                          size="sm"
                          variant="ghost"
                          rightIcon={<ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />}
                          className="min-h-[44px]"
                        >
                          {t("reminders.viewCase")}
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function RemindersPageRoute() {
  return (
    <RouteGuard>
      <RemindersPage />
    </RouteGuard>
  );
}
