import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  generateFullReport,
  BusinessData,
} from "@/lib/aggregation";
import { SurveyResponseData } from "@/lib/survey-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: { year: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vcFirmId = (session.user as any).vcFirmId;
    const vcFirmName = (session.user as any).vcFirmName || "VC Firm";
    const calendarYear = parseInt(params.year, 10);

    if (isNaN(calendarYear)) {
      return NextResponse.json(
        { error: "Invalid year parameter" },
        { status: 400 }
      );
    }

    // Step 1: Get all investments for the year with their portfolio companies
    const investments = await prisma.investment.findMany({
      where: {
        vcFirmId,
        calendarYear,
      },
      include: {
        portfolioCompany: {
          include: {
            foundingTeamMembers: {
              include: {
                surveyInvitations: {
                  where: {
                    calendarYear,
                    status: "COMPLETED",
                  },
                  include: {
                    surveyResponse: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Step 2: Group investments by portfolio company
    const companyMap = new Map<
      string,
      {
        company: (typeof investments)[0]["portfolioCompany"];
        totalAmount: number;
      }
    >();

    for (const investment of investments) {
      const companyId = investment.portfolioCompanyId;
      const existing = companyMap.get(companyId);

      if (existing) {
        existing.totalAmount += Number(investment.amount);
      } else {
        companyMap.set(companyId, {
          company: investment.portfolioCompany,
          totalAmount: Number(investment.amount),
        });
      }
    }

    // Step 3: Build BusinessData array and collect all responses
    const businesses: BusinessData[] = [];
    const allResponses: SurveyResponseData[] = [];

    const entries = Array.from(companyMap.entries());
    for (const [companyId, { company, totalAmount }] of entries) {
      const companyResponses: SurveyResponseData[] = [];

      for (const member of company.foundingTeamMembers) {
        for (const invitation of member.surveyInvitations) {
          if (invitation.surveyResponse) {
            const response = invitation.surveyResponse;
            const responseData: SurveyResponseData = {
              genderWoman: response.genderWoman,
              genderMan: response.genderMan,
              genderNonbinary: response.genderNonbinary,
              genderTransgender: response.genderTransgender,
              genderNoneOfAbove: response.genderNoneOfAbove,
              genderDecline: response.genderDecline,
              raceBlack: response.raceBlack,
              raceAsian: response.raceAsian,
              raceHispanic: response.raceHispanic,
              raceNativeAmerican: response.raceNativeAmerican,
              raceNativeHawaiian: response.raceNativeHawaiian,
              raceWhite: response.raceWhite,
              raceNoneOfAbove: response.raceNoneOfAbove,
              raceDecline: response.raceDecline,
              lgbtqYes: response.lgbtqYes,
              lgbtqNo: response.lgbtqNo,
              lgbtqDecline: response.lgbtqDecline,
              disabilityYes: response.disabilityYes,
              disabilityNo: response.disabilityNo,
              disabilityDecline: response.disabilityDecline,
              veteranYes: response.veteranYes,
              veteranDisabled: response.veteranDisabled,
              veteranNo: response.veteranNo,
              veteranDecline: response.veteranDecline,
              caResidentYes: response.caResidentYes,
              caResidentNo: response.caResidentNo,
              caResidentDecline: response.caResidentDecline,
              declineAll: response.declineAll,
            };
            companyResponses.push(responseData);
            allResponses.push(responseData);
          }
        }
      }

      businesses.push({
        companyId,
        companyName: company.name,
        principalPlaceOfBusiness: company.principalPlaceOfBusiness || "",
        totalInvestmentAmount: totalAmount,
        totalFounders: company.foundingTeamMembers.length,
        responses: companyResponses,
      });
    }

    // Step 4: Generate the full report
    const report = generateFullReport(
      calendarYear,
      vcFirmName,
      businesses,
      allResponses
    );

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
