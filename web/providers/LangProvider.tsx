"use client";

import {
  createContext, useContext, useEffect, useState,
  useCallback, type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type SupportedLang } from "@/i18n/config";

interface LangCtxValue {
  lang:      SupportedLang;
  dir:       "ltr";
  setLang:   (l: SupportedLang) => void;
  languages: typeof SUPPORTED_LANGUAGES;
}

const LangCtx = createContext<LangCtxValue>({
  lang:      "en",
  dir:       "ltr",
  setLang:   () => {},
  languages: SUPPORTED_LANGUAGES,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [lang, setLangState] = useState<SupportedLang>("en");
  const dir = "ltr" as const;

  const setLang = useCallback((_l: SupportedLang) => {
    i18n.changeLanguage("en");
    localStorage.setItem("i18nextLng", "en");
    setLangState("en");
  }, [i18n]);

  useEffect(() => {
    // Purely English for international presentation
    localStorage.setItem("i18nextLng", "en");
    if (i18n.language !== "en") {
      void i18n.changeLanguage("en");
    }
    const html = document.documentElement;
    html.setAttribute("lang", "en");
    html.setAttribute("dir", "ltr");
    html.classList.remove("font-urdu");
  }, [i18n]);

  return (
    <LangCtx.Provider value={{ lang: "en", dir: "ltr", setLang, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LangCtx.Provider>
  );
}

export function useLang() {
  return useContext(LangCtx);
}
