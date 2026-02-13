"use client";

import { Mic, Shield, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-gradient-to-b from-emerald-100/60 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Logo/Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
          <Mic className="h-4 w-4" />
          AI-Powered Voice Underwriting
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Your voice is your
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {" "}
            loan application
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Upload a voice memo in Spanish describing your loan request. VozLend
          transcribes, analyzes, and underwrites your application using AI — delivering
          a comprehensive decision in under a minute.
        </p>

        {/* Trust indicators */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Results in ~30 seconds</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" />
            <span>Secure & confidential</span>
          </div>
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-blue-500" />
            <span>Spanish voice memos</span>
          </div>
        </div>
      </div>
    </section>
  );
}
