import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", dir: "ltr" as const },
] as const;

export type SupportedLang = (typeof SUPPORTED_LANGUAGES)[number]["code"];

// Safe init — purely English for global international presence
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
      },
      lng: "en",
      fallbackLng: "en",
      supportedLngs: ["en"],
      interpolation: { escapeValue: false },
    });
}

export default i18n;
