"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "system";
export type AccentPreset = "indigo" | "emerald" | "sky" | "amber";

export interface AccentConfig {
  id: AccentPreset;
  name: string;
  hex: string;
  glow: string;
}

export const ACCENT_PRESETS: AccentConfig[] = [
  {
    id: "indigo",
    name: "Linear Indigo",
    hex: "#6366F1",
    glow: "rgba(99, 102, 241, 0.4)",
  },
  {
    id: "emerald",
    name: "Legal Emerald",
    hex: "#10B981",
    glow: "rgba(16, 185, 129, 0.4)",
  },
  {
    id: "sky",
    name: "Corporate Sky",
    hex: "#0EA5E9",
    glow: "rgba(14, 165, 233, 0.4)",
  },
  {
    id: "amber",
    name: "Executive Bronze",
    hex: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.4)",
  },
];

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedMode: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
  accent: AccentPreset;
  setAccent: (accent: AccentPreset) => void;
  accents: AccentConfig[];
}

const STORAGE_MODE_KEY = "peshify_theme_mode";
const STORAGE_ACCENT_KEY = "peshify_theme_accent";

const ThemeContext = createContext<ThemeContextValue>({
  mode: "dark",
  resolvedMode: "dark",
  setMode: () => {},
  accent: "indigo",
  setAccent: () => {},
  accents: ACCENT_PRESETS,
});

function getSystemMode(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("dark");
  const [accent, setAccentState] = useState<AccentPreset>("indigo");
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage or fallback
  useEffect(() => {
    setMounted(true);
    try {
      const savedMode = (localStorage.getItem(STORAGE_MODE_KEY) as ThemeMode) || "dark";
      const savedAccent = (localStorage.getItem(STORAGE_ACCENT_KEY) as AccentPreset) || "indigo";

      if (savedMode === "light" || savedMode === "dark" || savedMode === "system") {
        setModeState(savedMode);
        const resolved = savedMode === "system" ? getSystemMode() : savedMode;
        setResolvedMode(resolved);
      }

      if (ACCENT_PRESETS.some((a) => a.id === savedAccent)) {
        setAccentState(savedAccent);
      }
    } catch {}
  }, []);

  // Update HTML classes & attributes
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;

    const resolved = mode === "system" ? getSystemMode() : mode;
    setResolvedMode(resolved);

    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.setAttribute("data-theme", resolved);
    root.setAttribute("data-accent", accent);
    root.style.colorScheme = resolved;
  }, [mode, accent, mounted]);

  // Listen to OS theme changes when in "system" mode
  useEffect(() => {
    if (!mounted || mode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const resolved = media.matches ? "dark" : "light";
      setResolvedMode(resolved);
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
      root.setAttribute("data-theme", resolved);
      root.style.colorScheme = resolved;
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [mode, mounted]);

  // Set mode handler
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_MODE_KEY, newMode);
    } catch {}

    const resolved = newMode === "system" ? getSystemMode() : newMode;
    setResolvedMode(resolved);

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.setAttribute("data-theme", resolved);
    root.style.colorScheme = resolved;
  }, []);

  // Set accent handler
  const setAccent = useCallback((newAccent: AccentPreset) => {
    setAccentState(newAccent);
    try {
      localStorage.setItem(STORAGE_ACCENT_KEY, newAccent);
    } catch {}

    const root = document.documentElement;
    root.setAttribute("data-accent", newAccent);
  }, []);

  const value = useMemo(
    () => ({
      mode,
      resolvedMode,
      setMode,
      accent,
      setAccent,
      accents: ACCENT_PRESETS,
    }),
    [mode, resolvedMode, setMode, accent, setAccent]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
