"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getDashboardMetrics() {
  const session = await auth();

  if (!(session?.user as { accountId?: string })?.accountId) {
    throw new Error("Não autorizado");
  }

  const accountId = (session?.user as { accountId?: string }).accountId as string;

  const [
    leadsCount,
    assetsScreeningCount,
    committeeCount,
    publicationsCount,
    recentAssets,
    distribution
  ] = await Promise.all([
    db.lead.count({ where: { account_id: accountId, status: "NEW" } }),
    db.asset.count({ where: { account_id: accountId, status: "SCREENING" } }),
    db.asset.count({ where: { account_id: accountId, status: "COMMITTEE" } }),
    db.publication.count({ where: { account_id: accountId, status: "ACTIVE" } }),
    db.asset.findMany({
      where: { account_id: accountId },
      orderBy: { updated_at: "desc" },
      take: 5,
    }),
    db.asset.groupBy({
      by: ["status"],
      where: { account_id: accountId },
      _count: {
        status: true,
      },
    })
  ]);

  return {
    leadsCount,
    assetsScreeningCount,
    committeeCount,
    publicationsCount,
    recentAssets,
    distribution
  };
}
