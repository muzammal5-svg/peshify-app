import { type ReactNode, type ComponentType } from "react";
import { Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?:      LucideIcon | ComponentType<{ className?: string; strokeWidth?: number | string; "aria-hidden"?: boolean | string }>;
  title?:     string;
  message?:   string;
  /** Alias for `message` kept for backwards compatibility. */
  description?: string;
  action?:    ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon  = Inbox,
  title       = "No records found",
  message,
  description,
  action,
  className,
}: EmptyStateProps) {
  const body = message ?? description;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 md:py-16 px-4 text-center gap-3",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-xs">
        <Icon className="w-6 h-6 text-primary" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-foreground text-base tracking-tight">{title}</p>
        {body && (
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">{body}</p>
        )}
      </div>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
