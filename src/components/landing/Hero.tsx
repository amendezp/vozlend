"use client";

import { Mic, Shield, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-36 md:pb-24">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-gradient-to-b from-emerald-50/80 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Logo/Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs tracking-wide uppercase text-gray-500">
          <Mic className="h-3.5 w-3.5" />
          {t("hero.badge")}
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-light tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          {t("hero.headline")}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            {" "}
            {t("hero.headlineHighlight")}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400 font-light">
          {t("hero.description")}
        </p>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs tracking-wide text-gray-400">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>{t("hero.trustSpeed")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span>{t("hero.trustSecure")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mic className="h-3.5 w-3.5 text-blue-400" />
            <span>{t("hero.trustVoice")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
