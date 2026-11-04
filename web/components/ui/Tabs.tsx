"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// ─── Context ──────────────────────────────────────────────────────────────────
interface TabsCtx { active: string; setActive: (v: string) => void }
const Ctx = createContext<TabsCtx>({ active: "", setActive: () => {} });

// ─── Root ─────────────────────────────────────────────────────────────────────
interface TabsProps {
  defaultValue: string;
  children:     ReactNode;
  className?:   string;
  onChange?:    (value: string) => void;
}

export function Tabs({ defaultValue, children, className, onChange }: TabsProps) {
  const [active, setActiveState] = useState(defaultValue);
  const setActive = (v: string) => { setActiveState(v); onChange?.(v); };
  return (
    <Ctx.Provider value={{ active, setActive }}>
      <div className={cn("w-full", className)}>{children}</div>
    </Ctx.Provider>
  );
}

// ─── Tab List ─────────────────────────────────────────────────────────────────
interface TabListProps { children: ReactNode; className?: string }

export function TabList({ children, className }: TabListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex gap-0 border-b border-white/[0.08] overflow-x-auto scrollbar-hide",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Tab Trigger ──────────────────────────────────────────────────────────────
interface TabTriggerProps {
  value:      string;
  children:   ReactNode;
  className?: string;
  count?:     number;
}

export function TabTrigger({ value, children, className, count }: TabTriggerProps) {
  const { active, setActive } = useContext(Ctx);
  const isActive = active === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      onClick={() => setActive(value)}
      className={cn(
        "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap",
        "border-b-2 -mb-px transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        isActive
          ? "border-indigo-500 text-indigo-400 font-semibold shadow-[inset_0_-2px_0_#6366F1]"
          : "border-transparent text-zinc-400 font-medium hover:text-zinc-200 hover:border-zinc-700",
        className
      )}
    >
      {children}
      {count !== undefined && (
        <span className={cn(
          "text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center",
          isActive ? "bg-indigo-500/20 text-indigo-300" : "bg-zinc-800 text-zinc-400"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}

// ─── Tab Panel ────────────────────────────────────────────────────────────────
interface TabPanelProps { value: string; children: ReactNode; className?: string }

export function TabPanel({ value, children, className }: TabPanelProps) {
  const { active } = useContext(Ctx);
  if (active !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={cn("pt-4", className)}
    >
      {children}
    </div>
  );
}
