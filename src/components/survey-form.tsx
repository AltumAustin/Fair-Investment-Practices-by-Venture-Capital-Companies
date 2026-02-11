"use client";

import React, { useState } from "react";

interface SurveyFormProps {
  token: string;
  companyName: string;
  calendarYear: number;
  onSubmit: (data: SurveyFormData) => Promise<void>;
}

export interface SurveyFormData {
  genderWoman: boolean;
  genderMan: boolean;
  genderNonbinary: boolean;
  genderTransgender: boolean;
  genderNoneOfAbove: boolean;
  genderDecline: boolean;
  raceBlack: boolean;
  raceAsian: boolean;
  raceHispanic: boolean;
  raceNativeAmerican: boolean;
  raceNativeHawaiian: boolean;
  raceWhite: boolean;
  raceNoneOfAbove: boolean;
  raceDecline: boolean;
  lgbtqYes: boolean;
  lgbtqNo: boolean;
  lgbtqDecline: boolean;
  disabilityYes: boolean;
  disabilityNo: boolean;
  disabilityDecline: boolean;
  veteranYes: boolean;
  veteranDisabled: boolean;
  veteranNo: boolean;
  veteranDecline: boolean;
  caResidentYes: boolean;
  caResidentNo: boolean;
  caResidentDecline: boolean;
  declineAll: boolean;
}

const initialFormData: SurveyFormData = {
  genderWoman: false,
  genderMan: false,
  genderNonbinary: false,
  genderTransgender: false,
  genderNoneOfAbove: false,
  genderDecline: false,
  raceBlack: false,
  raceAsian: false,
  raceHispanic: false,
  raceNativeAmerican: false,
  raceNativeHawaiian: false,
  raceWhite: false,
  raceNoneOfAbove: false,
  raceDecline: false,
  lgbtqYes: false,
  lgbtqNo: false,
  lgbtqDecline: false,
  disabilityYes: false,
  disabilityNo: false,
  disabilityDecline: false,
  veteranYes: false,
  veteranDisabled: false,
  veteranNo: false,
  veteranDecline: false,
  caResidentYes: false,
  caResidentNo: false,
  caResidentDecline: false,
  declineAll: false,
};

type CategoryKey =
  | "gender"
  | "race"
  | "lgbtq"
  | "disability"
  | "veteran"
  | "caResident";

const CATEGORY_DECLINE_FIELDS: Record<CategoryKey, keyof SurveyFormData> = {
  gender: "genderDecline",
  race: "raceDecline",
  lgbtq: "lgbtqDecline",
  disability: "disabilityDecline",
  veteran: "veteranDecline",
  caResident: "caResidentDecline",
};

const CATEGORY_FIELDS: Record<CategoryKey, (keyof SurveyFormData)[]> = {
  gender: [
    "genderWoman",
    "genderMan",
    "genderNonbinary",
    "genderTransgender",
    "genderNoneOfAbove",
  ],
  race: [
    "raceBlack",
    "raceAsian",
    "raceHispanic",
    "raceNativeAmerican",
    "raceNativeHawaiian",
    "raceWhite",
    "raceNoneOfAbove",
  ],
  lgbtq: ["lgbtqYes", "lgbtqNo"],
  disability: ["disabilityYes", "disabilityNo"],
  veteran: ["veteranYes", "veteranDisabled", "veteranNo"],
  caResident: ["caResidentYes", "caResidentNo"],
};

