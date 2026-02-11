import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { foundingTeamMemberSchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = foundingTeamMemberSchema.parse(body);

    const member = await prisma.foundingTeamMember.update({
      where: { id: params.id },
      data: {
        name: validated.name,
        email: validated.email,
        title: validated.title,
        portfolioCompanyId: validated.portfolioCompanyId,
        isPassiveInvestor: validated.isPassiveInvestor,
      },
    });

    return NextResponse.json(member);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Founding team member not found" },
        { status: 404 }
      );
    }
    console.error("Error updating founding team member:", error);
    return NextResponse.json(
      { error: "Failed to update founding team member" },
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

    await prisma.foundingTeamMember.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Founding team member deleted" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Founding team member not found" },
        { status: 404 }
      );
    }
    console.error("Error deleting founding team member:", error);
    return NextResponse.json(
      { error: "Failed to delete founding team member" },
      { status: 500 }
    );
  }
}
