// ============================================
// Client-side Storage (sessionStorage)
// MVP: No database needed
// ============================================

import type { FullReport } from "@/types";

const STORAGE_PREFIX = "echobank_report_";

export function storeReport(report: FullReport): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      `${STORAGE_PREFIX}${report.id}`,
      JSON.stringify(report)
    );
  } catch (e) {
    console.warn("[EchoBank] Failed to store report:", e);
  }
}

export function getReport(id: string): FullReport | null {
  if (typeof window === "undefined") return null;
  try {
    const data = sessionStorage.getItem(`${STORAGE_PREFIX}${id}`);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn("[EchoBank] Failed to retrieve report:", e);
    return null;
  }
}
