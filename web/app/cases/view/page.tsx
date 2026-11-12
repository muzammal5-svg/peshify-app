"use client";

import { Suspense, useState }         from "react";
import { useSearchParams }            from "next/navigation";
import { useTranslation }             from "react-i18next";
import Link                           from "next/link";
import {
  Edit, MoreVertical, Trash2, CheckSquare, RefreshCw,
  CalendarPlus, ChevronRight, User, Gavel, Plus,
  FileText, Send, Clock, Activity,
} from "lucide-react";

import { AppShell }            from "@/components/layout/AppShell";
import { RouteGuard }          from "@/components/shared/RouteGuard";
import { Card }                from "@/components/ui/Card";
import { Badge, CaseStatusBadge, OutcomeBadge } from "@/components/ui/Badge";
import { Button }              from "@/components/ui/Button";
import { Tabs, TabList, TabTrigger, TabPanel } from "@/components/ui/Tabs";
import { DocumentsModule }     from "@/components/documents/DocumentsModule";
import { SkeletonCard }        from "@/components/ui/Skeleton";
import { EmptyState }          from "@/components/ui/EmptyState";
import { ConfirmDialog }       from "@/components/ui/Modal";
import { useToast }            from "@/components/ui/Toast";
import { useRoleGuard }        from "@/hooks/useRoleGuard";
import { MutatingButton, useMutationLock } from "@/components/shared/MutatingButton";
import { useCase, useCaseHearings, useCaseNotes, useSoftDeleteCase, useAddCaseNote, useDeleteCaseNote } from "@/hooks/useCases";
import { useActivityLog }      from "@/hooks/useActivityLog";
import { useAuth }             from "@/providers/AuthProvider";
import { MarkDecidedModal }    from "@/components/cases/MarkDecidedModal";
import { ReopenCaseModal }     from "@/components/cases/ReopenCaseModal";
import { PageLoader }          from "@/components/ui/LoadingSpinner";
import { QueryErrorState }     from "@/components/ui/QueryErrorState";
import { fmtDate, isUrdu, textDir } from "@/lib/utils";
import type { Hearing, CaseActivityLog } from "@/types/supabase";

// ─── Activity tab ─────────────────────────────────────────────────────────────
const EVENT_ICONS: Record<string, React.ComponentType<{className?:string}>> = {
  case_created:      CheckSquare,
  case_updated:      Edit,
  case_decided:      CheckSquare,
  case_reopened:     RefreshCw,
  hearing_added:     CalendarPlus,
  hearing_updated:   CalendarPlus,
  document_added:    FileText,
  document_deleted:  Trash2,
  note_added:        Send,
  note_deleted:      Trash2,
  reminder_dismissed: Clock,
};
const EVENT_COLORS: Record<string, string> = {
  case_decided:   "bg-emerald-500/10 text-emerald-400",
  case_reopened:  "bg-amber-500/10 text-amber-400",
  document_added: "bg-indigo-500/10 text-indigo-400",
  hearing_added:  "bg-indigo-500/10 text-indigo-400",
  default:        "bg-[#161922] text-zinc-400 border border-white/[0.08]",
};

