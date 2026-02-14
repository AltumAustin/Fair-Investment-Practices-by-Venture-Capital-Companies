import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

/** Price in cents for a single annual report generation. */
export const REPORT_PRICE_CENTS = 49900; // $499.00

export const REPORT_PRICE_DISPLAY = "$499";

/**
 * Get or create a Stripe customer for a VC firm.
 * Stores the customer ID on the VCFirm record for reuse.
 */
export async function getOrCreateStripeCustomer(
  vcFirmId: string,
  firmName: string,
  email: string
): Promise<string> {
  // Lazy import to avoid circular deps
  const { prisma } = await import("./db");

  const firm = await prisma.vCFirm.findUnique({
    where: { id: vcFirmId },
    select: { stripeCustomerId: true },
  });

  if (firm?.stripeCustomerId) {
    return firm.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    name: firmName,
    email,
    metadata: { vcFirmId },
  });

  await prisma.vCFirm.update({
    where: { id: vcFirmId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}
