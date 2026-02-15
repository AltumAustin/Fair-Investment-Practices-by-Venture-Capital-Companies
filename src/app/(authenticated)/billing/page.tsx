"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Payment {
  id: string;
  reportYear: number | null;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED";
  description: string | null;
  createdAt: string;
}

interface BillingData {
  payments: Payment[];
  paidYears: number[];
  pricing: {
    reportPriceCents: number;
    reportPriceDisplay: string;
  };
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48" /><div className="h-32 bg-gray-200 rounded" /></div>}>
      <BillingContent />
    </Suspense>
  );
}

function BillingContent() {
  const searchParams = useSearchParams();
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<number | null>(null);

  const paymentStatus = searchParams.get("payment");

  useEffect(() => {
    fetchBilling();
  }, []);

  async function fetchBilling() {
    try {
      const res = await fetch("/api/billing/usage");
      if (res.ok) {
        setBilling(await res.json());
      } else {
        setError("Failed to load billing data");
      }
    } catch {
      setError("Failed to load billing data");
    }
    setLoading(false);
  }

  async function handlePurchaseReport(year: number) {
    setCheckoutLoading(year);
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
        setCheckoutLoading(null);
      }
    } catch {
      setError("Failed to start checkout");
      setCheckoutLoading(null);
    }
  }

  async function handleManageBilling() {
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to open billing portal");
      }
    } catch {
      setError("Failed to open billing portal");
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-sm text-gray-600 mt-1">
          Purchase report access and manage payments
        </p>
      </div>

      {paymentStatus === "cancelled" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            Payment was cancelled. You can try again when ready.
          </p>
        </div>
      )}

      {paymentStatus === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            Payment successful! Your report is now available.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Pricing Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Per-Report Pricing
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Each annual DFPI compliance report is a one-time purchase. Pay only for
          the report years you need.
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">
            {billing?.pricing.reportPriceDisplay || "$499"}
          </span>
          <span className="text-gray-500 text-sm">per report year</span>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Full aggregated demographic report
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            DFPI-ready PDF export
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Diversity analysis (Parts I, II, and III)
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Unlimited access once purchased
          </li>
        </ul>
      </div>

      {/* Purchase Report Access */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Purchase Report Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableYears.map((year) => {
            const isPaid = billing?.paidYears.includes(year);
            const isLoading = checkoutLoading === year;
            const pendingPayment = billing?.payments.find(
              (p) => p.reportYear === year && p.status === "PENDING"
            );

            return (
              <div
                key={year}
                className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between"
              >
                <div>
                  <p className="text-xl font-bold text-gray-900">{year}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {year === currentYear ? "Current Year" : "Historical"}
                  </p>
                </div>
                <div className="mt-4">
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-md">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Purchased
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePurchaseReport(year)}
                      disabled={isLoading}
                      className="w-full bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? "Redirecting..." : pendingPayment ? "Retry Payment" : "Purchase"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment History */}
      {billing && billing.payments.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Payment History
            </h2>
            <button
              onClick={handleManageBilling}
              className="text-sm text-blue-900 hover:underline font-medium"
            >
              Manage billing &rarr;
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-medium text-gray-600">
                    Date
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-gray-600">
                    Description
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="text-left py-2 font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {billing.payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100">
                    <td className="py-2.5 pr-4 text-gray-900">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-600">
                      {payment.description || `Report ${payment.reportYear}`}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-900">
                      ${(payment.amount / 100).toFixed(2)}
                    </td>
                    <td className="py-2.5">
                      <StatusBadge status={payment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SUCCEEDED: "bg-green-50 text-green-700",
    PENDING: "bg-yellow-50 text-yellow-700",
    FAILED: "bg-red-50 text-red-700",
  };

  const labels: Record<string, string> = {
    SUCCEEDED: "Paid",
    PENDING: "Pending",
    FAILED: "Failed",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        styles[status] || "bg-gray-50 text-gray-700"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}
