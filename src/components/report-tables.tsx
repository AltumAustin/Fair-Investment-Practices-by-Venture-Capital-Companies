"use client";

import { ReportData } from "@/lib/aggregation";

interface ReportTablesProps {
  report: ReportData;
}

function formatPercent(val: number): string {
  return `${val.toFixed(1)}%`;
}

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val);
}

export default function ReportTables({ report }: ReportTablesProps) {
  const { partI, partII, investmentDetails, calendarYear, vcFirmName } = report;

  return (
    <div className="space-y-8">
      {/* Report Header */}
      <div className="bg-blue-900 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold">
          Venture Capital Demographic Data Report
        </h1>
        <p className="text-blue-200 mt-1">
          California Department of Financial Protection and Innovation
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-blue-300">Covered Entity</p>
            <p className="font-semibold">{vcFirmName}</p>
          </div>
          <div>
            <p className="text-blue-300">Calendar Year</p>
            <p className="font-semibold">{calendarYear}</p>
          </div>
          <div>
            <p className="text-blue-300">Total Responses</p>
            <p className="font-semibold">{partI.totalResponses}</p>
          </div>
        </div>
      </div>

      {/* Part I */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
          Part I: Aggregated Survey Demographic Data Responses
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Total number of survey responses received for each demographic
          category. Respondents may select multiple options within each category.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {partI.demographics.map((category) => (
            <div
              key={category.category}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-semibold text-gray-900">
                  {category.category}
                </h3>
              </div>
              <table className="w-full">
                <tbody>
                  {category.counts.map((item) => (
                    <tr key={item.field} className="border-b last:border-0">
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {item.label}
                      </td>
                      <td className="px-4 py-2 text-sm font-semibold text-right text-gray-900 w-20">
                        {item.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">
              Decline to state for all responses
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {partI.declineAllCount}
            </span>
          </div>
        </div>
      </div>

      {/* Part II */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
          Part II: Investments to Businesses Primarily Founded by Diverse
          Founding Team Members
        </h2>

        {/* Item 1 & 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Item 1: By Number of Investments
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Diverse investments</span>
                <span className="font-semibold">
                  {partII.item1And2.diverseInvestmentCount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total investments</span>
                <span className="font-semibold">
                  {partII.item1And2.totalInvestmentCount}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Percentage</span>
                <span className="text-lg font-bold text-blue-900">
                  {formatPercent(
                    partII.item1And2.diverseInvestmentPercentage
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Item 2: By Dollar Amount
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Diverse investment $</span>
                <span className="font-semibold">
                  {formatCurrency(partII.item1And2.diverseInvestmentDollars)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total investment $</span>
                <span className="font-semibold">
                  {formatCurrency(partII.item1And2.totalInvestmentDollars)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Percentage</span>
                <span className="text-lg font-bold text-blue-900">
                  {formatPercent(partII.item1And2.diverseDollarPercentage)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="font-semibold text-gray-900">
              Item 3: Breakdown by Demographic Category
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              A business qualifies for a category if it is primarily founded by
              diverse founding team members AND at least one responding founder
              selected that option.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-36">
                    (A) % by Number
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-36">
                    (B) % by Dollars
                  </th>
                </tr>
              </thead>
              <tbody>
                {partII.item3.categories.map((cat, i) => (
                  <tr
                    key={cat.field}
                    className={`border-b ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {cat.label}
                    </td>
                    <td className="px-4 py-2 text-sm font-semibold text-right">
                      {formatPercent(cat.investmentCountPercentage)}
                    </td>
                    <td className="px-4 py-2 text-sm font-semibold text-right">
                      {formatPercent(cat.investmentDollarPercentage)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Part III: Investment Details */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
          Part III: Investment Details
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Amount of venture capital investment and principal place of business
          for each business receiving funding in calendar year {calendarYear}.
        </p>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Business Name
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-44">
                    Total VC Investment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-56">
                    Principal Place of Business
                  </th>
                </tr>
              </thead>
              <tbody>
                {investmentDetails.map((detail, i) => (
                  <tr
                    key={i}
                    className={`border-b ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                      {detail.businessName}
                    </td>
                    <td className="px-4 py-2 text-sm text-right font-semibold">
                      {formatCurrency(detail.totalInvestmentAmount)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {detail.principalPlaceOfBusiness}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
