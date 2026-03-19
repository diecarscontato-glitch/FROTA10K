"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createAnalysis(data: {
  asset_id: string;
  structural_score?: number;
  engine_score?: number;
  paint_score?: number;
  interior_score?: number;
  general_notes?: string;
  
  // Financial Analysis Fields
  total_debt_estimated?: number;
  fipe_comparison_pct?: number;
  market_comparison_pct?: number;
  rental_potential?: number;
  estimated_rent?: number;
  monthly_margin?: number;
  vacancy_risk?: string;
  operational_cost?: number;
  bank_profile?: string;
  
  recommendation?: string;
  verdict?: string; // APPROVED, NEGOTIATE, REFUSED
  ready_for_committee?: boolean;
}) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const analysis = await db.analysis.create({
    data: {
      ...data,
      analyst_user_id: userData.id,
    },
  });

  // Update asset status based on verdict or progress
  let newStatus = "FINANCIAL_ANALYSIS";
  if (data.verdict === "APPROVED") newStatus = "APPROVED";
  if (data.verdict === "REFUSED") newStatus = "REJECTED";
  if (data.verdict === "NEGOTIATE") newStatus = "NEGOTIATION";

  // Update asset status to ANALYSIS
  await db.asset.update({
    where: { id: data.asset_id },
    data: { status: newStatus },
  });

  revalidatePath(`/assets/${data.asset_id}`);
  return analysis;
}

export async function submitDecision(data: {
  asset_id: string;
  decision: "AGIO_SALE" | "DIRECT_REPASSE" | "RENTAL_FLEET" | "DISCARD";
  justification: string;
  target_value: number;
}) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const destination = await db.destinationDecision.create({
    data: {
      asset_id: data.asset_id,
      decided_by_user_id: userData.id,
      decision: data.decision,
      justification: data.justification,
      target_value: data.target_value,
      decided_at: new Date(),
    },
  });

  // Map decision to Asset Status
  let newStatus = "MARKETPLACE";
  if (data.decision === "DISCARD") newStatus = "SOLD";

  await db.asset.update({
    where: { id: data.asset_id },
    data: { status: newStatus },
  });

  revalidatePath(`/assets/${data.asset_id}`);
  revalidatePath("/dashboard");
  return destination;
}
