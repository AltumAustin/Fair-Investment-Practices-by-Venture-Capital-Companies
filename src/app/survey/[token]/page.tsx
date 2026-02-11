"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SurveyForm, { SurveyFormData } from "@/components/survey-form";

interface SurveyInfo {
  companyName: string;
  calendarYear: number;
  founderName: string;
  status: string;
}

export default function SurveyPage() {
  const params = useParams();
  const token = params.token as string;

  const [surveyInfo, setSurveyInfo] = useState<SurveyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchSurveyInfo() {
      try {
        const res = await fetch(`/api/survey-response/${token}`);
        if (!res.ok) {
          const data = await res.json();
          if (data.completed) {
            setSubmitted(true);
          } else {
            setError(data.error || "Invalid survey link");
          }
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.status === "COMPLETED") {
          setSubmitted(true);
        } else {
          setSurveyInfo(data);
        }
      } catch {
        setError("Failed to load survey. Please try again.");
      }
      setLoading(false);
    }

    fetchSurveyInfo();
  }, [token]);

  const handleSubmit = async (data: SurveyFormData) => {
    const res = await fetch("/api/survey-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, ...data }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to submit survey");
    }

    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Thank You!
          </h1>
          <p className="text-gray-600 mb-4">
            Your survey response has been recorded. Your responses will be
            anonymized and only reported in aggregate to the California
            Department of Financial Protection and Innovation.
          </p>
          <p className="text-sm text-gray-500">
            You may close this page.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Survey Unavailable
          </h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!surveyInfo) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <SurveyForm
        token={token}
        companyName={surveyInfo.companyName}
        calendarYear={surveyInfo.calendarYear}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
