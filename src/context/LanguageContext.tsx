"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { en, type Locale } from "@/locales/en";
import { es } from "@/locales/es";

export type SupportedLocale = "en" | "es";

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const locales: Record<SupportedLocale, Locale> = { en, es };

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (
      current &&
      typeof current === "object" &&
      key in (current as Record<string, unknown>)
    ) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Fallback: return the key path itself
    }
  }
  return typeof current === "string" ? current : path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("echobank_locale") as SupportedLocale | null;
    if (saved && (saved === "en" || saved === "es")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem("echobank_locale", newLocale);
  }, []);

  const t = useCallback(
    (path: string): string => {
      return getNestedValue(
        locales[locale] as unknown as Record<string, unknown>,
        path
      );
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
