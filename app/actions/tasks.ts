"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getTasks() {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const tasks = await db.task.findMany({
    where: {
      account_id: userData.accountId,
    },
    include: {
      user: true,
      asset: true,
      lead: true,
    },
    orderBy: {
      due_date: "asc",
    },
  });

  return tasks;
}

export async function createTask(data: {
  title: string;
  description?: string;
  due_date?: Date;
  priority: string;
  user_id: string;
  asset_id?: string;
  lead_id?: string;
}) {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const task = await db.task.create({
    data: {
      account_id: userData.accountId,
      ...data,
      status: "PENDING",
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return task;
}

export async function updateTaskStatus(id: string, status: "PENDING" | "COMPLETED" | "CANCELLED") {
  const session = await auth();
  const userData = session?.user as { id: string, accountId: string } | undefined;

  if (!userData?.accountId) {
    throw new Error("Não autorizado");
  }

  const task = await db.task.update({
    where: {
      id,
      account_id: userData.accountId,
    },
    data: { status },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return task;
}
