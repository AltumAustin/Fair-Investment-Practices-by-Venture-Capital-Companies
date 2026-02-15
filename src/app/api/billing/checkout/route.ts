import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  stripe,
  getOrCreateStripeCustomer,
  REPORT_PRICE_CENTS,
} from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vcFirmId = (session.user as any).vcFirmId;
    const vcFirmName = (session.user as any).vcFirmName || "VC Firm";
    const email = session.user?.email || "";

    const body = await request.json();
    const { year } = body;

    if (!year || typeof year !== "number") {
      return NextResponse.json(
        { error: "Year is required" },
        { status: 400 }
      );
    }

    // Check if already paid for this year
    const existingPayment = await prisma.payment.findUnique({
      where: {
        vcFirmId_reportYear: {
          vcFirmId,
          reportYear: year,
        },
      },
    });

    if (existingPayment?.status === "SUCCEEDED") {
      return NextResponse.json(
        { error: "Report already purchased for this year" },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(
      vcFirmId,
      vcFirmName,
      email
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: REPORT_PRICE_CENTS,
            product_data: {
              name: `${year} Annual DFPI Compliance Report`,
              description: `Venture Capital Demographic Data Report for calendar year ${year}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        vcFirmId,
        reportYear: year.toString(),
      },
      success_url: `${appUrl}/reports/${year}?payment=success`,
      cancel_url: `${appUrl}/billing?payment=cancelled`,
    });

    // Upsert a pending payment record
    await prisma.payment.upsert({
      where: {
        vcFirmId_reportYear: {
          vcFirmId,
          reportYear: year,
        },
      },
      update: {
        stripeCheckoutId: checkoutSession.id,
        amount: REPORT_PRICE_CENTS,
        status: "PENDING",
      },
      create: {
        vcFirmId,
        stripeCheckoutId: checkoutSession.id,
        amount: REPORT_PRICE_CENTS,
        status: "PENDING",
        description: `${year} Annual DFPI Compliance Report`,
        reportYear: year,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
