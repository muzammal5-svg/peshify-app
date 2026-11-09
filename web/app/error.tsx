"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console or error monitor
    console.error("Peshify runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-400/20">
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 min-h-[44px]">
          <Logo size="md" variant="full" inverted />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg text-center space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertTriangle className="w-8 h-8" strokeWidth={1.75} />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest text-rose-400">
              System Alert &bull; Application Error
            </p>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              An Unexpected Error Occurred
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              We encountered an issue while loading this legal view. Your chamber data is secure.
            </p>
            {error.digest && (
              <p className="text-[11px] font-mono text-slate-500 pt-1">
                Ref ID: {error.digest}
              </p>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-semibold shadow-lg shadow-amber-400/10 transition-all min-h-[46px]"
            >
              <RefreshCw className="w-4 h-4" strokeWidth={1.75} />
              <span>Try Again</span>
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-colors min-h-[46px]"
            >
              <Home className="w-4 h-4" strokeWidth={1.75} />
              <span>Return to Dashboard</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-4 py-5 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Peshify (Pvt) Ltd. All rights reserved.
      </footer>
    </div>
  );
}
