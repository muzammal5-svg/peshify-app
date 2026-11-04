import { cn } from "@/lib/utils";
import type { CaseStatus, CaseOutcome, UserRole } from "@/types/supabase";

// ─── Generic Badge ────────────────────────────────────────────────────────────

export type BadgeVariant =
  | "gold" | "navy" | "success" | "danger" | "warning" | "info"
  | "neutral" | "purple";

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  gold:    "bg-white/[0.06] text-[#EDE8E0] border border-[rgba(237,232,224,0.18)]",
  navy:    "bg-white/[0.04] text-[#9A958C] border border-[rgba(237,232,224,0.12)]",
  success: "bg-[#6B8F71]/15 text-[#6B8F71] border border-[#6B8F71]/30",
  danger:  "bg-[#C45C5C]/15 text-[#C45C5C] border border-[#C45C5C]/30",
  warning: "bg-[#C4A574]/15 text-[#C4A574] border border-[#C4A574]/30",
  info:    "bg-white/[0.06] text-[#EDE8E0] border border-[rgba(237,232,224,0.18)]",
  neutral: "bg-white/[0.03] text-[#9A958C] border border-[rgba(237,232,224,0.10)]",
  purple:  "bg-white/[0.06] text-[#EDE8E0] border border-[rgba(237,232,224,0.18)]",
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
        "inline-flex items-center gap-1.5 font-bold uppercase tracking-[0.1em] rounded-none transition-colors",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
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
