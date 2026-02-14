import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { portfolioCompanySchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vcFirmId = (session.user as any).vcFirmId;

    const company = await prisma.portfolioCompany.findUnique({
      where: { id: params.id },
      include: {
        foundingTeamMembers: true,
        investments: true,
      },
    });

    if (!company || company.vcFirmId !== vcFirmId) {
      return NextResponse.json(
        { error: "Portfolio company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error("Error fetching portfolio company:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio company" },
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
    const validated = portfolioCompanySchema.parse(body);

    const company = await prisma.portfolioCompany.update({
      where: { id: params.id, vcFirmId },
      data: {
        name: validated.name,
        principalPlaceOfBusiness: validated.principalPlaceOfBusiness,
      },
      include: {
        foundingTeamMembers: true,
      },
    });

    return NextResponse.json(company);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Portfolio company not found" },
        { status: 404 }
      );
    }
    console.error("Error updating portfolio company:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio company" },
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

    const vcFirmId = (session.user as any).vcFirmId;

    await prisma.portfolioCompany.delete({
      where: { id: params.id, vcFirmId },
    });

    return NextResponse.json({ message: "Portfolio company deleted" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Portfolio company not found" },
        { status: 404 }
      );
    }
    console.error("Error deleting portfolio company:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio company" },
      { status: 500 }
    );
  }
}
