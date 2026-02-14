"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Mic,
  Search,
  Plus,
  LogOut,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ApplicationSummary {
  id: string;
  createdAt: string;
  status: string;
  audioFileName: string | null;
  audioDuration: number | null;
  audioLanguage: string | null;
  decision: string | null;
  weightedScore: number | null;
  applicantName: string | null;
  loanAmount: number | null;
  loanCurrency: string | null;
  loanPurpose: string | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const DECISION_COLORS: Record<string, string> = {
  approve: "bg-emerald-50 text-emerald-700 border-emerald-200",
  decline: "bg-red-50 text-red-700 border-red-200",
  request_more_info: "bg-amber-50 text-amber-700 border-amber-200",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-50 text-gray-500 border-gray-200",
  processing: "bg-blue-50 text-blue-600 border-blue-200",
  completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  failed: "bg-red-50 text-red-600 border-red-200",
};

export default function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();

  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filter !== "all") params.set("decision", filter);
      params.set("page", page.toString());

      const res = await fetch(`/api/applications?${params}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications);
        setPagination(data.pagination);
      }
    } catch (e) {
      console.error("[EchoBank] Failed to fetch applications:", e);
    } finally {
      setLoading(false);
    }
  }, [search, filter, page]);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (authStatus === "authenticated") {
      fetchApplications();
    }
  }, [authStatus, router, fetchApplications]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchApplications();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filter]);

  const getDecisionLabel = (decision: string | null, status: string) => {
    if (status === "processing") return t("dashboard.processing");
    if (status === "failed") return t("dashboard.failed");
    if (status === "pending") return t("dashboard.pending");
    if (!decision) return t("dashboard.pending");
    if (decision === "approve") return t("dashboard.approved");
    if (decision === "decline") return t("dashboard.declined");
    if (decision === "request_more_info") return t("dashboard.moreInfo");
    return decision;
  };

  const getDecisionStyle = (decision: string | null, status: string) => {
    if (status !== "completed" || !decision) return STATUS_COLORS[status] || STATUS_COLORS.pending;
    return DECISION_COLORS[decision] || STATUS_COLORS.pending;
  };

  const formatAmount = (amount: number | null, currency: string | null) => {
    if (!amount) return "—";
    const curr = currency || "USD";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (authStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-sm font-normal text-gray-900 tracking-wide">
            <Mic className="h-4 w-4 text-emerald-500" />
            Echo Bank
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">
              {session?.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              {t("auth.signOut")}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Title + Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-light text-gray-900">
              {t("dashboard.title")}
            </h1>
            <p className="text-sm text-gray-400 font-light mt-0.5">
              {t("dashboard.subtitle")}
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-normal text-white hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t("dashboard.analyzeNew")}
          </button>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("dashboard.searchPlaceholder")}
              className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors"
            />
          </div>
          <div className="flex gap-1.5">
            {["all", "approve", "decline", "request_more_info"].map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`rounded-lg px-3 py-2 text-xs font-normal transition-colors ${
                  filter === f
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {f === "all"
                  ? t("dashboard.filterAll")
                  : f === "approve"
                  ? t("dashboard.filterApproved")
                  : f === "decline"
                  ? t("dashboard.filterDeclined")
                  : t("dashboard.filterMoreInfo")}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="h-10 w-10 text-gray-200 mb-4" />
            <h3 className="text-sm font-normal text-gray-900">
              {t("dashboard.empty")}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {t("dashboard.emptyDesc")}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                      {t("dashboard.columnApplicant")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                      {t("dashboard.columnAmount")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                      {t("dashboard.columnDecision")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                      {t("dashboard.columnScore")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                      {t("dashboard.columnDate")}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">
                      {t("dashboard.columnActions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/report/${app.id}`)}
                    >
                      <td className="px-4 py-3.5">
                        <div className="text-sm text-gray-900">
                          {app.applicantName || "Unknown"}
                        </div>
                        {app.loanPurpose && (
                          <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">
                            {app.loanPurpose}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-900">
                        {formatAmount(app.loanAmount, app.loanCurrency)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-normal ${getDecisionStyle(
                            app.decision,
                            app.status
                          )}`}
                        >
                          {getDecisionLabel(app.decision, app.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {app.weightedScore ? (
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{
                                  width: `${Math.min(app.weightedScore * 10, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              {app.weightedScore.toFixed(1)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-400">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/report/${app.id}`);
                          }}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          {t("dashboard.viewReport")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-gray-400">
                  {pagination.total} total
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-lg border border-gray-200 p-2 text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-gray-500">
                    {page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page >= pagination.totalPages}
                    className="rounded-lg border border-gray-200 p-2 text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
