"use client";

import { useLang } from "@/providers/LangProvider";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { SupportedLang } from "@/i18n/config";

interface LangSwitcherProps {
  compact?:      boolean;   // icon-only pill
  singleToggle?: boolean;   // single icon/text button for tight spaces (collapsed sidebars)
  className?:    string;
}

export function LangSwitcher({ compact = false, singleToggle = false, className }: LangSwitcherProps) {
  const { t } = useTranslation();
  const { lang, setLang, languages } = useLang();

  if (singleToggle) {
    const nextLang = lang === "en" ? "ur" : "en";
    return (
      <button
        type="button"
        onClick={() => setLang(nextLang as SupportedLang)}
        title={lang === "en" ? "اردو میں تبدیل کریں (Switch to Urdu)" : "Switch to English"}
        aria-label={lang === "en" ? "Switch to Urdu" : "Switch to English"}
        className={cn(
          "w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-border/80 bg-secondary hover:bg-muted text-xs font-bold transition-all select-none shadow-xs",
          className
        )}
      >
        <span className="text-xs font-bold text-primary">
          {lang === "en" ? "اردو" : "EN"}
        </span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl overflow-hidden border border-border/80 bg-secondary/80 p-1 min-h-[44px]",
        compact ? "w-auto" : "w-full",
        className
      )}
      role="group"
      aria-label={t("settings.language")}
    >
      {languages.map((l) => {
        const active = lang === l.code;
        return (
          <button
            key={l.code}
            onClick={() => setLang(l.code as SupportedLang)}
            aria-pressed={active}
            aria-label={l.label}
            className={cn(
              "flex-1 min-h-[36px] py-1.5 px-3 text-xs font-semibold transition-all duration-150 rounded-lg flex items-center justify-center select-none",
              active
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-card/50"
            )}
          >
            {compact ? l.code.toUpperCase() : l.label}
          </button>
        );
      })}
    </div>
  );
}
