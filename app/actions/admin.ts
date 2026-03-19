"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getAuditLogs() {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const logs = await db.auditLog.findMany({
    where: { account_id: userData.accountId },
    include: {
      actor: { select: { name: true, role: true } }
    },
    orderBy: { created_at: 'desc' },
    take: 50
  });

  return logs;
}
