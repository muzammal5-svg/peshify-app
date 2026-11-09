"use client";

import { type ReactNode, type ComponentType } from "react";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";

export interface StatCardProps {
  label: string;
  value: number | string;
  trend?: string;
  trendVariant?: BadgeVariant;
  icon: LucideIcon | ComponentType<{ className?: string; strokeWidth?: number | string }>;
  iconBg?: string;
  href?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  trend,
  trendVariant = "neutral",
  icon: Icon,
  iconBg = "bg-primary/10 text-primary border-primary/20",
  href,
  className,
}: StatCardProps) {
  const content = (
    <div
      className={cn(
        "group relative bg-card border border-border/80 hover:border-primary/40 rounded-2xl p-5 md:p-6 transition-all duration-200 hover:shadow-md shadow-xs active:scale-[0.99] flex flex-col justify-between overflow-hidden",
        href && "cursor-pointer",
        className
      )}
    >
      {/* Top row: Tinted icon + trend context pill */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105",
            iconBg
          )}
        >
          <Icon className="w-5 h-5" strokeWidth={1.75} />
        </div>
        {trend && (
          <Badge variant={trendVariant} size="sm" dot>
            {trend}
          </Badge>
        )}
      </div>

      {/* Label */}
      <p className="text-muted-foreground text-[11px] md:text-xs font-semibold uppercase tracking-wider mb-1 truncate">
        {label}
      </p>

      {/* Large tabular numeral value + optional chevron */}
      <div className="flex items-baseline justify-between mt-auto">
        <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight font-sans tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {href && (
          <div className="w-7 h-7 rounded-lg bg-secondary/80 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-all">
            <ChevronRight className="w-4 h-4 rtl:rotate-180" strokeWidth={1.75} />
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl">
        {content}
      </Link>
    );
  }

  return content;
}
