"use client";

import React, { useState } from "react";
import { createLegalAnalysis } from "@/app/actions/legal";
import { Button } from "@/components/ui/button";
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
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  XOctagon,
  ShieldCheck,
  ShieldX,
  ShieldQuestion,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LegalAnalysisFormProps {
  asset: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function LegalAnalysisForm({ asset, onSuccess, onCancel }: LegalAnalysisFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const existing = asset.legal_analysis;

  const [checks, setChecks] = useState({
    criminal_records_checked: existing?.criminal_records_checked ?? false,
    civil_lawsuits_checked: existing?.civil_lawsuits_checked ?? false,
    vehicle_restrictions_checked: existing?.vehicle_restrictions_checked ?? false,
    cnh_status_checked: existing?.cnh_status_checked ?? false,
  });

  const [riskLevel, setRiskLevel] = useState<string>(existing?.risk_level ?? "");
  const [recommendation, setRecommendation] = useState<string>(existing?.recommendation ?? "");
  const [notes, setNotes] = useState(existing?.legal_notes ?? "");

  const allChecked = Object.values(checks).every(Boolean);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!allChecked) {
      setError("Todos os itens do checklist devem ser verificados.");
      return;
    }
    if (!riskLevel) {
      setError("Selecione o nível de risco.");
      return;
    }
    if (!recommendation) {
      setError("Selecione um parecer jurídico.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createLegalAnalysis({
        asset_id: asset.id,
        ...checks,
        risk_level: riskLevel,
        legal_notes: notes,
        recommendation,
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar análise jurídica");
    } finally {
      setLoading(false);
    }
  }

  const CheckItem = ({
    label,
    description,
    field,
    checked,
  }: {
    label: string;
    description: string;
    field: keyof typeof checks;
    checked: boolean;
  }) => (
    <label className="flex items-start gap-4 p-4 rounded-xl border border-slate-700 bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-all group">
      <div className="pt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecks((prev) => ({ ...prev, [field]: e.target.checked }))}
          className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{label}</p>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
      {checked ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
      )}
    </label>
  );

  const riskOptions = [
    { value: "LOW", label: "Baixo", color: "text-emerald-500", bg: "border-emerald-500/50 bg-emerald-500/5" },
    { value: "MEDIUM", label: "Médio", color: "text-amber-500", bg: "border-amber-500/50 bg-amber-500/5" },
    { value: "HIGH", label: "Alto", color: "text-orange-500", bg: "border-orange-500/50 bg-orange-500/5" },
    { value: "IMPEDIMENT", label: "Impedimento", color: "text-red-500", bg: "border-red-500/50 bg-red-500/5" },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-violet-500" />
          Análise Jurídica / Documental
        </CardTitle>
        <CardDescription className="text-slate-400">
          Verifique todos os itens obrigatórios antes de emitir o parecer.
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

          {/* Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Checklist Obrigatório</h3>
            <CheckItem
              label="Antecedentes Criminais"
              description="Consulta realizada nos sistemas estadual e federal para o proprietário."
              field="criminal_records_checked"
              checked={checks.criminal_records_checked}
            />
            <CheckItem
              label="Processos Cíveis"
              description="Verificação de ações cíveis, execuções fiscais e trabalhistas."
              field="civil_lawsuits_checked"
              checked={checks.civil_lawsuits_checked}
            />
            <CheckItem
              label="Restrições Veiculares"
              description="Consulta RENAJUD, DETRAN e SNG para restrições judiciais, administrativas e financeiras."
              field="vehicle_restrictions_checked"
              checked={checks.vehicle_restrictions_checked}
            />
            <CheckItem
              label="Status CNH do Proprietário"
              description="Validade da CNH, pontuação e processos de suspensão/cassação."
              field="cnh_status_checked"
              checked={checks.cnh_status_checked}
            />
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700">
            <div className="flex-1">
              <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider mb-1.5">
                <span className="text-slate-400">Progresso</span>
                <span className={allChecked ? "text-emerald-400" : "text-amber-400"}>
                  {Object.values(checks).filter(Boolean).length}/4
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    allChecked ? "bg-emerald-500" : "bg-amber-500"
                  )}
                  style={{ width: `${(Object.values(checks).filter(Boolean).length / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Risk Level */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nível de Risco</h3>
            <div className="grid grid-cols-4 gap-2">
              {riskOptions.map((opt) => (
                <label key={opt.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="risk_level"
                    value={opt.value}
                    checked={riskLevel === opt.value}
                    onChange={(e) => setRiskLevel(e.target.value)}
                    className="hidden peer"
                  />
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center",
                      riskLevel === opt.value ? opt.bg : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                    )}
                  >
                    <span className={cn("text-[10px] font-bold uppercase", opt.color)}>{opt.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Parecer Jurídico</h3>
            <div className="grid grid-cols-3 gap-3">
              <label className="cursor-pointer">
                <input type="radio" name="recommendation" value="PROCEED" checked={recommendation === "PROCEED"} onChange={(e) => setRecommendation(e.target.value)} className="hidden peer" />
                <div className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border transition-all",
                  recommendation === "PROCEED" ? "border-emerald-500 bg-emerald-500/10" : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                )}>
                  <ShieldCheck className="w-6 h-6 text-emerald-500 mb-2" />
                  <span className="text-[10px] font-bold text-white uppercase">Aprovar</span>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="recommendation" value="PROCEED_WITH_RESERVATIONS" checked={recommendation === "PROCEED_WITH_RESERVATIONS"} onChange={(e) => setRecommendation(e.target.value)} className="hidden peer" />
                <div className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border transition-all",
                  recommendation === "PROCEED_WITH_RESERVATIONS" ? "border-amber-500 bg-amber-500/10" : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                )}>
                  <ShieldQuestion className="w-6 h-6 text-amber-500 mb-2" />
                  <span className="text-[10px] font-bold text-white uppercase">Com Ressalvas</span>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="recommendation" value="BLOCK" checked={recommendation === "BLOCK"} onChange={(e) => setRecommendation(e.target.value)} className="hidden peer" />
                <div className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border transition-all",
                  recommendation === "BLOCK" ? "border-red-500 bg-red-500/10" : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                )}>
                  <ShieldX className="w-6 h-6 text-red-500 mb-2" />
                  <span className="text-[10px] font-bold text-white uppercase">Vetar</span>
                </div>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <Label className="text-slate-300">Observações Jurídicas</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Descreva riscos identificados, pendências documentais ou condições para prosseguir..."
              className="w-full p-3 rounded-lg border border-slate-700 bg-slate-800 text-white text-sm focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Veto Warning */}
          {recommendation === "BLOCK" && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <XOctagon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-400">Atenção: VETO Jurídico</p>
                <p className="text-xs text-red-300/70 mt-1 leading-relaxed">
                  Esta ação bloqueará o ativo e mudará o status para REJEITADO. O processo será encerrado permanentemente.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-slate-800 pt-6">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-slate-400 hover:text-white">
            Cancelar
          </Button>
          <Button
            type="submit"
            className={cn(
              "px-10 h-11 font-bold text-white",
              recommendation === "BLOCK"
                ? "bg-red-600 hover:bg-red-500"
                : "bg-violet-600 hover:bg-violet-500"
            )}
            disabled={loading}
          >
            {loading ? "Processando..." : recommendation === "BLOCK" ? "Confirmar Veto" : "Emitir Parecer"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
