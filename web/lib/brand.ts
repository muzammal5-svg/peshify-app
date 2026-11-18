/**
 * Brand constants for DiaryLex.
 * International legal case management, court docketing, and hearing diary.
 * All colours reference the Tailwind tokens — import from here, never hardcode.
 */

export const BRAND = {
  name:        "DiaryLex",
  shortName:   "DiaryLex",
  legalName:   "DiaryLex Technologies Ltd.",
  domain:      "diarylex.com",
  tagline:     "Intelligent Case Management & Court Hearing Diary for Modern Law Practices",
  timezone:    "UTC",
  dateFormat:  "dd MMM yyyy",   // date-fns format token
  dateLocale:  "en-US",

  colors: {
    gold:      "#8A6414",
    navy:      "#0B1B3A",
    offwhite:  "#F7F7F4",
    success:   "#1F7A4D",
    danger:    "#C0392B",
  },
} as const;

export type BrandColor = keyof typeof BRAND.colors;
