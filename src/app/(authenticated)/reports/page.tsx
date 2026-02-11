"use client";

import { useState } from "react";
import Link from "next/link";

export default function ReportsPage() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Annual Reports</h1>
        <p className="text-sm text-gray-600 mt-1">
          Generate DFPI Venture Capital Demographic Data Reports
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">About the Report</h2>
        <p className="text-sm text-gray-600 mb-4">
          Under California&apos;s Fair Investment Practices by Venture Capital Companies Law
          (Corp. Code § 27500 et seq.), covered entities must submit an annual Venture Capital
          Demographic Data Report to the DFPI. The report is due by April 1 of each year and
          covers investments made in the prior calendar year.
        </p>
        <p className="text-sm text-gray-600">
          The report contains three parts:
        </p>
        <ul className="text-sm text-gray-600 list-disc ml-5 mt-2 space-y-1">
          <li><strong>Part I:</strong> Aggregated demographic data from survey responses</li>
          <li><strong>Part II:</strong> Investments to businesses primarily founded by diverse founding team members</li>
          <li><strong>Part III:</strong> Investment details (amounts and principal place of business)</li>
        </ul>
      </div>

      <h2 className="text-lg font-semibold mb-4">Select Calendar Year</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {years.map((year) => (
          <Link
            key={year}
            href={`/reports/${year}`}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-900">
                  {year}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {year === currentYear ? "Current Year" : "Historical"}
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
