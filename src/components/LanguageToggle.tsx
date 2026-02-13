"use client";

import { useLanguage } from "@/context/LanguageContext";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "es" : "en")}
      className="language-toggle fixed top-4 right-4 z-50 flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
      aria-label="Toggle language"
    >
      {locale === "en" ? "🇪🇸 ES" : "🇺🇸 EN"}
    </button>
  );
}
