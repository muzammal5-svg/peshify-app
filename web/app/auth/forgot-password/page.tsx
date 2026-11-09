"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase, IS_SUPABASE_CONFIGURED } from "@/lib/supabase/client";
import { Logo } from "@/components/shared/Logo";
import { LangSwitcher } from "@/components/shared/LangSwitcher";

export default function ForgotPasswordPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ur";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!IS_SUPABASE_CONFIGURED) return;
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (err) setError(err.message);
      else setSent(true);
    } catch {
      setError(t("auth.networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-400/20 font-sans">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between relative z-20">
        <Link href="/" className="flex items-center gap-2 min-h-[44px]">
          <Logo size="md" variant="full" inverted />
        </Link>
        <div className="flex items-center gap-3">
          <LangSwitcher className="min-h-[44px]" />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-7 sm:p-9 space-y-6 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-fade-in">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-1">
              <Mail className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-white">
              {t("auth.resetPassword")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xs leading-relaxed">
              {t("auth.resetEmailLabel")}
            </p>
          </div>

          {sent ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" strokeWidth={1.75} />
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                {t("auth.resetSent")}
              </p>
              <Link
                href="/auth/sign-in"
                className="mt-2 w-full h-12 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-xl text-sm flex items-center justify-center min-h-[48px]"
              >
                {t("auth.backToLogin")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label
                  htmlFor="reset-email"
                  className="block text-xs font-medium text-slate-300"
                >
                  {t("auth.email")}
                </label>
                <div className="relative">
                  <Mail
                    className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
                    strokeWidth={1.75}
                  />
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("auth.emailPlaceholder")}
                    disabled={loading}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 text-white rounded-xl text-sm ps-10 pe-4 py-3 min-h-[46px] transition-all outline-none placeholder:text-slate-600 disabled:opacity-50"
                  />
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-rose-400 text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75} />
                  <p className="leading-snug">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full h-12 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-xl text-sm flex items-center justify-center min-h-[48px] shadow-lg shadow-amber-400/10 transition-all disabled:opacity-50"
              >
                {loading ? t("common.loading") : t("auth.resetPassword")}
              </button>
            </form>
          )}

          <div className="flex flex-col items-center gap-2.5 pt-4 text-center border-t border-slate-800">
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" strokeWidth={1.75} />
              <span>{t("auth.backToLogin")}</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Peshify (Pvt) Ltd.
      </footer>
    </div>
  );
}
