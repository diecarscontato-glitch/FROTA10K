"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function globalSearch(query: string) {
  if (!query || query.length < 2) return { leads: [], assets: [], publications: [] };

  const session = await auth();
  const userData = session?.user as { accountId: string } | undefined;

  if (!userData?.accountId) throw new Error("Não autorizado");

  const accountId = userData.accountId;

  const [leads, assets, publications] = await Promise.all([
    db.lead.findMany({
      where: {
        account_id: accountId,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { phone: { contains: query, mode: "insensitive" } },
        ]
      },
      take: 5
    }),
    db.asset.findMany({
      where: {
        account_id: accountId,
        OR: [
          { brand: { contains: query, mode: "insensitive" } },
          { model: { contains: query, mode: "insensitive" } },
          { plate: { contains: query, mode: "insensitive" } },
        ]
      },
      take: 5
    }),
    db.publication.findMany({
      where: {
        account_id: accountId,
        title: { contains: query, mode: "insensitive" }
      },
      include: { asset: true },
      take: 5
    })
  ]);

  return { leads, assets, publications };
}
