// Using number type for investment amounts (Prisma Decimal gets converted to number)
import { SurveyResponseData, isPrimarilyDiverse, hasCategory } from "./survey-helpers";

/**
 * Aggregation logic for the DFPI Venture Capital Demographic Data Report
 *
 * This module implements all report calculation logic for:
 * - Part I: Aggregated Survey Demographic Data Responses
 * - Part II: "Primarily Founded by Diverse Founding Team Members" Calculations
 */

// ============================================================================
// Types
// ============================================================================

export interface BusinessData {
  companyId: string;
  companyName: string;
  principalPlaceOfBusiness: string;
  totalInvestmentAmount: number;
  totalFounders: number;
  responses: SurveyResponseData[];
}

export interface DemographicCount {
  label: string;
  field: string;
  count: number;
}

export interface DemographicCategory {
  category: string;
  counts: DemographicCount[];
}

export interface PartIData {
  demographics: DemographicCategory[];
  totalResponses: number;
  declineAllCount: number;
}

export interface PartIIItem1And2 {
  diverseInvestmentCount: number;
  totalInvestmentCount: number;
  diverseInvestmentPercentage: number;
  diverseInvestmentDollars: number;
  totalInvestmentDollars: number;
  diverseDollarPercentage: number;
}

export interface CategoryBreakdown {
  label: string;
  field: string;
  investmentCountPercentage: number; // (A)
  investmentDollarPercentage: number; // (B)
  qualifyingCount: number;
  qualifyingDollars: number;
}

export interface PartIIItem3Data {
  categories: CategoryBreakdown[];
  totalInvestmentCount: number;
  totalInvestmentDollars: number;
}

export interface InvestmentDetail {
  businessName: string;
  totalInvestmentAmount: number;
  principalPlaceOfBusiness: string;
}

export interface ReportData {
  calendarYear: number;
  vcFirmName: string;
  partI: PartIData;
  partII: {
    item1And2: PartIIItem1And2;
    item3: PartIIItem3Data;
  };
  investmentDetails: InvestmentDetail[];
}

// ============================================================================
// Part I: Aggregated Survey Demographic Data Responses
// ============================================================================

const DEMOGRAPHIC_FIELDS: { category: string; fields: { label: string; field: string }[] }[] = [
  {
    category: "Gender",
    fields: [
      { label: "Woman", field: "genderWoman" },
      { label: "Man", field: "genderMan" },
      { label: "Nonbinary", field: "genderNonbinary" },
      { label: "Transgender", field: "genderTransgender" },
      { label: "None of the above", field: "genderNoneOfAbove" },
      { label: "Decline to state", field: "genderDecline" },
    ],
  },
  {
    category: "Race/Ethnicity",
    fields: [
      { label: "Black or African American", field: "raceBlack" },
      { label: "Asian", field: "raceAsian" },
      { label: "Hispanic or Latino/Latina", field: "raceHispanic" },
      { label: "Native American or Alaskan", field: "raceNativeAmerican" },
      { label: "Native Hawaiian or Other Pacific Islander", field: "raceNativeHawaiian" },
      { label: "White", field: "raceWhite" },
      { label: "None of the above", field: "raceNoneOfAbove" },
      { label: "Decline to state", field: "raceDecline" },
    ],
  },
  {
    category: "LGBTQ+",
    fields: [
      { label: "LGBTQ+", field: "lgbtqYes" },
      { label: "Not LGBTQ+", field: "lgbtqNo" },
      { label: "Decline to state", field: "lgbtqDecline" },
    ],
  },
  {
    category: "Disability Status",
    fields: [
      { label: "A Person with a Disability", field: "disabilityYes" },
      { label: "Not a Person with a Disability", field: "disabilityNo" },
      { label: "Decline to state", field: "disabilityDecline" },
    ],
  },
  {
    category: "Veteran Status",
    fields: [
      { label: "A Veteran", field: "veteranYes" },
      { label: "A Disabled Veteran", field: "veteranDisabled" },
      { label: "Not a Veteran", field: "veteranNo" },
      { label: "Decline to state", field: "veteranDecline" },
    ],
  },
  {
    category: "California Residency",
    fields: [
      { label: "A Resident of California", field: "caResidentYes" },
      { label: "Not a Resident of California", field: "caResidentNo" },
      { label: "Decline to state", field: "caResidentDecline" },
    ],
  },
];

export { DEMOGRAPHIC_FIELDS };

