"use client";
import { Button, type ButtonProps } from "@/components/ui/Button";

export type LockProps = { disabled?: boolean; "aria-disabled"?: boolean; title?: string };

/**
 * Free Early Access — mutation controls are active for all users.
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
