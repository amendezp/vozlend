"use client";

import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-gray-200 py-8">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-sm text-gray-500">
          {t("footer.tagline")}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {t("footer.builtWith")}
        </p>
      </div>
    </footer>
  );
}
