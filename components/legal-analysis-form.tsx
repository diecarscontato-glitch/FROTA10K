"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlert, CheckCircle2, FileText, AlertOctagon } from "lucide-react";
import { saveLegalAnalysis } from "@/app/actions/legal";

export function LegalAnalysisForm({ lead, initialData }: { lead: any, initialData?: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      lead_id: lead.id,
      criminal_records_checked: formData.get("criminal_records_checked") === "on",
      civil_lawsuits_checked: formData.get("civil_lawsuits_checked") === "on",
      vehicle_restrictions_checked: formData.get("vehicle_restrictions_checked") === "on",
      cnh_status_checked: formData.get("cnh_status_checked") === "on",
      renajud_checked: formData.get("renajud_checked") === "on",
      risk_level: formData.get("risk_level") as string,
      recommendation: formData.get("recommendation") as string,
      legal_notes: formData.get("legal_notes") as string,
    };

    try {
      await saveLegalAnalysis(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar análise jurídica");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bloco: Checklist Documental */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Checklist de Validação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-md border border-slate-800 bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors">
                <input type="checkbox" name="cnh_status_checked" defaultChecked={initialData?.cnh_status_checked} className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-900 bg-slate-900" />
                <span className="text-sm text-slate-300 font-medium">CNH Válida e Regular</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-md border border-slate-800 bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors">
                <input type="checkbox" name="criminal_records_checked" defaultChecked={initialData?.criminal_records_checked} className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-900 bg-slate-900" />
                <span className="text-sm text-slate-300 font-medium">Antecedentes Criminais (Nada Consta)</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-md border border-slate-800 bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors">
                <input type="checkbox" name="civil_lawsuits_checked" defaultChecked={initialData?.civil_lawsuits_checked} className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-900 bg-slate-900" />
                <span className="text-sm text-slate-300 font-medium">Processos Cíveis (Busca e Apreensão, etc)</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-md border border-slate-800 bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors">
                <input type="checkbox" name="vehicle_restrictions_checked" defaultChecked={initialData?.vehicle_restrictions_checked} className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-900 bg-slate-900" />
                <span className="text-sm text-slate-300 font-medium">Débitos Detran (Multas, IPVA)</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-md border border-amber-500/30 bg-amber-500/10 cursor-pointer hover:bg-amber-500/20 transition-colors">
                <input type="checkbox" name="renajud_checked" defaultChecked={initialData?.renajud_checked} className="w-4 h-4 rounded border-amber-700 text-amber-600 focus:ring-amber-600 focus:ring-offset-slate-900 bg-slate-900" />
                <span className="text-sm text-amber-500 font-medium">RENAJUD (Restrição Judicial)</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Bloco: Avaliação de Risco */}
        <Card className="bg-slate-900 border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-orange-500" />
              Nível de Risco Apurado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-3">
               <label className="cursor-pointer group">
                  <input type="radio" name="risk_level" value="BAIXO" className="peer hidden" defaultChecked={initialData?.risk_level === "BAIXO"} />
                  <div className="p-3 rounded border border-slate-700 bg-slate-800/50 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 text-center transition-all">
                    <span className="text-xs font-bold text-slate-400 peer-checked:text-emerald-500">Risco BAIXO</span>
                  </div>
               </label>
               <label className="cursor-pointer group">
                  <input type="radio" name="risk_level" value="MEDIO" className="peer hidden" defaultChecked={initialData?.risk_level === "MEDIO"} />
                  <div className="p-3 rounded border border-slate-700 bg-slate-800/50 peer-checked:border-amber-500 peer-checked:bg-amber-500/10 text-center transition-all">
                    <span className="text-xs font-bold text-slate-400 peer-checked:text-amber-500">Risco MÉDIO</span>
                  </div>
               </label>
               <label className="cursor-pointer group">
                  <input type="radio" name="risk_level" value="ALTO" className="peer hidden" defaultChecked={initialData?.risk_level === "ALTO"} />
                  <div className="p-3 rounded border border-slate-700 bg-slate-800/50 peer-checked:border-orange-500 peer-checked:bg-orange-500/10 text-center transition-all">
                    <span className="text-xs font-bold text-slate-400 peer-checked:text-orange-500">Risco ALTO</span>
                  </div>
               </label>
               <label className="cursor-pointer group">
                  <input type="radio" name="risk_level" value="IMPEDIMENTO" className="peer hidden" defaultChecked={initialData?.risk_level === "IMPEDIMENTO"} />
                  <div className="p-3 rounded border border-slate-700 bg-slate-800/50 peer-checked:border-red-500 peer-checked:bg-red-500/10 text-center transition-all">
                    <span className="text-xs font-bold text-slate-400 peer-checked:text-red-500 flex items-center justify-center gap-1"><AlertOctagon className="w-3 h-3"/> IMPEDIMENTO</span>
                  </div>
               </label>
            </div>

            <div className="space-y-2 flex-1">
              <Label htmlFor="legal_notes" className="text-slate-300">Parecer e Observações</Label>
              <textarea
                id="legal_notes"
                name="legal_notes"
                rows={4}
                defaultValue={initialData?.legal_notes || ""}
                placeholder="Exul: Proprietário possui processo trabalhista sem risco imediato de penhora..."
                className="w-full h-[calc(100%-24px)] min-h-[100px] p-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Bloco: Veredito Final Jurídico */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-300 uppercase text-xs font-bold tracking-widest">Decisão do Departamento Jurídico</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="cursor-pointer group">
                <input type="radio" name="recommendation" value="PROSSEGUIR" className="peer hidden" defaultChecked={initialData?.recommendation === "PROSSEGUIR"} />
                <div className="p-4 rounded-xl border-2 border-slate-800 bg-slate-900 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 transition-all text-center">
                  <span className="block text-lg font-bold text-slate-300 peer-checked:text-emerald-500 mb-1">✅ PROSSEGUIR</span>
                  <span className="text-xs text-slate-500">Documentação Limpa</span>
                </div>
              </label>

              <label className="cursor-pointer group">
                <input type="radio" name="recommendation" value="RESSALVAS" className="peer hidden" defaultChecked={initialData?.recommendation === "RESSALVAS"} />
                <div className="p-4 rounded-xl border-2 border-slate-800 bg-slate-900 peer-checked:border-amber-500 peer-checked:bg-amber-500/10 transition-all text-center">
                  <span className="block text-lg font-bold text-slate-300 peer-checked:text-amber-500 mb-1">⚠️ C/ RESSALVAS</span>
                  <span className="text-xs text-slate-500">Exige Contrato Específico</span>
                </div>
              </label>

              <label className="cursor-pointer group">
                <input type="radio" name="recommendation" value="BLOQUEAR" className="peer hidden" defaultChecked={initialData?.recommendation === "BLOQUEAR"} />
                <div className="p-4 rounded-xl border-2 border-slate-800 bg-slate-900 peer-checked:border-red-500 peer-checked:bg-red-500/10 transition-all text-center">
                  <span className="block text-lg font-bold text-slate-300 peer-checked:text-red-500 mb-1">⛔ BLOQUEAR</span>
                  <span className="text-xs text-slate-500">Risco Inaceitável</span>
                </div>
              </label>
            </div>
          </div>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-sm">{error}</div>}
          {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Análise Jurídica salva com sucesso! Lead liberado para captação física.</div>}

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]">
              {loading ? "Salvando..." : "Emitir Parecer Jurídico"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
