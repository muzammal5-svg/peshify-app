"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Sun, Moon, Laptop, Check, Palette, ChevronDown } from "lucide-react";
import { useTheme, type ThemeMode, type AccentPreset } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeCustomizerProps {
  compact?: boolean;
  showFullLabel?: boolean;
  align?: "left" | "right";
  dropup?: boolean;
  className?: string;
}

export function ThemeCustomizer({
  compact = false,
  showFullLabel = false,
  align = "right",
  dropup = false,
  className,
}: ThemeCustomizerProps) {
  const { t } = useTranslation();
  const { mode, resolvedMode, setMode, accent, setAccent, accents } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const activeAccent = accents.find((a) => a.id === accent) || accents[0];

  return (
    <div className={cn("relative inline-block text-start", className)} ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Customize theme and accent color"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 rounded-lg border transition-all duration-200 select-none shadow-xs",
          "bg-secondary hover:bg-muted border-border/80 hover:border-border-strong text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          compact ? "w-8 h-8 justify-center p-0" : "px-2.5 py-1.5",
          (className?.includes("flex-1") || className?.includes("w-full")) && "w-full justify-between",
          open && "border-primary/80 ring-1 ring-primary/40 bg-secondary"
        )}
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="relative flex items-center justify-center flex-shrink-0">
            {resolvedMode === "dark" ? (
              <Moon className="w-4 h-4 text-primary" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <span
              className="absolute -bottom-0.5 -end-0.5 w-2 h-2 rounded-full border border-background shadow-xs ring-1 ring-black/20"
              style={{ backgroundColor: activeAccent.hex }}
              aria-hidden="true"
            />
          </span>

          {!compact && (
            <span className="text-xs font-semibold text-foreground truncate">
              {showFullLabel
                ? `Theme: ${activeAccent.name.split(" ")[1] || "Accent"} (${resolvedMode === "dark" ? "Dark" : "Light"})`
                : `${activeAccent.name.split(" ")[1] || activeAccent.name} Theme`}
            </span>
          )}
        </span>

        {!compact && (
          <ChevronDown
            className={cn(
              "w-3 h-3 text-muted-foreground transition-transform duration-200 flex-shrink-0",
              open && "rotate-180"
            )}
          />
        )}
      </button>

      {/* Popover Dropdown */}
      {open && (
        <div
          className={cn(
            "absolute w-72 max-w-[calc(100vw-1.5rem)] rounded-xl p-3.5 z-50 animate-slide-down",
            "bg-card text-foreground border border-border shadow-[0_12px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl",
            dropup ? "bottom-full mb-2" : "top-full mt-2",
            align === "right" ? "end-0" : "start-0"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-foreground tracking-tight">
                Theme & Color Switcher
              </span>
            </div>
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
            >
              Live Sync
            </span>
          </div>

          {/* Mode Switcher (Light / Dark / System) */}
          <div className="space-y-1.5 mb-3.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Interface Mode
            </label>
            <div className="grid grid-cols-3 gap-1 bg-secondary/80 p-1 rounded-lg border border-border/60">
              {(
                [
                  { id: "light", label: "Light", Icon: Sun },
                  { id: "dark", label: "Dark", Icon: Moon },
                  { id: "system", label: "Auto", Icon: Laptop },
                ] as const
              ).map(({ id, label, Icon }) => {
                const isActive = mode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMode(id)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-150",
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Accent Preset
              </label>
              <span className="text-[11px] font-medium text-foreground font-mono">
                {activeAccent.name}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {accents.map((item) => {
                const isSelected = accent === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAccent(item.id)}
                    title={item.name}
                    className={cn(
                      "group relative flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-xs"
                        : "border-border/60 hover:border-border hover:bg-secondary/60"
                    )}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shadow-xs transition-transform group-hover:scale-110"
                      style={{ backgroundColor: item.hex }}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground mt-1 truncate max-w-full">
                      {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
