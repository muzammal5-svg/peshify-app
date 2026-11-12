"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2, Circle, ArrowRight, X, Sparkles,
  Briefcase, Users, MapPin, Languages
} from "lucide-react";
import { useLang } from "@/providers/LangProvider";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

interface OnboardingChecklistProps {
  caseCount: number;
  clientCount: number;
  className?: string;
}

export function OnboardingChecklist({
  caseCount,
  clientCount,
  className,
}: OnboardingChecklistProps) {
  const { t } = useTranslation();
  const { lang, setLang } = useLang();
  const { profile, firm } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("peshify_onboarding_dismissed");
    if (saved === "true") {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("peshify_onboarding_dismissed", "true");
  };

  const steps = [
    {
      id: "case",
      title: "Add your first litigation case",
      description: "Record parties, case ref number, and court room",
      completed: caseCount > 0,
      href: "/cases/new",
      icon: Briefcase,
    },
    {
      id: "client",
      title: "Add your first chamber client",
      description: "Store contact number and CNIC for WhatsApp alerts",
      completed: clientCount > 0,
      href: "/clients/new",
      icon: Users,
    },
    {
      id: "location",
      title: "Configure primary court & city",
      description: "Select your High Court bench and district courts",
      completed: !!(profile?.city || firm?.city),
      href: "/settings/courts",
      icon: MapPin,
    },
    {
      id: "lang",
      title: "Select your chamber language",
      description: "Toggle between Urdu (RTL) or English anytime",
      completed: true,
      onClick: () => setLang(lang === "en" ? "ur" : "en"),
      icon: Languages,
    },
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  // If already dismissed, completely done, or logged in as clerk, don't show
  if (!mounted || dismissed || completedCount === steps.length || profile?.role === "clerk") {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border border-primary/30 p-5 md:p-6 shadow-xs relative overflow-hidden",
        className
      )}
    >
      {/* Background glow */}
      <div className="absolute top-0 end-0 -translate-y-1/2 translate-x-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-primary/15 text-primary">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
            </span>
            <h3 className="text-sm md:text-base font-bold text-foreground tracking-tight">
              Chamber Setup Checklist
            </h3>
            <span className="text-[11px] font-bold text-primary font-mono px-2 py-0.5 rounded-full bg-primary/15 border border-primary/25">
              {completedCount} of {steps.length} done
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Complete these quick steps to get your practice fully operational on Peshify.
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
          title="Dismiss checklist"
          aria-label="Dismiss checklist"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mb-5 border border-border/60">
        <div
          className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        {steps.map((step) => {
          const Icon = step.icon;
          const inner = (
            <div
              className={cn(
                "p-3.5 rounded-xl border transition-all flex flex-col justify-between h-full group",
                step.completed
                  ? "bg-secondary/40 border-border/60 text-muted-foreground"
                  : "bg-card hover:bg-secondary/70 border-border/90 hover:border-primary/40 shadow-2xs"
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  step.completed
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-primary/10 text-primary"
                )}>
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </div>
                {step.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" strokeWidth={2} />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" strokeWidth={1.5} />
                )}
              </div>

              <div>
                <p className={cn(
                  "text-xs font-semibold leading-tight",
                  step.completed ? "line-through text-muted-foreground" : "text-foreground group-hover:text-primary transition-colors"
                )}>
                  {step.title}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                  {step.description}
                </p>
              </div>

              {!step.completed && (
                <div className="pt-2 mt-2 border-t border-border/40 flex items-center text-[11px] text-primary font-semibold gap-1">
                  <span>Start now</span>
                  <ArrowRight className="w-3 h-3 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                </div>
              )}
            </div>
          );

          if (step.href && !step.completed) {
            return (
              <Link key={step.id} href={step.href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                {inner}
              </Link>
            );
          }

          if (step.onClick) {
            return (
              <button key={step.id} onClick={step.onClick} className="block text-start w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                {inner}
              </button>
            );
          }

          return <div key={step.id}>{inner}</div>;
        })}
      </div>
    </div>
  );
}
