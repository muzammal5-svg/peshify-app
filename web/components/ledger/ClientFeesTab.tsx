"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Wallet,
  CreditCard,
  Plus,
  Receipt,
  ArrowUpRight,
  ChevronRight,
  TrendingDown,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { QueryErrorState } from "@/components/ui/QueryErrorState";
import {
  useClientDeals,
  useDealPayments,
  useDealExpenses,
} from "@/hooks/useLedger";
import { AddDealModal } from "./AddDealModal";
import { AddPaymentModal } from "./AddPaymentModal";
import { AddExpenseModal } from "./AddExpenseModal";
import { ReceiptModal, type ReceiptData } from "./ReceiptModal";
import { fmtDate, isUrdu, textDir } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

interface ClientFeesTabProps {
  clientId: string;
  clientName: string;
  clientPhone?: string | null;
  cases?: Array<{ id: string; case_ref_no?: string | null; plaintiff_name: string; defendant_name: string }>;
}

export function ClientFeesTab({
  clientId,
  clientName,
  clientPhone,
  cases = [],
}: ClientFeesTabProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ur";
  const { firm } = useAuth();

  const {
    data: deals,
    isLoading: dealsLoading,
    isError: dealsError,
    refetch: refetchDeals,
  } = useClientDeals(clientId);

  const {
    data: payments,
    isLoading: paymentsLoading,
    isError: paymentsError,
    refetch: refetchPayments,
  } = useDealPayments({ clientId });

  const {
    data: expenses,
    isLoading: expensesLoading,
    isError: expensesError,
    refetch: refetchExpenses,
  } = useDealExpenses({});

  // Modals state
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState<string | undefined>(undefined);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  if (dealsLoading || paymentsLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <SkeletonCard />
      </div>
    );
  }

  if (dealsError || paymentsError) {
    return <QueryErrorState onRetry={() => { void refetchDeals(); void refetchPayments(); }} />;
  }

  const allDeals = deals ?? [];
  const allPayments = payments ?? [];
  const clientExpenses = (expenses ?? []).filter((e) =>
    allDeals.some((d) => d.deal_id === e.deal_id)
  );

  // Totals
  const totalAgreed = allDeals.reduce((sum, d) => sum + Number(d.agreed_amount || 0), 0);
  const totalReceived = allDeals.reduce((sum, d) => sum + Number(d.total_received || 0), 0);
  const totalBalance = Math.max(0, totalAgreed - totalReceived);
  const totalExpenses = clientExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  function openPaymentForDeal(dealId: string) {
    setSelectedDealId(dealId);
    setShowAddPayment(true);
  }

  function viewReceiptForPayment(p: typeof allPayments[0]) {
    const deal = allDeals.find((d) => d.deal_id === p.deal_id);
    setReceiptData({
      chamberName: firm?.name || "Advocate Chamber Practice",
      clientName,
      clientPhone,
      dealTitle: deal?.title || "Legal Representation",
      amount: p.amount,
      paymentDate: p.payment_date,
      method: p.method,
      referenceNo: p.reference_no,
      balanceRemaining: deal ? Number(deal.balance) : 0,
      receiptNo: `REC-${p.id.slice(0, 8).toUpperCase()}`,
      notes: p.notes,
    });
  }

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Summary Financial Metrics Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
          <p className="text-xs text-muted-foreground font-medium">
            {isRTL ? "کل طے شدہ فیس" : "Total Agreed"}
          </p>
          <p className="text-base sm:text-lg font-bold text-foreground font-mono mt-1">
            Rs {Number(totalAgreed).toLocaleString()}
          </p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 shadow-xs">
          <p className="text-xs text-emerald-400 font-medium">
            {isRTL ? "کل وصول شدہ رقم" : "Total Received"}
          </p>
          <p className="text-base sm:text-lg font-bold text-emerald-400 font-mono mt-1">
            Rs {Number(totalReceived).toLocaleString()}
          </p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 shadow-xs">
          <p className="text-xs text-amber-400 font-medium">
            {isRTL ? "بقایا جات (Baqaya)" : "Total Balance (Baqaya)"}
          </p>
          <p className="text-base sm:text-lg font-bold text-amber-400 font-mono mt-1">
            Rs {Number(totalBalance).toLocaleString()}
          </p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 shadow-xs">
          <p className="text-xs text-rose-400 font-medium">
            {isRTL ? "مقدمہ اخراجات" : "Expenses Incurred"}
          </p>
          <p className="text-base sm:text-lg font-bold text-rose-400 font-mono mt-1">
            Rs {Number(totalExpenses).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ── Quick Action Bar ── */}
      <div className="flex items-center justify-between gap-2.5 flex-wrap">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              setSelectedDealId(undefined);
              setShowAddPayment(true);
            }}
            disabled={allDeals.length === 0}
            leftIcon={<Wallet className="w-4 h-4" />}
            className="min-h-[44px] text-xs font-semibold"
          >
            {isRTL ? "رقم وصول کریں" : "Receive Payment"}
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowAddDeal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="min-h-[44px] text-xs font-semibold"
          >
            {isRTL ? "نیا فیس معاہدہ" : "Add Fee Deal"}
          </Button>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowAddExpense(true)}
          leftIcon={<TrendingDown className="w-4 h-4 text-rose-400" />}
          className="min-h-[44px] text-xs text-muted-foreground hover:text-foreground"
        >
          {isRTL ? "خرچہ درج کریں" : "Record Expense"}
        </Button>
      </div>

      {/* ── Fee Deals Section ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {isRTL ? "فیس معاہدات / ڈیلز" : "Fee Deals & Retainers"} ({allDeals.length})
          </h3>
        </div>

        {allDeals.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title={isRTL ? "کوئی فیس ڈیل درج نہیں" : "No Fee Agreements Added"}
            description={
              isRTL
                ? "اس کلائنٹ کے لیے فیس، ایڈوانس اور بقایا ٹریک کرنے کے لیے نیا معاہدہ شامل کریں۔"
                : "Create a fee agreement to track agreed amounts, installments, and outstanding balances."
            }
            action={
              <Button
                size="sm"
                variant="primary"
                onClick={() => setShowAddDeal(true)}
                leftIcon={<Plus className="w-4 h-4" />}
                className="min-h-[44px]"
              >
                {isRTL ? "فیس معاہدہ بنائیں" : "Add First Fee Deal"}
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {allDeals.map((deal) => {
              const agreed = Number(deal.agreed_amount);
              const received = Number(deal.total_received);
              const balance = Number(deal.balance);
              const pct = agreed > 0 ? Math.min(100, Math.round((received / agreed) * 100)) : 100;

              return (
                <Card key={deal.deal_id} className="p-4 sm:p-5 space-y-3.5 border-border/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm sm:text-base font-bold text-foreground truncate">
                          {deal.title}
                        </h4>
                        <Badge
                          variant={deal.status === "active" ? "success" : "neutral"}
                          size="sm"
                        >
                          {deal.status}
                        </Badge>
                      </div>
                      {deal.notes && (
                        <p className="text-xs text-muted-foreground mt-1 truncate max-w-md">
                          {deal.notes}
                        </p>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openPaymentForDeal(deal.deal_id)}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      className="min-h-[40px] text-xs font-semibold self-start sm:self-auto"
                    >
                      {isRTL ? "قسط وصول کریں" : "Add Payment"}
                    </Button>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                      <span>{pct}% {isRTL ? "وصول شدہ" : "Collected"}</span>
                      <span>
                        Rs {received.toLocaleString()} / Rs {agreed.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Deal Metric Breakdown */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-center text-xs">
                    <div>
                      <p className="text-muted-foreground">{isRTL ? "طے شدہ" : "Agreed"}</p>
                      <p className="font-bold text-foreground font-mono mt-0.5">
                        Rs {agreed.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-emerald-400">{isRTL ? "وصول شدہ" : "Received"}</p>
                      <p className="font-bold text-emerald-400 font-mono mt-0.5">
                        Rs {received.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-amber-400">{isRTL ? "بقایا" : "Balance"}</p>
                      <p className="font-bold text-amber-400 font-mono mt-0.5">
                        Rs {balance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Payment History Section ── */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">
          {isRTL ? "ادائیگیوں کی تاریخ" : "Payment History (Receipts)"} ({allPayments.length})
        </h3>

        {allPayments.length === 0 ? (
          <p className="text-xs text-muted-foreground italic px-1">
            {isRTL ? "ابھی تک کوئی ادائیگی درج نہیں کی گئی۔" : "No payment records found."}
          </p>
        ) : (
          <div className="space-y-2.5">
            {allPayments.map((p) => {
              const deal = allDeals.find((d) => d.deal_id === p.deal_id);
              return (
                <Card
                  key={p.id}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-border/70 hover:border-border transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-foreground">
                          Rs {Number(p.amount).toLocaleString()}
                        </p>
                        <Badge variant="neutral" size="sm" className="capitalize">
                          {p.method}
                        </Badge>
                        {p.reference_no && (
                          <span className="text-[11px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                            {p.reference_no}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {deal?.title || "Fee Deal"} · {fmtDate(p.payment_date)}
                        {p.notes ? ` · "${p.notes}"` : ""}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={() => viewReceiptForPayment(p)}
                    leftIcon={<Receipt className="w-3.5 h-3.5" />}
                    className="min-h-[38px] text-xs font-semibold self-end sm:self-auto"
                  >
                    {isRTL ? "رسید دیکھیں" : "View Receipt"}
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Chamber Expenses Section ── */}
      {clientExpenses.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">
            {isRTL ? "مقدمہ اخراجات" : "Expenses on Matter"} ({clientExpenses.length})
          </h3>

          <div className="space-y-2">
            {clientExpenses.map((exp) => (
              <div
                key={exp.id}
                className="p-3 rounded-xl bg-secondary/30 border border-border/60 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-semibold capitalize text-foreground">
                    {exp.category.replace("_", " ")}
                  </span>
                  <span className="text-muted-foreground mx-1.5">·</span>
                  <span className="text-muted-foreground">{fmtDate(exp.expense_date)}</span>
                  {exp.notes && (
                    <p className="text-muted-foreground mt-0.5 italic">{exp.notes}</p>
                  )}
                </div>
                <span className="font-bold font-mono text-rose-400 flex-shrink-0">
                  Rs {Number(exp.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <AddDealModal
        open={showAddDeal}
        onClose={() => setShowAddDeal(false)}
        clientId={clientId}
        cases={cases}
        onSuccess={() => { void refetchDeals(); }}
      />

      <AddPaymentModal
        open={showAddPayment}
        onClose={() => setShowAddPayment(false)}
        clientId={clientId}
        clientName={clientName}
        clientPhone={clientPhone}
        deals={allDeals}
        defaultDealId={selectedDealId}
        onReceiptReady={(r) => setReceiptData(r)}
      />

      <AddExpenseModal
        open={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        deals={allDeals}
        defaultDealId={selectedDealId}
        onSuccess={() => { void refetchExpenses(); }}
      />

      <ReceiptModal
        open={!!receiptData}
        onClose={() => setReceiptData(null)}
        data={receiptData}
      />
    </div>
  );
}
