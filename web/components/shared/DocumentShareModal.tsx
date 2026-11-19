"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquare, Copy, Check, Share2, FileText, Phone, Link2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  generateDocumentShareMessage,
  openWhatsApp,
  copyTextToClipboard,
  shareViaNavigator,
  type DocumentShareData,
} from "@/lib/clientShare";

interface DocumentShareModalProps {
  open: boolean;
  onClose: () => void;
  data: DocumentShareData | null;
}

export function DocumentShareModal({ open, onClose, data }: DocumentShareModalProps) {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const isUrduLang = i18n.language === "ur";

  const [lang, setLang] = useState<"ur" | "en">(isUrduLang ? "ur" : "en");
  const [clientPhone, setClientPhone] = useState<string>(data?.clientPhone || "");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!data) return null;

  const currentData: DocumentShareData = {
    ...data,
    clientPhone: clientPhone || data.clientPhone,
    lang,
  };

  const messageText = generateDocumentShareMessage(currentData);

  async function handleCopyLinkOnly() {
    if (!data?.documentUrl) return;
    const ok = await copyTextToClipboard(data.documentUrl);
    if (ok) {
      setCopiedLink(true);
      toast.success(
        lang === "ur" ? "دستاویز کا لنک کاپی ہو گیا!" : "Document link copied!",
        lang === "ur" ? "لنک 7 دن کے لیے کارآمد ہے۔" : "Link is valid for 7 days."
      );
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }

  async function handleCopyFullMessage() {
    const ok = await copyTextToClipboard(messageText);
    if (ok) {
      setCopiedMessage(true);
      toast.success(
        lang === "ur" ? "مکمل میسج کاپی ہو گیا!" : "Full message copied!",
        lang === "ur" ? "واٹس ایپ پر پیسٹ کر کے بھیجیں۔" : "Paste in WhatsApp or SMS."
      );
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  }

  function handleSendWhatsApp() {
    openWhatsApp(clientPhone || data?.clientPhone, messageText);
    toast.success(
      lang === "ur" ? "WhatsApp کھل رہا ہے…" : "Opening WhatsApp…",
      lang === "ur" ? "موکل کو دستاویز بھیجیں" : "Sharing document with client"
    );
  }

  async function handleNativeShare() {
    if (!data) return;
    const shared = await shareViaNavigator(
      data.documentName,
      messageText,
      data.documentUrl
    );
    if (!shared) {
      handleCopyFullMessage();
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={lang === "ur" ? "موکل کے ساتھ دستاویز شیئر کریں" : "Share Document with Client"}
      size="md"
    >
      <div className="space-y-4 py-2">
        {/* Document Info Card */}
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">
                {data.documentName}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {data.caseTitle || data.caseRef || (lang === "ur" ? "عدالتی دستاویز" : "Court File")}
              </p>
            </div>
          </div>

          <div className="flex items-center rounded-lg bg-muted p-0.5 text-xs font-medium flex-shrink-0">
            <button
              type="button"
              onClick={() => setLang("ur")}
              className={`px-2 py-0.5 rounded-md transition-colors ${
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
              className={`px-2 py-0.5 rounded-md transition-colors ${
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
              {lang === "ur" ? "موکل کا واٹس ایپ نمبر" : "Client WhatsApp Number"}
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
            {lang === "ur" ? "واٹس ایپ پیغام کا پیش منظر:" : "WhatsApp Message Preview:"}
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
            onClick={handleCopyLinkOnly}
            className="btn-secondary min-h-[44px] px-3.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold"
            title="Copy download link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
            <span>{copiedLink ? (lang === "ur" ? "لنک کاپی ہو گیا" : "Link Copied") : (lang === "ur" ? "صرف لنک کاپی" : "Copy Link")}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyFullMessage}
            className="btn-ghost min-h-[44px] px-3.5 rounded-xl flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            title="Copy message text"
          >
            {copiedMessage ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copiedMessage ? "Copied" : (lang === "ur" ? "پیغام کاپی" : "Copy Text")}</span>
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="btn-ghost min-h-[44px] px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
