"use client";

import { useLanguage } from "@/context/LanguageContext";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "es" : "en")}
      className="language-toggle fixed top-4 right-4 z-50 flex items-center gap-1.5 rounded-full border border-gray-100 bg-white/80 backdrop-blur-sm px-3 py-1.5 text-xs tracking-wide text-gray-500 shadow-sm hover:bg-white transition-colors"
      aria-label="Toggle language"
    >
      {locale === "en" ? "ES" : "EN"}
    </button>
  );
}
