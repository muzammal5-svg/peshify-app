"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Scale, LayoutDashboard, Gavel, Users, Bell, Settings,
  CalendarClock, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Editorial Luxury product mockup matching Kontrora's framed UI preview.
 * Renders a crisp dark chrome window with cause list / case diary tabs.
 */
export function HeroDashboard() {
  const { t } = useTranslation();
  const [panel, setPanel] = useState<"cause" | "cases">("cause");

  const stats = [
    { label: t("dashboard.todayCases"),   value: "12",  icon: CalendarClock },
    { label: t("dashboard.runningCases"), value: "48",  icon: Gavel },
    { label: t("dashboard.totalClients"), value: "156", icon: Users },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Window chrome */}
      <div className="overflow-hidden rounded-none border border-[rgba(237,232,224,0.12)] bg-[#0A0A0A] shadow-[0_24px_64px_rgba(0,0,0,0.8)]">
        {/* Top title bar */}
        <div className="flex items-center gap-3 border-b border-[rgba(237,232,224,0.12)] bg-[#111111] px-4 py-3">
          <span className="flex gap-2" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 font-mono text-[11px] text-[#9A958C]">
            <Activity className="h-3 w-3 text-[#EDE8E0]" aria-hidden="true" />
            peshify.com/chamber
          </span>
          <span className="ms-auto inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#EDE8E0] border border-[rgba(237,232,224,0.15)] bg-white/[0.03]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6B8F71] animate-pulse" aria-hidden="true" />
            {t("marketing.floatLive")}
          </span>
        </div>

        <div className="flex">
          {/* Side rail */}
          <div className="hidden w-14 shrink-0 flex-col items-center gap-3 border-e border-[rgba(237,232,224,0.12)] bg-[#0E0E0E] py-4 sm:flex" aria-hidden="true">
            {[LayoutDashboard, Gavel, Users, Bell, Scale].map((Icon, i) => (
              <span
                key={i}
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-none transition-colors",
                  i === 0 ? "bg-[#EDE8E0] text-[#050505]" : "text-[#5C5852] hover:text-[#EDE8E0]"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
            ))}
            <span className="mt-auto grid h-8 w-8 place-items-center text-[#5C5852]">
              <Settings className="h-3.5 w-3.5" />
            </span>
          </div>

          {/* Main panel */}
          <div className="min-w-0 flex-1 p-4 sm:p-6 bg-[#0A0A0A]">
            {/* Stat row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {stats.map((s) => (
                <div key={s.label} className="border border-[rgba(237,232,224,0.10)] bg-[#111111] p-3.5 flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9A958C]">
                    <s.icon className="h-3.5 w-3.5 text-[#EDE8E0]" aria-hidden="true" />
                    {s.label}
                  </span>
                  <p className="mt-0 sm:mt-1 font-heading text-xl sm:text-2xl font-bold text-[#EDE8E0]">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Panel switcher */}
            <div
              className="mt-5 inline-flex border border-[rgba(237,232,224,0.14)] bg-[#111111] p-0.5"
              role="tablist"
              aria-label={t("marketing.floatPreviewTabs")}
            >
              {(["cause", "cases"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={panel === key}
                  onClick={() => setPanel(key)}
                  className={cn(
                    "px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors focus-visible:outline-none",
                    panel === key
                      ? "bg-[#EDE8E0] text-[#050505]"
                      : "text-[#9A958C] hover:text-[#EDE8E0]"
                  )}
                >
                  {key === "cause" ? t("dashboard.todayPreview") : t("cases.running")}
                </button>
              ))}
            </div>

            {/* Mock rows */}
            <div className="mt-3.5 space-y-1.5" aria-hidden="true">
              {panel === "cause" ? (
                <>
                  <MockRow time="10:00" refNo="PLD/2214/2024" party="M/s Ahmed & Sons" court="Court 12" />
                  <MockRow time="11:30" refNo="CRR/0918/2024" party="Imtiaz vs State" court="Court 04" />
                  <MockRow time="01:15" refNo="CYB/3342/2024" party="Malik Traders" court="Court 07" />
                </>
              ) : (
                <>
                  <MockRow time="D-03" refNo="PLD/2214/2024" party="M/s Ahmed & Sons" court="Running" />
                  <MockRow time="D-11" refNo="CRR/0918/2024" party="Imtiaz vs State" court="Running" />
                  <MockRow time="D-19" refNo="CYB/3342/2024" party="Malik Traders" court="Running" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockRow({ time, refNo, party, court }: { time: string; refNo: string; party: string; court: string }) {
  return (
    <div className="flex items-center gap-3 border border-[rgba(237,232,224,0.08)] bg-[#111111] px-3.5 py-2.5 transition-colors duration-200 hover:bg-[#161616]">
      <span className="w-14 shrink-0 bg-white/[0.04] px-1.5 py-0.5 text-center font-mono text-[10px] font-bold text-[#EDE8E0] border border-[rgba(237,232,224,0.1)]">
        {time}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12px] font-semibold text-[#EDE8E0]">{party}</span>
        <span className="block truncate font-mono text-[10px] text-[#5C5852]">{refNo}</span>
      </span>
      <span className="hidden shrink-0 border border-[rgba(237,232,224,0.12)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A958C] sm:block">
        {court}
      </span>
    </div>
  );
}
