"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import ReportTables from "@/components/report-tables";
import { ReportData } from "@/lib/aggregation";

export default function YearReportPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const year = parseInt(params.year as string, 10);

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const paymentSuccess = searchParams.get("payment") === "success";

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/reports/${year}`);
        if (res.ok) {
          const data = await res.json();
          setReport(data);
        } else if (res.status === 402) {
          setPaymentRequired(true);
        } else {
          setError("Failed to generate report");
        }
      } catch {
        setError("Failed to load report data");
      }
      setLoading(false);
    }
    fetchReport();
  }, [year]);

  const handleExportPDF = () => {
    window.open(`/api/reports/${year}/pdf`, "_blank");
  };

  async function handlePurchase() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to start checkout");
        setCheckoutLoading(false);
      }
    } catch {
      setError("Failed to start checkout");
      setCheckoutLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <Link href="/reports" className="text-blue-900 text-sm mt-2 hover:underline">
          Back to Reports
        </Link>
      </div>
    );
  }

  if (paymentRequired) {
    return (
      <div>
        <Link href="/reports" className="text-sm text-blue-900 hover:underline">
          &larr; Back to Reports
        </Link>
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Purchase {year} Report
          </h2>
          <p className="text-gray-600 mb-8">
            Access the full {year} Annual DFPI Compliance Report including aggregated
            demographics, diversity analysis, and investment details with PDF export.
          </p>
          <button
            onClick={handlePurchase}
            disabled={checkoutLoading}
            className="bg-blue-900 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {checkoutLoading ? "Redirecting to checkout..." : "Purchase Report — $499"}
          </button>
          <p className="text-xs text-gray-500 mt-4">
            One-time payment. Unlimited access once purchased.
          </p>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/reports" className="text-sm text-blue-900 hover:underline">
            &larr; Back to Reports
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            {year} Annual Report
          </h1>
          {paymentSuccess && (
            <p className="text-sm text-green-600 mt-1">
              Payment successful — your report is ready.
            </p>
          )}
        </div>
        <button
          onClick={handleExportPDF}
          className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export PDF
        </button>
      </div>

      <ReportTables report={report} />
    </div>
  );
}
