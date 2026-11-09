import { cn } from "@/lib/utils";
import type { CaseStatus, CaseOutcome, UserRole } from "@/types/supabase";

// ─── Generic Badge ────────────────────────────────────────────────────────────

export type BadgeVariant =
  | "gold" | "navy" | "success" | "danger" | "warning" | "info"
  | "neutral" | "purple";

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  gold:    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  navy:    "bg-secondary text-foreground border border-border/80",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  danger:  "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  info:    "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20",
  neutral: "bg-secondary text-muted-foreground border border-border/80",
  purple:  "bg-primary/10 text-primary border border-primary/20",
};

interface BadgeProps {
  children:    React.ReactNode;
  variant?:    BadgeVariant;
  size?:       "sm" | "md";
  dot?:        boolean;
  className?:  string;
}

export function Badge({
  children,
  variant   = "neutral",
  size      = "md",
  dot       = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full transition-colors",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        VARIANT_STYLES[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full flex-shrink-0",
            variant === "success" ? "bg-emerald-400 ring-2 ring-emerald-500/30" :
            variant === "danger"  ? "bg-rose-400 ring-2 ring-rose-500/30"  :
            variant === "warning" ? "bg-amber-400 ring-2 ring-amber-500/30" :
            variant === "gold"    ? "bg-amber-400 ring-2 ring-amber-500/30"    :
            variant === "info"    ? "bg-indigo-400 ring-2 ring-indigo-500/30" :
            "bg-zinc-400"
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

// ─── Specialised badges ───────────────────────────────────────────────────────

const CASE_STATUS_MAP: Record<CaseStatus, { variant: BadgeVariant; label: string }> = {
  running: { variant: "success", label: "Running" },
  decided: { variant: "neutral", label: "Decided" },
};

export function CaseStatusBadge({ status, className }: { status: CaseStatus; className?: string }) {
  const { variant, label } = CASE_STATUS_MAP[status];
  return <Badge variant={variant} dot className={className}>{label}</Badge>;
}

export type HearingStatus = "running" | "pending" | "adjourned" | "decided";

export function HearingStatusBadge({ status, className }: { status?: string | null; className?: string }) {
  const norm = (status ?? "pending").toLowerCase();
  let variant: BadgeVariant = "warning";
  let label = "Pending";

  if (norm.includes("run") || norm === "running") {
    variant = "success";
    label = "Running";
  } else if (norm.includes("adj") || norm === "adjourned") {
    variant = "info";
    label = "Adjourned";
  } else if (norm.includes("decid") || norm === "decided") {
    variant = "neutral";
    label = "Decided";
  } else {
    variant = "warning";
    label = "Pending";
  }

  return (
    <Badge variant={variant} size="sm" dot className={className}>
      {label}
    </Badge>
  );
}

const OUTCOME_MAP: Record<CaseOutcome, { variant: BadgeVariant; label: string }> = {
  won:       { variant: "success", label: "Won" },
  lost:      { variant: "danger",  label: "Lost" },
  dismissed: { variant: "neutral", label: "Dismissed" },
  settled:   { variant: "warning", label: "Settled" },
  withdrawn: { variant: "neutral", label: "Withdrawn" },
};

export function OutcomeBadge({ outcome, className }: { outcome: CaseOutcome; className?: string }) {
  const { variant, label } = OUTCOME_MAP[outcome];
  return <Badge variant={variant} className={className}>{label}</Badge>;
}

const ROLE_MAP: Record<UserRole, { variant: BadgeVariant; label: string }> = {
  super_admin: { variant: "purple",  label: "Super Admin" },
  admin:       { variant: "gold",    label: "Admin" },
  lawyer:      { variant: "navy",    label: "Lawyer" },
  clerk:       { variant: "neutral", label: "Clerk" },
};

export function RoleBadge({ role, className }: { role: UserRole; className?: string }) {
  const { variant, label } = ROLE_MAP[role];
  return <Badge variant={variant} className={className}>{label}</Badge>;
}

export function CourtBadge({ courtName, className }: { courtName?: string | null; className?: string }) {
  if (!courtName) return null;
  const isHighCourt = /high/i.test(courtName);
  const isSupremeCourt = /supreme/i.test(courtName);
  const variant: BadgeVariant = isSupremeCourt ? "purple" : isHighCourt ? "gold" : "navy";
  return (
    <Badge variant={variant} size="sm" className={className}>
      {courtName}
    </Badge>
  );
}
