"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getLeads(filters?: { status?: string }) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const leads = await db.lead.findMany({
    where: {
      account_id: userData.accountId,
      ...(filters?.status && { status: filters.status }),
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      owner: true,
      assigned_to: true,
      assets: true,
    },
  });

  return leads;
}

import { routeLeadRoundRobin } from "@/lib/automations/lead-router";

export async function createLead(data: {
  name: string;
  phone?: string;
  city?: string;
  state?: string;
  profession?: string;
  source?: string;
  
  // Vehicle Data
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_plate?: string;
  has_reserve_key?: boolean;
  has_manual?: boolean;
  auction_history?: string;
  damages?: string;
  
  // Financial Data
  finance_bank?: string;
  finance_installment_value?: number;
  finance_total_installments?: number;
  finance_paid_installments?: number;
  finance_remaining_installments?: number;
  finance_overdue_installments?: number;
  finance_outstanding_balance?: number;
  owner_expectation?: number;
  urgency?: string;
}) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const lead = await db.lead.create({
    data: {
      account_id: userData.accountId,
      owner_user_id: userData.id,
      ...data,
      status: "NEW", // Starts at the first stage of the 15-stage pipeline
    },
  });

  // Tries to route lead via Round Robin
  try {
    await routeLeadRoundRobin(userData.accountId, lead.id);
  } catch (error) {
    console.error("Erro na distribuição Round Robin:", error);
  }

  revalidatePath("/leads");
  return lead;
}

export async function updateLeadStatus(leadId: string, status: string) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const lead = await db.lead.update({
    where: {
      id: leadId,
      account_id: userData.accountId,
    },
    data: { status },
  });

  revalidatePath("/leads");
  return lead;
}

export async function getLeadById(id: string) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const lead = await db.lead.findUnique({
    where: {
      id,
      account_id: userData.accountId,
    },
    include: {
      assets: {
        include: {
          financing: true,
        },
      },
      tasks: true,
    },
  });

  return lead;
}
