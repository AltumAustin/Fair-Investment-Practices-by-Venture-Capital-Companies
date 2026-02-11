import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const invitation = await prisma.surveyInvitation.findUnique({
      where: { token: params.token },
      include: {
        foundingTeamMember: true,
        investment: {
          include: {
            portfolioCompany: true,
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invalid survey token" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      companyName: invitation.investment.portfolioCompany.name,
      calendarYear: invitation.calendarYear,
      founderName: invitation.foundingTeamMember.name,
      status: invitation.status,
    });
  } catch (error) {
    console.error("Error fetching survey invitation:", error);
    return NextResponse.json(
      { error: "Failed to fetch survey invitation details" },
      { status: 500 }
    );
  }
}
