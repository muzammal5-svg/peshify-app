/**
 * Client-side PDF export for the Cause List using jsPDF + jspdf-autotable.
 * Loaded lazily (dynamic import) so it never lands in the SSR bundle.
 *
 * Urdu text note: jsPDF does not natively support Noto Nastaliq (Arabic script).
 * For Urdu party names we render them as-is (Latin fallback in PDF) and note
 * in the footer that Urdu text may not render correctly in the PDF.
 * A full solution requires embedding the Urdu font as a base64 string (Phase 8+).
 */

import type { CauseListRow } from "@/types/supabase";
import { fmtDate }           from "@/lib/utils";
import { BRAND }             from "@/lib/brand";

export interface PdfExportOptions {
  rows:      CauseListRow[];
  date:      string;
  firmName?: string;
  firmLogoUrl?: string | null;
  title?:    string;
}

export async function exportCauseListPdf(opts: PdfExportOptions): Promise<void> {
  // Lazy-load to avoid SSR bundle inclusion
  const { default: jsPDF }     = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const {
    rows,
    date,
    firmName = BRAND.name as string,
    firmLogoUrl,
    title    = "Cause List",
  } = opts;

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  // Use the firm upload when present and the real brand mark as the fallback.
  try {
    const response = await fetch(firmLogoUrl || "/logo/peshify-logo.png");
    if (response.ok) {
      const logo = await response.blob();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(logo);
      });
      doc.addImage(dataUrl, dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG", 14, 7, 30, 19);
    }
  } catch { /* The text header remains available if the image cannot be loaded. */ }

  // ── Header ─────────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(11, 27, 58);     // navy
  doc.text(firmName, pageW / 2, 14, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(138, 100, 20);   // gold
  doc.text(BRAND.tagline, pageW / 2, 20, { align: "center" });

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(11);
  doc.text(`${title} — ${fmtDate(date)}`, pageW / 2, 27, { align: "center" });

  doc.setDrawColor(138, 100, 20);
  doc.setLineWidth(0.5);
  doc.line(14, 30, pageW - 14, 30);

  // ── Table ──────────────────────────────────────────────────────────────────
  const head = [[
    "Sr.", "Case Ref", "Parties (A vs B)", "Type",
    "Court", "Current Proceeding", "Next Proceeding", "Next Date", "Prev. Date",
  ]];

  const body = rows.map(r => [
    r.serial_no         ?? "—",
    r.case_ref_no || "—",
    `${r.plaintiff_name} vs ${r.defendant_name}`,
    r.case_type_name,
    r.hearing_court_no  ?? "—",
    r.current_proceeding ?? "—",
    r.next_proceeding   ?? "—",
    r.next_date         ? fmtDate(r.next_date)     : "—",
    r.previous_date     ? fmtDate(r.previous_date) : "—",
  ]);

  autoTable(doc, {
    startY:    33,
    head,
    body,
    styles: {
      font:      "helvetica",
      fontSize:  8,
      cellPadding: 2.5,
      overflow:  "linebreak",
      valign:    "middle",
      textColor: [11, 27, 58],
    },
    headStyles: {
      fillColor:  [11, 27, 58],
      textColor:  [255, 255, 255],
      fontStyle:  "bold",
      fontSize:   8.5,
    },
    alternateRowStyles: { fillColor: [247, 247, 244] },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 24 },
      2: { cellWidth: 52 },
      3: { cellWidth: 18 },
      4: { cellWidth: 16 },
      5: { cellWidth: 40 },
      6: { cellWidth: 40 },
      7: { cellWidth: 20 },
      8: { cellWidth: 20 },
    },
    didDrawPage: (data) => {
      // Footer on every page
      const pageCount = doc.internal.pages.length - 1;
      doc.setFontSize(7);
      doc.setTextColor(160, 160, 160);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}  •  Generated ${new Date().toLocaleString("en-PK")}  •  Note: Urdu text may not render in PDF`,
        14,
        doc.internal.pageSize.getHeight() - 6
      );
    },
    margin: { top: 33, left: 14, right: 14, bottom: 12 },
  });

  // ── Save ───────────────────────────────────────────────────────────────────
  const fileName = `cause-list-${date}.pdf`;
  doc.save(fileName);
}

// ─── Case Summary PDF ─────────────────────────────────────────────────────────

export interface CaseSummaryHearing {
  hearing_date: string;
  current_proceeding?: string | null;
  next_date?: string | null;
  judge_name?: string | null;
}

export interface CaseSummaryPdfParams {
  firmName?: string;
  firmLogoUrl?: string | null;
  caseRefNo: string;
  plaintiffName: string;
  defendantName: string;
  caseType?: string | null;
  courtNo?: string | null;
  judgeName?: string | null;
  status: string;
  clientName?: string | null;
  clientPhone?: string | null;
  clientCnic?: string | null;
  hearings?: CaseSummaryHearing[];
}

export async function exportCaseSummaryPdf(params: CaseSummaryPdfParams): Promise<void> {
  const { default: jsPDF }     = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const {
    firmName    = BRAND.name as string,
    firmLogoUrl,
    caseRefNo,
    plaintiffName,
    defendantName,
    caseType,
    courtNo,
    judgeName,
    status,
    clientName,
    clientPhone,
    clientCnic,
    hearings    = [],
  } = params;

  const doc   = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;

  // ── Logo ───────────────────────────────────────────────────────────────────
  try {
    const response = await fetch(firmLogoUrl || "/logo/peshify-logo.png");
    if (response.ok) {
      const logo   = await response.blob();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(logo);
      });
      doc.addImage(dataUrl, dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG", margin, 7, 25, 16);
    }
  } catch { /* text header is still present */ }

  // ── Header ─────────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(11, 27, 58);
  doc.text(firmName, pageW / 2, 14, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(138, 100, 20);
  doc.text(BRAND.tagline, pageW / 2, 20, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(11, 27, 58);
  doc.text("CASE BRIEF", pageW / 2, 28, { align: "center" });

  doc.setDrawColor(138, 100, 20);
  doc.setLineWidth(0.6);
  doc.line(margin, 32, pageW - margin, 32);

  let cursorY = 38;

  // ── Helper: section heading ─────────────────────────────────────────────────
  function sectionHeading(label: string, y: number): number {
    doc.setFillColor(11, 27, 58);
    doc.roundedRect(margin, y, pageW - margin * 2, 7, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(label.toUpperCase(), margin + 3, y + 5);
    return y + 10;
  }

  // ── Helper: info row ───────────────────────────────────────────────────────
  function infoRow(label: string, value: string, y: number, labelW = 40): number {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(label, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(11, 27, 58);
    doc.text(value || "—", margin + labelW, y);
    return y + 6;
  }

  // ── Case Info ──────────────────────────────────────────────────────────────
  cursorY = sectionHeading("Case Information", cursorY);
  cursorY = infoRow("Case Ref No:",    caseRefNo || "—",                              cursorY);
  cursorY = infoRow("Parties:",        `${plaintiffName}  vs  ${defendantName}`,      cursorY);
  cursorY = infoRow("Case Type:",      caseType  || "—",                              cursorY);
  cursorY = infoRow("Court:",          courtNo   || "—",                              cursorY);
  cursorY = infoRow("Judge:",          judgeName || "—",                              cursorY);
  cursorY = infoRow("Status:",         status.charAt(0).toUpperCase() + status.slice(1), cursorY);
  cursorY += 4;

  // ── Client Info ────────────────────────────────────────────────────────────
  if (clientName || clientPhone || clientCnic) {
    cursorY = sectionHeading("Client Information", cursorY);
    if (clientName)  cursorY = infoRow("Full Name:", clientName,  cursorY);
    if (clientPhone) cursorY = infoRow("Phone:",     clientPhone, cursorY);
    if (clientCnic)  cursorY = infoRow("CNIC:",      clientCnic,  cursorY);
    cursorY += 4;
  }

  // ── Hearing History ────────────────────────────────────────────────────────
  cursorY = sectionHeading("Hearing History (Last 10)", cursorY);
  cursorY += 2;

  const recentHearings = hearings.slice(0, 10);

  if (recentHearings.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("No hearings recorded.", margin + 2, cursorY + 4);
    cursorY += 10;
  } else {
    autoTable(doc, {
      startY:    cursorY,
      head: [["Date", "Proceeding", "Next Date", "Judge"]],
      body: recentHearings.map(h => [
        fmtDate(h.hearing_date),
        h.current_proceeding || "—",
        h.next_date          ? fmtDate(h.next_date) : "—",
        h.judge_name         || "—",
      ]),
      styles: {
        font:        "helvetica",
        fontSize:    8,
        cellPadding: 2.5,
        overflow:    "linebreak",
        valign:      "middle",
        textColor:   [11, 27, 58],
      },
      headStyles: {
        fillColor:  [11, 27, 58],
        textColor:  [255, 255, 255],
        fontStyle:  "bold",
        fontSize:   8.5,
      },
      alternateRowStyles: { fillColor: [247, 247, 244] },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: "auto" },
        2: { cellWidth: 28 },
        3: { cellWidth: 35 },
      },
      didDrawPage: (data) => {
        const pageCount = doc.internal.pages.length - 1;
        doc.setFontSize(7);
        doc.setTextColor(160, 160, 160);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}  •  Generated by Peshify  •  ${new Date().toLocaleString("en-PK")}`,
          margin,
          doc.internal.pageSize.getHeight() - 6
        );
      },
      margin: { top: 10, left: margin, right: margin, bottom: 14 },
    });
  }

  // Footer on first page when no table (table draws its own footer via didDrawPage)
  if (recentHearings.length === 0) {
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.text(
      `Generated by Peshify  •  ${new Date().toLocaleString("en-PK")}`,
      margin,
      doc.internal.pageSize.getHeight() - 6
    );
  }

  doc.save(`case-brief-${caseRefNo || "case"}.pdf`);
}

/** Web Share API — share the cause list summary text */
export async function shareCauseList(
  rows: CauseListRow[],
  date: string,
  firmName?: string
): Promise<void> {
  const name = firmName ?? (BRAND.name as string);
  const text = [
    `${name}`,
    `Cause List — ${fmtDate(date)}`,
    `${rows.length} hearing(s) scheduled`,
    "",
    ...rows.map(r =>
      `${r.serial_no ?? "—"}. ${r.case_ref_no || "—"} | ${r.plaintiff_name} vs ${r.defendant_name} | Court: ${r.hearing_court_no ?? "—"}`
    ),
  ].join("\n");

  if (typeof navigator !== "undefined" && navigator.share) {
    await navigator.share({ title: `Cause List ${fmtDate(date)}`, text });
  } else {
    await navigator.clipboard.writeText(text);
  }
}
