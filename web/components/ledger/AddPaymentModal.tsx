"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useCreatePayment } from "@/hooks/useLedger";
import { useAuth } from "@/providers/AuthProvider";
import type { DealSummary } from "@/types/ledger";
import type { ReceiptData } from "./ReceiptModal";

const paymentSchema = z.object({
  deal_id: z.string().min(1, "Please select a fee deal"),
  amount: z.coerce.number().min(1, "Payment amount must be greater than 0"),
  payment_date: z.string().min(1, "Date is required"),
  method: z.enum(["cash", "bank", "easypaisa", "jazzcash", "cheque", "other"]),
  reference_no: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface AddPaymentModalProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  clientPhone?: string | null;
  deals: DealSummary[];
  defaultDealId?: string;
  onReceiptReady?: (receipt: ReceiptData) => void;
}

export function AddPaymentModal({
  open,
  onClose,
  clientId,
  clientName,
  clientPhone,
  deals,
  defaultDealId,
  onReceiptReady,
}: AddPaymentModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ur";
  const toast = useToast();
  const { profile, firm } = useAuth();
  const createPaymentMutation = useCreatePayment();

  const [confirmOverpayment, setConfirmOverpayment] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<PaymentFormData | null>(null);

  const activeDeals = deals.filter((d) => d.status === "active");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      deal_id: defaultDealId || (activeDeals[0]?.deal_id ?? ""),
      amount: 0,
      payment_date: new Date().toISOString().split("T")[0],
      method: "cash",
      reference_no: "",
      notes: "",
    },
  });

  const selectedDealId = watch("deal_id");
  const selectedDeal = deals.find((d) => d.deal_id === selectedDealId);

  async function executeSave(data: PaymentFormData) {
    if (!profile?.firm_id) {
      toast.error(t("common.error"), "Firm session is not initialized.");
      return;
    }

    try {
      const deal = deals.find((d) => d.deal_id === data.deal_id);
      const remainingBefore = deal ? Number(deal.balance) : 0;
      const newRemaining = Math.max(0, remainingBefore - data.amount);

      await createPaymentMutation.mutateAsync({
        firm_id: profile.firm_id,
        deal_id: data.deal_id,
        client_id: clientId,
        amount: data.amount,
        payment_date: data.payment_date,
        method: data.method,
        reference_no: data.reference_no || null,
        notes: data.notes || null,
        created_by: profile.id,
      });

      toast.success(
        isRTL ? "ادائیگی وصول ہو گئی" : "Payment Recorded",
        `Rs ${Number(data.amount).toLocaleString()} (${data.method})`
      );

      // Prepare receipt data
      const receipt: ReceiptData = {
        chamberName: firm?.name || "Advocate Chamber Practice",
        clientName,
        clientPhone,
        caseRef: null,
        dealTitle: deal?.title || "Legal Representation",
        amount: data.amount,
        paymentDate: data.payment_date,
        method: data.method,
        referenceNo: data.reference_no,
        balanceRemaining: newRemaining,
        notes: data.notes,
      };

      reset();
      setPendingPayload(null);
      setConfirmOverpayment(false);
      onClose();

      // Launch receipt modal
      onReceiptReady?.(receipt);
    } catch (err: any) {
      toast.error(t("common.error"), err?.message || "Failed to record payment.");
    }
  }

  function onSubmit(data: PaymentFormData) {
    const deal = deals.find((d) => d.deal_id === data.deal_id);
    if (deal && data.amount > Number(deal.balance) && Number(deal.balance) > 0) {
      // Overpayment detected, require explicit confirmation
      setPendingPayload(data);
      setConfirmOverpayment(true);
      return;
    }
    void executeSave(data);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isRTL ? "فیس وصولی درج کریں" : "Receive Client Fee Payment"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-1" dir={isRTL ? "rtl" : "ltr"}>
        {selectedDeal && (
          <div className="p-3 rounded-xl bg-secondary/50 border border-border/70 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">{isRTL ? "موجودہ بقایا:" : "Current Outstanding (Baqaya):"}</span>
            <span className="font-bold text-amber-500 font-mono text-sm sm:text-base">
              Rs {Number(selectedDeal.balance).toLocaleString()}
            </span>
          </div>
        )}

        {confirmOverpayment && pendingPayload && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 space-y-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold text-amber-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{isRTL ? "اضافی رقم کی تصدیق" : "Overpayment Confirmation"}</span>
            </div>
            <p>
              {isRTL
                ? `درج کردہ رقم (Rs ${Number(pendingPayload.amount).toLocaleString()}) اس ڈیل کے بقایا (Rs ${Number(selectedDeal?.balance ?? 0).toLocaleString()}) سے زیادہ ہے۔ کیا آپ واقعی یہ رقم درج کرنا چاہتے ہیں؟`
                : `The entered amount (Rs ${Number(pendingPayload.amount).toLocaleString()}) exceeds the agreed balance (Rs ${Number(selectedDeal?.balance ?? 0).toLocaleString()}). Do you confirm recording an advance/overpayment?`}
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setConfirmOverpayment(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="xs"
                onClick={() => void executeSave(pendingPayload)}
              >
                {isRTL ? "تصدیق کریں" : "Confirm Overpayment"}
              </Button>
            </div>
          </div>
        )}

        <Select
          label={isRTL ? "فیس معاہدہ منتخب کریں" : "Select Fee Deal / Matter"}
          required
          options={deals.map((d) => ({
            value: d.deal_id,
            label: `${d.title} (Baqaya: Rs ${Number(d.balance).toLocaleString()})`,
          }))}
          {...register("deal_id")}
          error={errors.deal_id?.message}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label={isRTL ? "وصول شدہ رقم (PKR)" : "Amount Received (PKR)"}
            type="number"
            min="1"
            step="100"
            placeholder="25000"
            required
            {...register("amount")}
            error={errors.amount?.message}
          />

          <Input
            label={isRTL ? "تاریخ وصولی" : "Payment Date"}
            type="date"
            required
            {...register("payment_date")}
            error={errors.payment_date?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label={isRTL ? "طریقہ کار" : "Payment Method"}
            options={[
              { value: "cash", label: isRTL ? "کیش (نقد)" : "Cash" },
              { value: "bank", label: isRTL ? "بینک ٹرانسفر" : "Bank Transfer" },
              { value: "easypaisa", label: "EasyPaisa" },
              { value: "jazzcash", label: "JazzCash" },
              { value: "cheque", label: isRTL ? "چیک" : "Cheque" },
              { value: "other", label: isRTL ? "دیگر" : "Other" },
            ]}
            {...register("method")}
          />

          <Input
            label={isRTL ? "حوالہ نمبر / رسید / TID" : "Reference / Slip / TID No."}
            placeholder={isRTL ? "اختیاری" : "e.g. TID 987654"}
            {...register("reference_no")}
          />
        </div>

        <Textarea
          label={isRTL ? "نوٹس (اختیاری)" : "Notes (Optional)"}
          placeholder={isRTL ? "کسی مخصوص پیش رفت یا قسط کی تفصیل..." : "e.g. Paid in office after hearing"}
          rows={2}
          {...register("notes")}
        />

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="min-h-[44px]"
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={createPaymentMutation.isPending}
            className="min-h-[44px]"
          >
            {isRTL ? "رقم وصول کریں اور رسید بنائیں" : "Receive & Generate Receipt"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
