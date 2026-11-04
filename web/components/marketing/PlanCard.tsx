"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Check, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlanView {
  id: string;
  code: string;
  name: string;
  price_pkr: number | string;
  duration_months: number;
  max_users: number;
}

export const DEFAULT_PLANS: PlanView[] = [
  {
    id: "plan-monthly",
    code: "monthly",
    name: "Monthly Plan",
    price_pkr: 1000,
    duration_months: 1,
    max_users: 5,
  },
  {
    id: "plan-six-month",
    code: "six_month",
    name: "6 Months Plan",
    price_pkr: 5400,
    duration_months: 6,
    max_users: 5,
  },
  {
    id: "plan-yearly",
    code: "yearly",
    name: "Annual Plan",
    price_pkr: 9600,
    duration_months: 12,
    max_users: 5,
  },
];

/** Human cycle label for a plan duration. */
export function cycleKeyFor(months: number): "monthly" | "sixMonth" | "yearly" {
  if (months >= 12) return "yearly";
  if (months >= 6) return "sixMonth";
  return "monthly";
}

interface PlanCardProps {
  plan:        PlanView;
  selected?:   boolean;
  popular?:    boolean;
  /** Per-month price of the cheapest plan — used to compute the saving badge. */
  baselineMonthly?: number;
  onSelect?:   (plan: PlanView) => void;
  className?:  string;
  /** Hide the CTA when the card is used as a selector (billing portal). */
  showCta?:    boolean;
  ctaHref?:    string;
  ctaLabel?:   string;
}

export function PlanCard({
  plan,
  selected   = false,
  popular    = false,
  baselineMonthly,
  onSelect,
  className,
  showCta    = true,
  ctaHref,
  ctaLabel,
}: PlanCardProps) {
  const { t } = useTranslation();

  const price        = Number(plan.price_pkr) || 0;
  const months       = Math.max(1, plan.duration_months);
  const perMonth     = Math.round(price / months);
  const baseline     = baselineMonthly ?? perMonth;
  const saving       = baseline > 0 ? Math.round(((baseline - perMonth) / baseline) * 100) : 0;
  const cycleKey     = cycleKeyFor(months);

  const cycleLabel =
    cycleKey === "yearly"   ? t("marketing.planYearly")
    : cycleKey === "sixMonth" ? t("marketing.plan6Month")
    : t("marketing.planMonthly");

  const interactive = typeof onSelect === "function";

  const features = [
    "Supreme & High Court Cause Lists",
    "Automated Daily Hearing Diary",
    "Urdu & English WhatsApp Alerts",
    `Up to ${plan.max_users} Chamber Associates`,
    "Unlimited Case Files & Documents",
    "Court Fee & Retainer Ledger",
  ];

  const body = (
    <>
      {popular && (
        <span className="absolute -top-3 inset-x-0 flex justify-center">
          <span className="bg-[#EDE8E0] text-[#050505] text-[10px] font-bold uppercase tracking-[0.16em] px-3.5 py-1 rounded-none shadow-md">
            {t("marketing.planMostPopular")}
          </span>
        </span>
      )}

      {/* Badges */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A958C] border border-[rgba(237,232,224,0.12)] bg-white/[0.02] px-2.5 py-1">
          {cycleLabel}
        </span>

        <span className="flex items-center gap-2">
          {saving > 0 && (
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B8F71] border border-[#6B8F71]/30 bg-[#6B8F71]/10 px-2 py-0.5">
              {t("marketing.planSave", { percent: saving })}
            </span>
          )}
          {interactive && (
            <span
              className={cn(
                "grid h-6 w-6 shrink-0 place-items-center rounded-none border transition-colors",
                selected
                  ? "border-[#EDE8E0] bg-[#EDE8E0] text-[#050505]"
                  : "border-[rgba(237,232,224,0.22)] bg-transparent text-transparent"
              )}
              aria-hidden="true"
            >
              <Check className="h-3.5 w-3.5" />
            </span>
          )}
        </span>
      </div>

      {/* Name + price */}
      <div className="mt-5">
        <h3 className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#9A958C]">{plan.name}</h3>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="font-heading text-3xl sm:text-4xl font-bold leading-none text-[#EDE8E0]">
            Rs {price.toLocaleString()}
          </span>
          <span className="text-xs font-normal text-[#5C5852]">
            {t("marketing.planFor", { months })}
          </span>
        </div>
        <p className="mt-2 text-xs font-semibold text-[#EDE8E0]">
          {t("marketing.planPerMonth", { price: perMonth.toLocaleString() })}
        </p>
      </div>

      {/* Feature Checklist */}
      <div className="mt-6 pt-5 border-t border-[rgba(237,232,224,0.10)] space-y-2.5 flex-1">
        {features.map((feat, i) => (
          <div key={i} className="flex items-start gap-2.5 text-xs text-[#C8C2B8]">
            <Check className="w-3.5 h-3.5 text-[#EDE8E0] shrink-0 mt-0.5 opacity-80" />
            <span>{feat}</span>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <dl className="mt-6 space-y-2 border-t border-[rgba(237,232,224,0.08)] pt-4 text-xs">
        <div className="flex items-center justify-between gap-2">
          <dt className="text-[#9A958C]">{t("marketing.planSeats")}</dt>
          <dd className="inline-flex items-center gap-1.5 font-semibold text-[#EDE8E0]">
            <Users className="h-3.5 w-3.5 text-[#9A958C]" aria-hidden="true" />
            {t("pricing.users", { count: plan.max_users })}
          </dd>
        </div>
        {saving > 0 && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-[#9A958C]">{t("marketing.planYouSave")}</dt>
            <dd className="font-bold text-[#6B8F71]">
              Rs {Math.max(0, baseline * months - price).toLocaleString()}
            </dd>
          </div>
        )}
      </dl>

      {showCta && ctaHref && !interactive && (
        <Link
          href={ctaHref}
          className={cn(
            "group mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-none text-[11.5px] font-bold uppercase tracking-[0.14em] transition-all duration-200 active:scale-[0.99]",
            selected || popular
              ? "bg-[#EDE8E0] text-[#050505] hover:bg-white"
              : "bg-transparent text-[#EDE8E0] border border-[rgba(237,232,224,0.22)] hover:bg-[#EDE8E0] hover:text-[#050505]"
          )}
        >
          {ctaLabel ?? t("pricing.choosePlan")}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}
    </>
  );

  if (!interactive) {
    return (
      <div
        className={cn(
          "group relative flex h-full flex-col justify-between rounded-none border p-7 sm:p-8 bg-[#050505]",
          "border-[rgba(237,232,224,0.12)] transition-all duration-300 ease-out hover:border-[rgba(237,232,224,0.28)] hover:bg-[#0A0A0A]",
          popular && "border-[rgba(237,232,224,0.35)] bg-[#0A0A0A]/60 shadow-[0_16px_48px_rgba(0,0,0,0.6)]",
          className
        )}
      >
        {body}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(plan)}
      aria-pressed={selected}
      className={cn(
        "group relative flex h-full w-full flex-col justify-between rounded-none border p-6 text-start transition-all duration-200 bg-[#050505]",
        selected
          ? "border-[#EDE8E0] bg-[#0A0A0A]"
          : "border-[rgba(237,232,224,0.12)] hover:border-[rgba(237,232,224,0.25)] hover:bg-[#0A0A0A]",
        className
      )}
    >
      {body}
    </button>
  );
}
