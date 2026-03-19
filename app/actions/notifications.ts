"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const session = await auth();
  const userData = session?.user as { id: string } | undefined;

  if (!userData?.id) {
    return [];
  }

  const notifications = await db.notification.findMany({
    where: {
      user_id: userData.id,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 10,
  });

  return notifications;
}

export async function markAsRead(notificationId: string) {
  const session = await auth();
  const userData = session?.user as { id: string } | undefined;

  if (!userData?.id) {
    throw new Error("Não autorizado");
  }

  await db.notification.update({
    where: {
      id: notificationId,
      user_id: userData.id,
    },
    data: {
      read: true,
    },
  });

  revalidatePath("/notifications");
  return { success: true };
}

export async function markAllAsRead() {
  const session = await auth();
  const userData = session?.user as { id: string } | undefined;

  if (!userData?.id) {
    throw new Error("Não autorizado");
  }

  await db.notification.updateMany({
    where: {
      user_id: userData.id,
      read: false,
    },
    data: {
      read: true,
    },
  });

  revalidatePath("/notifications");
  return { success: true };
}
