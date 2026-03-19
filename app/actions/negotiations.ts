"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getNegotiations() {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const accountId = userData.accountId;

  const negotiations = await db.negotiation.findMany({
    where: {
      OR: [
        { proponent_account_id: accountId },
        { publication: { account_id: accountId } }
      ]
    },
    include: {
      publication: {
        include: { asset: true }
      },
      proponent_account: {
        select: { name: true }
      },
      messages: {
        orderBy: { created_at: "desc" },
        take: 1
      }
    },
    orderBy: {
      updated_at: "desc"
    }
  });

  return negotiations;
}

export async function getNegotiationById(id: string) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const accountId = userData.accountId;

  const negotiation = await db.negotiation.findUnique({
    where: { id },
    include: {
      publication: {
        include: { 
          asset: { include: { financing: true } },
          account: { select: { name: true } }
        }
      },
      proponent_account: {
        select: { name: true }
      },
      messages: {
        include: {
          user: { select: { name: true } }
        },
        orderBy: { created_at: "asc" }
      }
    }
  });

  // Security: Check if user belongs to one of the accounts in the negotiation
  if (negotiation?.proponent_account_id !== accountId && negotiation?.publication.account_id !== accountId) {
    throw new Error("Não autorizado a ver esta negociação");
  }

  return negotiation;
}

export async function sendNegotiationMessage(negotiationId: string, content: string, proposalValue?: number) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const userId = userData.id;

  const message = await db.negotiationMessage.create({
    data: {
      negotiation_id: negotiationId,
      user_id: userId,
      content,
      proposal_value: proposalValue
    }
  });

  // If a value was sent, update the current value of the negotiation
  if (proposalValue) {
    await db.negotiation.update({
      where: { id: negotiationId },
      data: { 
        current_value: proposalValue,
        updated_at: new Date() 
      }
    });
  } else {
    await db.negotiation.update({
      where: { id: negotiationId },
      data: { updated_at: new Date() }
    });
  }

  revalidatePath(`/negotiations/${negotiationId}`);
  return message;
}

export async function updateNegotiationStatus(id: string, status: "OPEN" | "ACCEPTED" | "REJECTED" | "CLOSED") {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const negotiation = await db.negotiation.update({
    where: { id },
    data: { status }
  });

  revalidatePath(`/negotiations/${id}`);
  revalidatePath("/negotiations");
  return negotiation;
}
