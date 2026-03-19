"use client";

import React, { useState } from "react";
import { createFinancialRecord } from "@/app/actions/financial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, AlertCircle } from "lucide-react";

export function AddRecordForm({ assetId }: { assetId?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const form = new FormData(e.currentTarget);
    try {
      await createFinancialRecord({
        asset_id: assetId,
        type: form.get("type") as string,
        category: form.get("category") as string,
        description: form.get("description") as string,
        amount: parseFloat(form.get("amount") as string),
        date: form.get("date") as string || undefined,
      });
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Erro ao criar lançamento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-500" />
          Novo Lançamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div className="space-y-2">
            <Label className="text-slate-400 text-[10px] uppercase font-bold">Tipo</Label>
            <select name="type" title="Tipo do lançamento" required className="w-full h-10 px-3 rounded-md border border-slate-700 bg-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500">
              <option value="INCOME">Receita</option>
              <option value="EXPENSE">Despesa</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-400 text-[10px] uppercase font-bold">Caixa</Label>
            <select name="category" title="Caixa de destino" required className="w-full h-10 px-3 rounded-md border border-slate-700 bg-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500">
              <option value="OPERACAO">Operacional</option>
              <option value="AQUISICAO">Aquisição</option>
              <option value="FROTA">Frota</option>
              <option value="QUITACAO">Contingência</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label className="text-slate-400 text-[10px] uppercase font-bold">Descrição</Label>
            <Input name="description" required placeholder="Ex: Aluguel SUV - Mar/2026" className="bg-slate-800 border-slate-700 text-white h-10" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-400 text-[10px] uppercase font-bold">Valor (R$)</Label>
            <Input name="amount" type="number" step="0.01" required placeholder="0.00" className="bg-slate-800 border-slate-700 text-white font-mono h-10" />
          </div>
          <div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white w-full h-10" disabled={loading}>
              {loading ? "..." : "Adicionar"}
            </Button>
          </div>
          <input type="hidden" name="date" value={new Date().toISOString()} />
          {error && (
            <div className="md:col-span-6 p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="w-3 h-3 inline mr-1" />{error}
            </div>
          )}
          {success && (
            <div className="md:col-span-6 p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              Lançamento adicionado com sucesso!
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
