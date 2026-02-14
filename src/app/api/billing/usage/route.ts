import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { REPORT_PRICE_CENTS, REPORT_PRICE_DISPLAY } from "@/lib/stripe";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vcFirmId = (session.user as any).vcFirmId;

    const payments = await prisma.payment.findMany({
      where: { vcFirmId },
      orderBy: { createdAt: "desc" },
    });

    // Build a map of which report years are paid for
    const paidYears: number[] = payments
      .filter((p) => p.status === "SUCCEEDED" && p.reportYear !== null)
      .map((p) => p.reportYear!);

    return NextResponse.json({
      payments: payments.map((p) => ({
        id: p.id,
        reportYear: p.reportYear,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        description: p.description,
        createdAt: p.createdAt,
      })),
      paidYears,
      pricing: {
        reportPriceCents: REPORT_PRICE_CENTS,
        reportPriceDisplay: REPORT_PRICE_DISPLAY,
      },
    });
  } catch (error) {
    console.error("Usage fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing data" },
      { status: 500 }
    );
  }
}
