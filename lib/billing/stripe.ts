import Stripe from "stripe";
import { db } from "@/lib/db";

/**
 * Gets a Stripe instance configured with the account's own API key (BYOK).
 */
export async function getStripeInstance(accountId: string) {
  const account = await db.account.findUnique({
    where: { id: accountId },
    select: { payment_config: true }
  });

  const config = (account?.payment_config as any) || {};
  
  if (!config.apiKey) {
    throw new Error("Configuração de pagamento não encontrada para esta conta.");
  }

  return new Stripe(config.apiKey, {
    apiVersion: "2024-12-18.acacia" as any,
  });
}
