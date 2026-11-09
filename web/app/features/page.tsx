"use client";

import { useTranslation } from "react-i18next";
import {
  Briefcase, Users, Clock, FileText, BarChart3,
  Lock, Globe, Zap, Check, ArrowRight
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { Reveal } from "@/components/marketing/Reveal";
import Link from "next/link";

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";
const SECTION = "py-20 md:py-32";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  titleKey: string;
  descKey: string;
  benefits: string[];
}

export default function FeaturesPage() {
  const { t } = useTranslation();

  const features: Feature[] = [
    {
      icon: Briefcase,
      titleKey: "features.caseManagementTitle",
      descKey: "features.caseManagementDesc",
      benefits: ["caseList", "statusTracking", "documentStorage", "deadlineTracking"]
    },
    {
      icon: Users,
      titleKey: "features.clientPortalTitle",
      descKey: "features.clientPortalDesc",
      benefits: ["secureAccess", "caseUpdates", "documentSharing", "communication"]
    },
    {
      icon: Clock,
      titleKey: "features.remindersTitle",
      descKey: "features.remindersDesc",
      benefits: ["smartReminders", "pushNotifications", "emailAlerts", "customization"]
    },
    {
      icon: FileText,
      titleKey: "features.documentsTitle",
      descKey: "features.documentsDesc",
      benefits: ["centralizedStorage", "versionControl", "quickAccess", "organization"]
    },
    {
      icon: BarChart3,
      titleKey: "features.analyticsTitle",
      descKey: "features.analyticsDesc",
      benefits: ["practiceMetrics", "caseAnalytics", "clientInsights", "reporting"]
    },
    {
      icon: Lock,
      titleKey: "features.securityTitle",
      descKey: "features.securityDesc",
      benefits: ["encryption", "compliance", "dataBackup", "accessControl"]
    },
    {
      icon: Zap,
      titleKey: "features.automationTitle",
      descKey: "features.automationDesc",
      benefits: ["taskAutomation", "workflowOptimization", "timeTracking", "efficiency"]
    },
    {
      icon: Globe,
      titleKey: "features.multiLanguageTitle",
      descKey: "features.multiLanguageDesc",
      benefits: ["urduEnglish", "rtlSupport", "culturalAdaptation", "accessibility"]
    },
  ];

  const featureTexts: Record<string, { title: string; desc: string; benefits: Record<string, string> }> = {
    caseManagement: {
      title: "Case Management",
      desc: "Organize and track all cases with automated status updates and deadline management",
      benefits: {
        caseList: "Daily cause list",
        statusTracking: "Real-time status tracking",
        documentStorage: "Secure document storage",
        deadlineTracking: "Automatic deadline tracking"
      }
    },
    clientPortal: {
      title: "Client Portal",
      desc: "Give clients access to their case details with a secure, easy-to-use interface",
      benefits: {
        secureAccess: "Secure client access",
        caseUpdates: "Real-time case updates",
        documentSharing: "Document sharing",
        communication: "Direct communication"
      }
    },
    reminders: {
      title: "Smart Reminders",
      desc: "Never miss important dates with intelligent reminder system",
      benefits: {
        smartReminders: "Intelligent reminders",
        pushNotifications: "Push notifications",
        emailAlerts: "Email alerts",
        customization: "Custom schedules"
      }
    },
    documents: {
      title: "Document Management",
      desc: "Centralize all documents with version control and quick access",
      benefits: {
        centralizedStorage: "Centralized storage",
        versionControl: "Version control",
        quickAccess: "Quick access",
        organization: "Organized folders"
      }
    },
    analytics: {
      title: "Analytics & Reporting",
      desc: "Get insights into your practice with comprehensive reporting",
      benefits: {
        practiceMetrics: "Practice metrics",
        caseAnalytics: "Case analytics",
        clientInsights: "Client insights",
        reporting: "Custom reports"
      }
    },
    security: {
      title: "Security & Compliance",
      desc: "Bank-level encryption and compliance with Pakistani legal requirements",
      benefits: {
        encryption: "Bank-level encryption",
        compliance: "Legal compliance",
        dataBackup: "Automatic backups",
        accessControl: "Access controls"
      }
    },
    automation: {
      title: "Automation",
      desc: "Automate repetitive tasks and focus on what matters most",
      benefits: {
        taskAutomation: "Task automation",
        workflowOptimization: "Workflow optimization",
        timeTracking: "Time tracking",
        efficiency: "Increased efficiency"
      }
    },
    multiLanguage: {
      title: "Multi-Language Support",
      desc: "Full Urdu and English support with RTL formatting",
      benefits: {
        urduEnglish: "Urdu & English",
        rtlSupport: "RTL support",
        culturalAdaptation: "Cultural adaptation",
        accessibility: "Accessible design"
      }
    }
  };

  return (
    <div className="min-h-dvh bg-[#050505] text-[#EDE8E0] overflow-x-clip">
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
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A958C]">Platform Capabilities</span>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#EDE8E0]">
            Powerful Features Built for Modern Legal Practice
          </h1>
          <p className="text-base sm:text-lg text-[#C8C2B8] max-w-xl mx-auto leading-relaxed">
            Everything you need to manage cases, court diaries, clients, and chamber billing efficiently and securely.
          </p>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className={`${SECTION} bg-[#050505]`}>
        <div className={CONTAINER}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(237,232,224,0.12)] border border-[rgba(237,232,224,0.12)]">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const featureKey = Object.keys(featureTexts).find(key => 
                featureTexts[key].title === t(feature.titleKey, featureTexts[key].title)
              ) || Object.keys(featureTexts)[idx];
              const fallback = featureTexts[featureKey] || featureTexts.caseManagement;
              const title = t(feature.titleKey, fallback.title);
              const desc = t(feature.descKey, fallback.desc);

              return (
                <Reveal key={idx}>
                  <div className="bg-[#050505] p-7 sm:p-8 h-full flex flex-col justify-between hover:bg-[#0A0A0A] transition-colors duration-200">
                    <div>
                      {/* Icon */}
                      <div className="w-10 h-10 border border-[rgba(237,232,224,0.15)] bg-white/[0.03] flex items-center justify-center mb-6 text-[#EDE8E0]">
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-heading font-bold text-lg text-[#EDE8E0] mb-2">{title}</h3>
                      <p className="text-xs text-[#C8C2B8] mb-6 leading-relaxed">{desc}</p>
                    </div>

                    {/* Benefits */}
                    <ul className="space-y-2 border-t border-[rgba(237,232,224,0.08)] pt-4">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-[#C8C2B8]">
                          <Check className="w-3.5 h-3.5 text-[#EDE8E0] shrink-0" />
                          <span>{t(`features.benefit_${benefit}`, fallback.benefits[benefit] || benefit)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className={`${SECTION} bg-[#050505] border-t border-[rgba(237,232,224,0.10)]`}>
        <div className={CONTAINER}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A958C]">Tier Breakdown</span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#EDE8E0]">
              {t("features.comparisonTitle", "Feature Comparison")}
            </h2>
            <p className="text-base text-[#C8C2B8]">
              {t("features.comparisonSubtitle", "All plans include everything your chamber needs")}
            </p>
          </div>

          <div className="overflow-x-auto border border-[rgba(237,232,224,0.12)]">
            <table className="w-full min-w-max border-collapse">
              <thead>
                <tr className="border-b border-[rgba(237,232,224,0.12)] bg-[#0A0A0A]">
                  <th className="text-left py-4 px-6 text-[#EDE8E0] font-bold text-xs uppercase tracking-[0.1em]">{t("features.featureName", "Feature")}</th>
                  <th className="text-center py-4 px-6 text-[#9A958C] font-bold text-xs uppercase tracking-[0.1em]">{t("features.starter", "Starter")}</th>
                  <th className="text-center py-4 px-6 text-[#9A958C] font-bold text-xs uppercase tracking-[0.1em]">{t("features.professional", "Professional")}</th>
                  <th className="text-center py-4 px-6 text-[#EDE8E0] font-bold text-xs uppercase tracking-[0.1em]">{t("features.enterprise", "Enterprise")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(237,232,224,0.08)] bg-[#050505]">
                {[
                  { key: "caseManagement", label: "Case Management" },
                  { key: "clientPortal", label: "Client Portal" },
                  { key: "reminders", label: "Smart Reminders" },
                  { key: "documentStorage", label: "Document Storage" },
                  { key: "analytics", label: "Analytics" },
                  { key: "customization", label: "Customization" },
                  { key: "apiAccess", label: "API Access" },
                  { key: "support", label: "Priority Support" }
                ].map((feature, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 text-sm text-[#EDE8E0] font-medium">{t(`features.compare_${feature.key}`, feature.label)}</td>
                    <td className="py-4 px-6 text-center"><Check className="w-4 h-4 text-[#EDE8E0] mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><Check className="w-4 h-4 text-[#EDE8E0] mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><Check className="w-4 h-4 text-[#EDE8E0] mx-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 bg-[#050505] border-t border-[rgba(237,232,224,0.10)] text-center">
        <div className={`${CONTAINER} max-w-2xl`}>
          <div className="border border-[rgba(237,232,224,0.12)] bg-[#0A0A0A] p-10 sm:p-14 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A958C]">Get Started</span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#EDE8E0]">
              {t("features.ctaTitle", "Ready to transform your practice?")}
            </h2>
            <p className="text-sm text-[#C8C2B8]">
              {t("features.ctaDesc", "Join hundreds of advocates and chambers already using Peshify.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link
                href="/register"
                className="btn-primary"
              >
                <span>{t("marketing.getStarted", "Get Started Free")}</span>
                <ArrowRight className="w-3.5 h-3.5 ms-2 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
