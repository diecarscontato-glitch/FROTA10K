/**
 * DIECAR Operational Pipeline - 15 Stages
 */
export const PIPELINE_STAGES = [
  { id: "NEW", label: "Lead novo", color: "blue" },
  { id: "CONTACT_STARTED", label: "Contato iniciado", color: "sky" },
  { id: "INCOMPLETE_DATA", label: "Dados incompletos", color: "amber" },
  { id: "READY_FOR_ANALYSIS", label: "Pronto para análise", color: "indigo" },
  { id: "FINANCIAL_ANALYSIS", label: "Em análise financeira", color: "purple" },
  { id: "LEGAL_ANALYSIS", label: "Em análise jurídica", color: "violet" },
  { id: "APPROVED", label: "Aprovado", color: "emerald" },
  { id: "NEGOTIATION", label: "Negociação em andamento", color: "orange" },
  { id: "PENDING_DOCS", label: "Documentação pendente", color: "yellow" },
  { id: "DOCS_COMPLETED", label: "Documentação concluída", color: "teal" },
  { id: "VEHICLE_RECEIVED", label: "Veículo recebido", color: "cyan" },
  { id: "IN_OPERATION", label: "Em operação / frota", color: "green" },
  { id: "EXIT_PROCESS", label: "Em saída / quitação / venda", color: "rose" },
  { id: "CLOSED", label: "Encerrado", color: "slate" },
  { id: "REJECTED", label: "Recusado / descartado", color: "red" },
] as const;

export type PipelineStatus = (typeof PIPELINE_STAGES)[number]["id"];

export const getStageLabel = (id: string) => {
  return PIPELINE_STAGES.find((s) => s.id === id)?.label || id;
};

export const getStageColor = (id: string) => {
  return PIPELINE_STAGES.find((s) => s.id === id)?.color || "slate";
};
