"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  CreditCard,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building2,
  Users,
  HardDrive,
  Receipt,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RouteGuard } from "@/components/shared/RouteGuard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/providers/AuthProvider";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";

export default function BillingPage() {
  const { t } = useTranslation();
  const { firm, profile } = useAuth();
  const { state: subState } = useSubscriptionAccess();

  const proFeatures = [
    "Unlimited Cases & Litigation Files",
    "Smart Morning Cause Lists & Bench Tracking",
    "1-Click Client Hearing Alerts via WhatsApp & Email",
    "Encrypted Case Document Storage & Secure Links",
    "Chamber Ledger & Client Fee Agreements",
    "Multi-Device & Cross-Platform Sync",
  ];

  return (
    <RouteGuard>
      <AppShell
        pageTitle="Subscription & Billing"
        pageSubtitle="Manage chamber plan, usage and billing details"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Active Plan Card */}
          <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active • Full Chamber Access
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Chamber Pro Plan
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Registered for <span className="text-foreground font-semibold">{firm?.name || "Your Chamber Practice"}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/pricing">
                  <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                    View All Plans
                  </Button>
                </Link>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Access Tier</p>
                  <p className="text-sm font-bold text-foreground">Early Access (Free)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Chamber Seats</p>
                  <p className="text-sm font-bold text-foreground">Unlimited Advocates</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Data Privacy</p>
                  <p className="text-sm font-bold text-foreground">Chamber Access Controls</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Included Features */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Features Included in Your Practice Tier</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {proFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/90">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Billing & Invoice History */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                <h3 className="text-base font-bold text-foreground">Billing & Invoices</h3>
              </div>
              <Badge variant="navy" size="sm">No Dues Pending</Badge>
            </div>

            <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border/80 rounded-xl bg-secondary/30">
              <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30 text-muted-foreground" />
              <p className="font-semibold text-foreground">No invoices generated yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Your account is currently on an unrestricted early access tier. Any official invoices or renewal receipts will automatically appear here.
              </p>
            </div>
          </Card>

          {/* Need Assistance Card */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border/70 bg-card text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span>Questions about subscription tiers or international payments?</span>
            </div>
            <Link
              href="/contact"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Contact Chamber Support
            </Link>
          </div>
        </div>
      </AppShell>
    </RouteGuard>
  );
}
