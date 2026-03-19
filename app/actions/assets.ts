"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAssets() {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const assets = await db.asset.findMany({
    where: {
      account_id: userData.accountId,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      lead: true,
      financing: true,
    },
  });

  return assets;
}

import { executeAutomations } from "@/lib/automations/engine";

export async function createAsset(data: {
  lead_id?: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  plate?: string;
  km?: number;
  condition?: string;
  estimated_value?: number;
  financing_data?: {
    bank: string;
    total_installments: number;
    paid_installments: number;
    installment_value: number;
    outstanding_balance: number;
    overdue_installments: number;
  };
}) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const asset = await db.asset.create({
    data: {
      account_id: userData.accountId,
      lead_id: data.lead_id,
      type: data.type,
      brand: data.brand,
      model: data.model,
      year: data.year,
      color: data.color,
      plate: data.plate,
      km: data.km,
      condition: data.condition,
      estimated_value: data.estimated_value,
      status: "SCREENING",
      financing: data.financing_data ? {
        create: {
          bank: data.financing_data.bank,
          total_installments: data.financing_data.total_installments,
          paid_installments: data.financing_data.paid_installments,
          installment_value: data.financing_data.installment_value,
          outstanding_balance: data.financing_data.outstanding_balance,
          overdue_installments: data.financing_data.overdue_installments,
        },
      } : undefined,
    },
  });

  // Run automations
  try {
    await executeAutomations(userData.accountId, "ASSET_CREATED", asset.id, asset);
  } catch (error) {
    console.error("Erro na execução de automações:", error);
  }

  revalidatePath("/assets");
  return asset;
}

export async function getAssetById(id: string) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const asset = await db.asset.findFirst({
    where: {
      id,
      account_id: userData.accountId,
    },
    include: {
      lead: true,
      financing: true,
      analyses: true,
      legal_analysis: true,
      documents: true,
      publications: true,
    },
  });

  return asset;
}
