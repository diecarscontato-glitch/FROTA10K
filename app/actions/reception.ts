"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitReception(data: {
  asset_id: string;
  reception_km: number;
  tracker_installed: boolean;
  insurance_active: boolean;
  hygiene_done: boolean;
  reception_notes?: string;
}) {
  const session = await auth();
  const userData = session?.user as { id: string; accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const asset = await db.asset.update({
    where: {
      id: data.asset_id,
      account_id: userData.accountId,
    },
    data: {
      received_at: new Date(),
      reception_km: data.reception_km,
      tracker_installed: data.tracker_installed,
      insurance_active: data.insurance_active,
      hygiene_done: data.hygiene_done,
      status: "IN_OPERATION",
    },
  });

  revalidatePath(`/assets/${data.asset_id}`);
  revalidatePath("/assets");
  return asset;
}
