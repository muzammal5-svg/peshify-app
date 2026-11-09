"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, CheckCircle2, Lock, AlertCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Logo } from "@/components/shared/Logo";
import { LangSwitcher } from "@/components/shared/LangSwitcher";

export default function ResetPasswordPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isRTL = i18n.language === "ur";

  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Supabase sends the session via URL hash on email-link redirect
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // Session is now active — allow form submission
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPwd.length < 8) {
      setError(t("profile.passwordMin"));
      return;
    }
    if (newPwd !== confirmPwd) {
      setError(t("profile.passwordMatch"));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password: newPwd });
      if (err) {
        setError(err.message);
      } else {
        setDone(true);
        setTimeout(() => router.replace("/"), 2000);
      }
    } catch {
      setError(t("auth.networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-400/20 font-sans">
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between relative z-20">
        <Link href="/" className="flex items-center gap-2 min-h-[44px]">
          <Logo size="md" variant="full" inverted />
        </Link>
        <div className="flex items-center gap-3">
          <LangSwitcher className="min-h-[44px]" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-7 sm:p-9 space-y-6 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-fade-in">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-1">
              <Lock className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-white">
              {t("auth.resetPassword")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xs leading-relaxed">
              {isRTL ? "اپنا نیا پاس ورڈ درج کریں" : "Set a new secure password for your chamber"}
            </p>
          </div>

          {done ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" strokeWidth={1.75} />
              <p className="text-sm font-semibold text-white">{t("profile.passwordChanged")}</p>
              <p className="text-xs text-slate-400">{t("common.loading")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label
                  htmlFor="new-password"
                  className="block text-xs font-medium text-slate-300"
                >
                  {t("profile.newPassword")}
                </label>
                <div className="relative">
                  <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" strokeWidth={1.75} />
                  <input
                    id="new-password"
                    type={showPwd ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 text-white rounded-xl text-sm ps-10 pe-12 py-3 min-h-[46px] transition-all outline-none placeholder:text-slate-600 disabled:opacity-50"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute end-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg"
                    aria-label={showPwd ? t("auth.hidePassword") : t("auth.showPassword")}
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" strokeWidth={1.75} /> : <Eye className="w-4 h-4" strokeWidth={1.75} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-medium text-slate-300"
                >
                  {t("profile.confirmPassword")}
                </label>
                <div className="relative">
                  <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" strokeWidth={1.75} />
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 text-white rounded-xl text-sm ps-10 pe-4 py-3 min-h-[46px] transition-all outline-none placeholder:text-slate-600 disabled:opacity-50"
                    disabled={loading}
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
                disabled={loading || !newPwd || !confirmPwd}
                className="w-full h-12 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-xl text-sm flex items-center justify-center min-h-[48px] shadow-lg shadow-amber-400/10 transition-all disabled:opacity-50"
              >
                {loading ? t("common.loading") : t("common.save")}
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

      <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Peshify (Pvt) Ltd.
      </footer>
    </div>
  );
}
