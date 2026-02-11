import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendSurveyInvitationEmail } from "@/lib/email";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vcFirmId = (session.user as any).vcFirmId;
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const status = searchParams.get("status");

    const where: any = {
      investment: {
        vcFirmId,
      },
    };

    if (year) {
      where.calendarYear = parseInt(year, 10);
    }

    if (status) {
      where.status = status;
    }

    const invitations = await prisma.surveyInvitation.findMany({
      where,
      include: {
        foundingTeamMember: true,
        investment: {
          include: {
            portfolioCompany: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Error fetching survey invitations:", error);
    return NextResponse.json(
      { error: "Failed to fetch survey invitations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vcFirmName = (session.user as any).vcFirmName;
    const body = await request.json();
    const { investmentId, foundingTeamMemberId } = body;

    if (!investmentId || !foundingTeamMemberId) {
      return NextResponse.json(
        { error: "investmentId and foundingTeamMemberId are required" },
        { status: 400 }
      );
    }

    // Look up the investment and founding team member
    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
      include: { portfolioCompany: true },
    });

    if (!investment) {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
    }

    const member = await prisma.foundingTeamMember.findUnique({
      where: { id: foundingTeamMemberId },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Founding team member not found" },
        { status: 404 }
      );
    }

    // Create the survey invitation with a unique token
    const token = crypto.randomUUID();

    const invitation = await prisma.surveyInvitation.create({
      data: {
        foundingTeamMemberId,
        investmentId,
        calendarYear: investment.calendarYear,
        token,
        status: "PENDING",
      },
      include: {
        foundingTeamMember: true,
        investment: {
          include: {
            portfolioCompany: true,
          },
        },
      },
    });

    // Send the email
    const surveyUrl = `${process.env.NEXTAUTH_URL}/survey/${token}`;
    const emailResult = await sendSurveyInvitationEmail({
      to: member.email,
      founderName: member.name,
      companyName: investment.portfolioCompany.name,
      vcFirmName: vcFirmName || "VC Firm",
      calendarYear: investment.calendarYear,
      surveyUrl,
    });

    if (emailResult.success) {
      // Update status to SENT
      const updatedInvitation = await prisma.surveyInvitation.update({
        where: { id: invitation.id },
        data: {
          status: "SENT",
          sentAt: new Date(),
        },
        include: {
          foundingTeamMember: true,
          investment: {
            include: {
              portfolioCompany: true,
            },
          },
        },
      });

      return NextResponse.json(updatedInvitation, { status: 201 });
    } else {
      // Invitation created but email failed - keep as PENDING
      return NextResponse.json(
        {
          invitation,
          warning: "Invitation created but email failed to send",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating survey invitation:", error);
    return NextResponse.json(
      { error: "Failed to create survey invitation" },
      { status: 500 }
    );
  }
}
