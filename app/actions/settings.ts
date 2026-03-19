"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUserProfile() {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;
  if (!userData?.id) throw new Error("Não autorizado");

  const user = await db.user.findUnique({
    where: { id: userData.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      display_name: true,
      avatar: true,
      role: true,
      status: true,
      created_at: true
    }
  });

  return user;
}

export async function getAccountSettings() {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;
  if (!userData?.accountId) throw new Error("Não autorizado");

  const accountId = userData.accountId;

  const account = await db.account.findUnique({
    where: { id: accountId },
    select: {
      id: true,
      name: true,
      public_name: true,
      email: true,
      phone: true,
      city: true,
      state: true,
      logo: true,
      operational_profile: true,
      status: true
    }
  });

  return account;
}

export async function updateProfile(data: {
  name: string;
  display_name?: string;
  phone?: string;
}) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;
  if (!userData?.id) throw new Error("Não autorizado");

  const user = await db.user.update({
    where: { id: userData.id },
    data: {
      name: data.name,
      display_name: data.display_name,
      phone: data.phone
    }
  });

  // Log audit
  await db.auditLog.create({
    data: {
      account_id: userData.accountId,
      actor_user_id: userData.id,
      event_type: "PROFILE_UPDATE",
      target_entity_type: "USER",
      target_entity_id: user.id,
      severity: "INFO",
      summary: `Usuário ${user.name} atualizou seu perfil.`
    }
  });

  revalidatePath("/settings");
  return user;
}

export async function updateAccount(data: {
  name: string;
  public_name?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
}) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;
  if (!userData?.accountId) throw new Error("Não autorizado");

  const accountId = userData.accountId;

  const account = await db.account.update({
    where: { id: accountId },
    data: {
      name: data.name,
      public_name: data.public_name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      state: data.state
    }
  });

  // Log audit
  await db.auditLog.create({
    data: {
      account_id: account.id,
      actor_user_id: userData.id,
      event_type: "ACCOUNT_UPDATE",
      target_entity_type: "ACCOUNT",
      target_entity_id: account.id,
      severity: "IMPORTANT",
      summary: `Dados da conta ${account.name} foram atualizados.`
    }
  });

  revalidatePath("/settings");
  return account;
}
