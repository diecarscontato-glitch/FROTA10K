"use client";

import React, { useState, useEffect } from "react";
import { createAnalysis } from "@/app/actions/analysis";
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
import { 
  Calculator, AlertCircle, CheckCircle2, 
  XCircle, Scale
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisFormProps {
  asset: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AnalysisForm({ asset, onSuccess, onCancel }: AnalysisFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verdict, setVerdict] = useState<string>("");

  // Calculation states - try to get from financing first, then lead
  const initialDebt = asset.financing?.outstanding_balance || asset.lead?.finance_outstanding_balance || 0;
  const initialExpectation = asset.lead?.owner_expectation || 0;
  
  const [debt, setDebt] = useState(initialDebt);
  const [expectation, setExpectation] = useState(initialExpectation);
  const [fipePct, setFipePct] = useState(0);
  const [marketPct, setMarketPct] = useState(0);

  // Score states
  const [scores, setScores] = useState({
    structural: 10,
    engine: 10,
    paint: 10,
    interior: 10
  });

  const [rent, setRent] = useState(0);
  const [opCost, setOpCost] = useState(0);
  const [margin, setMargin] = useState(0);

  useEffect(() => {
    const totalDebt = debt + expectation;
    const fipe = asset.fipe_value || 0;
    const market = asset.market_value || 0;

    if (fipe > 0) {
      setFipePct((totalDebt / fipe) * 100);
    }
    if (market > 0) {
      setMarketPct((totalDebt / market) * 100);
    }
    
    setMargin(rent - opCost);
  }, [debt, expectation, asset.fipe_value, asset.market_value, rent, opCost]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!verdict) {
      setError("Selecione um veredito para a análise.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      asset_id: asset.id,
      total_debt_estimated: debt + expectation,
      fipe_comparison_pct: fipePct,
      market_comparison_pct: marketPct,
      verdict: verdict as any,
      bank_profile: formData.get("bank_profile") as string,
      estimated_rent: rent,
      operational_cost: opCost,
      monthly_margin: margin,
      recommendation: formData.get("recommendation") as string,
      structural_score: scores.structural,
      engine_score: scores.engine,
      paint_score: scores.paint,
      interior_score: scores.interior,
    };

    try {
      await createAnalysis(data);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar análise");
    } finally {
      setLoading(false);
    }
  }

  const VerdictOption = ({ value, label, icon: Icon, color, activeColor }: {
    value: string;
    label: string;
    icon: any;
    color: string;
    activeColor: string;
  }) => (
    <label className="flex-1 cursor-pointer">
      <input 
        type="radio" 
        name="verdict" 
        value={value} 
        onChange={(e) => setVerdict(e.target.value)}
        className="hidden peer"
      />
      <div className={cn(
        "flex flex-col items-center justify-center p-4 rounded-xl border border-slate-700 bg-slate-800/50 transition-all",
        "peer-checked:border-2",
        verdict === value ? activeColor : "hover:bg-slate-800"
      )}>
        <Icon className={cn("w-6 h-6 mb-2", color)} />
        <span className="text-xs font-bold text-white uppercase">{label}</span>
      </div>
    </label>
  );

  const ScoreSlider = ({ name, label, value }: { name: keyof typeof scores, label: string, value: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <Label className="text-[10px] text-slate-400 uppercase font-bold">{label}</Label>
        <span className={cn(
          "text-xs font-bold",
          value >= 8 ? "text-emerald-400" : value >= 5 ? "text-amber-400" : "text-red-400"
        )}>{value}/10</span>
      </div>
      <input 
        type="range" 
        min="0" 
        max="10" 
        value={value} 
        onChange={(e) => setScores(prev => ({ ...prev, [name]: parseInt(e.target.value) }))}
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
      />
    </div>
  );

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-500" />
          Calculadora de Viabilidade Financeira & Técnica
        </CardTitle>
        <CardDescription className="text-slate-400">
          Analise o endividamento, estado técnico e margem operacional do ativo.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Avaliação Técnica</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ScoreSlider name="structural" label="Estrutura" value={scores.structural} />
                  <ScoreSlider name="engine" label="Motor/Câmbio" value={scores.engine} />
                  <ScoreSlider name="paint" label="Pintura/Lataria" value={scores.paint} />
                  <ScoreSlider name="interior" label="Interior" value={scores.interior} />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Base de Cálculo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-slate-400 text-[10px] uppercase font-bold">Saldo Devedor (Banco)</Label>
                    <Input 
                      type="number" 
                      value={debt} 
                      onChange={(e) => setDebt(parseFloat(e.target.value) || 0)}
                      className="bg-slate-800 border-slate-700 text-white font-mono h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-400 text-[10px] uppercase font-bold">Expectativa Equity</Label>
                    <Input 
                      type="number" 
                      value={expectation} 
                      onChange={(e) => setExpectation(parseFloat(e.target.value) || 0)}
                      className="bg-slate-800 border-slate-700 text-white font-mono h-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Indicadores de Risco</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className={cn(
                    "p-4 rounded-xl border flex flex-col items-center justify-center space-y-1",
                    fipePct > 100 ? "border-red-500/50 bg-red-500/5" : "border-emerald-500/50 bg-emerald-500/5"
                  )}>
                    <span className="text-[10px] text-slate-400 uppercase font-bold text-center leading-tight">Dívida / FIPE</span>
                    <span className={cn("text-lg font-black font-mono", fipePct > 100 ? "text-red-400" : "text-emerald-400")}>
                      {fipePct.toFixed(1)}%
                    </span>
                  </div>
                  <div className={cn(
                    "p-4 rounded-xl border flex flex-col items-center justify-center space-y-1",
                    marketPct > 90 ? "border-red-500/50 bg-red-500/5" : "border-emerald-500/50 bg-emerald-500/5"
                  )}>
                    <span className="text-[10px] text-slate-400 uppercase font-bold text-center leading-tight">Dívida / Mercado</span>
                    <span className={cn("text-lg font-black font-mono", marketPct > 90 ? "text-red-400" : "text-emerald-400")}>
                      {marketPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Viabilidade Operacional</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-slate-400 text-[10px] uppercase font-bold">Aluguel Estimado</Label>
                    <Input 
                      type="number" 
                      value={rent} 
                      onChange={(e) => setRent(parseFloat(e.target.value) || 0)}
                      className="bg-slate-800 border-slate-700 text-white h-9" 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-400 text-[10px] uppercase font-bold">Custo Op. / Mês</Label>
                    <Input 
                      type="number" 
                      value={opCost} 
                      onChange={(e) => setOpCost(parseFloat(e.target.value) || 0)}
                      className="bg-slate-800 border-slate-700 text-white h-9" 
                    />
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex justify-between items-center">
                  <span className="text-xs text-indigo-300 font-bold uppercase">Margem Mensal Est.</span>
                  <span className={cn("font-bold font-mono", margin >= 0 ? "text-emerald-400" : "text-red-400")}>
                    R$ {margin.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Perfil da Operação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Banco / Perfil Financeiro</Label>
                <select name="bank_profile" className="w-full h-10 px-3 rounded-md border border-slate-700 bg-slate-800 text-white text-sm focus:ring-2 focus:ring-indigo-500">
                  <option value="NEGOCIAVEL">Negociável (Fácil)</option>
                  <option value="DIFICIL">Difícil (Bancos Rígidos)</option>
                  <option value="JUDICIALIZADO">Judicializado / Busca e Apreensão</option>
                  <option value="QUITACAO_AVISTA">Apenas Quitação à Vista</option>
                  <option value="COOPERATIVA">Cooperativa / Câmbio Alternativo</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Veredito da Mesa</Label>
                <div className="flex gap-2">
                  <VerdictOption 
                    value="APPROVED" 
                    label="Aprovar" 
                    icon={CheckCircle2} 
                    color="text-emerald-500" 
                    activeColor="border-emerald-500 bg-emerald-500/10"
                  />
                  <VerdictOption 
                    value="NEGOTIATE" 
                    label="Negociar" 
                    icon={Scale} 
                    color="text-amber-500" 
                    activeColor="border-amber-500 bg-amber-500/10"
                  />
                  <VerdictOption 
                    value="REFUSED" 
                    label="Recusar" 
                    icon={XCircle} 
                    color="text-red-500" 
                    activeColor="border-red-500 bg-red-500/10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-800">
            <Label className="text-slate-300">Resumo da Análise / Recomendações</Label>
            <textarea
              name="recommendation"
              rows={3}
              placeholder="Descreva as condições ideais para a estruturação do negócio ou motivos da recusa..."
              className="w-full p-3 rounded-lg border border-slate-700 bg-slate-800 text-white text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-slate-800 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-slate-400 hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 h-11 font-bold"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Finalizar Análise"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
