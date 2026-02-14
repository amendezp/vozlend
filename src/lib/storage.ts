// ============================================
// Client-side Storage (sessionStorage) + Database fallback
// Stores report client-side for immediate access after processing,
// then falls back to API fetch for persistent reports
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

/**
 * Fetch report from API (database) — used when sessionStorage miss
 */
export async function fetchReport(id: string): Promise<FullReport | null> {
  try {
    const res = await fetch(`/api/applications/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
