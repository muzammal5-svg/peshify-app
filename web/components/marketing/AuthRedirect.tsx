"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasStoredSession } from "@/hooks/useStoredSession";

/**
 * Client-only silent redirect for already-authenticated counsel.
 * Runs only in the browser after initial hydration so the public
 * HTML output is 100% preserved for search engine crawlers.
 */
export function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && hasStoredSession()) {
      router.replace("/dashboard/");
    }
  }, [router]);

  return null;
}
