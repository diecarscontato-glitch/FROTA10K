import { db } from "@/lib/db";

export async function routeLeadRoundRobin(accountId: string, leadId: string) {
  // 1. Get available users (vendedores or sdr)
  const users = await db.user.findMany({
    where: {
      account_id: accountId,
      role: { in: ["VENDEDOR", "SDR", "account_admin"] },
      status: "ACTIVE"
    },
    orderBy: { created_at: "asc" }
  });

  if (users.length === 0) return null;

  // 2. Find who was the last assigned user in this account
  const lastLead = await db.lead.findFirst({
    where: { 
      account_id: accountId,
      assigned_to_user_id: { not: null }
    },
    orderBy: { created_at: "desc" }
  });

  let nextUserId = users[0].id;
  if (lastLead?.assigned_to_user_id) {
    const lastIndex = users.findIndex(u => u.id === lastLead.assigned_to_user_id);
    nextUserId = users[(lastIndex + 1) % users.length].id;
  }

  // 3. Assign the lead
  await db.lead.update({
    where: { id: leadId },
    data: { assigned_to_user_id: nextUserId }
  });

  // 4. Create notification
  await db.notification.create({
    data: {
      account_id: accountId,
      user_id: nextUserId,
      type: "LEAD_ASSIGNED",
      title: "Novo Lead Atribuído",
      message: `Um novo lead foi atribuído a você via Round Robin.`,
      link: `/leads/${leadId}`
    }
  });

  return nextUserId;
}
