"use client";

import { useLang } from "@/providers/LangProvider";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { SupportedLang } from "@/i18n/config";

interface LangSwitcherProps {
  compact?:   boolean;   // icon-only pill
  className?: string;
}

export function LangSwitcher({ compact = false, className }: LangSwitcherProps) {
  const { t } = useTranslation();
  const { lang, setLang, languages } = useLang();

  return (
    <div
      className={cn(
        "flex rounded-none overflow-hidden border border-[rgba(237,232,224,0.14)] bg-[#111111] p-0.5",
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
              "flex-1 py-1.5 px-3 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors duration-150 rounded-none",
              active
                ? "bg-[#EDE8E0] text-[#050505]"
                : "bg-transparent text-[#9A958C] hover:text-[#EDE8E0]"
            )}
          >
            {compact ? l.code.toUpperCase() : l.label}
          </button>
        );
      })}
    </div>
  );
}
