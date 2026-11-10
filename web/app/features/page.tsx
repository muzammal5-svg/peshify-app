"use client";

import { useTranslation } from "react-i18next";
import {
  Briefcase, Users, Clock, FileText, BarChart3,
  Lock, Globe, Zap, Check, ArrowRight, Sparkles, Scale, ShieldCheck,
  type LucideIcon
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { FloatingWhatsApp } from "@/components/marketing/FloatingWhatsApp";
import { Reveal } from "@/components/marketing/Reveal";
import Link from "next/link";

const CONTAINER = "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8";
const SECTION = "py-20 md:py-28";

interface Feature {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  benefits: string[];
}

export default function FeaturesPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ur";

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
      desc: "Organize and track all cases with automated status updates, courtroom benchmarks, and hearing schedules.",
      benefits: {
        caseList: "Automated daily cause list",
        statusTracking: "Real-time hearing status tracking",
        documentStorage: "Secure pleadings & brief storage",
        deadlineTracking: "Limitation & petition alerts"
      }
    },
    clientPortal: {
      title: "Client Directory & Alerts",
      desc: "Manage client files with automated bilingual WhatsApp hearing updates dispatched with one click.",
      benefits: {
        secureAccess: "Encrypted client records",
        caseUpdates: "1-Click WhatsApp hearing alerts",
        documentSharing: "Direct order sheet sharing",
        communication: "Bilingual English & Urdu notices"
      }
    },
    reminders: {
      title: "Limitation & Hearing Diary",
      desc: "Never miss an appeal deadline, rejoinder due date, or chamber hearing with proactive notifications.",
      benefits: {
        smartReminders: "Limitation calculation alerts",
        pushNotifications: "Morning hearing schedule alert",
        emailAlerts: "Chamber calendar digest",
        customization: "Custom chamber reminder tasks"
      }
    },
    documents: {
      title: "Chamber File Repository",
      desc: "Centralize petitions, vakalatnamas, and court judgments per case with instant search.",
      benefits: {
        centralizedStorage: "Single repository per case",
        versionControl: "Pleadings draft management",
        quickAccess: "Instant mobile search & view",
        organization: "Per-firm folder isolation"
      }
    },
    analytics: {
      title: "Chamber Insights & Ledger",
      desc: "Review chamber litigation velocity, hearing dispositions, and client fee retainers in real time.",
      benefits: {
        practiceMetrics: "Case load & court benchmarks",
        caseAnalytics: "Won / decided litigation stats",
        clientInsights: "Active retainer overview",
        reporting: "PDF cause list & ledger export"
      }
    },
    security: {
      title: "Privilege & Bank-Grade Security",
      desc: "Compliant with attorney-client confidentiality with PostgreSQL Row-Level Security (RLS) isolation.",
      benefits: {
        encryption: "TLS 1.3 in transit & AES-256 rest",
        compliance: "Pakistani Bar standards compliant",
        dataBackup: "Automated multi-region backups",
        accessControl: "Role-based associate permissions"
      }
    },
    automation: {
      title: "Courtroom Workflow Automation",
      desc: "Automate repetitive daily chamber clerical chores and focus counsel time on legal advocacy.",
      benefits: {
        taskAutomation: "Morning list compilation",
        workflowOptimization: "Status transition workflows",
        timeTracking: "Hearing duration tracking",
        efficiency: "Reduced clerical overhead"
      }
    },
    multiLanguage: {
      title: "Native Urdu Nastaliq & RTL",
      desc: "Full Urdu and English support with true right-to-left layout mirroring and Nastaliq typography.",
      benefits: {
        urduEnglish: "1-Click English/Urdu switch",
        rtlSupport: "True RTL layout mirroring",
        culturalAdaptation: "Pakistani court nomenclature",
        accessibility: "High-contrast legible Nastaliq"
      }
    }
  };

  return (
    <div className="min-h-dvh bg-[#070A12] text-[#EDE8E0] selection:bg-primary/30 selection:text-white overflow-x-clip font-sans">
      <PublicHeader overDark />

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 text-center overflow-hidden border-b border-white/10">
        {/* Ambient glow backgrounds */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-primary/15 to-transparent blur-3xl pointer-events-none" />
        </div>

        <div className={`${CONTAINER} relative z-10 max-w-3xl mx-auto space-y-5`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-amber-400/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isRTL ? "وکلاء کے لیے جدید ترین ٹیکنالوجی" : "Platform Capabilities & Courtroom Workflows"}</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            {isRTL
              ? "پاکستانی وکلاء کے لیے مخصوص جدید فیچرز"
              : "Modern Legal Software Built For Pakistani Advocates"}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isRTL
              ? "صبح کی کاز لسٹ سے لے کر موکلین کو واٹس ایپ اپ ڈیٹس تک، پیشی فائی آپ کے چیمبر کے ہر عمل کو تیز اور منظم بناتا ہے۔"
              : "From automated morning cause lists to client WhatsApp hearing notices and limitation alerts — engineered specifically for the courts of Pakistan."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/register"
              className="btn-primary min-w-[200px] py-3.5 text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl"
            >
              <span>{isRTL ? "مفت اکاؤنٹ بنائیں" : "Get Started Free"}</span>
              <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
            </Link>
            <Link
              href="/contact"
              className="btn-secondary min-w-[160px] py-3.5 text-sm font-semibold rounded-xl bg-card border-white/10 text-slate-200 hover:text-white"
            >
              <span>{isRTL ? "چیمبر ڈیمو حاصل کریں" : "Request Chamber Demo"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className={`${SECTION} relative`}>
        <div className={CONTAINER}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {isRTL ? "چیمبر آپریشنز" : "Core Capabilities"}
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white tracking-tight">
              {isRTL ? "آپ کے چیمبر کی روزمرہ ضروریات کا مکمل حل" : "Everything Needed to Run a High-Performing Chamber"}
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              {isRTL
                ? "کاغذی فائلوں اور پرانے رجسٹروں کی جگہ جدید کلاؤڈ سسٹم جو موبائل اور کمپیوٹر دونوں پر کام کرتا ہے۔"
                : "Eliminate manual paperwork with a unified operating system built for Supreme Court, High Courts, and District Benches."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <div className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 sm:p-7 h-full flex flex-col justify-between hover:border-amber-400/40 hover:-translate-y-1 transition-all duration-300 shadow-xl">
                    <div>
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-amber-400/20 transition-all">
                        <Icon className="w-5 h-5" strokeWidth={1.75} />
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-amber-300 transition-colors">
                        {title}
                      </h3>
                      <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    {/* Benefits */}
                    <ul className="space-y-2.5 border-t border-white/10 pt-4">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2} />
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
      <section className={`${SECTION} border-t border-white/10 bg-gradient-to-b from-transparent via-[#091024] to-transparent`}>
        <div className={CONTAINER}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {isRTL ? "خصوصیات کا موازنہ" : "Tier Breakdown & Comparison"}
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white tracking-tight">
              {t("features.comparisonTitle", "Transparent Practice Plans")}
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              {t("features.comparisonSubtitle", "All litigation tools, cause lists, and client alerts are 100% free during early access.")}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-card/60 backdrop-blur-md shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max border-collapse text-start">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="text-start py-4 px-6 text-white font-bold text-xs uppercase tracking-wider">
                      {t("features.featureName", "Chamber Feature")}
                    </th>
                    <th className="text-center py-4 px-6 text-slate-300 font-bold text-xs uppercase tracking-wider">
                      {t("features.starter", "Solo Advocate")}
                    </th>
                    <th className="text-center py-4 px-6 text-amber-300 font-bold text-xs uppercase tracking-wider bg-amber-400/10 border-x border-amber-400/20">
                      {t("features.professional", "Law Chamber (Featured)")}
                    </th>
                    <th className="text-center py-4 px-6 text-white font-bold text-xs uppercase tracking-wider">
                      {t("features.enterprise", "Enterprise / Bar")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-xs sm:text-sm">
                  {[
                    { key: "caseManagement", label: "Cause List & Hearing Diary" },
                    { key: "clientPortal", label: "Client Directory & 1-Click WhatsApp" },
                    { key: "reminders", label: "Limitation & Appeal Due Alerts" },
                    { key: "documentStorage", label: "Case Pleadings & Judgment Vault" },
                    { key: "analytics", label: "Practice Benchmarks & Ledger" },
                    { key: "customization", label: "Urdu Nastaliq & RTL Interface" },
                    { key: "apiAccess", label: "Multi-Associate Role Permissions" },
                    { key: "support", label: "Priority 24/7 WhatsApp Chamber Help" }
                  ].map((feature, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 text-white font-medium">
                        {t(`features.compare_${feature.key}`, feature.label)}
                      </td>
                      <td className="py-4 px-6 text-center text-emerald-400">
                        <Check className="w-4 h-4 mx-auto text-emerald-400" strokeWidth={2.5} />
                      </td>
                      <td className="py-4 px-6 text-center text-emerald-400 bg-amber-400/[0.03] border-x border-amber-400/20">
                        <Check className="w-4 h-4 mx-auto text-amber-400" strokeWidth={2.5} />
                      </td>
                      <td className="py-4 px-6 text-center text-emerald-400">
                        <Check className="w-4 h-4 mx-auto text-emerald-400" strokeWidth={2.5} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CHAMBER CTA (Matching Home Page) ── */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#070A12] to-[#0A0E1C] border-t border-white/10">
        <div className={`${CONTAINER} max-w-3xl text-center relative z-10 space-y-6`}>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
            {isRTL ? "ابھی شروع کریں" : "Ready For Trial-Ready Litigation?"}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            {isRTL ? "اپنے چیمبر کو جدید سافٹ ویئر سے لیس کریں" : "Equip Your Chamber With Modern Software"}
          </h2>
          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            {isRTL
              ? "ابھی مفت اکاؤنٹ بنائیں اور صبح کی کاز لسٹس، پیشی ڈائری اور کلائنٹ نوٹسز خودکار بنائیں۔"
              : "Experience morning cause lists organized automatically, limitation alerts that keep counsel informed, and client updates that dispatch themselves."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/register"
              className="btn-primary min-w-[220px] py-3.5 text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl"
            >
              <span>{isRTL ? "مفت اکاؤنٹ رجسٹر کریں" : "Create Free Chamber Account"}</span>
              <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
            </Link>
            <Link
              href="/contact"
              className="btn-secondary min-w-[160px] py-3.5 text-sm font-semibold rounded-xl bg-card border-white/10 text-slate-200 hover:text-white"
            >
              <span>{isRTL ? "ہم سے رابطہ کریں" : "Contact Chamber Support"}</span>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <FloatingWhatsApp />
    </div>
  );
}