function ActivityTab({ caseId }: { caseId: string }) {
  const { t } = useTranslation();
  const { data: log, isLoading, isError, refetch } = useActivityLog(caseId);
  if (isLoading) return <div className="space-y-2">{[1,2,3].map(i=><SkeletonCard key={i}/>)}</div>;
  if (isError) return <QueryErrorState onRetry={() => void refetch()} />;
  if (!log?.length) return <EmptyState icon={Activity} title={t("common.noData")} className="py-8" />;
  return (
    <div className="space-y-2">
      {log.map((entry: CaseActivityLog) => {
        const Icon  = EVENT_ICONS[entry.event] ?? Clock;
        const color = EVENT_COLORS[entry.event] ?? EVENT_COLORS.default;
        return (
          <div key={entry.id} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-sm text-zinc-200 leading-snug">{entry.summary}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {entry.actor_name ?? t("common.system")} · {fmtDate(entry.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Hearing timeline ─────────────────────────────────────────────────────────
function HearingTimeline({ caseId }: { caseId: string }) {
  const { t } = useTranslation();
  const { data: hearings, isLoading, isError, refetch } = useCaseHearings(caseId);
  if (isLoading) return <div className="space-y-3">{[1,2,3].map(i=><SkeletonCard key={i}/>)}</div>;
  if (isError) return <QueryErrorState onRetry={() => void refetch()} />;
  if (!hearings?.length) return (
    <EmptyState icon={Gavel} title={t("common.noData")}
      action={<Link href={`/cases/running?updateCaseId=${caseId}`}><Button size="sm" leftIcon={<Plus className="w-4 h-4"/>}>{t("cases.new")}</Button></Link>}
    />
  );
  return (
    <div className="space-y-3">
      {(hearings as Hearing[]).map((h, idx) => (
        <div key={h.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full border-2 mt-1.5 flex-shrink-0 ${idx === 0 ? "border-indigo-500 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" : "border-zinc-700 bg-[#0F1117]"}`} />
            {idx < hearings.length - 1 && <div className="w-0.5 bg-zinc-800 flex-1 my-1" />}
          </div>
          <Card className="flex-1 mb-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-zinc-100">{fmtDate(h.hearing_date)}</p>
                {h.serial_no && <span className="text-xs text-indigo-400 font-mono">#{h.serial_no}</span>}
              </div>
              {idx === 0 && <Badge variant="info" size="sm">{t("common.update")}</Badge>}
            </div>
            {h.current_proceeding && <p className="text-xs text-zinc-300 mt-1.5">{h.current_proceeding}</p>}
            {h.next_date && (
              <div className="mt-2 pt-2 border-t border-white/[0.08] flex items-center gap-1.5 text-xs text-zinc-400">
                <CalendarPlus className="w-3.5 h-3.5 text-indigo-400" />
                {t("hearings.nextDate")}: <strong className="text-zinc-100">{fmtDate(h.next_date)}</strong>
                {h.next_proceeding && <span> — {h.next_proceeding}</span>}
              </div>
            )}
          </Card>
        </div>
      ))}
    </div>
  );
}

// ─── Notes tab ────────────────────────────────────────────────────────────────
function NotesTab({ caseId, readOnly = false }: { caseId: string; readOnly?: boolean }) {
  const { t }       = useTranslation();
  const { profile } = useAuth();
  const toast       = useToast();
  const { isAdminOrAbove } = useRoleGuard();
  const { lock } = useMutationLock();
  const { data: notes, isLoading, isError, refetch } = useCaseNotes(caseId);
  const addNote    = useAddCaseNote(caseId);
  const deleteNote = useDeleteCaseNote(caseId);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmNote, setConfirmNote] = useState<string | null>(null);

  if (isError) return <QueryErrorState onRetry={() => void refetch()} />;

  async function submitNote(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !profile) return;
    setSaving(true);
    try {
      await addNote.mutateAsync({ firm_id: profile.firm_id, body: body.trim(), created_by: profile.id });
      setBody("");
    } catch { toast.error(t("common.error")); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-4">
      {!readOnly && (
        <form onSubmit={submitNote} className="flex gap-2 items-end">
          <div className="flex-1">
            <textarea value={body} onChange={e => setBody(e.target.value)}
              placeholder={t("cases.description")} rows={2} className="input resize-none" />
          </div>
          <MutatingButton type="submit" size="sm" loading={saving} leftIcon={<Send className="w-4 h-4"/>} disabled={!body.trim()}>
            {t("common.save")}
          </MutatingButton>
        </form>
      )}
      {isLoading ? <SkeletonCard /> :
        !notes?.length ? <EmptyState icon={FileText} title={t("common.noData")} className="py-8" /> :
        <div className="space-y-2">
          {notes.map(n => (
            <div key={n.id} className="bg-[#0F1117] rounded-xl border border-white/[0.08] p-3 space-y-1 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-zinc-200 flex-1">{n.body}</p>
                {isAdminOrAbove && !readOnly && (
                  <button onClick={() => setConfirmNote(n.id)} {...lock}
                    className="text-zinc-500 hover:text-rose-400 transition-colors flex-shrink-0 disabled:opacity-40">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-zinc-500">
                {n.author?.full_name ?? "—"} · {fmtDate(n.created_at)}
              </p>
            </div>
          ))}
        </div>
      }
      <ConfirmDialog open={!!confirmNote} onClose={() => setConfirmNote(null)}
        onConfirm={async () => { if (confirmNote) await deleteNote.mutateAsync(confirmNote); setConfirmNote(null); }}
        title={t("common.delete")} message="Delete this note permanently?" confirmLabel={t("common.delete")} confirmVariant="danger"
      />
    </div>
  );
}

// ─── Overview tab ─────────────────────────────────────────────────────────────
function OverviewTab({ caseId }: { caseId: string }) {
  const { data: c } = useCase(caseId);
  const { t }       = useTranslation();
  if (!c) return null;

  function Row({ label, value, mono = false }: { label: string; value?: string | null; mono?: boolean }) {
    if (!value) return null;
    return (
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 py-2.5 border-b border-border/60 last:border-0 min-w-0">
        <span className="text-xs sm:text-sm text-muted-foreground font-medium flex-shrink-0 sm:w-32">{label}</span>
        <span className={`text-sm font-semibold text-foreground text-start sm:text-end flex-1 min-w-0 break-all sm:break-words [overflow-wrap:anywhere] ${mono ? "font-mono text-primary font-bold" : ""} ${isUrdu(value) ? "font-urdu" : ""}`}
          dir={textDir(value)}>{value}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Decision summary for decided cases */}
      {c.status === "decided" && (
        <div className="bg-[#12151E] rounded-xl border border-white/[0.08] p-4 space-y-2">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t("cases.decisionSummary")}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-zinc-500">{t("cases.decidedDate")}</p>
              <p className="text-sm font-semibold text-zinc-100">{c.decision_date ? fmtDate(c.decision_date) : "—"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">{t("cases.outcome")}</p>
              {c.outcome ? <OutcomeBadge outcome={c.outcome} /> : <span className="text-zinc-500 text-sm">—</span>}
            </div>
          </div>
          {c.decision_notes && (
            <p className="text-sm text-zinc-300 mt-2 pt-2 border-t border-white/[0.08]">{c.decision_notes}</p>
          )}
        </div>
      )}

      <Card padding="sm">
        <Row label={t("cases.caseNo")}      value={c.case_ref_no || "—"}    mono />
        <Row label={t("cases.caseType")}    value={c.case_type?.name} />
        <Row label={t("cases.From")} value={((c as any).representing ?? c.From) === "plaintiff" ? (t("cases.plaintiff") || "Plaintiff") : (t("cases.defendant") || "Defendant")} />
        <Row label={t("cases.offence")}     value={c.offence} />
        <Row label={t("cases.judge")}       value={c.judge_name} />
        <Row label={t("cases.courtNo")}     value={c.court_no} />
        <Row label={t("cases.description")} value={c.description} />
      </Card>

      {c.client && (
        <Link href={`/clients/view?id=${c.client_id}`}>
          <Card hover className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-400">{t("clients.title")}</p>
              <p className="text-sm font-semibold text-zinc-100 truncate" dir={textDir(c.client.full_name)}>
                {c.client.full_name}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500 flex-shrink-0 rtl:rotate-180" />
          </Card>
        </Link>
      )}
    </div>
  );
}

// ─── Actions menu ─────────────────────────────────────────────────────────────
function CaseActionsMenu({
  caseId, caseRef, parties, status,
  onDecide, onReopen,
}: {
  caseId: string; caseRef: string; parties: string; status: string;
  onDecide: () => void; onReopen: () => void;
}) {
  const { t }       = useTranslation();
  const toast       = useToast();
  const { can, canDelete, isSuperAdmin, isAdminOrAbove } = useRoleGuard();
  const { lock } = useMutationLock();
  const softDelete  = useSoftDeleteCase();
  const [open,    setOpen]    = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function handleDelete() {
    try {
      await softDelete.mutateAsync(caseId);
      toast.success(t("common.caseDeleted"));
      if (typeof window !== "undefined") window.location.href = "/cases";
    } catch { toast.error(t("common.error")); }
    setConfirm(false);
  }

  return (
    <>
      <div className="relative">
        <Button size="sm" variant="secondary" onClick={() => setOpen(v=>!v)}
          leftIcon={<MoreVertical className="w-4 h-4"/>}>
          {t("common.actions")}
        </Button>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute end-0 top-full mt-1.5 w-52 bg-[#0F1117] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/[0.08] z-50 animate-slide-down overflow-hidden text-zinc-100">
              {status === "running" && (
                <>
                  {can("hearings:edit") && (
                    <Link href={`/cases/running?updateCaseId=${caseId}`} onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-zinc-100 transition-colors">
                      <CalendarPlus className="w-4 h-4 text-zinc-400" /> {t("common.updateHearing")}
                    </Link>
                  )}
                  {can("cases:edit") && (
                    <Link href={`/cases/edit?id=${caseId}`} onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-zinc-100 transition-colors">
                      <Edit className="w-4 h-4 text-zinc-400" /> {t("common.edit")}
                    </Link>
                  )}
                  {can("cases:decide") && (
                    <button onClick={() => { setOpen(false); onDecide(); }} {...lock}
                      className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-zinc-100 transition-colors disabled:opacity-40">
                      <CheckSquare className="w-4 h-4 text-zinc-400" /> {t("common.markAsDecided")}
                    </button>
                  )}
                </>
              )}
              {status === "decided" && can("cases:reopen") && (
                  <button onClick={() => { setOpen(false); onReopen(); }} {...lock}
                    className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-zinc-100 transition-colors disabled:opacity-40">
                    <RefreshCw className="w-4 h-4 text-zinc-400" /> {t("common.reopenCase")}
                  </button>
              )}
              {can("cases:delete") && (
                <>
                  <div className="border-t border-white/[0.08]" />
                  <button onClick={() => { setOpen(false); setConfirm(true); }} {...lock}
                    className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-40">
                    <Trash2 className="w-4 h-4" /> {t("common.delete")}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <ConfirmDialog open={confirm} onClose={() => setConfirm(false)} onConfirm={handleDelete}
        title={t("common.delete")} confirmLabel={t("common.delete")} confirmVariant="danger" loading={softDelete.isPending}
        message={t("common.softDeleteConfirm")}
      />
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function CaseViewPage() {
  const { t }    = useTranslation();
  const params   = useSearchParams();
  const id       = params.get("id");
  const { canWrite } = useRoleGuard();

  const { data: c, isLoading, isError, refetch } = useCase(id);
  const [decidedOpen, setDecidedOpen] = useState(false);
  const [reopenOpen,  setReopenOpen]  = useState(false);

  if (isLoading) return <AppShell showBack><PageLoader /></AppShell>;
  if (isError) return <AppShell showBack><QueryErrorState onRetry={() => void refetch()} /></AppShell>;
  if (!c) return <AppShell showBack><EmptyState title={t("common.caseNotFound")} /></AppShell>;

  const isDecided = c.status === "decided";
  const parties   = `${c.plaintiff_name} ${t("cases.vs")} ${c.defendant_name}`;

  return (
    <AppShell
      pageTitle={c.case_ref_no || parties}
      showBack
      headerActions={
        canWrite ? (
          <CaseActionsMenu
            caseId={c.id} caseRef={c.case_ref_no || "—"} parties={parties} status={c.status}
            onDecide={() => setDecidedOpen(true)}
            onReopen={() => setReopenOpen(true)}
          />
        ) : undefined
      }
    >
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Header card */}
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-indigo-400 font-semibold">{c.case_ref_no || "—"}</p>
              <h1 className="text-base font-bold text-zinc-50 mt-0.5 leading-snug"
                dir={isUrdu(c.plaintiff_name) || isUrdu(c.defendant_name) ? "rtl" : "ltr"}>
                {c.plaintiff_name}
                <span className="text-zinc-500 font-normal mx-1.5 text-sm">{t("cases.vs")}</span>
                {c.defendant_name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <CaseStatusBadge status={c.status} />
                {c.case_type && <Badge variant="navy" size="sm">{c.case_type.name}</Badge>}
                <Badge variant={((c as any).representing ?? c.From) === "plaintiff" ? "gold" : "info"} size="sm">
                  {((c as any).representing ?? c.From) === "plaintiff" ? (t("cases.plaintiff") || "For Plaintiff") : (t("cases.defendant") || "For Defendant")}
                </Badge>
                {isDecided && c.outcome && <OutcomeBadge outcome={c.outcome} />}
              </div>
            </div>
            <div className="hidden md:flex gap-2 flex-shrink-0">
              {canWrite && (
                <CaseActionsMenu
                  caseId={c.id} caseRef={c.case_ref_no || "—"} parties={parties} status={c.status}
                  onDecide={() => setDecidedOpen(true)}
                  onReopen={() => setReopenOpen(true)}
                />
              )}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabList>
            <TabTrigger value="overview">{t("common.tabOverview")}</TabTrigger>
            <TabTrigger value="hearings">{t("common.tabHearings")}</TabTrigger>
            <TabTrigger value="documents">{t("common.tabDocuments")}</TabTrigger>
            <TabTrigger value="notes">{t("common.tabNotes")}</TabTrigger>
            <TabTrigger value="activity">{t("common.tabActivity")}</TabTrigger>
          </TabList>

          <TabPanel value="overview">
            <OverviewTab caseId={c.id} />
          </TabPanel>
          <TabPanel value="hearings">
            <HearingTimeline caseId={c.id} />
          </TabPanel>
          <TabPanel value="documents">
            <DocumentsModule caseId={c.id} />
          </TabPanel>
          <TabPanel value="notes">
            <NotesTab caseId={c.id} readOnly={isDecided} />
          </TabPanel>
          <TabPanel value="activity">
            <ActivityTab caseId={c.id} />
          </TabPanel>
        </Tabs>
      </div>

      {/* Modals */}
      <MarkDecidedModal
        caseId={c.id} caseRef={c.case_ref_no || "—"} parties={parties}
        open={decidedOpen} onClose={() => setDecidedOpen(false)}
      />
      <ReopenCaseModal
        caseId={c.id} caseRef={c.case_ref_no || "—"}
        open={reopenOpen} onClose={() => setReopenOpen(false)}
      />
    </AppShell>
  );
}

export default function CaseViewRoute() {
  return (
    <RouteGuard>
      <Suspense><CaseViewPage /></Suspense>
    </RouteGuard>
  );
}
