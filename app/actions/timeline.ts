"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export type TimelineEvent = {
  id: string;
  type: "LEAD" | "INTEREST" | "NEGOTIATION" | "SYSTEM";
  title: string;
  description: string;
  createdAt: Date;
  meta?: any;
};

export async function getOperationalTimeline() {
  const session = await auth();
  const userData = session?.user as { accountId: string } | undefined;

  if (!userData?.accountId) throw new Error("Não autorizado");

  const accountId = userData.accountId;

  // Fetch recent leads
  const recentLeads = await db.lead.findMany({
    where: { account_id: accountId },
    orderBy: { created_at: "desc" },
    take: 5
  });

  // Fetch recent interests
  const recentInterests = await db.interest.findMany({
    where: { account_id: accountId },
    include: { user: true, publication: { include: { asset: true } } },
    orderBy: { created_at: "desc" },
    take: 5
  });

  // Fetch recent negotiation messages (proposals)
  const recentProposals = await db.negotiationMessage.findMany({
    where: { 
      message_type: "PROPOSAL",
      negotiation: {
        publication: { account_id: accountId }
      }
    },
    include: { user: true, negotiation: { include: { publication: { include: { asset: true } } } } },
    orderBy: { created_at: "desc" },
    take: 5
  });

  const events: TimelineEvent[] = [];

  recentLeads.forEach(lead => {
    events.push({
      id: lead.id,
      type: "LEAD",
      title: "Novo Lead Captado",
      description: `${lead.name} entrou no funil via ${lead.source || 'Direto'}.`,
      createdAt: lead.created_at,
    });
  });

  recentInterests.forEach(interest => {
    events.push({
      id: interest.id,
      type: "INTEREST",
      title: "Interesse no Marketplace",
      description: `${interest.user.name} demonstrou interesse no ${interest.publication.asset.brand} ${interest.publication.asset.model}.`,
      createdAt: interest.created_at,
    });
  });

  recentProposals.forEach(prop => {
    events.push({
      id: prop.id,
      type: "NEGOTIATION",
      title: "Nova Proposta Recebida",
      description: `${prop.user.name} enviou uma proposta de R$ ${prop.proposal_value?.toLocaleString()} pelo ${prop.negotiation.publication.asset.model}.`,
      createdAt: prop.created_at,
    });
  });

  return events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);
}
