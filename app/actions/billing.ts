"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getBillingInfo() {
  const session = await auth();
  const userData = session?.user as { accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  return await db.account.findUnique({
    where: { id: userData.accountId },
    select: {
      plan_type: true,
      subscription_status: true,
      next_billing_date: true,
      payment_config: true,
    }
  });
}

export async function updatePaymentConfig(data: {
  provider: "STRIPE" | "PAGARME";
  apiKey: string;
  publicKey?: string;
  webhookSecret?: string;
}) {
  const session = await auth();
  const userData = session?.user as { accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  // In a production app, we would encrypt the apiKey here
  const paymentConfig = {
    provider: data.provider,
    apiKey: data.apiKey,
    publicKey: data.publicKey,
    webhookSecret: data.webhookSecret,
    updatedAt: new Date().toISOString()
  };

  await db.account.update({
    where: { id: userData.accountId },
    data: {
      payment_config: paymentConfig
    }
  });

  revalidatePath("/billing");
  return { success: true };
}

import { getStripeInstance } from "@/lib/billing/stripe";

export async function createCheckoutSession(amount: number, description: string) {
  const session = await auth();
  const userData = session?.user as { accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  try {
    const stripe = await getStripeInstance(userData.accountId);
    
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: description,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
    });

    return { url: checkoutSession.url };
  } catch (error) {
    console.error("Erro ao criar checkout Stripe:", error);
    throw new Error("Erro ao processar pagamento com o provedor configurado.");
  }
}
