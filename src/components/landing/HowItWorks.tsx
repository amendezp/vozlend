"use client";

import { Mic, FileText, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Mic,
    title: "Record",
    description:
      "Record a voice memo describing your loan request — who you are, how much you need, and how you plan to repay.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    icon: FileText,
    title: "Analyze",
    description:
      "Our AI transcribes your voice, extracts key data, and performs a comprehensive underwriting analysis across 8 dimensions.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    icon: CheckCircle,
    title: "Decision",
    description:
      "Receive a detailed report with your score, decision (approve, decline, or more info needed), and specific terms or next steps.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          How It Works
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-gray-600">
          Three simple steps from voice memo to underwriting decision
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
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
