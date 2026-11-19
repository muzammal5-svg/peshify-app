"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarPlus, Download, ExternalLink, Calendar as CalendarIcon } from "lucide-react";
import {
  CalendarHearingEvent,
  getGoogleCalendarUrl,
  downloadICS,
} from "@/lib/calendarExport";

export interface HearingInput {
  hearing_date: string;
  next_date?: string | null;
  case_ref_no?: string | null;
  plaintiff_name?: string | null;
  defendant_name?: string | null;
  court_no?: string | null;
  judge_name?: string | null;
  client_name?: string | null;
}

interface CalendarExportButtonProps {
  hearing?: HearingInput;
  event?: CalendarHearingEvent;
  className?: string;
  variant?: "icon" | "button";
}

export function CalendarExportButton({
  hearing,
  event: customEvent,
  className = "",
  variant = "icon",
}: CalendarExportButtonProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const event: CalendarHearingEvent = customEvent || {
    title: hearing?.case_ref_no
      ? `Court Hearing: ${hearing.case_ref_no}`
      : "Court Hearing",
    date: hearing?.next_date || hearing?.hearing_date || new Date().toISOString().split("T")[0],
    description: [
      hearing?.plaintiff_name && hearing?.defendant_name
        ? `${hearing.plaintiff_name} vs ${hearing.defendant_name}`
        : null,
      hearing?.court_no ? `Court No: ${hearing.court_no}` : null,
      hearing?.judge_name ? `Judge: ${hearing.judge_name}` : null,
      hearing?.client_name ? `Client: ${hearing.client_name}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    location: hearing?.court_no ? `Court No. ${hearing.court_no}` : "Court",
    caseRef: hearing?.case_ref_no || undefined,
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleGoogleCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getGoogleCalendarUrl(event);
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const handleDownloadICS = (e: React.MouseEvent) => {
    e.stopPropagation();
    const filename = `hearing-${event.date}-${(event.caseRef || "case").replace(/[^a-zA-Z0-9_-]/g, "_")}.ics`;
    downloadICS(event, filename);
    setOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
          title="Add to Google / Apple Calendar"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-sky-500 hover:bg-sky-500/10 transition-colors"
          aria-label="Add hearing to Calendar"
        >
          <CalendarPlus className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/80 hover:bg-secondary text-xs font-medium text-foreground border border-border/80 transition-colors shadow-2xs"
        >
          <CalendarPlus className="w-3.5 h-3.5 text-sky-500" />
          <span>Calendar</span>
        </button>
      )}

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-1.5 w-48 rounded-xl bg-card border border-border shadow-lg p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleGoogleCalendar}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-secondary text-foreground transition-colors text-start"
          >
            <span className="flex items-center gap-2">
              <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>Google Calendar</span>
            </span>
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handleDownloadICS}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-secondary text-foreground transition-colors text-start"
          >
            <span className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span>Apple / Outlook (.ics)</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
