"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Phone, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { supabase, IS_SUPABASE_CONFIGURED } from "@/lib/supabase/client";
import { Logo } from "@/components/shared/Logo";
import { LangSwitcher } from "@/components/shared/LangSwitcher";
import { cn } from "@/lib/utils";

// Feature flag: show OTP tab only when SMS provider is configured
const OTP_ENABLED = process.env.NEXT_PUBLIC_OTP_ENABLED === "true";

type Tab = "password" | "otp";
type OtpStep = "phone" | "verify";

export default function SignInPage() {
  const { t } = useTranslation();
  const router = useRouter();

  // ── Tab state ─────────────────────────────────────────────────────────────
  const [tab, setTab] = useState<Tab>("password");

  // ── Password login ────────────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ── OTP login ─────────────────────────────────────────────────────────────
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState<OtpStep>("phone");

  // ── Shared ────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Pre-fill email from localStorage if remember-me was set
  useEffect(() => {
    const saved = localStorage.getItem("mzm_remember_email");
    if (saved) { setEmail(saved); setRememberMe(true); }
  }, []);

  function clearMessages() { setError(null); setInfo(null); }

  // ── Password sign-in ──────────────────────────────────────────────────────
  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!IS_SUPABASE_CONFIGURED) return;
    clearMessages();
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(
          err.message.toLowerCase().includes("network")
            ? t("auth.networkError")
            : t("auth.invalidCreds")
        );
      } else {
        if (rememberMe) localStorage.setItem("mzm_remember_email", email);
        else localStorage.removeItem("mzm_remember_email");
        router.replace("/");
      }
    } catch {
      setError(t("auth.networkError"));
    } finally {
      setLoading(false);
    }
  }

  // ── OTP send ──────────────────────────────────────────────────────────────
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!IS_SUPABASE_CONFIGURED) return;
    clearMessages();
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({ phone });
      if (err) setError(err.message);
      else { setOtpStep("verify"); setInfo(t("auth.otpSent")); }
    } catch { setError(t("auth.networkError")); }
    finally { setLoading(false); }
  }

  // ── OTP verify ────────────────────────────────────────────────────────────
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!IS_SUPABASE_CONFIGURED) return;
    clearMessages();
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
      if (err) setError(t("auth.invalidOtp"));
      else router.replace("/");
    } catch { setError(t("auth.networkError")); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-dvh bg-[#050505] text-[#EDE8E0] flex flex-col items-center justify-center px-4 py-8 relative selection:bg-white/20">
      {/* Subtle perspective grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.08] z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(237,232,224,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(237,232,224,0.12) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="w-full max-w-sm bg-[#0A0A0A] border border-[rgba(237,232,224,0.12)] rounded-none shadow-[0_24px_64px_rgba(0,0,0,0.8)] overflow-hidden animate-fade-in relative z-10 text-[#EDE8E0]">

        <div className="p-7 space-y-6">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2 pb-2">
            <Logo size="lg" variant="full" inverted />
            <p className="text-xs text-[#9A958C] font-medium text-center leading-snug">
              {t("brand.tagline")}
            </p>
          </div>

          <LangSwitcher className="ms-auto max-w-32" />

          {/* Not-configured notice */}
          {!IS_SUPABASE_CONFIGURED && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-none p-3">
              <p className="text-xs font-semibold text-amber-300 mb-0.5">{t("auth.configTitle")}</p>
              <p className="text-xs text-amber-200">
                {t("auth.configAddKeys")} <code className="bg-[#111111] px-1 font-mono text-[#EDE8E0]">web/.env.local</code> {t("auth.configRestart")}
              </p>
            </div>
          )}

          {/* Tab switcher — only when OTP enabled */}
          {OTP_ENABLED && (
            <div className="flex bg-[#111111] border border-[rgba(237,232,224,0.14)] p-1 gap-1">
              {(["password", "otp"] as Tab[]).map((t_) => (
                <button
                  key={t_}
                  onClick={() => { setTab(t_); clearMessages(); }}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold uppercase tracking-[0.08em] transition-colors rounded-none",
                    tab === t_
                      ? "bg-[#EDE8E0] text-[#050505]"
                      : "text-[#9A958C] hover:text-[#EDE8E0]"
                  )}
                >
                  {t_ === "password" ? <Mail className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                  {t_ === "password" ? t("auth.email") : t("auth.loginWithOtp")}
                </button>
              ))}
            </div>
          )}

          {/* ── Password form ── */}
          {tab === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A958C]">{t("auth.email")}</label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5852] pointer-events-none" />
                  <input
                    id="email" type="email" autoComplete="email" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    placeholder={t("auth.emailPlaceholder")}
                    disabled={!IS_SUPABASE_CONFIGURED || loading}
                    className="input ps-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A958C]">{t("auth.password")}</label>
                <div className="relative">
                  <input
                    id="password" type={showPwd ? "text" : "password"}
                    autoComplete="current-password" required
                    value={password} onChange={e => setPassword(e.target.value)}
                    disabled={!IS_SUPABASE_CONFIGURED || loading}
                    className="input pe-10"
                  />
                  <button
                    type="button"
                    aria-label={showPwd ? t("auth.hidePassword") : t("auth.showPassword")}
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-[#9A958C] hover:text-[#EDE8E0] transition-colors p-0.5"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me + forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none min-h-0">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-none border border-[rgba(237,232,224,0.3)] bg-[#111111] accent-[#EDE8E0]"
                  />
                  <span className="text-xs font-medium text-[#9A958C]">{t("auth.rememberMe")}</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-[#EDE8E0] hover:underline"
                >
                  {t("auth.forgotPassword")}
                </Link>
              </div>

              {/* Error */}
              {error && (
                <div role="alert" className="flex items-start gap-2 bg-[#C45C5C]/10 border border-[#C45C5C]/30 p-2.5">
                  <AlertCircle className="w-4 h-4 text-[#C45C5C] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#C45C5C] font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !IS_SUPABASE_CONFIGURED || !email || !password}
                className="btn-primary w-full h-11 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {t("common.loading")}
                  </span>
                ) : (
                  <><span>{t("auth.signIn")}</span><ArrowRight className="w-4 h-4 rtl:rotate-180" /></>
                )}
              </button>
            </form>
          )}

          {/* ── OTP form ── */}
          {tab === "otp" && OTP_ENABLED && (
            <form onSubmit={otpStep === "phone" ? handleSendOtp : handleVerifyOtp} className="space-y-4" noValidate>
              {otpStep === "phone" ? (
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A958C]">{t("auth.phone")}</label>
                  <div className="relative">
                    <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5852] pointer-events-none" />
                    <input
                      id="phone" type="tel" autoComplete="tel" required
                      value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder={t("auth.phonePlaceholder")}
                      disabled={loading}
                      dir="ltr"
                      className="input ps-9"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-xs text-[#9A958C] font-medium">{info}</p>
                  <label htmlFor="otp" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A958C]">{t("auth.otpLabel")}</label>
                  <input
                    id="otp" type="text" inputMode="numeric" pattern="[0-9]*"
                    maxLength={6} required
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="input tracking-[0.4em] text-center text-lg font-mono font-bold text-[#EDE8E0]"
                    placeholder="000000"
                    disabled={loading}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => { setOtpStep("phone"); setOtp(""); clearMessages(); }}
                    className="text-xs font-semibold text-[#EDE8E0] hover:underline"
                  >
                    {t("auth.backToLogin")}
                  </button>
                </div>
              )}

              {error && (
                <div role="alert" className="flex items-start gap-2 bg-[#C45C5C]/10 border border-[#C45C5C]/30 p-2.5">
                  <AlertCircle className="w-4 h-4 text-[#C45C5C] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#C45C5C] font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (otpStep === "phone" ? !phone : otp.length < 6)}
                className="btn-primary w-full h-11"
              >
                {loading ? t("common.loading") : otpStep === "phone" ? t("auth.sendOtp") : t("auth.verifyOtp")}
              </button>
            </form>
          )}

        </div>
      </div>

      {/* Sign-up nudge */}
      <div className="mt-4 text-center text-xs text-[#9A958C] relative z-10">
        {t("marketing.regHaveAccount")}{' '}
        <Link href="/register" className="font-semibold text-[#EDE8E0] underline-offset-4 hover:underline">
          {t("marketing.signUp")}
        </Link>
      </div>

      {/* Version note */}
      <p className="mt-6 text-[#5C5852] text-xs relative z-10">{t("brand.name")} &copy; {new Date().getFullYear()}</p>
    </div>
  );
}
