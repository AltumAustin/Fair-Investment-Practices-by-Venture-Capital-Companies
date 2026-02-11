"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReportTables from "@/components/report-tables";
import { ReportData } from "@/lib/aggregation";

export default function YearReportPage() {
  const params = useParams();
  const year = parseInt(params.year as string, 10);

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/reports/${year}`);
        if (res.ok) {
          const data = await res.json();
          setReport(data);
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
