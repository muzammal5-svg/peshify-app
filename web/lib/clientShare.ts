import { fmtDate } from "@/lib/utils";

export interface HearingShareData {
  clientName?: string | null;
  clientPhone?: string | null;
  plaintiff?: string | null;
  defendant?: string | null;
  caseRef?: string | null;
  courtName?: string | null;
  judgeName?: string | null;
  hearingDate?: string | null;
  nextDate?: string | null;
  nextProceeding?: string | null;
  currentProceeding?: string | null;
  chamberName?: string | null;
  lang?: "ur" | "en";
}

export interface DocumentShareData {
  clientName?: string | null;
  clientPhone?: string | null;
  documentName: string;
  documentUrl: string;
  caseTitle?: string | null;
  caseRef?: string | null;
  chamberName?: string | null;
  lang?: "ur" | "en";
}

/**
 * Normalizes any phone number into WhatsApp format (digits only, e.g. 923323055502)
 */
export function cleanWhatsAppNumber(phone?: string | null): string {
  if (!phone) return "";
  let digits = phone.replace(/[^0-9]/g, "");
  if (digits.startsWith("0092")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0")) {
    digits = `92${digits.slice(1)}`;
  }
  return digits;
}

/**
 * Generates an Urdu or English court hearing update message formatted for advocates
 */
export function generateHearingShareMessage(data: HearingShareData): string {
  const isUrdu = data.lang !== "en";
  const clientGreeting = data.clientName ? (isUrdu ? `محترم ${data.clientName} صاحب` : `Respected ${data.clientName}`) : (isUrdu ? "محترم موکل" : "Respected Client");
  const caseTitle = [data.plaintiff, data.defendant].filter(Boolean).join(isUrdu ? " بنام " : " vs ");
  const formattedNextDate = data.nextDate ? fmtDate(data.nextDate) : (isUrdu ? "جلد مقرر ہوگی" : "To be scheduled");
  const courtInfo = [data.courtName ? (isUrdu ? `عدالت ${data.courtName}` : `Court ${data.courtName}`) : "", data.judgeName].filter(Boolean).join(" - ");

  if (isUrdu) {
    const lines = [
      `السلام علیکم ${clientGreeting}،`,
      `آپ کے مقدمے کی تازہ ترین پیشی اپڈیٹ:`,
      "",
      caseTitle ? `⚖️ مقدمہ: ${caseTitle}` : "",
      data.caseRef ? `🔢 کیس نمبر: ${data.caseRef}` : "",
      courtInfo ? `🏛️ عدالت: ${courtInfo}` : "",
      `📅 اگلی پیشی کی تاریخ: ${formattedNextDate}`,
      data.nextProceeding ? `📋 اگلی کارروائی / مقصد: ${data.nextProceeding}` : "",
      data.currentProceeding ? `📝 آج کی کارروائی: ${data.currentProceeding}` : "",
      "",
      data.chamberName ? `چیمبر: ${data.chamberName}` : "آپ کا قانونی چیمبر",
      "کسی بھی سوال کی صورت میں رابطہ فرمائیں۔",
    ].filter(line => line !== "");

    return lines.join("\n");
  }

  const lines = [
    `Dear ${clientGreeting},`,
    `Court Hearing Update:`,
    "",
    caseTitle ? `⚖️ Case: ${caseTitle}` : "",
    data.caseRef ? `🔢 Case Ref: ${data.caseRef}` : "",
    courtInfo ? `🏛️ Court: ${courtInfo}` : "",
    `📅 Next Hearing Date: ${formattedNextDate}`,
    data.nextProceeding ? `📋 Stage / Purpose: ${data.nextProceeding}` : "",
    data.currentProceeding ? `📝 Today's Proceeding: ${data.currentProceeding}` : "",
    "",
    data.chamberName ? `Chamber: ${data.chamberName}` : "Legal Chamber",
    "Please contact our chamber for any inquiries.",
  ].filter(line => line !== "");

  return lines.join("\n");
}

/**
 * Generates an Urdu or English document sharing message
 */
export function generateDocumentShareMessage(data: DocumentShareData): string {
  const isUrdu = data.lang !== "en";
  const clientGreeting = data.clientName ? (isUrdu ? `محترم ${data.clientName} صاحب` : `Respected ${data.clientName}`) : (isUrdu ? "محترم موکل" : "Respected Client");

  if (isUrdu) {
    const lines = [
      `السلام علیکم ${clientGreeting}،`,
      `آپ کے کیس کی عدالتی دستاویز / فائل درج ذیل ہے:`,
      "",
      `📄 دستاویز: ${data.documentName}`,
      data.caseTitle ? `⚖️ مقدمہ: ${data.caseTitle}` : "",
      data.caseRef ? `🔢 کیس نمبر: ${data.caseRef}` : "",
      "",
      `🔗 فائل ڈاؤن لوڈ لنک:`,
      data.documentUrl,
      "",
      `یہ لنک اگلے 7 دنوں کے لیے فعال ہے۔`,
      data.chamberName ? `🏛️ ${data.chamberName}` : "",
    ].filter(line => line !== "");

    return lines.join("\n");
  }

  const lines = [
    `Dear ${clientGreeting},`,
    `Please find the case document / court order below:`,
    "",
    `📄 Document: ${data.documentName}`,
    data.caseTitle ? `⚖️ Case: ${data.caseTitle}` : "",
    data.caseRef ? `🔢 Case Ref: ${data.caseRef}` : "",
    "",
    `🔗 Download Link:`,
    data.documentUrl,
    "",
    `This link remains active for 7 days.`,
    data.chamberName ? `🏛️ ${data.chamberName}` : "",
  ].filter(line => line !== "");

  return lines.join("\n");
}

/**
 * Open WhatsApp with a prefilled message (with or without specific phone)
 */
export function openWhatsApp(phone: string | null | undefined, message: string) {
  const num = cleanWhatsAppNumber(phone);
  const encoded = encodeURIComponent(message);
  const url = num ? `https://wa.me/${num}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

/**
 * Native Web Share API trigger
 */
export async function shareViaNavigator(title: string, text: string, url?: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        console.error("Native share failed", e);
      }
    }
  }
  return false;
}
