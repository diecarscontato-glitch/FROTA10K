"use client";

import React, { useState } from "react";
import { submitDecision } from "@/app/actions/analysis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gavel, TrendingUp, Truck, Home, Trash2, BadgeDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface DecisionFormProps {
  assetId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DecisionForm({ assetId, onSuccess, onCancel }: DecisionFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [decision, setDecision] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!decision) {
      setError("Por favor, selecione uma decisão de destino.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      asset_id: assetId,
      decision: decision as any,
      justification: formData.get("justification") as string,
      target_value: parseFloat(formData.get("target_value") as string),
    };

    try {
      await submitDecision(data);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar decisão");
    } finally {
      setLoading(false);
    }
  }

  const DecisionOption = ({ value, label, description, icon: Icon, color }: any) => (
    <label className="flex-1 min-w-[200px]">
      <input 
        type="radio" 
        name="decision_radio" 
        value={value} 
        onChange={(e) => setDecision(e.target.value)}
        className="hidden peer" 
      />
      <div className={cn(
        "h-full flex flex-col p-4 rounded-xl border border-slate-700 bg-slate-800/50 cursor-pointer transition-all hover:bg-slate-800",
        "peer-checked:border-blue-500 peer-checked:bg-blue-600/10 active:scale-95"
      )}>
        <div className={cn("p-2 rounded-lg w-fit mb-3", color)}>
           <Icon className="w-5 h-5" />
        </div>
        <p className="font-bold text-white text-sm mb-1">{label}</p>
        <p className="text-[10px] text-slate-400 leading-relaxed">{description}</p>
      </div>
    </label>
  );

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
           <Gavel className="w-5 h-5 text-amber-500" />
           Comitê de Destino do Ativo
        </CardTitle>
        <CardDescription className="text-slate-400">
           Escolha a estratégia comercial para este veículo.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DecisionOption 
              value="AGIO_SALE"
              label="Venda de Ágio"
              description="Vender a posse e o direito sobre o financiamento (Equity)."
              icon={TrendingUp}
              color="bg-blue-500/10 text-blue-500"
            />
            <DecisionOption 
              value="DIRECT_REPASSE"
              label="Repasse Direto"
              description="Venda rápida para lojistas ou investidores parceiros."
              icon={Truck}
              color="bg-emerald-500/10 text-emerald-500"
            />
            <DecisionOption 
              value="RENTAL_FLEET"
              label="Locação / Frota"
              description="Manter o ativo para gerar renda recorrente."
              icon={Home}
              color="bg-purple-500/10 text-purple-500"
            />
            <DecisionOption 
              value="DISCARD"
              label="Descarte / Recusa"
              description="Ativo não saudável. Devolver ou encerrar lead."
              icon={Trash2}
              color="bg-red-500/10 text-red-500"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
             <div className="space-y-2">
                <Label htmlFor="target_value" className="text-slate-300 text-xs uppercase font-bold tracking-tight">Valor Alvo da Operação</Label>
                <div className="relative">
                   <BadgeDollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                   <Input 
                     id="target_value" 
                     name="target_value" 
                     type="number" 
                     step="0.01" 
                     placeholder="Ex: 15000.00" 
                     className="pl-10 bg-slate-800/50 border-slate-700 text-white font-bold" 
                     required 
                   />
                </div>
                <p className="text-[10px] text-slate-500">Este é o valor de entrada/ágio ou preço final de repasse esperado.</p>
             </div>

             <div className="space-y-2">
                <Label htmlFor="justification" className="text-slate-300 text-xs uppercase font-bold tracking-tight">Justificativa da Decisão</Label>
                <textarea
                  id="justification"
                  name="justification"
                  rows={3}
                  placeholder="Por que este destino foi escolhido?"
                  className="w-full p-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
             </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-slate-800 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-slate-400 hover:text-white"
          >
            Voltar
          </Button>
          <Button
            type="submit"
            className="bg-amber-600 hover:bg-amber-500 text-white px-10 h-11 shadow-lg shadow-amber-600/20"
            disabled={loading}
          >
            {loading ? "Processando..." : "Confirmar Destino do Ativo"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
