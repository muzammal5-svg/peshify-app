import { type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children:    ReactNode;
  padding?:    "none" | "sm" | "md" | "lg";
  hover?:      boolean;
  clickable?:  boolean;
  variant?:    "light" | "dark";
}

const paddingMap = {
  none: "p-0",
  sm:   "p-3",
  md:   "p-4",
  lg:   "p-6",
};

export function Card({
  children,
  padding    = "md",
  hover      = false,
  clickable  = false,
  variant    = "light",
  className,
  ...props
}: CardProps) {
  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      className={cn(
        "bg-[#111111] rounded-none border border-[rgba(237,232,224,0.12)] shadow-none text-[#EDE8E0]",
        paddingMap[padding],
        hover     && "hover:border-[rgba(237,232,224,0.25)] hover:bg-[#171717] transition-all duration-200",
        clickable && "cursor-pointer active:scale-[.99] transition-transform focus-visible:ring-1 focus-visible:ring-[#EDE8E0] focus-visible:ring-offset-[#050505]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ── Card sub-components ───────────────────────────────────────────────────────

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center justify-between mb-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-semibold tracking-tight text-zinc-50", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-sm text-zinc-400", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-4 pt-3 border-t border-white/[0.08] flex items-center gap-2 text-zinc-400", className)} {...props}>
      {children}
    </div>
  );
}
