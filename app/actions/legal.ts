"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveLegalAnalysis(data: any) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const lead = await db.lead.findUnique({
    where: { id: data.lead_id, account_id: userData.accountId }
  });

  if (!lead) {
    throw new Error("Lead não encontrado");
  }

  const legalRecord = await db.legalAnalysis.findFirst({
    where: { lead_id: data.lead_id }
  });

  const payload = {
    lead_id: data.lead_id,
    analyst_user_id: userData.id,
    criminal_records_checked: data.criminal_records_checked,
    civil_lawsuits_checked: data.civil_lawsuits_checked,
    vehicle_restrictions_checked: data.vehicle_restrictions_checked,
    cnh_status_checked: data.cnh_status_checked,
    renajud_checked: data.renajud_checked,
    risk_level: data.risk_level,
    legal_notes: data.legal_notes,
    recommendation: data.recommendation,
  };

  let analysis;
  if (legalRecord) {
    analysis = await db.legalAnalysis.update({
      where: { id: legalRecord.id },
      data: payload,
    });
  } else {
    analysis = await db.legalAnalysis.create({
      data: payload,
    });
  }

  // Automate Lead Status based on Recommendation
  // Pipeline: LEGAL_ANALYSIS -> APPROVED (or PENDING_DOCS) -> DOCS_DONE -> DISCARDED
  let newStatus = lead.status;
  if (data.recommendation === "PROSSEGUIR" || data.recommendation === "RESSALVAS") {
    // If it was in LEGAL_ANALYSIS or earlier, move it to PENDING_DOCS or DOCS_DONE based on flow
    // Let's just set it to DOCS_DONE if they approved the Legal.
    newStatus = "DOCS_DONE";
  } else if (data.recommendation === "BLOQUEAR") {
    newStatus = "DISCARDED";
  }

  if (newStatus !== lead.status) {
    await db.lead.update({
      where: { id: data.lead_id },
      data: { status: newStatus }
    });
  }

  revalidatePath(`/leads/${data.lead_id}`);
  revalidatePath("/leads");
  
  return analysis;
}
