import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ErrorStateProps {
  message?:   string;
  onRetry?:   () => void;
  className?: string;
}

export function ErrorState({
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  const { t } = useTranslation();
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center gap-3", className)}>
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-rose-400" />
      </div>
      <p className="text-rose-400 font-semibold">{t("common.errorTitle")}</p>
      <p className="text-sm text-zinc-400 max-w-xs">{message ?? t("common.errorDescription")}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-2 text-sm">
          {t("common.retry")}
        </button>
      )}
    </div>
  );
}
