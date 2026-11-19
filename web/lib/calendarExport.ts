/**
 * Utility for exporting hearings to Google Calendar and Apple/Outlook iCal (.ics)
 */

export interface CalendarHearingEvent {
  title: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  description?: string;
  location?: string;
  caseRef?: string;
}

/**
 * Format date string "YYYY-MM-DD" into ICS format "YYYYMMDD"
 */
function toICSDate(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

/**
 * Generate iCal (.ics) string according to RFC 5545
 */
export function generateICS(event: CalendarHearingEvent): string {
  const dtStart = toICSDate(event.date);
  // Default end date is next day for all-day events in ICS, or same day
  const dtEnd = event.endDate ? toICSDate(event.endDate) : dtStart;
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const uid = `peshify-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@peshify.pk`;

  const escapeICS = (str: string) =>
    str.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

  const summary = escapeICS(event.title || "Court Hearing");
  const description = escapeICS(event.description || "");
  const location = escapeICS(event.location || "Court");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Peshify//Court Diary//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Trigger browser download of .ics file
 */
export function downloadICS(event: CalendarHearingEvent, filename = "court-hearing.ics"): void {
  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate Google Calendar Web URL (opens Google Calendar with event pre-filled)
 */
export function getGoogleCalendarUrl(event: CalendarHearingEvent): string {
  const dtStart = toICSDate(event.date);
  // For all-day event in Google Calendar, dates parameter is YYYYMMDD/YYYYMMDD
  const dates = `${dtStart}/${dtStart}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title || "Court Hearing",
    dates,
    details: event.description || "",
    location: event.location || "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
