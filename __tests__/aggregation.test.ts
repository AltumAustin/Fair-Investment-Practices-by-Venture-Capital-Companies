import {
  isDiverseFounder,
  isPrimarilyDiverse,
  SurveyResponseData,
} from "../src/lib/survey-helpers";
import {
  computePartI,
  computePartIIItems1And2,
  computePartIIItem3,
  computeInvestmentDetails,
  generateFullReport,
  BusinessData,
} from "../src/lib/aggregation";

// Helper to create a blank response (all false)
function blankResponse(): SurveyResponseData {
  return {
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
}

// ============================================================================
// isDiverseFounder Tests
// ============================================================================

describe("isDiverseFounder", () => {
  test("a founder who selects Woman and Asian is diverse", () => {
    const response = { ...blankResponse(), genderWoman: true, raceAsian: true };
    expect(isDiverseFounder(response)).toBe(true);
  });

  test("a founder who only selects Man, White, not LGBTQ+, not Disabled, not Veteran is NOT diverse", () => {
    const response = {
      ...blankResponse(),
      genderMan: true,
      raceWhite: true,
      lgbtqNo: true,
      disabilityNo: true,
      veteranNo: true,
    };
    expect(isDiverseFounder(response)).toBe(false);
  });

  test("a founder who selects only Woman is diverse", () => {
    const response = { ...blankResponse(), genderWoman: true };
    expect(isDiverseFounder(response)).toBe(true);
  });

  test("a founder who selects only Nonbinary is diverse", () => {
    const response = { ...blankResponse(), genderNonbinary: true };
    expect(isDiverseFounder(response)).toBe(true);
  });

  test("a founder who selects only Transgender is diverse", () => {
    const response = { ...blankResponse(), genderTransgender: true };
    expect(isDiverseFounder(response)).toBe(true);
  });

  test("a founder who selects only Black is diverse", () => {
    const response = { ...blankResponse(), raceBlack: true };
    expect(isDiverseFounder(response)).toBe(true);
  });

  test("a founder who selects only Hispanic is diverse", () => {
    const response = { ...blankResponse(), raceHispanic: true };
    expect(isDiverseFounder(response)).toBe(true);
  });

  test("a founder who selects only Native American is diverse", () => {
    const response = { ...blankResponse(), raceNativeAmerican: true };
    expect(isDiverseFounder(response)).toBe(true);
  });

  test("a founder who selects only Native Hawaiian is diverse", () => {
    const response = { ...blankResponse(), raceNativeHawaiian: true };
    expect(isDiverseFounder(response)).toBe(true);
  });

  test("a founder who selects only disability is diverse", () => {
    const response = { ...blankResponse(), disabilityYes: true };
    expect(isDiverseFounder(response)).toBe(true);
  });

  test("a founder who selects only veteran is diverse", () => {
    const response = { ...blankResponse(), veteranYes: true };
    expect(isDiverseFounder(response)).toBe(true);
  });

  test("a founder who selects only disabled veteran is diverse", () => {
    const response = { ...blankResponse(), veteranDisabled: true };
    expect(isDiverseFounder(response)).toBe(true);
  });

  test("a founder who selects only LGBTQ+ is diverse", () => {
    const response = { ...blankResponse(), lgbtqYes: true };
    expect(isDiverseFounder(response)).toBe(true);
  });

  test("a founder who declines all is NOT diverse", () => {
    const response = { ...blankResponse(), declineAll: true };
    expect(isDiverseFounder(response)).toBe(false);
  });

  test("a founder who declines individual categories is NOT diverse", () => {
    const response = {
      ...blankResponse(),
      genderDecline: true,
      raceDecline: true,
      lgbtqDecline: true,
      disabilityDecline: true,
      veteranDecline: true,
    };
    expect(isDiverseFounder(response)).toBe(false);
  });

  test("a blank response (no selections at all) is NOT diverse", () => {
    expect(isDiverseFounder(blankResponse())).toBe(false);
  });

  test("a founder with multiple diverse categories is diverse", () => {
    const response = {
      ...blankResponse(),
      genderWoman: true,
      raceAsian: true,
      lgbtqYes: true,
      veteranYes: true,
    };
    expect(isDiverseFounder(response)).toBe(true);
  });
});

// ============================================================================
// isPrimarilyDiverse Tests
// ============================================================================

describe("isPrimarilyDiverse", () => {
  test("3 founders, 2 responded, 1 diverse => NOT primarily diverse", () => {
    const responses = [
      { ...blankResponse(), genderWoman: true }, // diverse
      { ...blankResponse(), genderMan: true, raceWhite: true }, // not diverse
    ];
    // 2/3 > 1/2 (response rate check passes), but 1/2 < 1/2 (diverse check fails)
    // Actually 1/2 is not >= 1/2? Let's check: 1 >= 2/2 = 1, so 1 >= 1 is true
    // Wait, the formula says diverseResponded >= totalResponded / 2
    // 1 >= 2/2 = 1, so 1 >= 1 is TRUE. Let me re-check the spec.
    // Spec says "at least one-half of the responding founding team members are diverse"
    // 1 out of 2 = 0.5 = exactly one-half. The spec says "at least one-half" so this IS met.
    // Let me adjust: 3 founders, 2 responded, 1 diverse => IS primarily diverse actually
    expect(isPrimarilyDiverse(3, responses)).toBe(true);
  });

  test("3 founders, 2 responded, 0 diverse => NOT primarily diverse", () => {
    const responses = [
      { ...blankResponse(), genderMan: true, raceWhite: true },
      { ...blankResponse(), genderMan: true, raceWhite: true },
    ];
    expect(isPrimarilyDiverse(3, responses)).toBe(false);
  });

  test("3 founders, 2 responded, 2 diverse => IS primarily diverse", () => {
    const responses = [
      { ...blankResponse(), genderWoman: true },
      { ...blankResponse(), raceBlack: true },
    ];
    expect(isPrimarilyDiverse(3, responses)).toBe(true);
  });

  test("3 founders, 1 responded => NOT primarily diverse (response rate too low)", () => {
    const responses = [{ ...blankResponse(), genderWoman: true }];
    // 1/3 is not > 1/2
    expect(isPrimarilyDiverse(3, responses)).toBe(false);
  });

  test("2 founders, 2 responded, 1 diverse => IS primarily diverse", () => {
    const responses = [
      { ...blankResponse(), genderWoman: true },
      { ...blankResponse(), genderMan: true, raceWhite: true },
    ];
    // 2/2 > 2/2? Actually 2 > 1 (totalFounders/2 = 1). Yes.
    // diverseResponded = 1, totalResponded/2 = 1. 1 >= 1. Yes.
    expect(isPrimarilyDiverse(2, responses)).toBe(true);
  });

  test("4 founders, 2 responded => NOT primarily diverse (exactly half is not more than half)", () => {
    const responses = [
      { ...blankResponse(), genderWoman: true },
      { ...blankResponse(), raceBlack: true },
    ];
    // totalResponded (2) <= totalFounders/2 (2) → NOT more than half
    expect(isPrimarilyDiverse(4, responses)).toBe(false);
  });

  test("4 founders, 3 responded, 2 diverse => IS primarily diverse", () => {
    const responses = [
      { ...blankResponse(), genderWoman: true },
      { ...blankResponse(), raceBlack: true },
      { ...blankResponse(), genderMan: true, raceWhite: true },
    ];
    // 3 > 2 (response rate), 2 >= 1.5 (diverse rate)
    expect(isPrimarilyDiverse(4, responses)).toBe(true);
  });

  test("0 founders => NOT primarily diverse", () => {
    expect(isPrimarilyDiverse(0, [])).toBe(false);
  });

  test("1 founder, 1 responded, diverse => IS primarily diverse", () => {
    const responses = [{ ...blankResponse(), genderWoman: true }];
    // 1 > 0.5, 1 >= 0.5
    expect(isPrimarilyDiverse(1, responses)).toBe(true);
  });

  test("1 founder, 1 responded, not diverse => NOT primarily diverse", () => {
    const responses = [{ ...blankResponse(), genderMan: true, raceWhite: true }];
    expect(isPrimarilyDiverse(1, responses)).toBe(false);
  });

  test("all decline to state => respondents but not diverse", () => {
    const responses = [
      { ...blankResponse(), declineAll: true },
      { ...blankResponse(), declineAll: true },
    ];
    // 2/3 > 1/2 (response rate check passes)
    // 0/2 < 2/2 (diverse check fails)
    expect(isPrimarilyDiverse(3, responses)).toBe(false);
  });
});

// ============================================================================
// computePartI Tests
// ============================================================================

describe("computePartI", () => {
  test("aggregates demographic counts correctly", () => {
    const responses = [
      { ...blankResponse(), genderWoman: true, raceAsian: true, lgbtqYes: true },
      { ...blankResponse(), genderMan: true, raceWhite: true, lgbtqNo: true },
      { ...blankResponse(), genderWoman: true, raceBlack: true, raceAsian: true },
    ];

    const result = computePartI(responses);

    expect(result.totalResponses).toBe(3);
    expect(result.declineAllCount).toBe(0);

    // Find Gender counts
    const genderCategory = result.demographics.find((d) => d.category === "Gender");
    expect(genderCategory).toBeDefined();
    const womanCount = genderCategory!.counts.find((c) => c.field === "genderWoman");
    expect(womanCount!.count).toBe(2);
    const manCount = genderCategory!.counts.find((c) => c.field === "genderMan");
    expect(manCount!.count).toBe(1);

    // Race counts
    const raceCategory = result.demographics.find((d) => d.category === "Race/Ethnicity");
    const asianCount = raceCategory!.counts.find((c) => c.field === "raceAsian");
    expect(asianCount!.count).toBe(2);
    const blackCount = raceCategory!.counts.find((c) => c.field === "raceBlack");
    expect(blackCount!.count).toBe(1);

    // LGBTQ+ counts
    const lgbtqCategory = result.demographics.find((d) => d.category === "LGBTQ+");
    const lgbtqYesCount = lgbtqCategory!.counts.find((c) => c.field === "lgbtqYes");
    expect(lgbtqYesCount!.count).toBe(1);
  });

  test("handles empty responses", () => {
    const result = computePartI([]);
    expect(result.totalResponses).toBe(0);
    expect(result.declineAllCount).toBe(0);
    for (const cat of result.demographics) {
      for (const count of cat.counts) {
        expect(count.count).toBe(0);
      }
    }
  });

  test("counts declineAll correctly", () => {
    const responses = [
      { ...blankResponse(), declineAll: true },
      { ...blankResponse(), declineAll: true },
      { ...blankResponse(), genderWoman: true },
    ];

    const result = computePartI(responses);
    expect(result.declineAllCount).toBe(2);
    expect(result.totalResponses).toBe(3);
  });
});

// ============================================================================
// computePartIIItems1And2 Tests
// ============================================================================

describe("computePartIIItems1And2", () => {
  test("correctly identifies diverse investments", () => {
    const businesses: BusinessData[] = [
      {
        companyId: "1",
        companyName: "Company A",
        principalPlaceOfBusiness: "San Francisco, CA",
        totalInvestmentAmount: 1000000,
        totalFounders: 2,
        responses: [
          { ...blankResponse(), genderWoman: true },
          { ...blankResponse(), raceBlack: true },
        ],
      },
      {
        companyId: "2",
        companyName: "Company B",
        principalPlaceOfBusiness: "Los Angeles, CA",
        totalInvestmentAmount: 500000,
        totalFounders: 2,
        responses: [
          { ...blankResponse(), genderMan: true, raceWhite: true },
          { ...blankResponse(), genderMan: true, raceWhite: true },
        ],
      },
    ];

    const result = computePartIIItems1And2(businesses);

    expect(result.diverseInvestmentCount).toBe(1);
    expect(result.totalInvestmentCount).toBe(2);
    expect(result.diverseInvestmentPercentage).toBe(50);
    expect(result.diverseInvestmentDollars).toBe(1000000);
    expect(result.totalInvestmentDollars).toBe(1500000);
    expect(result.diverseDollarPercentage).toBeCloseTo(66.67, 1);
  });

  test("handles zero investments", () => {
    const result = computePartIIItems1And2([]);
    expect(result.diverseInvestmentCount).toBe(0);
    expect(result.totalInvestmentCount).toBe(0);
    expect(result.diverseInvestmentPercentage).toBe(0);
    expect(result.diverseDollarPercentage).toBe(0);
  });

  test("handles all diverse investments", () => {
    const businesses: BusinessData[] = [
      {
        companyId: "1",
        companyName: "Company A",
        principalPlaceOfBusiness: "SF",
        totalInvestmentAmount: 100000,
        totalFounders: 1,
        responses: [{ ...blankResponse(), genderWoman: true }],
      },
      {
        companyId: "2",
        companyName: "Company B",
        principalPlaceOfBusiness: "LA",
        totalInvestmentAmount: 200000,
        totalFounders: 1,
        responses: [{ ...blankResponse(), raceAsian: true }],
      },
    ];

    const result = computePartIIItems1And2(businesses);
    expect(result.diverseInvestmentPercentage).toBe(100);
    expect(result.diverseDollarPercentage).toBe(100);
  });

  test("handles all non-diverse investments", () => {
    const businesses: BusinessData[] = [
      {
        companyId: "1",
        companyName: "Company A",
        principalPlaceOfBusiness: "SF",
        totalInvestmentAmount: 100000,
        totalFounders: 1,
        responses: [{ ...blankResponse(), genderMan: true, raceWhite: true }],
      },
    ];

    const result = computePartIIItems1And2(businesses);
    expect(result.diverseInvestmentPercentage).toBe(0);
    expect(result.diverseDollarPercentage).toBe(0);
  });
});

// ============================================================================
// computePartIIItem3 Tests
// ============================================================================

describe("computePartIIItem3", () => {
  test("correctly attributes investments to demographic categories", () => {
    const businesses: BusinessData[] = [
      {
        companyId: "1",
        companyName: "Company A",
        principalPlaceOfBusiness: "SF",
        totalInvestmentAmount: 1000000,
        totalFounders: 2,
        responses: [
          { ...blankResponse(), genderWoman: true, raceAsian: true },
          { ...blankResponse(), genderWoman: true, raceBlack: true },
        ],
      },
      {
        companyId: "2",
        companyName: "Company B",
        principalPlaceOfBusiness: "LA",
        totalInvestmentAmount: 500000,
        totalFounders: 2,
        responses: [
          { ...blankResponse(), genderMan: true, raceWhite: true },
          { ...blankResponse(), genderMan: true, raceWhite: true },
        ],
      },
    ];

    const result = computePartIIItem3(businesses);

    // Company A is primarily diverse. Company B is not.
    // Woman: Company A qualifies (50% by count, 66.7% by dollar)
    const womanCat = result.categories.find((c) => c.field === "genderWoman");
    expect(womanCat!.investmentCountPercentage).toBe(50);
    expect(womanCat!.investmentDollarPercentage).toBeCloseTo(66.67, 1);

    // Asian: Company A qualifies
    const asianCat = result.categories.find((c) => c.field === "raceAsian");
    expect(asianCat!.investmentCountPercentage).toBe(50);

    // Man: Company B has men but is NOT primarily diverse, so Man should be 0
    // Company A also doesn't have genderMan. So Man = 0.
    const manCat = result.categories.find((c) => c.field === "genderMan");
    expect(manCat!.investmentCountPercentage).toBe(0);
  });

  test("handles zero investments", () => {
    const result = computePartIIItem3([]);
    expect(result.totalInvestmentCount).toBe(0);
    for (const cat of result.categories) {
      expect(cat.investmentCountPercentage).toBe(0);
      expect(cat.investmentDollarPercentage).toBe(0);
    }
  });
});

// ============================================================================
// computeInvestmentDetails Tests
// ============================================================================

describe("computeInvestmentDetails", () => {
  test("returns correct investment details", () => {
    const businesses: BusinessData[] = [
      {
        companyId: "1",
        companyName: "TechCo",
        principalPlaceOfBusiness: "San Francisco, CA",
        totalInvestmentAmount: 2500000,
        totalFounders: 3,
        responses: [],
      },
    ];

    const details = computeInvestmentDetails(businesses);
    expect(details).toHaveLength(1);
    expect(details[0].businessName).toBe("TechCo");
    expect(details[0].totalInvestmentAmount).toBe(2500000);
    expect(details[0].principalPlaceOfBusiness).toBe("San Francisco, CA");
  });
});

// ============================================================================
// generateFullReport Tests
// ============================================================================

describe("generateFullReport", () => {
  test("generates a complete report", () => {
    const businesses: BusinessData[] = [
      {
        companyId: "1",
        companyName: "Company A",
        principalPlaceOfBusiness: "SF",
        totalInvestmentAmount: 1000000,
        totalFounders: 2,
        responses: [
          { ...blankResponse(), genderWoman: true, raceAsian: true },
          { ...blankResponse(), raceBlack: true, lgbtqYes: true },
        ],
      },
    ];

    const allResponses = businesses[0].responses;

    const report = generateFullReport(2025, "Test VC Fund", businesses, allResponses);

    expect(report.calendarYear).toBe(2025);
    expect(report.vcFirmName).toBe("Test VC Fund");
    expect(report.partI.totalResponses).toBe(2);
    expect(report.partII.item1And2.totalInvestmentCount).toBe(1);
    expect(report.partII.item1And2.diverseInvestmentCount).toBe(1);
    expect(report.investmentDetails).toHaveLength(1);
  });

  test("handles empty data", () => {
    const report = generateFullReport(2025, "Empty Fund", [], []);
    expect(report.partI.totalResponses).toBe(0);
    expect(report.partII.item1And2.totalInvestmentCount).toBe(0);
    expect(report.investmentDetails).toHaveLength(0);
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe("edge cases", () => {
  test("single-person founding team, responded, diverse => primarily diverse", () => {
    const result = isPrimarilyDiverse(1, [
      { ...blankResponse(), genderWoman: true },
    ]);
    expect(result).toBe(true);
  });

  test("single-person founding team, responded, not diverse => NOT primarily diverse", () => {
    const result = isPrimarilyDiverse(1, [
      { ...blankResponse(), genderMan: true },
    ]);
    expect(result).toBe(false);
  });

  test("all responses are decline to state", () => {
    const responses = [
      { ...blankResponse(), declineAll: true },
      { ...blankResponse(), declineAll: true },
      { ...blankResponse(), declineAll: true },
    ];

    const partI = computePartI(responses);
    expect(partI.totalResponses).toBe(3);
    expect(partI.declineAllCount).toBe(3);

    // None should be diverse
    const businesses: BusinessData[] = [
      {
        companyId: "1",
        companyName: "Co",
        principalPlaceOfBusiness: "SF",
        totalInvestmentAmount: 100000,
        totalFounders: 3,
        responses,
      },
    ];

    const partII = computePartIIItems1And2(businesses);
    expect(partII.diverseInvestmentCount).toBe(0);
  });

  test("zero responses for a business", () => {
    const businesses: BusinessData[] = [
      {
        companyId: "1",
        companyName: "Co",
        principalPlaceOfBusiness: "SF",
        totalInvestmentAmount: 100000,
        totalFounders: 3,
        responses: [],
      },
    ];

    const result = computePartIIItems1And2(businesses);
    expect(result.diverseInvestmentCount).toBe(0);
    expect(result.totalInvestmentCount).toBe(1);
  });

  test("multiple selections per category (Asian and White)", () => {
    const response = { ...blankResponse(), raceAsian: true, raceWhite: true };
    expect(isDiverseFounder(response)).toBe(true);
  });
});