export function computePartI(allResponses: SurveyResponseData[]): PartIData {
  const demographics: DemographicCategory[] = DEMOGRAPHIC_FIELDS.map(({ category, fields }) => ({
    category,
    counts: fields.map(({ label, field }) => ({
      label,
      field,
      count: allResponses.filter((r) => hasCategory(r, field)).length,
    })),
  }));

  return {
    demographics,
    totalResponses: allResponses.length,
    declineAllCount: allResponses.filter((r) => r.declineAll).length,
  };
}

// ============================================================================
// Part II: Primarily Founded by Diverse Founding Team Members
// ============================================================================

export function computePartIIItems1And2(businesses: BusinessData[]): PartIIItem1And2 {
  const totalInvestmentCount = businesses.length;
  const totalInvestmentDollars = businesses.reduce(
    (sum, b) => sum + Number(b.totalInvestmentAmount),
    0
  );

  let diverseInvestmentCount = 0;
  let diverseInvestmentDollars = 0;

  for (const business of businesses) {
    if (isPrimarilyDiverse(business.totalFounders, business.responses)) {
      diverseInvestmentCount++;
      diverseInvestmentDollars += Number(business.totalInvestmentAmount);
    }
  }

  return {
    diverseInvestmentCount,
    totalInvestmentCount,
    diverseInvestmentPercentage:
      totalInvestmentCount > 0
        ? (diverseInvestmentCount / totalInvestmentCount) * 100
        : 0,
    diverseInvestmentDollars,
    totalInvestmentDollars,
    diverseDollarPercentage:
      totalInvestmentDollars > 0
        ? (diverseInvestmentDollars / totalInvestmentDollars) * 100
        : 0,
  };
}

/**
 * Part II Item 3: Per-demographic-category breakdown
 *
 * For each demographic option:
 * A business qualifies for that demographic category if:
 * 1. The business is "primarily founded by diverse founding team members", AND
 * 2. At least one responding founder from that business selected that demographic option
 *
 * (A) = count of qualifying businesses / total investments
 * (B) = sum of investment amounts for qualifying businesses / total investment dollars
 */
export function computePartIIItem3(businesses: BusinessData[]): PartIIItem3Data {
  const totalInvestmentCount = businesses.length;
  const totalInvestmentDollars = businesses.reduce(
    (sum, b) => sum + Number(b.totalInvestmentAmount),
    0
  );

  // All demographic fields for Item 3 breakdown
  const allFields = DEMOGRAPHIC_FIELDS.flatMap((cat) => cat.fields);

  const categories: CategoryBreakdown[] = allFields.map(({ label, field }) => {
    let qualifyingCount = 0;
    let qualifyingDollars = 0;

    for (const business of businesses) {
      const businessIsDiverse = isPrimarilyDiverse(
        business.totalFounders,
        business.responses
      );
      if (!businessIsDiverse) continue;

      // Check if at least one responding founder selected this category
      const hasFounderWithCategory = business.responses.some((r) =>
        hasCategory(r, field)
      );
      if (hasFounderWithCategory) {
        qualifyingCount++;
        qualifyingDollars += Number(business.totalInvestmentAmount);
      }
    }

    return {
      label,
      field,
      investmentCountPercentage:
        totalInvestmentCount > 0
          ? (qualifyingCount / totalInvestmentCount) * 100
          : 0,
      investmentDollarPercentage:
        totalInvestmentDollars > 0
          ? (qualifyingDollars / totalInvestmentDollars) * 100
          : 0,
      qualifyingCount,
      qualifyingDollars,
    };
  });

  return {
    categories,
    totalInvestmentCount,
    totalInvestmentDollars,
  };
}

export function computeInvestmentDetails(businesses: BusinessData[]): InvestmentDetail[] {
  return businesses.map((b) => ({
    businessName: b.companyName,
    totalInvestmentAmount: Number(b.totalInvestmentAmount),
    principalPlaceOfBusiness: b.principalPlaceOfBusiness,
  }));
}

export function generateFullReport(
  calendarYear: number,
  vcFirmName: string,
  businesses: BusinessData[],
  allResponses: SurveyResponseData[]
): ReportData {
  return {
    calendarYear,
    vcFirmName,
    partI: computePartI(allResponses),
    partII: {
      item1And2: computePartIIItems1And2(businesses),
      item3: computePartIIItem3(businesses),
    },
    investmentDetails: computeInvestmentDetails(businesses),
  };
}
