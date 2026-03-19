"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getFinancialSummary() {
  const session = await auth();
  const userData = session?.user as { id: string; accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const records = await db.financialRecord.findMany({
    where: { account_id: userData.accountId },
    orderBy: { date: "desc" },
  });

  const categories = ["OPERACAO", "AQUISICAO", "FROTA", "QUITACAO"];
  const summary: Record<string, { income: number; expense: number; balance: number; records: typeof records }> = {};

  for (const cat of categories) {
    const catRecords = records.filter((r) => r.category === cat);
    const income = catRecords.filter((r) => r.type === "INCOME").reduce((acc, r) => acc + r.amount, 0);
    const expense = catRecords.filter((r) => r.type === "EXPENSE").reduce((acc, r) => acc + r.amount, 0);
    summary[cat] = {
      income,
      expense,
      balance: income - expense,
      records: catRecords.slice(0, 10), // last 10 per category
    };
  }

  const recentRecords = records.slice(0, 20);

  return { summary, recentRecords };
}

export async function createFinancialRecord(data: {
  asset_id?: string;
  type: string; // INCOME, EXPENSE
  category: string; // OPERACAO, AQUISICAO, FROTA, QUITACAO
  description: string;
  amount: number;
  date?: string;
}) {
  const session = await auth();
  const userData = session?.user as { id: string; accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const record = await db.financialRecord.create({
    data: {
      account_id: userData.accountId,
      asset_id: data.asset_id || null,
      type: data.type,
      category: data.category,
      description: data.description,
      amount: data.amount,
      date: data.date ? new Date(data.date) : new Date(),
    },
  });

  revalidatePath("/financials");
  if (data.asset_id) {
    revalidatePath(`/assets/${data.asset_id}`);
  }
  return record;
}

export async function getAssetFinancials(assetId: string) {
  const session = await auth();
  const userData = session?.user as { id: string; accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const records = await db.financialRecord.findMany({
    where: {
      account_id: userData.accountId,
      asset_id: assetId,
    },
    orderBy: { date: "desc" },
  });

  const income = records.filter((r) => r.type === "INCOME").reduce((acc, r) => acc + r.amount, 0);
  const expense = records.filter((r) => r.type === "EXPENSE").reduce((acc, r) => acc + r.amount, 0);

  return { records, income, expense, net: income - expense };
}
