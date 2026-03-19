"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getOperationalReports() {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const accountId = userData.accountId;

  const [
    leadsByStatus,
    assetsByType,
    assetsByStatus,
    leadsBySource,
    recentNegotiations
  ] = await Promise.all([
    db.lead.groupBy({
      by: ["status"],
      where: { account_id: accountId },
      _count: { status: true }
    }),
    db.asset.groupBy({
      by: ["type"],
      where: { account_id: accountId },
      _count: { type: true }
    }),
    db.asset.groupBy({
      by: ["status"],
      where: { account_id: accountId },
      _count: { status: true }
    }),
    db.lead.groupBy({
      by: ["source"],
      where: { account_id: accountId },
      _count: { source: true }
    }),
    db.negotiation.findMany({
      where: {
        OR: [
          { proponent_account_id: accountId },
          { publication: { account_id: accountId } }
        ]
      },
      include: {
        publication: { include: { asset: true } },
        proponent_account: { select: { name: true } }
      },
      orderBy: { created_at: 'desc' },
      take: 5
    })
  ]);

  return {
    leadsByStatus,
    assetsByType,
    assetsByStatus,
    leadsBySource,
    recentNegotiations
  };
}

export async function getMarketplaceAnalytics() {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const accountId = userData.accountId;

  const [
    totalPublications,
    activeInterests,
    closedNegotiations,
  ] = await Promise.all([
    db.publication.count({ where: { account_id: accountId } }),
    db.interest.count({ where: { publication: { account_id: accountId } } }),
    db.negotiation.count({ where: { publication: { account_id: accountId }, status: "CLOSED" } })
  ]);

  return {
    totalPublications,
    activeInterests,
    closedNegotiations,
    conversionRate: totalPublications > 0 ? (closedNegotiations / totalPublications) * 100 : 0
  };
}
