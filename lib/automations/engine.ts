import { db } from "@/lib/db";

export async function executeAutomations(accountId: string, triggerType: string, entityId: string, data: Record<string, any>) {
  const rules = await db.automationRule.findMany({
    where: {
      account_id: accountId,
      trigger_type: triggerType,
      status: "ACTIVE"
    }
  });

  for (const rule of rules) {
    try {
      // Check conditions
      const conditions = rule.condition_payload as Record<string, any>;
      let matched = true;

      if (conditions && typeof conditions === 'object') {
        for (const [key, expectedValue] of Object.entries(conditions)) {
          if (data[key] !== expectedValue) {
            matched = false;
            break;
          }
        }
      }

      if (matched) {
        // Execute actions
        const actions = rule.action_payload as Record<string, any>;
        if (actions?.type === "UPDATE_STATUS") {
          await db.asset.update({
            where: { id: entityId },
            data: { status: actions.value }
          });
        }

        // Log execution
        await db.automationExecution.create({
          data: {
            automation_rule_id: rule.id,
            status: "SUCCESS",
            linked_entity_type: triggerType.split('_')[0], // e.g., ASSET from ASSET_CREATED
            linked_entity_id: entityId,
            result_summary: `Regra "${rule.name}" aplicada com sucesso.`
          }
        });
      }
    } catch (error) {
      console.error(`Erro ao executar automação ${rule.id}:`, error);
      await db.automationExecution.create({
        data: {
          automation_rule_id: rule.id,
          status: "FAILED",
          linked_entity_id: entityId,
          result_summary: `Erro: ${error instanceof Error ? error.message : String(error)}`
        }
      });
    }
  }
}
