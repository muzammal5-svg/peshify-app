"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Eye,
  EyeOff,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CalendarDays,
  Scale,
  Languages,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { supabase, IS_SUPABASE_CONFIGURED } from "@/lib/supabase/client";
import { Logo } from "@/components/shared/Logo";
import { LangSwitcher } from "@/components/shared/LangSwitcher";
import { cn } from "@/lib/utils";

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
    const saved = localStorage.getItem("peshify_remember_email");
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  function clearMessages() {
    setError(null);
    setInfo(null);
  }

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
        if (rememberMe) localStorage.setItem("peshify_remember_email", email);
        else localStorage.removeItem("peshify_remember_email");
        router.replace("/dashboard/");
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
      else {
        setOtpStep("verify");
        setInfo(t("auth.otpSent"));
      }
    } catch {
      setError(t("auth.networkError"));
    } finally {
      setLoading(false);
    }
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
      else router.replace("/dashboard/");
    } catch {
      setError(t("auth.networkError"));
    } finally {
      setLoading(false);
    }
  }

  const chamberHighlights = [
    {
      icon: CalendarDays,
      title: "Smart Daily Cause Lists & Hearing Diary",
      desc: "Track daily courtroom hearings and benches effortlessly",
    },
    {
      icon: Scale,
      title: "Multi-Jurisdiction Docket Coverage",
      desc: "Engineered for trial courts, appellate benches, and international tribunals",
    },
    {
      icon: MessageCircle,
      title: "Instant WhatsApp & Email Notices",
      desc: "Keep clients updated with official hearing date alerts and orders",
    },
    {
      icon: ShieldCheck,
      title: "Chamber-Grade Data Privacy",
      desc: "Strict access controls, TLS 1.3 encryption, and complete multi-tenant isolation",
    },
  ];

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-400/20 font-sans">
      {/* Top Mobile Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between relative z-20">
        <Link href="/" className="flex items-center gap-2 group min-h-[44px]">
          <Logo size="md" variant="full" inverted />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5 min-h-[44px] flex items-center"
          >
            Back to Home &rarr;
          </Link>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden">

          {/* Left Brand Panel (Desktop Only) */}
          <aside className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#0B1B3A] via-[#0E234A] to-[#081329] p-10 flex-col justify-between border-e border-white/10 relative overflow-hidden">
            {/* Subtle decorative grid motif */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.08]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
              aria-hidden="true"
            />
            {/* Subtle glow */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-amber-400/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                Built for Modern Law Practices & Counsel
              </span>

              <h2 className="text-2xl xl:text-3xl font-heading font-bold text-white leading-tight">
                Organize your cases, court dockets, and hearing diaries.
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                The intelligent case management platform and court hearing diary engineered for litigation counsel worldwide.
              </p>

              {/* Highlights List */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                {chamberHighlights.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-amber-300 border border-white/10 mt-0.5">
                        <Icon className="w-4 h-4" strokeWidth={1.75} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                        <p className="text-[11px] text-slate-300 leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chamber Trust Quote */}
            <div className="relative z-10 pt-6 border-t border-white/10 mt-8">
              <blockquote className="text-xs text-slate-300 italic leading-relaxed">
                &ldquo;DiaryLex brings clarity and speed to daily hearing diaries, cause lists, and client communication across our litigation practice.&rdquo;
              </blockquote>
              <p className="text-[11px] text-amber-300 font-medium mt-2">
                — Senior Litigation Counsel &amp; Law Partner
              </p>
            </div>
          </aside>

          {/* Right Form Panel (Mobile + Desktop) */}
          <div className="col-span-1 lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full space-y-6">

              {/* Form Header */}
              <div>
                <h1 className="text-2xl font-heading font-bold text-white tracking-tight">
                  Sign in to your chamber
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                  Access your daily cause lists, case files, and client updates
                </p>
              </div>

              {/* Supabase not configured warning */}
              {!IS_SUPABASE_CONFIGURED && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                  <p className="font-semibold text-amber-300 mb-0.5">{t("auth.configTitle")}</p>
                  <p>
                    {t("auth.configAddKeys")}{" "}
                    <code className="bg-slate-900 px-1 py-0.5 rounded font-mono text-white">web/.env.local</code>{" "}
                    {t("auth.configRestart")}
                  </p>
                </div>
              )}

              {/* Tab switcher (if OTP enabled) */}
              {OTP_ENABLED && (
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
                  {(["password", "otp"] as Tab[]).map((t_) => (
                    <button
                      key={t_}
                      type="button"
                      onClick={() => {
                        setTab(t_);
                        clearMessages();
                      }}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-colors min-h-[44px]",
                        tab === t_
                          ? "bg-slate-800 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      )}
                    >
                      {t_ === "password" ? (
                        <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
                      ) : (
                        <Phone className="w-3.5 h-3.5" strokeWidth={1.75} />
                      )}
                      {t_ === "password" ? t("auth.email") : t("auth.loginWithOtp")}
                    </button>
                  ))}
                </div>
              )}

              {/* Password Login Form */}
              {tab === "password" && (
                <form onSubmit={handlePasswordLogin} className="space-y-4" noValidate>
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
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
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("auth.emailPlaceholder")}
                        disabled={!IS_SUPABASE_CONFIGURED || loading}
                        className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 text-white rounded-xl text-sm ps-10 pe-4 py-3 min-h-[46px] transition-all outline-none placeholder:text-slate-600 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-xs font-medium text-slate-300"
                      >
                        {t("auth.password")}
                      </label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors p-1"
                      >
                        {t("auth.forgotPassword")}
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock
                        className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
                        strokeWidth={1.75}
                      />
                      <input
                        id="password"
                        type={showPwd ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={!IS_SUPABASE_CONFIGURED || loading}
                        className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 text-white rounded-xl text-sm ps-10 pe-12 py-3 min-h-[46px] transition-all outline-none placeholder:text-slate-600 disabled:opacity-50"
                      />
                      <button
                        type="button"
                        aria-label={showPwd ? t("auth.hidePassword") : t("auth.showPassword")}
                        onClick={() => setShowPwd((v) => !v)}
                        className="absolute end-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg"
                      >
                        {showPwd ? (
                          <EyeOff className="w-4 h-4" strokeWidth={1.75} />
                        ) : (
                          <Eye className="w-4 h-4" strokeWidth={1.75} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none min-h-[36px]">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-400/20 focus:ring-offset-0"
                      />
                      <span className="text-xs text-slate-400">{t("auth.rememberMe")}</span>
                    </label>
                  </div>

                  {/* Error Notification */}
                  {error && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-rose-400 text-xs animate-shake"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75} />
                      <p className="leading-snug">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !IS_SUPABASE_CONFIGURED || !email || !password}
                    className="w-full h-12 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99] min-h-[48px]"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        <span>{t("common.loading")}</span>
                      </span>
                    ) : (
                      <>
                        <span>{t("auth.signIn")}</span>
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" strokeWidth={1.75} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* OTP Form (only when OTP enabled) */}
              {tab === "otp" && OTP_ENABLED && (
                <form
                  onSubmit={otpStep === "phone" ? handleSendOtp : handleVerifyOtp}
                  className="space-y-4"
                  noValidate
                >
                  {otpStep === "phone" ? (
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="block text-xs font-medium text-slate-300">
                        {t("auth.phone")}
                      </label>
                      <div className="relative">
                        <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" strokeWidth={1.75} />
                        <input
                          id="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={t("auth.phonePlaceholder")}
                          disabled={loading}
                          dir="ltr"
                          className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 text-white rounded-xl text-sm ps-10 pe-4 py-3 min-h-[46px] transition-all outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {info && <p className="text-xs text-emerald-400">{info}</p>}
                      <label htmlFor="otp" className="block text-xs font-medium text-slate-300">
                        {t("auth.otpLabel")}
                      </label>
                      <input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-slate-950/70 border border-slate-800 text-center text-xl font-mono font-bold tracking-[0.4em] text-white rounded-xl py-3 min-h-[46px]"
                        placeholder="000000"
                        disabled={loading}
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep("phone");
                          setOtp("");
                          clearMessages();
                        }}
                        className="text-xs font-medium text-amber-400 hover:text-amber-300 underline py-1"
                      >
                        {t("auth.backToLogin")}
                      </button>
                    </div>
                  )}

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
                    disabled={loading || (otpStep === "phone" ? !phone : otp.length < 6)}
                    className="w-full h-12 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-xl text-sm flex items-center justify-center min-h-[48px]"
                  >
                    {loading
                      ? t("common.loading")
                      : otpStep === "phone"
                      ? t("auth.sendOtp")
                      : t("auth.verifyOtp")}
                  </button>
                </form>
              )}

              {/* Sign up link */}
              <div className="pt-4 border-t border-slate-800 text-center">
                <p className="text-xs sm:text-sm text-slate-400">
                  {t("marketing.regHaveAccount")}{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4 transition-colors"
                  >
                    {t("marketing.signUp")}
                  </Link>
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} DiaryLex Technologies Ltd. Intelligent Legal Case Management.
        </p>
      </footer>
    </div>
  );
}
