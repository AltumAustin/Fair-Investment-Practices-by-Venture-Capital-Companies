import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendSurveyInvitationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vcFirmId = (session.user as any).vcFirmId;
    const vcFirmName = (session.user as any).vcFirmName;
    const body = await request.json();
    const { year } = body;

    if (!year) {
      return NextResponse.json(
        { error: "year is required" },
        { status: 400 }
      );
    }

    const calendarYear = parseInt(year, 10);

    // Find all investments for the year belonging to this VC firm
    const investments = await prisma.investment.findMany({
      where: {
        vcFirmId,
        calendarYear,
      },
      include: {
        portfolioCompany: {
          include: {
            foundingTeamMembers: true,
          },
        },
      },
    });

    let created = 0;
    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const investment of investments) {
      // Get non-passive founding team members for this company
      const activeMembers = investment.portfolioCompany.foundingTeamMembers.filter(
        (member: any) => !member.isPassiveInvestor
      );

      for (const member of activeMembers) {
        // Check if an invitation already exists for this member + investment
        const existingInvitation = await prisma.surveyInvitation.findFirst({
          where: {
            foundingTeamMemberId: member.id,
            investmentId: investment.id,
            calendarYear,
          },
        });

        if (existingInvitation) {
          skipped++;
          continue;
        }

        // Create invitation
        const token = crypto.randomUUID();
        const invitation = await prisma.surveyInvitation.create({
          data: {
            foundingTeamMemberId: member.id,
            investmentId: investment.id,
            calendarYear,
            token,
            status: "PENDING",
          },
        });

        created++;

        // Send email
        const surveyUrl = `${process.env.NEXTAUTH_URL}/survey/${token}`;
        const emailResult = await sendSurveyInvitationEmail({
          to: member.email,
          founderName: member.name,
          companyName: investment.portfolioCompany.name,
          vcFirmName: vcFirmName || "VC Firm",
          calendarYear,
          surveyUrl,
        });

        if (emailResult.success) {
          await prisma.surveyInvitation.update({
            where: { id: invitation.id },
            data: {
              status: "SENT",
              sentAt: new Date(),
            },
          });
          sent++;
        } else {
          failed++;
        }
      }
    }

    return NextResponse.json({
      message: "Batch survey send completed",
      results: {
        created,
        sent,
        skipped,
        failed,
      },
    });
  } catch (error) {
    console.error("Error sending batch surveys:", error);
    return NextResponse.json(
      { error: "Failed to send batch surveys" },
      { status: 500 }
    );
  }
}
