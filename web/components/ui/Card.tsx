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
        "bg-card rounded-xl border border-border/80 shadow-xs text-foreground transition-all duration-200",
        paddingMap[padding],
        hover     && "hover:border-primary/40 hover:shadow-md hover:bg-card/90",
        clickable && "cursor-pointer active:scale-[.99] transition-transform focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1",
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
    <h3 className={cn("text-base font-semibold tracking-tight text-foreground", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-4 pt-3 border-t border-border/80 flex items-center gap-2 text-muted-foreground", className)} {...props}>
      {children}
    </div>
  );
}
