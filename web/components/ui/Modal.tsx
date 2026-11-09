"use client";

import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

// ─── Shared overlay ───────────────────────────────────────────────────────────
function Overlay({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
      aria-hidden="true"
      onClick={onClick}
    />
  );
}

// =============================================================================
// MODAL (desktop-style centred dialog)
// =============================================================================
interface ModalProps {
  open:       boolean;
  onClose:    () => void;
  title?:     string;
  children:   ReactNode;
  footer?:    ReactNode;
  size?:      "sm" | "md" | "lg" | "xl";
  className?: string;
}

const MODAL_SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size      = "md",
  className,
}: ModalProps) {
  const { t } = useTranslation();
  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          className={cn(
            "relative w-full bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border/80 text-foreground",
            "pointer-events-auto animate-slide-up sm:animate-slide-down",
            "flex flex-col max-h-[88dvh] sm:max-h-[90dvh]",
            MODAL_SIZES[size],
            className
          )}
        >
          {/* Mobile bottom sheet drag handle */}
          <div className="sm:hidden flex justify-center pt-2.5 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" aria-hidden="true" />
          </div>

          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-5 pt-3 sm:pt-5 pb-4 border-b border-border/80 flex-shrink-0">
              <h2 id="modal-title" className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                {title}
              </h2>
              <button
                onClick={onClose}
                aria-label={t("common.close")}
                className="w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border/80 flex-shrink-0" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 1rem))" }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// =============================================================================
// BOTTOM SHEET (mobile-style slide-up sheet)
// =============================================================================
interface BottomSheetProps {
  open:       boolean;
  onClose:    () => void;
  title?:     string;
  children:   ReactNode;
  footer?:    ReactNode;
  snapPoints?: "auto" | "half" | "full";
  className?: string;
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  snapPoints = "auto",
  className,
}: BottomSheetProps) {
  const { t } = useTranslation();
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else       document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const heightClass =
    snapPoints === "full" ? "h-[95dvh]" :
    snapPoints === "half" ? "h-[50dvh]" :
    "max-h-[92dvh]";

  return (
    <>
      <Overlay onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "sheet-title" : undefined}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        className={cn(
          "fixed bottom-0 start-0 end-0 z-50",
          "bg-card rounded-t-3xl shadow-2xl border-t border-border text-foreground",
          "flex flex-col animate-slide-up",
          heightClass,
          className
        )}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" aria-hidden="true" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 pt-2 pb-4 flex-shrink-0 border-b border-border">
            <h2 id="sheet-title" className="text-base font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label={t("common.close")}
              className="w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-border flex-shrink-0 flex gap-2">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}

// =============================================================================
// CONFIRM DIALOG (convenience wrapper)
// =============================================================================
interface ConfirmDialogProps {
  open:         boolean;
  onClose:      () => void;
  onConfirm:    () => void;
  title?:       string;
  message:      string;
  confirmLabel?: string;
  confirmVariant?: "primary" | "danger";
  loading?:     boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  confirmVariant = "primary",
  loading,
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title ?? t("common.confirmTitle")}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>{t("common.cancel")}</Button>
          <Button variant={confirmVariant} size="sm" onClick={onConfirm} loading={loading}>
            {confirmLabel ?? t("common.confirmAction")}
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">{message}</p>
    </Modal>
  );
}
