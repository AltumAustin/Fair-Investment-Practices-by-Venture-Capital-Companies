import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { portfolioCompanySchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vcFirmId = (session.user as any).vcFirmId;

    const companies = await prisma.portfolioCompany.findMany({
      where: {
        investments: {
          some: {
            vcFirmId,
          },
        },
      },
      include: {
        foundingTeamMembers: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching portfolio companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio companies" },
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
    const validated = portfolioCompanySchema.parse(body);

    const company = await prisma.portfolioCompany.create({
      data: {
        name: validated.name,
        principalPlaceOfBusiness: validated.principalPlaceOfBusiness,
      },
      include: {
        foundingTeamMembers: true,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating portfolio company:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio company" },
      { status: 500 }
    );
  }
}
