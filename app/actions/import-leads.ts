"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";

export async function importLeadsAction(leads: {
  name: string;
  phone?: string;
  city?: string;
  state?: string;
  source?: string;
}[]) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) throw new Error("Não autorizado");

  const accountId = userData.accountId;

  // Create an Import Job record
  const job = await db.importJob.create({
    data: {
      account_id: accountId,
      import_type: "LEAD",
      file_name: "upload_manual.csv", // Simplified for this implementation
      file_url: "internal",
      status: "PROCESSING",
      total_rows: leads.length,
      created_by_user_id: userData.id,
    }
  });

  try {
    let validCount = 0;
    
    // Create Leads in batches or all at once if count is small
    // For simplicity, we create them in a loop or createMany
    const createdLeads = await db.lead.createMany({
      data: leads.map(l => ({
        account_id: accountId,
        owner_user_id: userData.id,
        name: l.name,
        phone: l.phone,
        city: l.city,
        state: l.state,
        source: l.source || "IMPORT",
        status: "NEW"
      }))
    });

    validCount = createdLeads.count;

    await db.importJob.update({
      where: { id: job.id },
      data: {
        status: "COMPLETED",
        valid_rows: validCount,
        finished_at: new Date()
      }
    });

    await createAuditLog({
      accountId: accountId,
      actorUserId: userData.id,
      eventType: "LEAD_IMPORT",
      summary: `Importação de ${validCount} leads concluída com sucesso.`,
      severity: "INFO"
    });

    revalidatePath("/leads");
    return { success: true, imported: validCount };
  } catch (error: any) {
    await db.importJob.update({
      where: { id: job.id },
      data: {
        status: "FAILED",
        finished_at: new Date()
      }
    });
    throw new Error(`Erro na importação: ${error.message}`);
  }
}
