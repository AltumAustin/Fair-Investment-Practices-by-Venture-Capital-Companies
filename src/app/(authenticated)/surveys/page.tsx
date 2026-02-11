"use client";

import { useEffect, useState } from "react";

interface SurveyInvitation {
  id: string;
  token: string;
  calendarYear: number;
  status: string;
  sentAt: string | null;
  completedAt: string | null;
  foundingTeamMember: {
    name: string;
    email: string;
    isPassiveInvestor: boolean;
    portfolioCompany: {
      name: string;
    };
  };
  investment: {
    portfolioCompany: {
      name: string;
    };
  };
}

const statusColors: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-800",
  SENT: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  DECLINED: "bg-red-100 text-red-800",
};

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<SurveyInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [sending, setSending] = useState<string | null>(null);
  const [batchSending, setBatchSending] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/surveys?year=${year}`);
      if (res.ok) {
        const data = await res.json();
        setSurveys(data);
      }
    } catch (err) {
      console.error("Failed to load surveys:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSurveys();
  }, [year]);

  const handleSendSurvey = async (surveyId: string) => {
    setSending(surveyId);
    try {
      const res = await fetch(`/api/surveys`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyId, action: "send" }),
      });
      if (res.ok) fetchSurveys();
    } catch (err) {
      console.error("Failed to send survey:", err);
    }
    setSending(null);
  };

  const handleResend = async (surveyId: string) => {
    setSending(surveyId);
    try {
      const res = await fetch(`/api/surveys`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyId, action: "resend" }),
      });
      if (res.ok) fetchSurveys();
    } catch (err) {
      console.error("Failed to resend survey:", err);
    }
    setSending(null);
  };

  const handleBatchSend = async () => {
    setBatchSending(true);
    try {
      const res = await fetch("/api/surveys/send-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year }),
      });
      if (res.ok) {
        const data = await res.json();
        alert(`${data.sent} surveys sent, ${data.created} new invitations created.`);
        fetchSurveys();
      }
    } catch (err) {
      console.error("Failed to batch send:", err);
    }
    setBatchSending(false);
  };

  const pendingCount = surveys.filter((s) => s.status === "PENDING").length;
  const sentCount = surveys.filter((s) => s.status === "SENT").length;
  const completedCount = surveys.filter((s) => s.status === "COMPLETED").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Survey Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Distribute and track demographic surveys for founding team members
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={handleBatchSend}
            disabled={batchSending}
            className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
          >
            {batchSending ? "Sending..." : "Send All Pending Surveys"}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-xl font-bold text-gray-900">{surveys.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-xl font-bold text-gray-900">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Sent</p>
          <p className="text-xl font-bold text-blue-900">{sentCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-xl font-bold text-green-700">{completedCount}</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border p-6 animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      ) : surveys.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-2">No survey invitations for {year}.</p>
          <p className="text-sm text-gray-400">
            Click &ldquo;Send All Pending Surveys&rdquo; to create and send invitations
            for all investments in {year}.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Founder
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Company
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Completed
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((survey) => (
                <tr key={survey.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {survey.foundingTeamMember.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {survey.foundingTeamMember.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {survey.investment.portfolioCompany.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[survey.status] || statusColors.PENDING
                      }`}
                    >
                      {survey.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {survey.sentAt
                      ? new Date(survey.sentAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {survey.completedAt
                      ? new Date(survey.completedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {survey.status === "PENDING" && (
                      <button
                        onClick={() => handleSendSurvey(survey.id)}
                        disabled={sending === survey.id}
                        className="text-sm text-blue-900 hover:underline disabled:opacity-50"
                      >
                        {sending === survey.id ? "Sending..." : "Send"}
                      </button>
                    )}
                    {survey.status === "SENT" && (
                      <button
                        onClick={() => handleResend(survey.id)}
                        disabled={sending === survey.id}
                        className="text-sm text-blue-900 hover:underline disabled:opacity-50"
                      >
                        {sending === survey.id ? "Sending..." : "Resend"}
                      </button>
                    )}
                    {survey.status === "COMPLETED" && (
                      <span className="text-sm text-green-700">Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
