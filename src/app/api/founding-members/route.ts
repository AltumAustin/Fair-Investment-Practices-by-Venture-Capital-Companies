import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { foundingTeamMemberSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const portfolioCompanyId = searchParams.get("portfolioCompanyId");

    if (!portfolioCompanyId) {
      return NextResponse.json(
        { error: "portfolioCompanyId query parameter is required" },
        { status: 400 }
      );
    }

    const members = await prisma.foundingTeamMember.findMany({
      where: {
        portfolioCompanyId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching founding team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch founding team members" },
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

    const body = await request.json();
    const validated = foundingTeamMemberSchema.parse(body);

    const member = await prisma.foundingTeamMember.create({
      data: {
        name: validated.name,
        email: validated.email,
        title: validated.title,
        portfolioCompanyId: validated.portfolioCompanyId,
        isPassiveInvestor: validated.isPassiveInvestor,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating founding team member:", error);
    return NextResponse.json(
      { error: "Failed to create founding team member" },
      { status: 500 }
    );
  }
}
