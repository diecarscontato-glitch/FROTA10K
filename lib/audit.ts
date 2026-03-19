import { db } from "@/lib/db";

export async function createAuditLog({
  accountId,
  actorUserId,
  eventType,
  targetEntityType,
  targetEntityId,
  summary,
  beforePayload,
  afterPayload,
  severity = "INFO"
}: {
  accountId?: string;
  actorUserId?: string;
  eventType: string;
  targetEntityType?: string;
  targetEntityId?: string;
  summary?: string;
  beforePayload?: any;
  afterPayload?: any;
  severity?: "INFO" | "WARNING" | "CRITICAL";
}) {
  try {
    return await db.auditLog.create({
      data: {
        account_id: accountId,
        actor_user_id: actorUserId,
        event_type: eventType,
        target_entity_type: targetEntityType,
        target_entity_id: targetEntityId,
        summary: summary,
        before_payload: beforePayload,
        after_payload: afterPayload,
        severity: severity,
      }
    });
  } catch (error) {
    console.error("Erro ao criar AuditLog:", error);
  }
}
