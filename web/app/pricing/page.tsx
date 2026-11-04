"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Check, ArrowRight } from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { Reveal } from "@/components/marketing/Reveal";
import { saasDb } from "@/lib/supabase/saas";
import { DEFAULT_PLANS, type PlanView } from "@/components/marketing/PlanCard";

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";
const SECTION = "py-20 md:py-32";

export default function PricingPage() {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<PlanView[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    Promise.resolve(
      saasDb
        .plans()
        .select("*")
        .eq("is_active", true)
        .order("sort_order")
    )
      .then((res: any) => {
        if (mounted) {
          const rows = (res?.data as unknown as PlanView[]) ?? [];
          if (rows.length > 0) {
            setPlans(rows);
            const yearly = rows.find((p) => p.duration_months >= 12) ?? rows[0];
            if (yearly) setSelected(yearly.id);
          } else {
            setPlans(DEFAULT_PLANS);
            setSelected(DEFAULT_PLANS[2].id);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setPlans(DEFAULT_PLANS);
          setSelected(DEFAULT_PLANS[2].id);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const displayPlans = useMemo(() => {
    return plans.length > 0 ? plans : DEFAULT_PLANS;
  }, [plans]);

  const features = [
    { key: "caseManagement", icon: "📋" },
    { key: "clientPortal", icon: "👥" },
    { key: "smartReminders", icon: "🔔" },
    { key: "documentStorage", icon: "📄" },
    { key: "analytics", icon: "📊" },
    { key: "apiAccess", icon: "⚙️" },
    { key: "support", icon: "💬" },
    { key: "customization", icon: "🎨" },
  ];

  return (
    <div className="min-h-dvh bg-[#050505] text-[#EDE8E0]">
      <PublicHeader overDark />

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 text-center overflow-hidden bg-[#050505] border-b border-[rgba(237,232,224,0.10)]">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `linear-gradient(rgba(237,232,224,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(237,232,224,0.12) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,0.4)_0%,#050505_80%)]" />
        </div>

        <div className={`${CONTAINER} relative z-10 max-w-3xl mx-auto space-y-4`}>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A958C]">Pricing &amp; Plans</span>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#EDE8E0]">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base sm:text-lg text-[#C8C2B8] max-w-xl mx-auto leading-relaxed">
            Choose the plan that fits your chamber. 7-day free trial on all plans. No credit card required to start.
          </p>
        </div>
      </section>

      {/* ── PRICING PLANS ── */}
      <section className={`${SECTION} bg-[#050505]`}>
        <div className={CONTAINER}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(237,232,224,0.12)] border border-[rgba(237,232,224,0.12)]">
            {displayPlans.map((plan) => {
              const isPopular = plan.duration_months >= 12;
              const monthlyEq = Math.round(Number(plan.price_pkr) / Math.max(1, plan.duration_months));

              return (
                <Reveal key={plan.id}>
                  <div
                    className={`relative h-full bg-[#050505] p-8 flex flex-col justify-between transition-colors duration-200 ${
                      isPopular ? "border border-[rgba(237,232,224,0.3)] bg-[#090909]" : ""
                    }`}
                  >
                    {/* Popular badge */}
                    {isPopular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 bg-[#EDE8E0] text-[#050505] text-[10px] font-bold uppercase tracking-[0.14em]">
                        {t("pricing.mostPopular") || "Most Popular"}
                      </div>
                    )}

                    <div>
                      {/* Plan name & price */}
                      <div className="mb-6">
                        <h3 className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#9A958C] mb-3">
                          {plan.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="font-heading text-4xl sm:text-5xl font-bold text-[#EDE8E0]">
                            Rs {monthlyEq.toLocaleString()}
                          </span>
                          <span className="text-xs text-[#5C5852]">/month</span>
                        </div>
                        <p className="text-xs text-[#9A958C] mt-2">
                          {t("pricing.billedEvery")} {plan.duration_months} {t("pricing.months")} (Rs {Number(plan.price_pkr).toLocaleString()})
                        </p>
                      </div>

                      {/* CTA */}
                      <Link
                        href={`/register?plan=${plan.code}`}
                        className={`w-full h-11 text-[11.5px] font-bold uppercase tracking-[0.14em] transition-colors mb-8 text-center inline-flex items-center justify-center gap-2 ${
                          isPopular
                            ? "bg-[#EDE8E0] text-[#050505] hover:bg-white"
                            : "border border-[rgba(237,232,224,0.22)] text-[#EDE8E0] hover:bg-[#EDE8E0] hover:text-[#050505]"
                        }`}
                      >
                        {t("pricing.getCta") || "Start 7-Day Free Trial"}
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </Link>

                      {/* Features list */}
                      <div className="space-y-3 border-t border-[rgba(237,232,224,0.10)] pt-6">
                        <p className="text-xs text-[#9A958C] font-bold uppercase tracking-[0.1em] mb-4">
                          {t("pricing.includes")}:
                        </p>
                        <div className="space-y-2.5 text-xs text-[#C8C2B8]">
                          <div className="flex items-center gap-2.5">
                            <Check className="w-4 h-4 text-[#EDE8E0] shrink-0" />
                            <span>Up to {plan.max_users} {t("pricing.users")}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Check className="w-4 h-4 text-[#EDE8E0] shrink-0" />
                            <span>{t("pricing.fullAccess")}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Check className="w-4 h-4 text-[#EDE8E0] shrink-0" />
                            <span>24/7 Chamber Support</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Check className="w-4 h-4 text-[#EDE8E0] shrink-0" />
                            <span>{t("pricing.dataBackup")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES COMPARISON ── */}
      <section className={`${SECTION} bg-[#050505] border-t border-[rgba(237,232,224,0.10)]`}>
        <div className={CONTAINER}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A958C]">Comparison</span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#EDE8E0]">
              {t("pricing.featureComparison") || "Feature Comparison"}
            </h2>
            <p className="text-base text-[#C8C2B8]">
              All plans include complete litigation management for Pakistani courts.
            </p>
          </div>

          <div className="overflow-x-auto border border-[rgba(237,232,224,0.12)]">
            <table className="w-full min-w-max border-collapse">
              <thead>
                <tr className="border-b border-[rgba(237,232,224,0.12)] bg-[#0A0A0A]">
                  <th className="text-left py-4 px-6 text-[#EDE8E0] font-bold text-xs uppercase tracking-[0.1em]">
                    {t("pricing.feature")}
                  </th>
                  {displayPlans.map((plan) => (
                    <th key={plan.id} className="text-center py-4 px-6 text-[#EDE8E0] font-bold text-xs uppercase tracking-[0.1em]">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(237,232,224,0.08)] bg-[#050505]">
                {features.map((feature, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 text-sm text-[#EDE8E0] font-medium">
                      <span className="mr-2">{feature.icon}</span>
                      {t(`pricing.feature_${feature.key}`) || feature.key}
                    </td>
                    {displayPlans.map((plan) => (
                      <td key={plan.id} className="text-center py-4 px-6">
                        <Check className="w-4 h-4 text-[#EDE8E0] mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ CTA ── */}
      <section className="py-20 md:py-28 bg-[#050505] border-t border-[rgba(237,232,224,0.10)] text-center">
        <div className={`${CONTAINER} max-w-2xl`}>
          <div className="border border-[rgba(237,232,224,0.12)] bg-[#0A0A0A] p-10 sm:p-14 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A958C]">Questions?</span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#EDE8E0]">
              {t("pricing.questions") || "Have questions about our plans?"}
            </h2>
            <p className="text-sm text-[#C8C2B8]">
              {t("pricing.questionsDesc") || "Check out our FAQ or contact our chamber support team."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link
                href="/faq"
                className="btn-secondary"
              >
                {t("pricing.readFaq") || "Read FAQ"}
              </Link>
              <Link
                href="/contact"
                className="btn-primary"
              >
                {t("pricing.contactSales") || "Contact Support"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
