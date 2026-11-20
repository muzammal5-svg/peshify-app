"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Scale,
  ShieldCheck,
  Sparkles,
  Check,
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Gavel,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { saasRpc } from "@/lib/supabase/saas";
import { Button } from "@/components/ui/Button";
import { FloatingField } from "@/components/billing/FloatingField";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { InternationalLocationFields, type LocationValues } from "@/components/marketing/InternationalLocationFields";
import { Logo } from "@/components/shared/Logo";

function RegisterForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const plan = params.get("plan") ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firmName, setFirmName] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [locationValues, setLocationValues] = useState<LocationValues>({
    country: "Pakistan",
    city: "",
    province: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const emailValid    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 8;
  const firmValid     = firmName.trim().length >= 2;
  const nameValid     = fullName.trim().length >= 2;
  const cityValid     = locationValues.city.trim().length >= 2;
  const countryValid  = (locationValues.country || "").trim().length >= 1;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    if (
      !firmValid ||
      !nameValid ||
      !emailValid ||
      !passwordValid ||
      !cityValid ||
      !countryValid
    ) {
      return;
    }

    setLoading(true);
    setError("");

    // 1. Instant registration via internal API (automatically confirms email so advocates can start immediately)
    let registrationSuccess = false;

    try {
      const resp = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          phone,
          firm_name: firmName,
          country: locationValues.country,
          city: locationValues.city,
          province: locationValues.province,
          location: locationValues.location || locationValues.country,
        }),
      });

      const resData = await resp.json();
      if (!resp.ok) {
        if (resp.status === 409 || resData?.error?.toLowerCase().includes("already")) {
          setError(t("auth.alreadyRegistered") || "An account with this email already exists. Please sign in.");
          setLoading(false);
          return;
        }
        // Try fallback to standard signUp if internal API route is somehow disabled
      } else if (resData?.success) {
        registrationSuccess = true;
      }
    } catch {
      // Network or runtime fallback
    }

    // 2. Fallback only if internal API was unreachable
    if (!registrationSuccess) {
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            firm_name: firmName,
            country: locationValues.country,
            city: locationValues.city,
            location: locationValues.location || locationValues.country,
            province: locationValues.province,
          },
        },
      });
      if (signUpErr) {
        setError(signUpErr.message);
        setLoading(false);
        return;
      }
      if (!data.user?.id) {
        setError("Registration failed. Please try again.");
        setLoading(false);
        return;
      }
    }

    // 3. Immediately sign in to establish active session
    const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signInErr || !signInData?.session) {
      setError(
        signInErr?.message || "Account created. Please sign in with your credentials."
      );
      setLoading(false);
      return;
    }

    // 4. Register firm in database under active user
    const { error: rpcErr } = await saasRpc.registerFirm(
      firmName,
      fullName,
      phone,
      {
        city: locationValues.city,
        province: locationValues.province,
        location: locationValues.location || locationValues.country,
      }
    );
    if (rpcErr) {
      setError(rpcErr.message);
      setLoading(false);
      return;
    }
    router.replace("/dashboard/");
  }

  const benefits = [
    "Full hearing diary for Supreme Courts, High Courts & District Benches",
    "Smart morning cause lists with automatic courtroom tracking",
    "Instant WhatsApp & email hearing alerts sent directly to clients",
    "Chamber-grade privacy, encrypted backups & team permissions",
  ];

  return (
    <div className="relative min-h-[calc(100dvh-140px)] overflow-hidden bg-slate-950 text-slate-100 px-3 sm:px-6 py-8 sm:py-12 md:py-16 font-sans">
      <div className="mx-auto w-full max-w-5xl">
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-[0_24px_64px_rgba(0,0,0,0.6)] lg:grid lg:grid-cols-[1fr_1.2fr]">

          {/* Left Brand Panel */}
          <aside className="relative overflow-hidden bg-gradient-to-br from-[#0B1B3A] via-[#0E234A] to-[#081329] border-b lg:border-b-0 lg:border-e border-slate-800 p-6 sm:p-8 lg:p-10 text-white flex flex-col justify-between">
            {/* Subtle decorative grid motif */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.08]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <Logo size="md" variant="full" inverted />
              </div>

              <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-amber-400/20">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                Free Early Access • No Card Required
              </div>

              <h1 className="mt-4 font-heading text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white">
                Upgrade your law practice to an intelligent digital diary
              </h1>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
                Register in under 60 seconds to organize cause lists, track bench hearings, and send client alerts worldwide.
              </p>

              {/* Benefits list */}
              <ul className="mt-6 space-y-3">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded bg-amber-400 text-slate-950">
                      <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>
                Chamber-grade confidentiality: TLS 1.3 encryption and dedicated advocate data ownership.
              </span>
            </div>
          </aside>

          {/* Form Panel */}
          <div className="bg-slate-900/60 p-6 sm:p-8 lg:p-10 text-slate-100">
            {plan && (
              <p className="mb-4 inline-flex items-center gap-2 border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-amber-300">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {t("marketing.regPlan", { plan })}
              </p>
            )}

            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-400"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4" noValidate>
              <FloatingField
                label={t("marketing.regFirmName")}
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                required
                autoComplete="organization"
                leftIcon={<Building2 className="h-4 w-4" />}
                valid={firmValid}
                error={touched && !firmValid ? t("marketing.regFirmNameRequired") : undefined}
              />

              {/* International Country, City & State/Province fields */}
              <InternationalLocationFields
                values={locationValues}
                onChange={setLocationValues}
                touched={touched}
              />

              <FloatingField
                label={t("marketing.regFullName")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                leftIcon={<User className="h-4 w-4" />}
                valid={nameValid}
                error={touched && !nameValid ? t("marketing.regFullNameRequired") : undefined}
              />

              <FloatingField
                label={t("auth.email")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                leftIcon={<Mail className="h-4 w-4" />}
                valid={emailValid}
                error={touched && !emailValid ? t("marketing.regEmailRequired") : undefined}
              />

              <FloatingField
                label={t("auth.password")}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                leftIcon={<Lock className="h-4 w-4" />}
                valid={passwordValid}
                error={touched && !passwordValid ? t("marketing.regPasswordRequired") : undefined}
                hint={t("marketing.regPasswordHint")}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" strokeWidth={1.75} />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={1.75} />
                    )}
                  </button>
                }
              />

              <FloatingField
                label={t("auth.phone")}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                leftIcon={<Phone className="h-4 w-4" />}
                valid={phone.trim().length >= 10}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10 transition-all disabled:opacity-50 min-h-[48px]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>{t("common.loading")}</span>
                  </span>
                ) : (
                  <>
                    <span>{t("marketing.regTitle")}</span>
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" strokeWidth={1.75} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs sm:text-sm text-slate-400">
              {t("marketing.regHaveAccount")}{" "}
              <Link
                href="/auth/sign-in"
                className="font-semibold text-amber-400 underline underline-offset-4 transition-colors hover:text-amber-300"
              >
                {t("marketing.signIn")}
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100 selection:bg-amber-400/20 overflow-x-clip">
      <PublicHeader overDark />
      <main>
        <Suspense fallback={<div className="min-h-dvh bg-slate-950" />}>
          <RegisterForm />
        </Suspense>
      </main>
      <PublicFooter />
    </div>
  );
}
