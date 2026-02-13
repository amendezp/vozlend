"use client";

import { Mic, FileText, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Mic,
      title: t("howItWorks.step1Title"),
      description: t("howItWorks.step1Desc"),
    },
    {
      icon: FileText,
      title: t("howItWorks.step2Title"),
      description: t("howItWorks.step2Desc"),
    },
    {
      icon: CheckCircle,
      title: t("howItWorks.step3Title"),
      description: t("howItWorks.step3Desc"),
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-gray-100">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-2xl font-light text-gray-900 sm:text-3xl tracking-tight">
          {t("howItWorks.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-gray-400 font-light">
          {t("howItWorks.subtitle")}
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative rounded-xl border border-gray-100 bg-white p-6 transition-shadow hover:shadow-sm"
            >
              {/* Step number */}
              <div className="absolute -top-3 -left-3 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-normal text-white">
                {i + 1}
              </div>

              <step.icon className="h-8 w-8 text-gray-300 stroke-[1.5]" />
              <h3 className="mt-4 text-base font-medium text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400 font-light">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
