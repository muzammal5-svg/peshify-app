"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { Bell, Check, ExternalLink, RotateCcw, X, Plus, Calendar, Briefcase, User } from "lucide-react";
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
import { fmtDate, todayKarachi } from "@/lib/utils";
import type { ReminderStatus } from "@/types/supabase";

type ReminderTab = Extract<ReminderStatus, "upcoming" | "done" | "dismissed">;

function RemindersPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();
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
    { value: "", label: `-- ${t("common.optional") || "No specific case (General)"} --` },
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
    if (!profile) return;
    if (!title.trim() || !date) {
      toast.error(t("common.error"), "Please provide a title and remind date.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabaseRaw.from("reminders").insert({
        firm_id: profile.firm_id,
        user_id: profile.id,
        case_id: selectedCaseId || null,
        title: title.trim(),
        from: fromValue.trim() || null,
        from_party: fromValue.trim() || null,
        remind_date: date,
        status: "upcoming",
        is_custom: true,
      } as any);
      if (error) throw error;
      toast.success(t("common.saved") || "Reminder added!");
      setTitle("");
      setDate("");
      setFromValue("");
      setSelectedCaseId("");
      setShowForm(false);
      void refetch();
      qc.invalidateQueries({ queryKey: ["reminders", profile?.id] });
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
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Top Bar: Tabs & Add Reminder Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto">
            {(["upcoming", "done", "dismissed"] as const).map(status => (
              <button
                key={status}
                role="tab"
                aria-selected={tab === status}
                onClick={() => setTab(status)}
                className={`flex items-center gap-2 rounded-none border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-200 ${
                  tab === status
                    ? "border-[#EDE8E0] bg-[#EDE8E0] text-[#050505] shadow-xs"
                    : "border-[rgba(237,232,224,0.14)] bg-[#111111] text-[#9A958C] hover:text-[#EDE8E0] hover:bg-[#171717]"
                }`}
              >
                {t(`reminders.${status}`)}
                <span className={`rounded-none px-1.5 py-0.5 text-[10px] font-mono font-bold leading-none ${
                  tab === status ? "bg-[#050505]/15 text-[#050505]" : "bg-white/[0.06] text-[#9A958C]"
                }`}>
                  {counts[status]}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowForm(v => !v)}
            className="self-end sm:self-auto px-4 py-2 rounded-none bg-[#EDE8E0] text-[#050505] font-bold text-xs uppercase tracking-[0.08em] hover:bg-white transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? t("common.cancel") : (t("reminders.add") || "Add Reminder")}</span>
          </button>
        </div>

        {/* Collapsible Add Reminder Form */}
        {showForm && (
          <Card className="p-5 border-[rgba(237,232,224,0.16)] bg-[#111111] space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[rgba(237,232,224,0.10)] pb-3">
              <h3 className="text-sm font-heading font-bold text-[#EDE8E0] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#EDE8E0]" />
                {t("reminders.newReminder") || "New Reminder"}
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-[#9A958C] hover:text-[#EDE8E0] p-1 transition-colors"
                aria-label={t("common.close")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cases Dropdown */}
              <div className="md:col-span-2">
                <Select
                  label={t("reminders.case") || "Case"}
                  options={caseOptions}
                  value={selectedCaseId}
                  onChange={e => handleCaseChange(e.target.value)}
                  placeholder={t("reminders.selectCase") || "Select a case"}
                />
              </div>

              {/* Custom "From" Input */}
              <div>
                <Input
                  label={t("reminders.From") || "From"}
                  placeholder={t("reminders.fromPlaceholder") || "e.g. Plaintiff, Defendant, Advocate, or custom party"}
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
                  label={t("reminders.reminder") || "Reminder Note / Action"}
                  placeholder="e.g. Prepare rejoinder, file power of attorney, client update..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={addReminder}
                loading={saving}
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
          <Card>
            <EmptyState
              icon={Bell}
              title={tab === "upcoming" ? t("reminders.noUpcoming") : t("reminders.noStatus", { status: t(`reminders.${tab}`) })}
              message={tab === "upcoming" ? t("reminders.emptyUpcoming") : undefined}
              className="py-10"
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
                ? "border-[#C45C5C]/40 bg-[#C45C5C]/10"
                : daysLeft !== null && daysLeft <= 3
                  ? "border-[rgba(237,232,224,0.25)] bg-[#171717]"
                  : "border-[rgba(237,232,224,0.10)] bg-[#111111]";
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
                <Card key={reminder.id} className={`border ${urgent} transition-all duration-200 hover:border-[rgba(237,232,224,0.25)]`}>
                  {/* Reminder custom title / action */}
                  {(reminder as any).title && (
                    <p className="mb-2 font-semibold text-[#EDE8E0] text-sm">{(reminder as any).title}</p>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Date Pill */}
                    <div className={`w-[76px] shrink-0 rounded-none p-2 text-center ${
                      daysLeft === 0 ? "bg-[#C45C5C] text-white" : daysLeft !== null && daysLeft <= 3 ? "bg-[#EDE8E0] text-[#050505]" : "bg-white/[0.06] text-[#EDE8E0]"
                    }`}>
                      <p className="text-sm font-bold leading-tight">
                        {nextDate ? fmtDate(nextDate) : t("reminders.dateUnavailable")}
                      </p>
                      <p className="mt-1 text-[10px] leading-tight font-medium opacity-80">{timing}</p>
                    </div>

                    {/* Details Column */}
                    <div className="min-w-0 flex-1 space-y-1">
                      {reminder.case ? (
                        <>
                          <p className="text-sm font-semibold text-[#EDE8E0] truncate">
                            {reminder.case.plaintiff_name} <span className="text-[#9A958C] font-normal text-xs mx-1">{t("cases.vs")}</span> {reminder.case.defendant_name}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            {reminder.case.case_ref_no && (
                              <span className="font-mono text-[#EDE8E0] font-medium">
                                {reminder.case.case_ref_no}
                              </span>
                            )}
                            {(reminder.hearing?.court_no ?? reminder.case?.court_no) && (
                              <span className="text-[#9A958C]">
                                • {t("reminders.court")} {reminder.hearing?.court_no ?? reminder.case?.court_no}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-[#9A958C] font-medium">
                          {t("reminders.reminder")}
                        </p>
                      )}

                      {/* Custom "From" Display */}
                      {(customFrom || reminder.case?.representing) && (
                        <div className="pt-0.5 flex items-center gap-1.5 text-xs text-[#C8C2B8]">
                          <span className="text-[#9A958C] font-normal">{t("reminders.From") || "From"}:</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-none bg-white/[0.05] text-[#EDE8E0] border border-[rgba(237,232,224,0.14)] font-medium text-[11px]">
                            {customFrom || (reminder.case?.representing === "plaintiff" ? t("cases.plaintiff") : reminder.case?.representing === "defendant" ? t("cases.defendant") : reminder.case?.representing)}
                          </span>
                        </div>
                      )}

                      {reminder.case?.client?.full_name && (
                        <p className="text-xs text-[#9A958C] font-medium flex items-center gap-1">
                          <User className="w-3 h-3 text-[#9A958C]" />
                          <span>{t("reminders.client")}: {reminder.case.client.full_name}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                    {tab === "upcoming" ? (
                      <>
                        <Button
                          size="sm"
                          leftIcon={<Check className="h-3.5 w-3.5" />}
                          loading={updateStatus.isPending}
                          {...lock}
                          onClick={() => void setStatus(reminder.id, "done")}
                        >{t("reminders.markDone")}</Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          leftIcon={<X className="h-3.5 w-3.5" />}
                          disabled={updateStatus.isPending}
                          {...lock}
                          onClick={() => void setStatus(reminder.id, "dismissed")}
                        >{t("reminders.dismiss")}</Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                        loading={updateStatus.isPending}
                        {...lock}
                        onClick={() => void setStatus(reminder.id, "upcoming")}
                      >{t("reminders.undo")}</Button>
                    )}

                    {reminder.case?.id && (
                      <Link href={caseUrl} className="ms-auto">
                        <Button size="sm" variant="ghost" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
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
  return <RouteGuard><RemindersPage /></RouteGuard>;
}
