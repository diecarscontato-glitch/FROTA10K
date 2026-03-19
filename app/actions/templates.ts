"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getTemplates(category?: string) {
  const session = await auth();
  const userData = session?.user as { accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  return await db.template.findMany({
    where: {
      ...(category && { category }),
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function createTemplate(data: {
  name: string;
  category: string;
  description?: string;
  config_payload?: any;
}) {
  const session = await auth();
  const userData = session?.user as { accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const template = await db.template.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/settings/templates");
  return template;
}
