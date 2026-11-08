"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import type { UserRole } from "@/types/supabase";

interface UseRequireAuthOptions {
  redirectTo?: string;
  allowedRoles?: UserRole[];
  unauthorizedTo?: string;
}

export function useRequireAuth({
  redirectTo = "/auth/sign-in",
  allowedRoles,
  unauthorizedTo = "/",
}: UseRequireAuthOptions = {}) {
  const { user, profile, loading, profileLoading, configured } = useAuth();
  const router = useRouter();
  const waitingForAuth = loading || (configured && !!user && profileLoading);

  useEffect(() => {
    if (waitingForAuth) return;
    if (!configured) return;
    if (!user) { router.replace(redirectTo); return; }
    if (!profile) { router.replace(redirectTo); return; }
    if (allowedRoles && !allowedRoles.includes(profile.role)) {
      router.replace(unauthorizedTo);
      return;
    }
  }, [waitingForAuth, user, profile, configured, router, redirectTo, allowedRoles, unauthorizedTo]);

  return { user, profile, loading: waitingForAuth || (configured && (!user || !profile)) };
}
