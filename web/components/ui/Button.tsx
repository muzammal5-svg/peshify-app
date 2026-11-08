import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "link";
export type ButtonSize    = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  loading?:   boolean;
  leftIcon?:  ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:   "bg-primary text-primary-foreground font-semibold shadow-xs hover:opacity-90 active:scale-[0.98] border border-white/10 focus-visible:ring-primary",
  secondary: "bg-secondary text-foreground font-medium border border-border/80 hover:bg-muted hover:border-border-strong active:scale-[0.98] focus-visible:ring-primary",
  danger:    "bg-red-500/10 text-red-500 dark:text-red-400 font-semibold border border-red-500/20 hover:bg-red-500/20 focus-visible:ring-red-500",
  ghost:     "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary focus-visible:ring-primary",
  link:      "bg-transparent text-primary underline-offset-4 hover:underline p-0 min-h-0 focus-visible:ring-primary",
};

const sizes: Record<ButtonSize, string> = {
  xs: "h-7  px-2.5 text-xs  gap-1 rounded-md",
  sm: "h-9  px-3   text-xs font-medium gap-1.5 rounded-lg",
  md: "h-10 px-4   text-sm font-medium gap-2 rounded-lg",
  lg: "h-12 px-6   text-base font-medium gap-2 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant   = "primary",
      size      = "md",
      loading   = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          // Base
          "inline-flex items-center justify-center font-medium rounded-lg",
          "transition-all duration-150 active:scale-[.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "select-none",
          variant !== "link" && (size === "xs" ? "min-h-[30px]" : size === "sm" ? "min-h-[36px]" : "min-h-[40px] min-w-[40px]"),
          // Variant + size
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          leftIcon
        )}
        {children && <span>{children}</span>}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
