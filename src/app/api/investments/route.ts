import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { investmentSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vcFirmId = (session.user as any).vcFirmId;
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");

    const where: any = { vcFirmId };
    if (year) {
      where.calendarYear = parseInt(year, 10);
    }

    const investments = await prisma.investment.findMany({
      where,
      include: {
        portfolioCompany: true,
      },
      orderBy: {
        investmentDate: "desc",
      },
    });

    return NextResponse.json(investments);
  } catch (error) {
    console.error("Error fetching investments:", error);
    return NextResponse.json(
      { error: "Failed to fetch investments" },
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

    const vcFirmId = (session.user as any).vcFirmId;
    const body = await request.json();
    const validated = investmentSchema.parse(body);

    const investmentDate = new Date(validated.investmentDate);
    const calendarYear = investmentDate.getFullYear();

    const investment = await prisma.investment.create({
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

    return NextResponse.json(investment, { status: 201 });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating investment:", error);
    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 }
    );
  }
}