function CheckboxItem({
  id,
  label,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-3 py-2 px-3 rounded-md cursor-pointer transition-colors ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : checked
          ? "bg-blue-50"
          : "hover:bg-gray-50"
      }`}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900 disabled:opacity-50"
      />
      <span className={`text-sm ${disabled ? "text-gray-400" : "text-gray-700"}`}>
        {label}
      </span>
    </label>
  );
}

export default function SurveyForm({
  companyName,
  calendarYear,
  onSubmit,
}: SurveyFormProps) {
  const [formData, setFormData] = useState<SurveyFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDeclineAll = formData.declineAll;

  const isCategoryDeclined = (category: CategoryKey) =>
    formData[CATEGORY_DECLINE_FIELDS[category]];

  const handleFieldChange = (field: keyof SurveyFormData, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  const handleDeclineCategory = (category: CategoryKey, checked: boolean) => {
    const declineField = CATEGORY_DECLINE_FIELDS[category];
    const categoryFields = CATEGORY_FIELDS[category];

    setFormData((prev) => {
      const updated = { ...prev, [declineField]: checked };
      // Clear other fields in this category when declining
      if (checked) {
        for (const field of categoryFields) {
          updated[field] = false;
        }
      }
      return updated;
    });
  };

  const handleDeclineAll = (checked: boolean) => {
    if (checked) {
      // Clear ALL fields and set declineAll
      setFormData({ ...initialFormData, declineAll: true });
    } else {
      setFormData({ ...initialFormData, declineAll: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || "Failed to submit survey. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-blue-900 text-white p-6 rounded-t-lg">
        <h1 className="text-xl font-bold">
          Venture Capital Demographic Data Survey
        </h1>
        <p className="text-blue-200 text-sm mt-1">
          California Department of Financial Protection and Innovation
        </p>
      </div>

      {/* Business Info (read-only) */}
      <div className="bg-blue-50 border-x border-blue-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-blue-700 font-medium uppercase tracking-wide">
              Business Receiving Venture Capital Investment
            </p>
            <p className="text-sm font-semibold text-blue-900 mt-1">
              {companyName}
            </p>
          </div>
          <div>
            <p className="text-xs text-blue-700 font-medium uppercase tracking-wide">
              Calendar Year Received Investment
            </p>
            <p className="text-sm font-semibold text-blue-900 mt-1">
              {calendarYear}
            </p>
          </div>
        </div>
      </div>

      {/* Voluntary notice */}
      <div className="bg-amber-50 border-x border-amber-200 p-4">
        <p className="text-sm text-amber-800">
          <strong>Voluntary Participation:</strong> Your decision to disclose
          demographic information is completely voluntary. No adverse action will
          be taken against you if you decline to participate. Your individual
          responses will be anonymized and only aggregate data will be reported
          to the DFPI. Neither the covered entity nor the DFPI may encourage,
          incentivize, or attempt to influence your decision whether to
          participate.
        </p>
      </div>

      <div className="border border-gray-200 rounded-b-lg bg-white">
        {/* Instructions */}
        <div className="p-4 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            Please check the box(es) for which you identify. You may select one
            or more designations within each category. You may also decline to
            state for any or all categories.
          </p>
        </div>

        {/* Gender */}
        <div className={`p-4 border-b border-gray-200 ${isDeclineAll ? "opacity-50" : ""}`}>
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Gender: I identify as:
          </h2>
          <div className="space-y-1">
            <CheckboxItem
              id="genderWoman"
              label="Woman"
              checked={formData.genderWoman}
              disabled={isDeclineAll || isCategoryDeclined("gender")}
              onChange={(c) => handleFieldChange("genderWoman", c)}
            />
            <CheckboxItem
              id="genderMan"
              label="Man"
              checked={formData.genderMan}
              disabled={isDeclineAll || isCategoryDeclined("gender")}
              onChange={(c) => handleFieldChange("genderMan", c)}
            />
            <CheckboxItem
              id="genderNonbinary"
              label="Nonbinary"
              checked={formData.genderNonbinary}
              disabled={isDeclineAll || isCategoryDeclined("gender")}
              onChange={(c) => handleFieldChange("genderNonbinary", c)}
            />
            <CheckboxItem
              id="genderTransgender"
              label="Transgender"
              checked={formData.genderTransgender}
              disabled={isDeclineAll || isCategoryDeclined("gender")}
              onChange={(c) => handleFieldChange("genderTransgender", c)}
            />
            <CheckboxItem
              id="genderNoneOfAbove"
              label="None of the above"
              checked={formData.genderNoneOfAbove}
              disabled={isDeclineAll || isCategoryDeclined("gender")}
              onChange={(c) => handleFieldChange("genderNoneOfAbove", c)}
            />
            <CheckboxItem
              id="genderDecline"
              label="Decline to state"
              checked={formData.genderDecline}
              disabled={isDeclineAll}
              onChange={(c) => handleDeclineCategory("gender", c)}
            />
          </div>
        </div>

        {/* Race/Ethnicity */}
        <div className={`p-4 border-b border-gray-200 ${isDeclineAll ? "opacity-50" : ""}`}>
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Race/Ethnicity: I identify as:
          </h2>
          <div className="space-y-1">
            <CheckboxItem
              id="raceBlack"
              label="Black or African American"
              checked={formData.raceBlack}
              disabled={isDeclineAll || isCategoryDeclined("race")}
              onChange={(c) => handleFieldChange("raceBlack", c)}
            />
            <CheckboxItem
              id="raceAsian"
              label="Asian"
              checked={formData.raceAsian}
              disabled={isDeclineAll || isCategoryDeclined("race")}
              onChange={(c) => handleFieldChange("raceAsian", c)}
            />
            <CheckboxItem
              id="raceHispanic"
              label="Hispanic or Latino/Latina"
              checked={formData.raceHispanic}
              disabled={isDeclineAll || isCategoryDeclined("race")}
              onChange={(c) => handleFieldChange("raceHispanic", c)}
            />
            <CheckboxItem
              id="raceNativeAmerican"
              label="Native American or Alaskan"
              checked={formData.raceNativeAmerican}
              disabled={isDeclineAll || isCategoryDeclined("race")}
              onChange={(c) => handleFieldChange("raceNativeAmerican", c)}
            />
            <CheckboxItem
              id="raceNativeHawaiian"
              label="Native Hawaiian or Other Pacific Islander"
              checked={formData.raceNativeHawaiian}
              disabled={isDeclineAll || isCategoryDeclined("race")}
              onChange={(c) => handleFieldChange("raceNativeHawaiian", c)}
            />
            <CheckboxItem
              id="raceWhite"
              label="White"
              checked={formData.raceWhite}
              disabled={isDeclineAll || isCategoryDeclined("race")}
              onChange={(c) => handleFieldChange("raceWhite", c)}
            />
            <CheckboxItem
              id="raceNoneOfAbove"
              label="None of the above"
              checked={formData.raceNoneOfAbove}
              disabled={isDeclineAll || isCategoryDeclined("race")}
              onChange={(c) => handleFieldChange("raceNoneOfAbove", c)}
            />
            <CheckboxItem
              id="raceDecline"
              label="Decline to state"
              checked={formData.raceDecline}
              disabled={isDeclineAll}
              onChange={(c) => handleDeclineCategory("race", c)}
            />
          </div>
        </div>

        {/* LGBTQ+ */}
        <div className={`p-4 border-b border-gray-200 ${isDeclineAll ? "opacity-50" : ""}`}>
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            LGBTQ+: I identify as:
          </h2>
          <div className="space-y-1">
            <CheckboxItem
              id="lgbtqYes"
              label="LGBTQ+"
              checked={formData.lgbtqYes}
              disabled={isDeclineAll || isCategoryDeclined("lgbtq")}
              onChange={(c) => handleFieldChange("lgbtqYes", c)}
            />
            <CheckboxItem
              id="lgbtqNo"
              label="Not LGBTQ+"
              checked={formData.lgbtqNo}
              disabled={isDeclineAll || isCategoryDeclined("lgbtq")}
              onChange={(c) => handleFieldChange("lgbtqNo", c)}
            />
            <CheckboxItem
              id="lgbtqDecline"
              label="Decline to state"
              checked={formData.lgbtqDecline}
              disabled={isDeclineAll}
              onChange={(c) => handleDeclineCategory("lgbtq", c)}
            />
          </div>
        </div>

        {/* Disability Status */}
        <div className={`p-4 border-b border-gray-200 ${isDeclineAll ? "opacity-50" : ""}`}>
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Disability Status: I identify as:
          </h2>
          <div className="space-y-1">
            <CheckboxItem
              id="disabilityYes"
              label="A Person with a Disability"
              checked={formData.disabilityYes}
              disabled={isDeclineAll || isCategoryDeclined("disability")}
              onChange={(c) => handleFieldChange("disabilityYes", c)}
            />
            <CheckboxItem
              id="disabilityNo"
              label="Not a Person with a Disability"
              checked={formData.disabilityNo}
              disabled={isDeclineAll || isCategoryDeclined("disability")}
              onChange={(c) => handleFieldChange("disabilityNo", c)}
            />
            <CheckboxItem
              id="disabilityDecline"
              label="Decline to state"
              checked={formData.disabilityDecline}
              disabled={isDeclineAll}
              onChange={(c) => handleDeclineCategory("disability", c)}
            />
          </div>
        </div>

        {/* Veteran Status */}
        <div className={`p-4 border-b border-gray-200 ${isDeclineAll ? "opacity-50" : ""}`}>
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Veteran Status: I identify as:
          </h2>
          <div className="space-y-1">
            <CheckboxItem
              id="veteranYes"
              label="A Veteran"
              checked={formData.veteranYes}
              disabled={isDeclineAll || isCategoryDeclined("veteran")}
              onChange={(c) => handleFieldChange("veteranYes", c)}
            />
            <CheckboxItem
              id="veteranDisabled"
              label="A Disabled Veteran"
              checked={formData.veteranDisabled}
              disabled={isDeclineAll || isCategoryDeclined("veteran")}
              onChange={(c) => handleFieldChange("veteranDisabled", c)}
            />
            <CheckboxItem
              id="veteranNo"
              label="Not a Veteran"
              checked={formData.veteranNo}
              disabled={isDeclineAll || isCategoryDeclined("veteran")}
              onChange={(c) => handleFieldChange("veteranNo", c)}
            />
            <CheckboxItem
              id="veteranDecline"
              label="Decline to state"
              checked={formData.veteranDecline}
              disabled={isDeclineAll}
              onChange={(c) => handleDeclineCategory("veteran", c)}
            />
          </div>
        </div>

        {/* California Residency */}
        <div className={`p-4 border-b border-gray-200 ${isDeclineAll ? "opacity-50" : ""}`}>
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            California Residency: I am:
          </h2>
          <div className="space-y-1">
            <CheckboxItem
              id="caResidentYes"
              label="A Resident of California"
              checked={formData.caResidentYes}
              disabled={isDeclineAll || isCategoryDeclined("caResident")}
              onChange={(c) => handleFieldChange("caResidentYes", c)}
            />
            <CheckboxItem
              id="caResidentNo"
              label="Not a Resident of California"
              checked={formData.caResidentNo}
              disabled={isDeclineAll || isCategoryDeclined("caResident")}
              onChange={(c) => handleFieldChange("caResidentNo", c)}
            />
            <CheckboxItem
              id="caResidentDecline"
              label="Decline to state"
              checked={formData.caResidentDecline}
              disabled={isDeclineAll}
              onChange={(c) => handleDeclineCategory("caResident", c)}
            />
          </div>
        </div>

        {/* Decline All */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Decline to State for All:
          </h2>
          <CheckboxItem
            id="declineAll"
            label="Decline to state for all responses"
            checked={formData.declineAll}
            disabled={false}
            onChange={handleDeclineAll}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Submit */}
        <div className="p-6">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-900 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Survey"}
          </button>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Your responses will be anonymized and only reported in aggregate.
            You will not be able to modify your responses after submission.
          </p>
        </div>
      </div>
    </form>
  );
}
