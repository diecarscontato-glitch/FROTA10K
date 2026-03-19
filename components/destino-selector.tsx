"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitDecision } from "@/app/actions/analysis";

interface DestinoSelectorProps {
  assetId: string;
  optionId: string;
  recommended?: boolean;
}

export function DestinoSelector({ assetId, optionId, recommended }: DestinoSelectorProps) {
  const [loading, setLoading] = useState(false);

  async function handleSelect() {
    setLoading(true);
    try {
      await submitDecision({
        asset_id: assetId,
        decision: optionId as any,
        justification: `Selecionado via Comitê de Destino (${recommended ? 'Recomendado' : 'Manual'})`,
        target_value: 0, // Should be refined later with a modal for value input if needed
      });
      window.location.href = `/assets/${assetId}`;
    } catch (error) {
      console.error(error);
      alert("Erro ao processar decisão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button 
      onClick={handleSelect}
      disabled={loading}
      className={cn(
        "w-full gap-2",
        recommended ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
      )}
    >
      {loading ? "Processando..." : "Selecionar Destino"} <ChevronRight className="w-4 h-4" />
    </Button>
  );
}
