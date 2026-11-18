"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useCreateDeal } from "@/hooks/useLedger";
import { useAuth } from "@/providers/AuthProvider";

const dealSchema = z.object({
  title: z.string().min(2, "Title is required").max(150),
  agreed_amount: z.coerce.number().min(0, "Amount must be zero or positive"),
  case_id: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

type DealFormData = z.infer<typeof dealSchema>;

interface AddDealModalProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
  cases?: Array<{ id: string; case_ref_no?: string | null; plaintiff_name: string; defendant_name: string }>;
  onSuccess?: () => void;
}

export function AddDealModal({
  open,
  onClose,
  clientId,
  cases = [],
  onSuccess,
}: AddDealModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ur";
  const toast = useToast();
  const { profile, firm } = useAuth();
  const createDealMutation = useCreateDeal();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: "",
      agreed_amount: 0,
      case_id: "",
      notes: "",
    },
  });

  async function onSubmit(data: DealFormData) {
    if (!profile?.firm_id) {
      toast.error(t("common.error"), "Session error: firm not loaded.");
      return;
    }

    try {
      await createDealMutation.mutateAsync({
        firm_id: profile.firm_id,
        client_id: clientId,
        case_id: data.case_id || null,
        title: data.title.trim(),
        agreed_amount: data.agreed_amount,
        notes: data.notes || null,
        created_by: profile.id,
      });

      toast.success(
        isRTL ? "فیس معاہدہ محفوظ ہو گیا" : "Fee Deal Created",
        `${data.title} - Rs ${Number(data.agreed_amount).toLocaleString()}`
      );
      reset();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(t("common.error"), err?.message || "Failed to create deal.");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isRTL ? "نیا فیس معاہدہ شامل کریں" : "Add New Fee Agreement / Deal"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-1" dir={isRTL ? "rtl" : "ltr"}>
        <Input
          label={isRTL ? "معاہدے کا عنوان / تفصیل" : "Deal / Representation Title"}
          placeholder={isRTL ? "مثال: سول اپیل یا مکمل مقدمہ فیس" : "e.g. Civil Suit 123/2025 Retainer"}
          required
          {...register("title")}
          error={errors.title?.message}
        />

        <Input
          label={isRTL ? "طے شدہ فیس (PKR)" : "Agreed Fee Amount (PKR)"}
          type="number"
          min="0"
          step="500"
          placeholder="50000"
          required
          {...register("agreed_amount")}
          error={errors.agreed_amount?.message}
        />

        {cases.length > 0 && (
          <Select
            label={isRTL ? "منسلک مقدمہ (اختیاری)" : "Link to Case (Optional)"}
            options={[
              {
                value: "",
                label: isRTL ? "-- کوئی مقدمہ منتخب نہیں --" : "-- No specific case --",
              },
              ...cases.map((c) => ({
                value: c.id,
                label: `${c.case_ref_no ? `[${c.case_ref_no}] ` : ""}${c.plaintiff_name} vs ${c.defendant_name}`,
              })),
            ]}
            {...register("case_id")}
          />
        )}

        <Textarea
          label={isRTL ? "اضافی نوٹس یا شرائط (اختیاری)" : "Notes or Payment Terms (Optional)"}
          placeholder={isRTL ? "اقساط یا پیشگی رقم سے متعلق نوٹس..." : "e.g. 50% advance, 50% upon final arguments"}
          rows={3}
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
            loading={createDealMutation.isPending}
            className="min-h-[44px]"
          >
            {isRTL ? "معاہدہ محفوظ کریں" : "Create Fee Deal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
