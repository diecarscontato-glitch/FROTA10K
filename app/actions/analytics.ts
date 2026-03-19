"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getAnalyticsData() {
  const session = await auth();
  const userData = session?.user as { accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const accountId = userData.accountId;

  // 1. Asset Status Distribution
  const assetStatusCounts = await db.asset.groupBy({
    by: ['status'],
    where: { account_id: accountId },
    _count: true,
  });

  // 2. Stock by Brand (Top 5)
  const stockByBrand = await db.asset.groupBy({
    by: ['brand'],
    where: { account_id: accountId },
    _count: true,
    orderBy: { _count: { brand: 'desc' } },
    take: 5
  });

  // 3. Conversion Funnel (Simplified)
  const totalLeads = await db.lead.count({ where: { account_id: accountId } });
  const totalAssets = await db.asset.count({ where: { account_id: accountId } });
  const totalPublications = await db.publication.count({ where: { account_id: accountId } });
  const totalNegotiations = await db.negotiation.count({ 
    where: { 
      OR: [
        { proponent_account_id: accountId },
        { publication: { account_id: accountId } }
      ]
    } 
  });

  // 4. Financial Metrics
  const totalAskingVolume = await db.publication.aggregate({
    where: { account_id: accountId, status: 'ACTIVE' },
    _sum: { asking_price: true }
  });

  return {
    statusDistribution: assetStatusCounts,
    brandDistribution: stockByBrand,
    funnel: {
      leads: totalLeads,
      assets: totalAssets,
      publications: totalPublications,
      negotiations: totalNegotiations
    },
    financials: {
      totalAskingVolume: totalAskingVolume._sum.asking_price || 0
    }
  };
}
