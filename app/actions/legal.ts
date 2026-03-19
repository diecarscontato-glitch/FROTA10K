"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createLegalAnalysis(data: {
  asset_id: string;
  criminal_records_checked: boolean;
  civil_lawsuits_checked: boolean;
  vehicle_restrictions_checked: boolean;
  cnh_status_checked: boolean;
  risk_level: string; // LOW, MEDIUM, HIGH, IMPEDIMENT
  legal_notes?: string;
  recommendation: string; // PROCEED, PROCEED_WITH_RESERVATIONS, BLOCK
}) {
  const session = await auth();
  const userData = session?.user as { id: string; accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  // Upsert: one legal analysis per asset
  const legalAnalysis = await db.legalAnalysis.upsert({
    where: { asset_id: data.asset_id },
    create: {
      asset_id: data.asset_id,
      analyst_user_id: userData.id,
      criminal_records_checked: data.criminal_records_checked,
      civil_lawsuits_checked: data.civil_lawsuits_checked,
      vehicle_restrictions_checked: data.vehicle_restrictions_checked,
      cnh_status_checked: data.cnh_status_checked,
      risk_level: data.risk_level,
      legal_notes: data.legal_notes,
      recommendation: data.recommendation,
    },
    update: {
      analyst_user_id: userData.id,
      criminal_records_checked: data.criminal_records_checked,
      civil_lawsuits_checked: data.civil_lawsuits_checked,
      vehicle_restrictions_checked: data.vehicle_restrictions_checked,
      cnh_status_checked: data.cnh_status_checked,
      risk_level: data.risk_level,
      legal_notes: data.legal_notes,
      recommendation: data.recommendation,
    },
  });

  // Update asset status based on legal recommendation
  let newStatus = "LEGAL_ANALYSIS";
  if (data.recommendation === "BLOCK") {
    newStatus = "REJECTED";
  } else if (data.recommendation === "PROCEED") {
    newStatus = "APPROVED";
  } else if (data.recommendation === "PROCEED_WITH_RESERVATIONS") {
    newStatus = "APPROVED";
  }

  await db.asset.update({
    where: { id: data.asset_id },
    data: { status: newStatus },
  });

  revalidatePath(`/assets/${data.asset_id}`);
  return legalAnalysis;
}
