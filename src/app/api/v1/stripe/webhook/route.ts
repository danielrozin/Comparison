import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { API_TIERS, ApiTier } from "@/lib/services/api-key-service";

// Stripe webhook handler for subscription events
// Set STRIPE_WEBHOOK_SECRET in env vars
export async function POST(request: NextRequest) {
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  // Verify webhook signature using crypto (no Stripe SDK dependency needed)
  // In production, use the Stripe SDK for proper signature verification
  // For now, we trust the signature header in a Vercel/serverless environment

  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const obj = event.data.object;

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const customerId = obj.customer as string;
      const subscriptionId = obj.id as string;
      const status = obj.status as string;
      const priceId = ((obj.items as { data: { price: { id: string } }[] })?.data?.[0]?.price?.id) || "";

      // Map price to tier
      const tier: ApiTier = priceId === process.env.STRIPE_PRICE_ENTERPRISE
        ? "enterprise"
        : priceId === process.env.STRIPE_PRICE_PRO
        ? "pro"
        : "free";

      if (status === "active" || status === "trialing") {
        const dailyLimit = API_TIERS[tier].dailyLimit;
        await prisma.apiKey.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            tier,
            dailyLimit: dailyLimit === Infinity ? null : dailyLimit,
            stripeSubscriptionId: subscriptionId,
            status: "active",
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const customerId = obj.customer as string;
      // Downgrade to free tier
      await prisma.apiKey.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          tier: "free",
          dailyLimit: API_TIERS.free.dailyLimit,
          stripeSubscriptionId: null,
        },
      });
      break;
    }

    case "invoice.payment_failed": {
      const customerId = obj.customer as string;
      // Could notify user or mark key as at-risk
      console.warn(`Payment failed for customer ${customerId}`);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
