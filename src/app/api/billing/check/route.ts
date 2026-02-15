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
    const year = request.nextUrl.searchParams.get("year");

    if (!year) {
      return NextResponse.json(
        { error: "Year parameter required" },
        { status: 400 }
      );
    }

    const reportYear = parseInt(year, 10);
    if (isNaN(reportYear)) {
      return NextResponse.json(
        { error: "Invalid year" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: {
        vcFirmId_reportYear: {
          vcFirmId,
          reportYear,
        },
      },
    });

    const paid = payment?.status === "SUCCEEDED";

    return NextResponse.json({ paid, reportYear });
  } catch (error) {
    console.error("Billing check error:", error);
    return NextResponse.json(
      { error: "Failed to check billing status" },
      { status: 500 }
    );
  }
}
