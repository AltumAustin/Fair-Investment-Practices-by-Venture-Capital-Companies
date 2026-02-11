import { SurveyResponse } from "@/generated/prisma";

/**
 * Statutory definitions from Corp. Code § 27500 et seq.
 */

// A "diverse founding team member" self-identifies as any of these categories
export const DIVERSE_CATEGORIES = [
  "woman",
  "nonbinary",
  "transgender",
  "black",
  "african_american",
  "hispanic",
  "latino_latina",
  "asian",
  "pacific_islander",
  "native_american",
  "native_hawaiian",
  "alaskan_native",
  "disabled",
  "veteran",
  "disabled_veteran",
  "lesbian",
  "gay",
  "bisexual",
  "queer",
  "lgbtq",
] as const;

export type SurveyResponseData = Pick<
  SurveyResponse,
  | "genderWoman"
  | "genderMan"
  | "genderNonbinary"
  | "genderTransgender"
  | "genderNoneOfAbove"
  | "genderDecline"
  | "raceBlack"
  | "raceAsian"
  | "raceHispanic"
  | "raceNativeAmerican"
  | "raceNativeHawaiian"
  | "raceWhite"
  | "raceNoneOfAbove"
  | "raceDecline"
  | "lgbtqYes"
  | "lgbtqNo"
  | "lgbtqDecline"
  | "disabilityYes"
  | "disabilityNo"
  | "disabilityDecline"
  | "veteranYes"
  | "veteranDisabled"
  | "veteranNo"
  | "veteranDecline"
  | "caResidentYes"
  | "caResidentNo"
  | "caResidentDecline"
  | "declineAll"
>;

/**
 * Determines if a survey respondent qualifies as a "diverse founding team member"
 * per Corp. Code § 27500 et seq.
 *
 * A founder is diverse if ANY of these are true in their response:
 * - genderWoman, genderNonbinary, genderTransgender
 * - raceBlack, raceAsian, raceHispanic, raceNativeAmerican, raceNativeHawaiian
 * - disabilityYes
 * - veteranYes, veteranDisabled
 * - lgbtqYes
 */
export function isDiverseFounder(response: SurveyResponseData): boolean {
  return (
    response.genderWoman ||
    response.genderNonbinary ||
    response.genderTransgender ||
    response.raceBlack ||
    response.raceAsian ||
    response.raceHispanic ||
    response.raceNativeAmerican ||
    response.raceNativeHawaiian ||
    response.disabilityYes ||
    response.veteranYes ||
    response.veteranDisabled ||
    response.lgbtqYes
  );
}

/**
 * Determines if a business is "primarily founded by diverse founding team members"
 *
 * For a given business and calendar year:
 * totalFounders = count of all founding team members for the business
 * totalResponded = count of founding team members who completed the survey
 * diverseResponded = count of responding founders who are "diverse founding team members"
 * isPrimarilyDiverse = (totalResponded > totalFounders / 2) AND (diverseResponded >= totalResponded / 2)
 */
export function isPrimarilyDiverse(
  totalFounders: number,
  responses: SurveyResponseData[]
): boolean {
  if (totalFounders === 0) return false;

  const totalResponded = responses.length;

  // More than one-half of the founding team members responded
  if (totalResponded <= totalFounders / 2) return false;

  // At least one-half of the responding founding team members are diverse
  const diverseResponded = responses.filter(isDiverseFounder).length;
  return diverseResponded >= totalResponded / 2;
}

/**
 * Checks if a response has a specific demographic category selected.
 * Used for per-category breakdowns in Part II Item 3 of the report.
 */
export function hasCategory(
  response: SurveyResponseData,
  category: string
): boolean {
  const categoryMap: Record<string, (r: SurveyResponseData) => boolean> = {
    genderWoman: (r) => r.genderWoman,
    genderMan: (r) => r.genderMan,
    genderNonbinary: (r) => r.genderNonbinary,
    genderTransgender: (r) => r.genderTransgender,
    genderNoneOfAbove: (r) => r.genderNoneOfAbove,
    genderDecline: (r) => r.genderDecline,
    raceBlack: (r) => r.raceBlack,
    raceAsian: (r) => r.raceAsian,
    raceHispanic: (r) => r.raceHispanic,
    raceNativeAmerican: (r) => r.raceNativeAmerican,
    raceNativeHawaiian: (r) => r.raceNativeHawaiian,
    raceWhite: (r) => r.raceWhite,
    raceNoneOfAbove: (r) => r.raceNoneOfAbove,
    raceDecline: (r) => r.raceDecline,
    lgbtqYes: (r) => r.lgbtqYes,
    lgbtqNo: (r) => r.lgbtqNo,
    lgbtqDecline: (r) => r.lgbtqDecline,
    disabilityYes: (r) => r.disabilityYes,
    disabilityNo: (r) => r.disabilityNo,
    disabilityDecline: (r) => r.disabilityDecline,
    veteranYes: (r) => r.veteranYes,
    veteranDisabled: (r) => r.veteranDisabled,
    veteranNo: (r) => r.veteranNo,
    veteranDecline: (r) => r.veteranDecline,
    caResidentYes: (r) => r.caResidentYes,
    caResidentNo: (r) => r.caResidentNo,
    caResidentDecline: (r) => r.caResidentDecline,
    declineAll: (r) => r.declineAll,
  };

  const checker = categoryMap[category];
  return checker ? checker(response) : false;
}
