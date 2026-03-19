"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createAsset } from "@/app/actions/assets";
import { getLeads } from "@/app/actions/leads";
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
  Car, 
  Bike, 
  ChevronLeft, 
  Save, 
  BadgeDollarSign, 
  Calendar, 
  Gauge, 
  Palette, 
  Hash,
  AlertCircle,
  Building2,
  ListOrdered
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NewAssetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLeads() {
      try {
        const data = await getLeads();
        setLeads(data);
      } catch (err) {
        console.error("Erro ao carregar leads", err);
      }
    }
    fetchLeads();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    const data = {
      lead_id: formData.get("lead_id") as string,
      type: formData.get("type") as string,
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      year: parseInt(formData.get("year") as string),
      color: formData.get("color") as string,
      plate: formData.get("plate") as string,
      km: parseInt(formData.get("km") as string),
      condition: formData.get("condition") as string,
      estimated_value: parseFloat(formData.get("estimated_value") as string),
      financing_data: {
        bank: formData.get("bank") as string,
        total_installments: parseInt(formData.get("total_installments") as string),
        paid_installments: parseInt(formData.get("paid_installments") as string),
        installment_value: parseFloat(formData.get("installment_value") as string),
        outstanding_balance: parseFloat(formData.get("outstanding_balance") as string),
        overdue_installments: parseInt(formData.get("overdue_installments") as string) || 0,
      }
    };

    try {
      await createAsset(data);
      router.push("/assets");
    } catch (err: any) {
      setError(err.message || "Erro ao salvar ativo");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
         <Link href="/assets" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Cancelar e Voltar
         </Link>
         <h1 className="text-2xl font-bold text-white">Novo Registro de Ativo</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
        )}

        {/* Lead Selection */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Vínculo com Proponente</CardTitle>
            <CardDescription className="text-slate-400">Associe este ativo a um lead ou oportunidade existente.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-2">
                <Label htmlFor="lead_id" className="text-slate-300">Selecione o Lead</Label>
                <select
                  id="lead_id"
                  name="lead_id"
                  className="w-full h-11 px-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um lead...</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>{lead.name} ({lead.phone})</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-wide">
                  Não encontrou o lead? <Link href="/leads" className="text-blue-500 hover:underline">Cadastre-o no portal de leads primeiro.</Link>
                </p>
             </div>
          </CardContent>
        </Card>

        {/* Vehicle Data */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Dados do Veículo</CardTitle>
            <CardDescription className="text-slate-400">Informações técnicas básicas do ativo.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <Label className="text-slate-300">Tipo de Ativo</Label>
                <div className="flex gap-4">
                   <label className="flex-1">
                      <input type="radio" name="type" value="CAR" defaultChecked className="hidden peer" />
                      <div className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 peer-checked:bg-blue-600/10 peer-checked:border-blue-500 peer-checked:text-blue-500 cursor-pointer transition-all">
                         <Car className="w-4 h-4" />
                         <span className="text-sm font-medium">Carro</span>
                      </div>
                   </label>
                   <label className="flex-1">
                      <input type="radio" name="type" value="MOTORCYCLE" className="hidden peer" />
                      <div className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 peer-checked:bg-blue-600/10 peer-checked:border-blue-500 peer-checked:text-blue-500 cursor-pointer transition-all">
                         <Bike className="w-4 h-4" />
                         <span className="text-sm font-medium">Moto</span>
                      </div>
                   </label>
                </div>
             </div>

             <div className="space-y-2">
                <Label htmlFor="brand" className="text-slate-300">Marca / Fabricante</Label>
                <Input id="brand" name="brand" placeholder="Ex: Honda, Toyota..." className="bg-slate-800/50 border-slate-700 text-white" required />
             </div>

             <div className="space-y-2">
                <Label htmlFor="model" className="text-slate-300">Modelo</Label>
                <Input id="model" name="model" placeholder="Ex: Civic G10 Touring" className="bg-slate-800/50 border-slate-700 text-white" required />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-slate-300">Ano / Modelo</Label>
                  <Input id="year" name="year" type="number" placeholder="2021" className="bg-slate-800/50 border-slate-700 text-white" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color" className="text-slate-300">Cor</Label>
                  <Input id="color" name="color" placeholder="Prata" className="bg-slate-800/50 border-slate-700 text-white" />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plate" className="text-slate-300">Placa</Label>
                  <Input id="plate" name="plate" placeholder="ABC1234" className="bg-slate-800/50 border-slate-700 text-white uppercase" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="km" className="text-slate-300">Quilometragem</Label>
                  <Input id="km" name="km" type="number" placeholder="45000" className="bg-slate-800/50 border-slate-700 text-white" />
                </div>
             </div>

             <div className="space-y-2">
                <Label htmlFor="estimated_value" className="text-slate-300">Valor Estimado (FIPE/Mercado)</Label>
                <div className="relative">
                   <BadgeDollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                   <Input id="estimated_value" name="estimated_value" type="number" step="0.01" placeholder="85000.00" className="pl-10 bg-slate-800/50 border-slate-700 text-white" required />
                </div>
             </div>
          </CardContent>
        </Card>

        {/* Financing Data */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Financiamento & Dívida</CardTitle>
            <CardDescription className="text-slate-400">Informações sobre o contrato fiduciário.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <Label htmlFor="bank" className="text-slate-300">Banco / Financeira</Label>
                <div className="relative">
                   <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                   <Input id="bank" name="bank" placeholder="Ex: Santander, Banco do Brasil" className="pl-10 bg-slate-800/50 border-slate-700 text-white" required />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total_installments" className="text-slate-300">Total Parcelas</Label>
                  <Input id="total_installments" name="total_installments" type="number" placeholder="48" className="bg-slate-800/50 border-slate-700 text-white" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paid_installments" className="text-slate-300">Parcelas Pagas</Label>
                  <Input id="paid_installments" name="paid_installments" type="number" placeholder="24" className="bg-slate-800/50 border-slate-700 text-white" required />
                </div>
             </div>

             <div className="space-y-2">
                <Label htmlFor="installment_value" className="text-slate-300">Valor da Parcela</Label>
                <Input id="installment_value" name="installment_value" type="number" step="0.01" placeholder="1250.00" className="bg-slate-800/50 border-slate-700 text-white" required />
             </div>

             <div className="space-y-2">
                <Label htmlFor="outstanding_balance" className="text-slate-300">Saldo Quitação (Aprox.)</Label>
                <Input id="outstanding_balance" name="outstanding_balance" type="number" step="0.01" placeholder="32000.00" className="bg-slate-800/50 border-slate-700 text-white font-bold" required />
             </div>

             <div className="space-y-2 md:col-span-2">
                <Label htmlFor="overdue_installments" className="text-slate-300">Parcelas em Atraso</Label>
                <div className="relative">
                   <ListOrdered className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                   <Input id="overdue_installments" name="overdue_installments" type="number" placeholder="0" className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
                </div>
                <p className="text-[10px] text-amber-500 mt-1 uppercase font-bold tracking-tight">* Crucial para análise de busca e apreensão.</p>
             </div>
          </CardContent>
          <CardFooter className="bg-slate-800/20 p-6 flex justify-between items-center border-t border-slate-800">
             <div className="text-slate-400 text-xs">
                Certifique-se de que os dados de quitação estão atualizados.
             </div>
             <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-10 gap-2 shadow-lg shadow-blue-600/20" disabled={loading}>
                <Save className="w-4 h-4" />
                {loading ? "Salvando..." : "Finalizar Cadastro do Ativo"}
             </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
