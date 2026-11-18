"use client";

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
import { useCreateExpense } from "@/hooks/useLedger";
import { useAuth } from "@/providers/AuthProvider";
import type { DealSummary } from "@/types/ledger";

const expenseSchema = z.object({
  deal_id: z.string().optional().or(z.literal("")),
  category: z.enum(["court_fee", "stamp_paper", "munshi", "travel", "other"]),
  amount: z.coerce.number().min(0, "Amount must be zero or positive"),
  expense_date: z.string().min(1, "Date is required"),
  notes: z.string().optional().or(z.literal("")),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  deals?: DealSummary[];
  defaultDealId?: string;
  onSuccess?: () => void;
}

export function AddExpenseModal({
  open,
  onClose,
  deals = [],
  defaultDealId,
  onSuccess,
}: AddExpenseModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ur";
  const toast = useToast();
  const { profile } = useAuth();
  const createExpenseMutation = useCreateExpense();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      deal_id: defaultDealId || "",
      category: "court_fee",
      amount: 0,
      expense_date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  async function onSubmit(data: ExpenseFormData) {
    if (!profile?.firm_id) {
      toast.error(t("common.error"), "Session error: firm not found.");
      return;
    }

    try {
      await createExpenseMutation.mutateAsync({
        firm_id: profile.firm_id,
        deal_id: data.deal_id || null,
        category: data.category,
        amount: data.amount,
        expense_date: data.expense_date,
        notes: data.notes || null,
        created_by: profile.id,
      });

      toast.success(
        isRTL ? "خرچہ درج ہو گیا" : "Expense Recorded",
        `Rs ${Number(data.amount).toLocaleString()} (${data.category.replace("_", " ")})`
      );
      reset();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(t("common.error"), err?.message || "Failed to record expense.");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isRTL ? "مقدمہ یا چیمبر خرچہ درج کریں" : "Record Matter / Chamber Expense"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-1" dir={isRTL ? "rtl" : "ltr"}>
        {deals.length > 0 && (
          <Select
            label={isRTL ? "منسلک فیس معاہدہ (اختیاری)" : "Link to Fee Agreement (Optional)"}
            options={[
              {
                value: "",
                label: isRTL ? "-- عمومی خرچہ (کوئی معاہدہ نہیں) --" : "-- General / Unlinked --",
              },
              ...deals.map((d) => ({
                value: d.deal_id,
                label: d.title,
              })),
            ]}
            {...register("deal_id")}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label={isRTL ? "خرچے کی قسم" : "Expense Category"}
            options={[
              { value: "court_fee", label: isRTL ? "کورٹ فیس" : "Court Fee" },
              { value: "stamp_paper", label: isRTL ? "اسٹامپ پیپر" : "Stamp Paper" },
              { value: "munshi", label: isRTL ? "منشیانہ / محرر" : "Munshi / Staff Fee" },
              { value: "travel", label: isRTL ? "سفری اخراجات" : "Travel / Conveyance" },
              { value: "other", label: isRTL ? "دیگر متفرق" : "Other Miscellaneous" },
            ]}
            {...register("category")}
          />

          <Input
            label={isRTL ? "رقم (PKR)" : "Amount (PKR)"}
            type="number"
            min="0"
            step="50"
            placeholder="1500"
            required
            {...register("amount")}
            error={errors.amount?.message}
          />
        </div>

        <Input
          label={isRTL ? "تاریخ خرچہ" : "Expense Date"}
          type="date"
          required
          {...register("expense_date")}
          error={errors.expense_date?.message}
        />

        <Textarea
          label={isRTL ? "تفصیل / نوٹس (اختیاری)" : "Description / Notes (Optional)"}
          placeholder={isRTL ? "مثال: سول کورٹ میں فائلنگ اور کورٹ فیس ٹکٹس" : "e.g. Certified copies fee or high court filing stamp"}
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
            loading={createExpenseMutation.isPending}
            className="min-h-[44px]"
          >
            {isRTL ? "خرچہ محفوظ کریں" : "Save Expense"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
