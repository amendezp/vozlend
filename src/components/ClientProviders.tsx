"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <LanguageToggle />
      {children}
    </LanguageProvider>
  );
}
