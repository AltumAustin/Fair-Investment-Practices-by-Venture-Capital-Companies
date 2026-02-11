import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vcFirmId = (session.user as any).vcFirmId;
    const year = parseInt(
      request.nextUrl.searchParams.get("year") || String(new Date().getFullYear()),
      10
    );

    const [totalPortfolioCompanies, investments, surveyInvitations] =
      await Promise.all([
        prisma.portfolioCompany.count({
          where: {
            investments: { some: { vcFirmId } },
          },
        }),
        prisma.investment.findMany({
          where: { vcFirmId, calendarYear: year },
          select: { amount: true },
        }),
        prisma.surveyInvitation.findMany({
          where: {
            calendarYear: year,
            investment: { vcFirmId },
          },
          select: { status: true },
        }),
      ]);

    const totalInvestments = investments.length;
    const totalInvestmentAmount = investments.reduce(
      (sum: number, inv: { amount: any }) => sum + Number(inv.amount),
      0
    );
    const surveysSent = surveyInvitations.filter(
      (s: { status: string }) => s.status !== "PENDING"
    ).length;
    const surveysCompleted = surveyInvitations.filter(
      (s: { status: string }) => s.status === "COMPLETED"
    ).length;
    const responseRate =
      surveysSent > 0 ? (surveysCompleted / surveysSent) * 100 : 0;

    return NextResponse.json({
      totalPortfolioCompanies,
      totalInvestments,
      totalInvestmentAmount,
      surveysSent,
      surveysCompleted,
      responseRate,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
