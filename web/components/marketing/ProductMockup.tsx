"use client";

import { useState } from "react";
import {
  Scale, Gavel, Calendar, Users, Bell, Search,
  ChevronRight, ArrowUpRight, CheckCircle2, ShieldCheck,
  Clock, Plus, Smartphone, Laptop, MessageSquare
} from "lucide-react";
import { Badge, HearingStatusBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function ProductMockup() {
  const [activeTab, setActiveTab] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Device switcher pill */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center p-1 rounded-xl bg-card border border-border/80 shadow-xs">
          <button
            onClick={() => setActiveTab("desktop")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all select-none min-h-[38px]",
              activeTab === "desktop"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Laptop className="w-4 h-4" strokeWidth={1.75} />
            <span>Desktop Chamber OS</span>
          </button>
          <button
            onClick={() => setActiveTab("mobile")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all select-none min-h-[38px]",
              activeTab === "mobile"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Smartphone className="w-4 h-4" strokeWidth={1.75} />
            <span>Mobile Advocate App</span>
          </button>
        </div>
      </div>

      {/* ── DESKTOP BROWSER FRAME ── */}
      <div className={cn(
        "relative rounded-2xl border border-white/10 bg-[#0A0D14] shadow-2xl overflow-hidden transition-all duration-300",
        activeTab === "mobile" ? "hidden md:block" : "block"
      )}>
        {/* Browser Chrome Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0E131F] border-b border-white/[0.08] text-xs text-muted-foreground">
          {/* Traffic lights */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/20" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/20" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/20" />
          </div>

          {/* URL bar */}
          <div className="flex items-center justify-center gap-2 px-4 py-1 rounded-lg bg-[#080B12] border border-white/[0.06] text-[11px] font-mono text-zinc-300 w-full max-w-sm mx-auto shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate">https://app.peshify.pk/cause-list/daily</span>
          </div>

          {/* Right badges */}
          <div className="flex items-center gap-2 text-[10px] font-semibold text-zinc-400">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Chamber Live
            </span>
          </div>
        </div>

        {/* Realistic Desktop App UI inside Frame */}
        <div className="flex min-h-[460px] text-foreground">
          {/* Mock Sidebar */}
          <div className="w-48 bg-[#090C15] border-e border-white/[0.06] p-4 flex flex-col justify-between hidden sm:flex">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 px-2">
                <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-xs">
                  P
                </div>
                <span className="font-bold text-xs text-zinc-100 tracking-tight">Peshify Chambers</span>
              </div>

              <div className="space-y-1 text-xs font-medium">
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-primary/15 text-primary font-semibold">
                  <Calendar className="w-4 h-4" strokeWidth={1.75} />
                  <span>Cause List</span>
                </div>
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200">
                  <Scale className="w-4 h-4" strokeWidth={1.75} />
                  <span>Running Cases</span>
                </div>
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200">
                  <Users className="w-4 h-4" strokeWidth={1.75} />
                  <span>Clients Directory</span>
                </div>
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200">
                  <Bell className="w-4 h-4" strokeWidth={1.75} />
                  <span>Reminders</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[11px] text-zinc-400">
              <p className="font-semibold text-zinc-200">Karachi High Court</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Bench 02 • Morning Call</p>
            </div>
          </div>

          {/* Mock Main View */}
          <div className="flex-1 p-5 md:p-6 space-y-5 bg-[#0B0F19]">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <span>Peshawar &amp; Islamabad Cause List</span>
                  <Badge variant="gold" size="sm">Today&apos;s Board</Badge>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  12 appearances scheduled • Supreme Court &amp; High Court Benches
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300">
                  Nov 2026
                </span>
                <span className="px-3 py-1 rounded-lg bg-primary text-primary-foreground font-semibold text-xs">
                  + Add Appearance
                </span>
              </div>
            </div>

            {/* Quick KPI stats inside mock */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#111726] border border-white/[0.06]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Today&apos;s Calls</span>
                <p className="text-xl font-bold font-mono text-zinc-100 mt-0.5">12 Cases</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111726] border border-white/[0.06]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Active Hearings</span>
                <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">4 In Court</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111726] border border-white/[0.06]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Stay Expiries</span>
                <p className="text-xl font-bold font-mono text-amber-400 mt-0.5">2 Notices</p>
              </div>
            </div>

            {/* Realistic Cause List Table */}
            <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#0E1422]">
              <table className="w-full text-start text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-zinc-400 text-[11px] font-semibold uppercase">
                    <th className="py-2.5 px-3 text-start">Sr</th>
                    <th className="py-2.5 px-3 text-start">Case Ref</th>
                    <th className="py-2.5 px-3 text-start">Parties</th>
                    <th className="py-2.5 px-3 text-start">Court / Judge</th>
                    <th className="py-2.5 px-3 text-start">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-mono font-bold text-primary">#01</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-zinc-200">WP 1042/2024</td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-zinc-100">Tariq Mahmood</span>
                      <span className="text-zinc-500 mx-1">vs</span>
                      <span className="text-zinc-300">Federation of Pakistan</span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-300">Court 02 • Hon. Justice S. Ali</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="success" size="sm" dot>Running</Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-mono font-bold text-primary">#02</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-zinc-200">Crl. Misc 421/2024</td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-zinc-100">State</span>
                      <span className="text-zinc-500 mx-1">vs</span>
                      <span className="text-zinc-300">Bilal Ahmad Khan</span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-300">Court 04 • Regular Board</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="warning" size="sm" dot>Pending</Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-mono font-bold text-primary">#03</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-zinc-200">C.A. 89/2023</td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-zinc-100">Haji Abdul Rehman</span>
                      <span className="text-zinc-500 mx-1">vs</span>
                      <span className="text-zinc-300">CDA Islamabad</span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-300">Supreme Court • Court 01</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="info" size="sm" dot>Adjourned</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── OVERLAPPING REALISTIC MOBILE PHONE FRAME ── */}
      <div className={cn(
        "transition-all duration-300",
        activeTab === "desktop"
          ? "hidden md:block absolute -bottom-10 -end-6 w-[280px] shadow-[0_30px_70px_rgba(0,0,0,0.85)] z-20"
          : "block w-full max-w-[320px] mx-auto shadow-2xl"
      )}>
        <div className="rounded-[40px] border-[6px] border-[#222938] bg-[#090C15] p-3 text-foreground shadow-2xl overflow-hidden ring-1 ring-white/10">
          {/* Dynamic Island Notch */}
          <div className="w-24 h-4 bg-black rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 me-2" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-900/60" />
          </div>

          {/* Mobile Screen Header */}
          <div className="flex items-center justify-between px-2 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-bold text-xs text-zinc-100">Peshify Mobile</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">09:41</span>
          </div>

          {/* Mobile Screen Body */}
          <div className="space-y-2.5 px-1 pb-2">
            <div className="p-3 rounded-2xl bg-[#111726] border border-white/[0.08]">
              <span className="text-[10px] font-bold uppercase text-zinc-400">Next Hearing</span>
              <p className="text-xs font-bold text-zinc-100 mt-0.5">WP 1042/2024</p>
              <p className="text-[11px] text-zinc-300">Court 02 • Bench S. Ali</p>
              <div className="mt-2 flex items-center justify-between">
                <Badge variant="success" size="sm" dot>Running</Badge>
                <span className="text-[10px] text-primary font-semibold">11:30 AM</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#111726] border border-white/[0.08]">
              <span className="text-[10px] font-bold uppercase text-zinc-400">WhatsApp Alert</span>
              <p className="text-xs font-semibold text-zinc-100 mt-0.5">Tariq vs Federation</p>
              <p className="text-[10px] text-zinc-400">Next date 18 Nov dispatched to client</p>
            </div>
          </div>

          {/* Mobile Bottom Tab Bar Mock */}
          <div className="mt-3 pt-2 border-t border-white/[0.08] flex items-center justify-around text-[9px] text-zinc-400">
            <div className="flex flex-col items-center text-primary font-bold">
              <Calendar className="w-4 h-4" strokeWidth={2} />
              <span>Cause</span>
            </div>
            <div className="flex flex-col items-center">
              <Scale className="w-4 h-4" strokeWidth={1.75} />
              <span>Cases</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-4 h-4" strokeWidth={1.75} />
              <span>Clients</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
