"use client";
import { Button, type ButtonProps } from "@/components/ui/Button";

export type LockProps = { disabled?: boolean; "aria-disabled"?: boolean; title?: string };

/**
 * 100% Free Full Access — mutation controls are permanently enabled for all users.
 */
export function useMutationLock() {
  return { canMutate: true, lock: {} as LockProps, renewTooltip: "" };
}

export function MutatingButton({ children, ...props }: ButtonProps) {
  return (
    <Button {...props}>
      {children}
    </Button>
  );
}
