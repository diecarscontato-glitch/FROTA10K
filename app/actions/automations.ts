"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAutomationRules() {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  return await db.automationRule.findMany({
    where: { account_id: userData.accountId },
    orderBy: { created_at: "desc" }
  });
}

export async function createAutomationRule(data: {
  name: string;
  trigger_type: string;
  condition_payload: Record<string, any>;
  action_payload: Record<string, any>;
}) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const rule = await db.automationRule.create({
    data: {
      account_id: userData.accountId,
      created_by_user_id: userData.id,
      name: data.name,
      trigger_type: data.trigger_type,
      condition_payload: data.condition_payload,
      action_payload: data.action_payload,
      status: "ACTIVE"
    }
  });

  revalidatePath("/settings/automations");
  return rule;
}

export async function toggleRuleStatus(id: string, currentStatus: string) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const newStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";

  const rule = await db.automationRule.update({
    where: { id, account_id: userData.accountId },
    data: { status: newStatus }
  });

  revalidatePath("/settings/automations");
  return rule;
}

export async function deleteAutomationRule(id: string) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  await db.automationRule.delete({
    where: { id, account_id: userData.accountId }
  });

  revalidatePath("/settings/automations");
}
