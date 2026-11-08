"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

export type SubState = {
  status: string;
  days_left?: number;
  in_grace?: boolean;
  seats_used?: number;
  seats_max?: number;
  ends_at?: string;
};

type SubscriptionValue = {
  state: SubState;
  loading: boolean;
  status: string;
  canMutate: boolean;
  isLocked: boolean;
  inGrace: boolean;
  refresh: (silent?: boolean) => Promise<void>;
};

const freeFullAccessValue: SubscriptionValue = {
  state: {
    status: "active",
    days_left: 99999,
    in_grace: false,
    seats_used: 1,
    seats_max: 99999,
  },
  loading: false,
  status: "active",
  canMutate: true,
  isLocked: false,
  inGrace: false,
  refresh: async () => {},
};

const SubscriptionContext = createContext<SubscriptionValue>(freeFullAccessValue);

/**
 * 100% Free Full Access — all paywalls, restrictions, and plan locks neutralized.
 */
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const value = useMemo<SubscriptionValue>(() => freeFullAccessValue, []);
  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscriptionGate(): SubscriptionValue {
  const ctx = useContext(SubscriptionContext);
  return ctx ?? freeFullAccessValue;
}
