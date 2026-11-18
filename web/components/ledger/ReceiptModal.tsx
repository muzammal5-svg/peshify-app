"use client";

import { useTranslation } from "react-i18next";
import { Printer, MessageCircle, X, CheckCircle2, Shield } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { fmtDate } from "@/lib/utils";

export interface ReceiptData {
  chamberName: string;
  clientName: string;
  clientPhone?: string | null;
  caseRef?: string | null;
  dealTitle: string;
  amount: number;
  paymentDate: string;
  method: string;
  referenceNo?: string | null;
  balanceRemaining: number;
  receiptNo?: string;
  notes?: string | null;
}

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  data: ReceiptData | null;
}

export function ReceiptModal({ open, onClose, data }: ReceiptModalProps) {
  const { t } = useTranslation();

  if (!data) return null;

  const formattedAmount = `Rs ${Number(data.amount).toLocaleString()}`;
  const formattedBalance = `Rs ${Number(data.balanceRemaining).toLocaleString()}`;
  const receiptNo = data.receiptNo || `REC-${Date.now().toString().slice(-6)}`;

  // Generate plain-text WhatsApp message for client
  function handleShareWhatsApp() {
    if (!data) return;
    const msg = [
      `*${data.chamberName}*`,
      `*OFFICIAL FEE PAYMENT RECEIPT*`,
      `---------------------------------`,
      `*Receipt No:* ${receiptNo}`,
      `*Date:* ${fmtDate(data.paymentDate)}`,
      `*Client Name:* ${data.clientName}`,
      data.caseRef ? `*Case Ref:* ${data.caseRef}` : null,
      `*Matter:* ${data.dealTitle}`,
      `---------------------------------`,
      `*Amount Received:* ${formattedAmount}`,
      `*Payment Method:* ${data.method.toUpperCase()}${data.referenceNo ? ` (Ref: ${data.referenceNo})` : ""}`,
      `*Remaining Balance:* ${formattedBalance}`,
      `---------------------------------`,
      `Thank you for trusting our legal practice.`,
      `For inquiries: ${data.chamberName}`,
    ]
      .filter(Boolean)
      .join("\n");

    const encoded = encodeURIComponent(msg);
    const phone = data.clientPhone ? data.clientPhone.replace(/\D/g, "") : "";
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
  }

  function handlePrint() {
    window.print();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Fee Payment Receipt Voucher"
      size="md"
    >
      <div className="space-y-5 py-2">
        {/* Printable Receipt Paper Container */}
        <div
          id="peshify-printable-receipt"
          className="bg-card text-foreground border-2 border-border/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 print:p-0 print:border-none print:shadow-none print:text-black print:bg-white"
        >
          {/* Header */}
          <div className="text-center pb-4 border-b border-border/80 print:border-neutral-300">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight font-serif text-primary print:text-black">
              {data.chamberName}
            </h3>
            <p className="text-xs text-muted-foreground print:text-neutral-600 mt-0.5">
              Advocates &amp; Legal Consultants · Chamber Practice
            </p>
            <div className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs print:bg-transparent print:border-black print:text-black">
              OFFICIAL PAYMENT ACKNOWLEDGEMENT
            </div>
          </div>

          {/* Meta rows */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground print:text-neutral-500">Receipt No:</p>
              <p className="font-mono font-bold text-foreground print:text-black">{receiptNo}</p>
            </div>
            <div className="text-end">
              <p className="text-muted-foreground print:text-neutral-500">Date:</p>
              <p className="font-semibold text-foreground print:text-black">{fmtDate(data.paymentDate)}</p>
            </div>
          </div>

          {/* Details Table */}
          <div className="rounded-xl border border-border/70 overflow-hidden divide-y divide-border/60 text-xs sm:text-sm print:border-neutral-300 print:divide-neutral-300">
            <div className="flex justify-between p-2.5 bg-secondary/30 print:bg-transparent">
              <span className="text-muted-foreground print:text-neutral-600">Client Name:</span>
              <span className="font-bold text-foreground print:text-black">{data.clientName}</span>
            </div>
            <div className="flex justify-between p-2.5">
              <span className="text-muted-foreground print:text-neutral-600">Matter / Case:</span>
              <span className="font-semibold text-foreground print:text-black text-end max-w-[240px] truncate">
                {data.dealTitle} {data.caseRef ? `(${data.caseRef})` : ""}
              </span>
            </div>
            <div className="flex justify-between p-2.5 bg-secondary/30 print:bg-transparent">
              <span className="text-muted-foreground print:text-neutral-600">Payment Mode:</span>
              <span className="font-semibold capitalize text-foreground print:text-black">
                {data.method} {data.referenceNo ? `(Ref: ${data.referenceNo})` : ""}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-primary/10 print:bg-neutral-100 font-bold">
              <span className="text-primary print:text-black text-sm">AMOUNT RECEIVED:</span>
              <span className="text-primary print:text-black text-base">{formattedAmount}</span>
            </div>
            <div className="flex justify-between p-2.5">
              <span className="text-muted-foreground print:text-neutral-600">Remaining Balance:</span>
              <span className="font-bold text-amber-500 print:text-black">{formattedBalance}</span>
            </div>
          </div>

          {data.notes && (
            <p className="text-xs text-muted-foreground italic print:text-neutral-600">
              Note: {data.notes}
            </p>
          )}

          {/* Signature Footer */}
          <div className="pt-6 flex justify-between items-end text-xs text-muted-foreground print:text-neutral-600">
            <div>
              <p className="font-mono text-[10px]">Generated electronically by DiaryLex</p>
            </div>
            <div className="text-center">
              <div className="w-28 border-b border-border/80 print:border-black mb-1" />
              <p className="font-semibold">Authorized Signature</p>
            </div>
          </div>
        </div>

        {/* Action Buttons (Excluded from print via print:hidden) */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 print:hidden">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShareWhatsApp}
            leftIcon={<MessageCircle className="w-4 h-4 text-emerald-500" />}
            className="w-full sm:w-auto min-h-[44px] text-xs font-semibold"
          >
            Share via WhatsApp
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
            className="w-full sm:w-auto min-h-[44px] text-xs font-semibold"
          >
            Print Receipt
          </Button>
        </div>
      </div>
    </Modal>
  );
}
