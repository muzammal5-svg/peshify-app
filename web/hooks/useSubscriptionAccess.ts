"use client";
import { useSubscriptionGate, type SubState } from "@/providers/SubscriptionProvider";

export type { SubState };

/**
 * Free Early Access — all users have active, unblocked access to all features.
 */
export function useSubscriptionAccess() {
  return useSubscriptionGate();
}
