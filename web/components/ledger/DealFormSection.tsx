"use client";

import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, Wallet, Shield } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

export interface DealFormValues {
  enabled: boolean;
  title: string;
  agreedAmount: number | "";
  advanceReceived: number | "";
  paymentMethod: "cash" | "bank" | "easypaisa" | "jazzcash" | "cheque" | "other";
  caseId: string;
  notes: string;
}

interface DealFormSectionProps {
  values: DealFormValues;
  onChange: (updates: Partial<DealFormValues>) => void;
  cases?: Array<{ id: string; case_ref_no?: string | null; plaintiff_name: string; defendant_name: string }>;
}

export function DealFormSection({
  values,
  onChange,
  cases = [],
}: DealFormSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border/80 overflow-hidden bg-card transition-all">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => onChange({ enabled: !values.enabled })}
        className="w-full p-4 flex items-center justify-between gap-3 text-start hover:bg-secondary/40 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              Fee &amp; Retainer Details (Optional)
            </p>
            <p className="text-xs text-muted-foreground">
              Record agreed retainer amount and initial advance payment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground flex-shrink-0">
          <span className="text-xs font-semibold hidden sm:inline">
            {values.enabled ? "Collapse" : "Expand"}
          </span>
          {values.enabled ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Form Fields (Revealed when open) */}
      {values.enabled && (
        <div className="p-4 pt-1 border-t border-border/60 space-y-4 bg-secondary/20">
          <Input
            label="Deal / Representation Title"
            placeholder="e.g. Legal Representation Agreement"
            value={values.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Agreed Fee / Retainer Amount"
              type="number"
              min="0"
              step="500"
              placeholder="50000"
              value={values.agreedAmount === "" ? "" : values.agreedAmount}
              onChange={(e) =>
                onChange({
                  agreedAmount: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
                })
              }
            />

            <Input
              label="Advance Received"
              type="number"
              min="0"
              step="500"
              placeholder="0"
              value={values.advanceReceived === "" ? "" : values.advanceReceived}
              onChange={(e) =>
                onChange({
                  advanceReceived: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Payment Method (For Advance)"
              value={values.paymentMethod}
              options={[
                { value: "cash", label: "Cash" },
                { value: "bank", label: "Bank Transfer / Wire" },
                { value: "cheque", label: "Check / Cheque" },
                { value: "easypaisa", label: "Mobile Wallet (EasyPaisa/JazzCash)" },
                { value: "other", label: "Other / Card" },
              ]}
              onChange={(e) =>
                onChange({
                  paymentMethod: e.target.value as DealFormValues["paymentMethod"],
                })
              }
            />

            {cases.length > 0 ? (
              <Select
                label="Linked Case (Optional)"
                value={values.caseId}
                options={[
                  {
                    value: "",
                    label: "-- No specific case --",
                  },
                  ...cases.map((c) => ({
                    value: c.id,
                    label: `${c.case_ref_no ? `[${c.case_ref_no}] ` : ""}${c.plaintiff_name} vs ${c.defendant_name}`,
                  })),
                ]}
                onChange={(e) => onChange({ caseId: e.target.value })}
              />
            ) : null}
          </div>

          <Textarea
            label="Payment Terms / Notes (Optional)"
            placeholder="e.g. Balance payable in 2 installments"
            rows={2}
            value={values.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}
