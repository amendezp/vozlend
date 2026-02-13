"use client";

import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-gray-100 py-10">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-xs tracking-wide text-gray-400 font-light">
          {t("footer.tagline")}
        </p>
        <p className="mt-1 text-xs text-gray-300 font-light">
          {t("footer.builtWith")}
        </p>
      </div>
    </footer>
  );
}
