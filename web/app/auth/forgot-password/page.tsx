"use client";

import { useState }          from "react";
import Link                  from "next/link";
import { useTranslation }    from "react-i18next";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { supabase, IS_SUPABASE_CONFIGURED } from "@/lib/supabase/client";
import { Logo }  from "@/components/shared/Logo";
import { BRAND } from "@/lib/brand";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);

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
      else     setSent(true);
    } catch { setError(t("auth.networkError")); }
    finally  { setLoading(false); }
  }

  return (
    <div className="min-h-dvh bg-[#050505] text-[#EDE8E0] flex flex-col items-center justify-center px-4 py-8 relative selection:bg-white/20">
      <div className="w-full max-w-sm bg-[#111111] border border-[rgba(237,232,224,0.14)] p-7 space-y-6 animate-fade-in shadow-[0_16px_40px_rgba(0,0,0,0.85)]">
        <div className="flex flex-col items-center gap-2">
          <Logo size="md" variant="mark" />
          <h1 className="text-lg font-heading font-semibold text-[#EDE8E0]">{t("auth.resetPassword")}</h1>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <CheckCircle className="w-12 h-12 text-[#6B8F71]" />
            <p className="text-sm text-[#EDE8E0] font-medium">{t("auth.resetSent")}</p>
            <Link href="/auth/sign-in" className="btn-primary px-6">
              {t("auth.backToLogin")}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <p className="text-xs text-[#9A958C]">{t("auth.resetEmailLabel")}</p>
            <div className="space-y-1.5">
              <label htmlFor="reset-email" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A958C]">{t("auth.email")}</label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5852] pointer-events-none" />
                <input
                  id="reset-email" type="email" autoComplete="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={t("auth.emailPlaceholder")}
                  disabled={loading}
                  className="input ps-9"
                />
              </div>
            </div>
            {error && (
              <div role="alert" className="flex items-start gap-2 bg-[#C45C5C]/10 border border-[#C45C5C]/30 p-2.5">
                <p className="text-xs text-[#E58080] font-medium">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !email}
              className="btn-primary w-full"
            >
              {loading ? t("common.loading") : t("auth.resetPassword")}
            </button>
          </form>
        )}

        <div className="flex flex-col items-center gap-2 pt-2 text-center border-t border-[rgba(237,232,224,0.08)]">
          <Link href="/auth/sign-in" className="flex items-center justify-center gap-1 text-xs font-semibold text-[#EDE8E0] hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> {t("auth.backToLogin")}
          </Link>
          <Link href="/register" className="text-xs text-[#9A958C] hover:text-[#EDE8E0] hover:underline">
            {t("marketing.signUp")}
          </Link>
        </div>
      </div>
    </div>
  );
}
