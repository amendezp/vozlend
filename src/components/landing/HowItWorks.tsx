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
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      icon: FileText,
      title: t("howItWorks.step2Title"),
      description: t("howItWorks.step2Desc"),
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    {
      icon: CheckCircle,
      title: t("howItWorks.step3Title"),
      description: t("howItWorks.step3Desc"),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          {t("howItWorks.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-gray-600">
          {t("howItWorks.subtitle")}
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`relative rounded-2xl border ${step.border} ${step.bg} p-6 transition-shadow hover:shadow-lg`}
            >
              {/* Step number */}
              <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-900 shadow-md">
                {i + 1}
              </div>

              <step.icon className={`h-10 w-10 ${step.color}`} />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
