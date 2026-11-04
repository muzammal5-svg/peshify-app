"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";

/** The single subscription banner: trial notice + read-only grace notice + renewal call to action. */
export function SubscriptionBanner() {
  const { inGrace, status, state } = useSubscriptionAccess();
  const { t } = useTranslation();
  const isTrial = status === "trialing";
  if (!inGrace && !isTrial) return null;
  const days = typeof state?.days_left === "number" ? t("subscription.graceDaysLeft", { days: state.days_left }) : "";
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-5 text-sm flex flex-wrap items-center justify-between gap-3 text-amber-200">
      <span className="text-zinc-200">
        {isTrial
          ? t("subscription.trialNotice", { days: state?.days_left ?? 7 })
          : t("subscription.graceNotice")}
        {!isTrial && days ? <span className="text-zinc-400"> {days}</span> : null}
      </span>
      <Link href="/billing" className="btn-primary shrink-0 whitespace-nowrap px-4 py-2 text-xs">
        {t("subscription.renew")}
      </Link>
    </div>
  );
}
