import { Check } from "lucide-react";
import { cn }    from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface Step {
  label:    string;
  optional?: boolean;
}

interface StepIndicatorProps {
  steps:      Step[];
  current:    number;   // 0-indexed
  className?: string;
}

export function StepIndicator({ steps, current, className }: StepIndicatorProps) {
  const { t } = useTranslation();
  return (
    <div className={cn("flex items-center", className)}         aria-label={t("common.progress")}>
      {steps.map((step, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-colors duration-200",
                  done   && "bg-[#EDE8E0] border-[#EDE8E0] text-[#050505]",
                  active && "bg-[#111111] border-[#EDE8E0] text-[#EDE8E0]",
                  !done && !active && "bg-[#0A0A0A] border-[rgba(237,232,224,0.14)] text-[#5C5852]"
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn(
                "text-[10px] font-medium whitespace-nowrap",
                active ? "text-[#EDE8E0] font-semibold" : done ? "text-[#EDE8E0]" : "text-[#5C5852]"
              )}>
                {step.label}
                {step.optional && <span className="text-[#5C5852] ms-1">({t("common.optional")})</span>}
              </span>
            </div>
            {/* Connector */}
            {i < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2 -mt-5 rounded",
                i < current ? "bg-[#EDE8E0]" : "bg-white/[0.08]"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
