import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { investmentSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const investment = await prisma.investment.findUnique({
      where: { id: params.id },
      include: {
        portfolioCompany: true,
        surveyInvitations: true,
      },
    });

    if (!investment) {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(investment);
  } catch (error) {
    console.error("Error fetching investment:", error);
    return NextResponse.json(
      { error: "Failed to fetch investment" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vcFirmId = (session.user as any).vcFirmId;
    const body = await request.json();
    const validated = investmentSchema.parse(body);

    const investmentDate = new Date(validated.investmentDate);
    const calendarYear = investmentDate.getFullYear();

    const investment = await prisma.investment.update({
      where: { id: params.id },
      data: {
        vcFirmId,
        portfolioCompanyId: validated.portfolioCompanyId,
        amount: parseFloat(validated.amount),
        investmentDate,
        calendarYear,
      },
      include: {
        portfolioCompany: true,
      },
    });

    return NextResponse.json(investment);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
    }
    console.error("Error updating investment:", error);
    return NextResponse.json(
      { error: "Failed to update investment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.investment.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Investment deleted" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
    }
    console.error("Error deleting investment:", error);
    return NextResponse.json(
      { error: "Failed to delete investment" },
      { status: 500 }
    );
  }
}
