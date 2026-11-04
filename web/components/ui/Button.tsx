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
  primary:   "bg-[#EDE8E0] text-[#050505] font-bold uppercase tracking-[0.12em] border border-[#EDE8E0] hover:bg-white active:bg-[#D8D2C6] focus-visible:ring-[#EDE8E0] focus-visible:ring-offset-[#050505]",
  secondary: "bg-transparent text-[#EDE8E0] font-semibold uppercase tracking-[0.12em] border border-[rgba(237,232,224,0.22)] hover:bg-[#EDE8E0] hover:text-[#050505] hover:border-[#EDE8E0] focus-visible:ring-[#EDE8E0] focus-visible:ring-offset-[#050505]",
  danger:    "bg-[#C45C5C]/15 text-[#C45C5C] font-semibold uppercase tracking-[0.08em] border border-[#C45C5C]/30 hover:bg-[#C45C5C]/25 focus-visible:ring-[#C45C5C] focus-visible:ring-offset-[#050505]",
  ghost:     "bg-transparent text-[#9A958C] hover:text-[#EDE8E0] hover:bg-white/[0.04] focus-visible:ring-[#EDE8E0] focus-visible:ring-offset-[#050505]",
  link:      "bg-transparent text-[#EDE8E0] underline-offset-4 hover:underline p-0 min-h-0 focus-visible:ring-[#EDE8E0] focus-visible:ring-offset-[#050505]",
};

const sizes: Record<ButtonSize, string> = {
  xs: "h-8  px-2.5 text-xs  gap-1",
  sm: "h-9  px-3   text-sm  gap-1.5",
  md: "h-12 px-4   text-sm  gap-2",
  lg: "h-14 px-6   text-base gap-2",
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
          "inline-flex items-center justify-center font-medium rounded-none",
          "transition-all duration-150 active:scale-[.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "select-none",
          variant !== "link" && (size === "xs" ? "min-h-[32px]" : size === "sm" ? "min-h-[36px]" : "min-h-[44px] min-w-[44px]"),
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
