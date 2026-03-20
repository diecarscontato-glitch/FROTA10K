"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calculator, AlertTriangle, Scale, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";
import { saveAnalysis } from "@/app/actions/analysis";
import { cn } from "@/lib/utils";

export function AnalysisForm({ lead, initialAnalysis }: { lead: any, initialAnalysis?: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Auto-calculation states
  const [fipe, setFipe] = useState<number>(initialAnalysis?.fipe_value || 0);
  const [market, setMarket] = useState<number>(initialAnalysis?.market_value || 0);
  const totalDebt = (lead.finance_installment_value || 0) * (lead.finance_remaining_installments || 0) + (lead.finance_overdue_installments || 0) * (lead.finance_installment_value || 0); // Simplified for calculation
  
  const diffFipe = fipe > 0 ? fipe - totalDebt : 0;
  const diffMarket = market > 0 ? market - totalDebt : 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      fipe_value: parseFloat(formData.get("fipe_value") as string) || 0,
      market_value: parseFloat(formData.get("market_value") as string) || 0,
      difference_fipe: diffFipe,
      difference_market: diffMarket,
      estimated_rent: parseFloat(formData.get("estimated_rent") as string) || 0,
      bank_profile: formData.get("bank_profile") as string,
      verdict: formData.get("verdict") as string,
      recommendation: formData.get("recommendation") as string,
      lead_id: lead.id
    };

    try {
      await saveAnalysis(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar análise");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bloco: Dívida vs FIPE */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-500" />
              Cálculo da Dívida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Dívida Total Estimada</p>
                <p className="text-2xl font-bold text-red-500">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDebt)}
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>{lead.finance_remaining_installments || 0} parcelas restantes</p>
                <p>{lead.finance_overdue_installments || 0} em atraso</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fipe_value" className="text-slate-300">FIPE Estimada</Label>
                <Input
                  id="fipe_value"
                  name="fipe_value"
                  type="number"
                  value={fipe || ""}
                  onChange={(e) => setFipe(parseFloat(e.target.value) || 0)}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  placeholder="R$ 0,00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="market_value" className="text-slate-300">Mercado Real</Label>
                <Input
                  id="market_value"
                  name="market_value"
                  type="number"
                  value={market || ""}
                  onChange={(e) => setMarket(parseFloat(e.target.value) || 0)}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Diferença p/ FIPE</p>
                <p className={cn("font-bold", diffFipe >= 0 ? "text-emerald-500" : "text-red-500")}>
                  {diffFipe >= 0 ? "+" : ""}{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(diffFipe)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Diferença p/ Mercado</p>
                <p className={cn("font-bold", diffMarket >= 0 ? "text-emerald-500" : "text-red-500")}>
                  {diffMarket >= 0 ? "+" : ""}{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(diffMarket)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bloco: Potencial e Risco */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Potencial & Risco
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_rent" className="text-slate-300">Faixa de Aluguel Estimada / Receita</Label>
              <Input
                id="estimated_rent"
                name="estimated_rent"
                type="number"
                defaultValue={initialAnalysis?.estimated_rent || ""}
                className="bg-slate-800/50 border-slate-700 text-white"
                placeholder="Ex: 2500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bank_profile" className="text-slate-300">Perfil do Banco</Label>
              <select
                id="bank_profile"
                name="bank_profile"
                defaultValue={initialAnalysis?.bank_profile || ""}
                className="w-full h-10 px-3 rounded-md border border-input bg-slate-800/50 border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o perfil do credor</option>
                <option value="NEGOCIAVEL">Bom para negociar (Ex: PAN)</option>
                <option value="MEDIO">Médio (Bancos Tradicionais)</option>
                <option value="RUIM">Ruim / Agressivo (Busca rápida)</option>
                <option value="COOPERATIVA">Cooperativa (Mais travado)</option>
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 p-3 rounded-md border border-amber-500/20 bg-amber-500/10">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="text-xs text-amber-200">
                  <span className="font-bold">Atenção ao Risco:</span> {(lead.finance_overdue_installments || 0) >= 3 ? "3+ parcelas em atraso. Risco ALTO de busca e apreensão." : "Atraso controlado momentaneamente."}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Bloco: Veredito Final */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-500" />
            Veredito da Mesa de Análise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-300 uppercase text-xs font-bold tracking-widest">Carimbo Decisório</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="cursor-pointer group">
                <input type="radio" name="verdict" value="APROVADO" className="peer hidden" defaultChecked={initialAnalysis?.verdict === "APROVADO"} />
                <div className="p-4 rounded-xl border-2 border-slate-800 bg-slate-900 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 transition-all text-center">
                  <span className="block text-lg font-bold text-slate-300 peer-checked:text-emerald-500 mb-1">🟢 APROVADO</span>
                  <span className="text-xs text-slate-500">Entra no padrão da esteira</span>
                </div>
              </label>

              <label className="cursor-pointer group">
                <input type="radio" name="verdict" value="NEGOCIAR" className="peer hidden" defaultChecked={initialAnalysis?.verdict === "NEGOCIAR"} />
                <div className="p-4 rounded-xl border-2 border-slate-800 bg-slate-900 peer-checked:border-amber-500 peer-checked:bg-amber-500/10 transition-all text-center">
                  <span className="block text-lg font-bold text-slate-300 peer-checked:text-amber-500 mb-1">🟡 NEGOCIAR</span>
                  <span className="text-xs text-slate-500">Ajustar preço ou condição</span>
                </div>
              </label>

              <label className="cursor-pointer group">
                <input type="radio" name="verdict" value="RECUSADO" className="peer hidden" defaultChecked={initialAnalysis?.verdict === "RECUSADO"} />
                <div className="p-4 rounded-xl border-2 border-slate-800 bg-slate-900 peer-checked:border-red-500 peer-checked:bg-red-500/10 transition-all text-center">
                  <span className="block text-lg font-bold text-slate-300 peer-checked:text-red-500 mb-1">🔴 RECUSADO</span>
                  <span className="text-xs text-slate-500">Risco ou dívida inviável</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendation" className="text-slate-300">Tese de Saída e Plano de Ação</Label>
            <textarea
              id="recommendation"
              name="recommendation"
              rows={3}
              defaultValue={initialAnalysis?.recommendation || ""}
              placeholder="Ex: Assunção com R$ 2.000 de entrada e destino direto para locação de app..."
              className="w-full p-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-sm">{error}</div>}
          {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Veredito salvo com sucesso! Lead pode avançar jurídico.</div>}

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]">
              {loading ? "Salvando..." : "Salvar Parecer da Análise"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
