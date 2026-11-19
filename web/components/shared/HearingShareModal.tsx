"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquare, Copy, Check, Share2, Calendar, Phone, Gavel } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  generateHearingShareMessage,
  openWhatsApp,
  copyTextToClipboard,
  shareViaNavigator,
  type HearingShareData,
} from "@/lib/clientShare";

interface HearingShareModalProps {
  open: boolean;
  onClose: () => void;
  data: HearingShareData | null;
}

export function HearingShareModal({ open, onClose, data }: HearingShareModalProps) {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const isUrduLang = i18n.language === "ur";

  const [lang, setLang] = useState<"ur" | "en">(isUrduLang ? "ur" : "en");
  const [clientPhone, setClientPhone] = useState<string>(data?.clientPhone || "");
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const currentData: HearingShareData = {
    ...data,
    clientPhone: clientPhone || data.clientPhone,
    lang,
  };

  const messageText = generateHearingShareMessage(currentData);

  async function handleCopy() {
    const ok = await copyTextToClipboard(messageText);
    if (ok) {
      setCopied(true);
      toast.success(
        lang === "ur" ? "پیغام کاپی ہو گیا!" : "Hearing update copied!",
        lang === "ur" ? "آپ اسے واٹس ایپ یا ایس ایم ایس پر بھیج سکتے ہیں۔" : "You can paste and send via WhatsApp or SMS."
      );
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error(t("common.error") || "Error", "Could not copy to clipboard");
    }
  }

  function handleSendWhatsApp() {
    openWhatsApp(clientPhone || data?.clientPhone, messageText);
    toast.success(
      lang === "ur" ? "WhatsApp کھل رہا ہے…" : "Opening WhatsApp…",
      lang === "ur" ? "موکل کو پیغام بھیجیں" : "Sending update to client"
    );
  }

  async function handleNativeShare() {
    const shared = await shareViaNavigator(
      lang === "ur" ? "عدالتی پیشی کی تاریخ" : "Court Hearing Date",
      messageText
    );
    if (!shared) {
      handleCopy();
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={lang === "ur" ? "موکل کے ساتھ اگلی پیشی شیئر کریں" : "Share Next Hearing Date with Client"}
      size="md"
    >
      <div className="space-y-4 py-2">
        {/* Language & Channel Header */}
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                {lang === "ur" ? "1-کلک واٹس ایپ نوٹس" : "Instant Client WhatsApp Notice"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {lang === "ur" ? "قانونی ڈائری فارمیٹ" : "Standard court diary format"}
              </p>
            </div>
          </div>

          <div className="flex items-center rounded-lg bg-muted p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setLang("ur")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                lang === "ur"
                  ? "bg-card text-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              اردو
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                lang === "en"
                  ? "bg-card text-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Client phone number input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-primary" />
              {lang === "ur" ? "موکل کا موبائل / واٹس ایپ نمبر" : "Client Mobile / WhatsApp"}
            </span>
            {data.clientName && (
              <span className="text-[11px] text-muted-foreground font-normal">
                {data.clientName}
              </span>
            )}
          </label>
          <input
            type="tel"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            placeholder="0300 1234567"
            dir="ltr"
            className="w-full px-3 py-2 text-xs rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-primary text-foreground font-mono"
          />
        </div>

        {/* Formatted Message Preview */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            {lang === "ur" ? "پیغام کا پیش منظر (Preview):" : "Message Preview:"}
          </span>
          <div
            className="p-3.5 rounded-xl bg-muted/30 border border-border/60 text-xs text-foreground font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto selection:bg-emerald-500/20"
            dir={lang === "ur" ? "rtl" : "ltr"}
          >
            {messageText}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border/60">
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="btn-primary flex-1 min-h-[44px] rounded-xl flex items-center justify-center gap-2 text-xs font-semibold bg-[#1F7A4D] hover:bg-[#1A6640] text-white"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>{lang === "ur" ? "واٹس ایپ پر بھیجیں" : "Send on WhatsApp"}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="btn-secondary min-h-[44px] px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (lang === "ur" ? "کاپی ہو گیا" : "Copied") : (lang === "ur" ? "کاپی کریں" : "Copy")}</span>
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="btn-ghost min-h-[44px] px-3 rounded-xl flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
