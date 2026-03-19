"use client";

import React, { useState } from "react";
import { createLead } from "@/app/actions/leads";
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
  UserPlus, X, Phone, User, Globe, MapPin, 
  Car, Briefcase, Calendar, Hash, Gauge, 
  Key, Book, AlertTriangle, Landmark, 
  ListOrdered, Receipt, BadgeDollarSign, Timer, 
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

export function LeadIntakeModal() {
  const [isOpen, setIsOpen] = useState(false);
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
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      profession: formData.get("profession") as string,
      source: formData.get("source") as string,
      
      // Vehicle Data
      vehicle_model: formData.get("vehicle_model") as string,
      vehicle_year: parseInt(formData.get("vehicle_year") as string) || undefined,
      vehicle_plate: formData.get("vehicle_plate") as string,
      has_reserve_key: formData.get("has_reserve_key") === "on",
      has_manual: formData.get("has_manual") === "on",
      auction_history: formData.get("auction_history") as string,
      damages: formData.get("damages") as string,
      
      // Financial Data
      finance_bank: formData.get("finance_bank") as string,
      finance_installment_value: parseFloat(formData.get("finance_installment_value") as string) || undefined,
      finance_total_installments: parseInt(formData.get("finance_total_installments") as string) || undefined,
      finance_paid_installments: parseInt(formData.get("finance_paid_installments") as string) || undefined,
      finance_remaining_installments: parseInt(formData.get("finance_remaining_installments") as string) || undefined,
      finance_overdue_installments: parseInt(formData.get("finance_overdue_installments") as string) || undefined,
      finance_outstanding_balance: parseFloat(formData.get("finance_outstanding_balance") as string) || undefined,
      owner_expectation: parseFloat(formData.get("owner_expectation") as string) || undefined,
      urgency: formData.get("urgency") as string,
    };

    try {
      await createLead(data);
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Erro ao registrar lead");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
      >
        <UserPlus className="w-4 h-4" />
        Novo Lead
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <Card className="w-full max-w-2xl bg-slate-900 border-slate-800 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <CardHeader className="relative border-b border-slate-800 pb-6">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 p-2 text-slate-500 hover:text-white transition-colors"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
              <CardTitle className="text-xl text-white">Captação de Novo Ativado</CardTitle>
              <CardDescription className="text-slate-400">
                Inicie o registro do cliente e do ativo para triagem.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 pt-6 max-h-[70vh] overflow-y-auto">
                {error && (
                  <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                    Lead registrado com sucesso! Atualizando fila...
                  </div>
                )}
                
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                    <TabsTrigger value="personal" className="text-xs">Dados Pessoais</TabsTrigger>
                    <TabsTrigger value="vehicle" className="text-xs">O Veículo</TabsTrigger>
                    <TabsTrigger value="financial" className="text-xs">Financeiro</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="name" className="text-slate-300">Nome do Proponente</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <Input
                            id="name"
                            name="name"
                            placeholder="Nome completo do cliente"
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-300">WhatsApp / Celular</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="(00) 00000-0000"
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="profession" className="text-slate-300">Profissão</Label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <Input
                            id="profession"
                            name="profession"
                            placeholder="Ex: Motorista, Vendedor"
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-slate-300">Cidade</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <Input
                            id="city"
                            name="city"
                            placeholder="São Paulo"
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-slate-300">UF</Label>
                        <Input
                          id="state"
                          name="state"
                          placeholder="SP"
                          maxLength={2}
                          className="bg-slate-800/50 border-slate-700 text-white uppercase"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="source" className="text-slate-300">Canal de Origem</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
                          <select
                            id="source"
                            name="source"
                            className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-slate-800/50 border-slate-700 text-white text-sm appearance-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="Manual">Manual</option>
                            <option value="Indicação">Indicação</option>
                            <option value="Tráfego Pago">Tráfego Pago</option>
                            <option value="Marketplace">Marketplace</option>
                            <option value="OLX">OLX</option>
                            <option value="Facebook">Facebook Marketplace</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="vehicle" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="vehicle_model" className="text-slate-300 text-xs uppercase font-bold tracking-tight">Modelo do Veículo</Label>
                        <div className="relative">
                          <Car className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <Input
                            id="vehicle_model"
                            name="vehicle_model"
                            placeholder="Ex: Fiat Mobi Like 1.0"
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vehicle_year" className="text-slate-300 text-xs uppercase font-bold tracking-tight">Ano</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <Input
                            id="vehicle_year"
                            name="vehicle_year"
                            type="number"
                            placeholder="2023"
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vehicle_plate" className="text-slate-300 text-xs uppercase font-bold tracking-tight">Placa</Label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <Input
                            id="vehicle_plate"
                            name="vehicle_plate"
                            placeholder="ABC1D23"
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white uppercase"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 md:col-span-2 py-2 px-3 rounded-lg bg-slate-800/30 border border-slate-800">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="has_reserve_key" name="has_reserve_key" />
                          <Label htmlFor="has_reserve_key" className="text-xs text-slate-300 flex items-center gap-1">
                            <Key className="w-3 h-3" /> Possui chave reserva?
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="has_manual" name="has_manual" />
                          <Label htmlFor="has_manual" className="text-xs text-slate-300 flex items-center gap-1">
                            <Book className="w-3 h-3" /> Possui manual?
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="auction_history" className="text-slate-300 text-xs uppercase font-bold tracking-tight">Passagem por Leilão?</Label>
                        <select
                          id="auction_history"
                          name="auction_history"
                          className="w-full h-10 px-3 rounded-md border border-input bg-slate-800/50 border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="NÃO">Não</option>
                          <option value="SIM - COM DESVALORIZAÇÃO">Sim - Com desvalorização</option>
                          <option value="SIM - ROUBO/FURTO">Sim - Roubo/Furto</option>
                          <option value="ESTRUTURAL">Sim - Estrutural</option>
                          <option value="NÃO INFORMADO">Não informado</option>
                        </select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="damages" className="text-slate-300 text-xs uppercase font-bold tracking-tight">Avarias / Observações do Carro</Label>
                        <textarea
                          id="damages"
                          name="damages"
                          rows={2}
                          placeholder="Arranhões, amassados, pendências mecânicas..."
                          className="w-full p-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="financial" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="finance_bank" className="text-slate-300 text-xs uppercase font-bold tracking-tight">Banco / Financeira</Label>
                        <div className="relative">
                          <Landmark className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <Input
                            id="finance_bank"
                            name="finance_bank"
                            placeholder="Ex: Santander, PAN, BV"
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="finance_installment_value" className="text-slate-300 text-xs uppercase font-bold tracking-tight">Valor da Parcela</Label>
                        <div className="relative">
                          <Receipt className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <Input
                            id="finance_installment_value"
                            name="finance_installment_value"
                            type="number"
                            step="0.01"
                            placeholder="R$ 1.200,00"
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="finance_remaining_installments" className="text-slate-300 text-xs uppercase font-bold tracking-tight">Parcelas Restantes</Label>
                        <div className="relative">
                          <ListOrdered className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <Input
                            id="finance_remaining_installments"
                            name="finance_remaining_installments"
                            type="number"
                            placeholder="Ex: 36"
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="finance_overdue_installments" className="text-slate-300 text-xs uppercase font-bold tracking-tight">Parcelas em Atraso</Label>
                        <div className="relative">
                          <AlertTriangle className="absolute left-3 top-3 h-4 w-4 text-amber-500" />
                          <Input
                            id="finance_overdue_installments"
                            name="finance_overdue_installments"
                            type="number"
                            placeholder="Ex: 2"
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="owner_expectation" className="text-slate-300 text-xs uppercase font-bold tracking-tight">Desejo do Proprietário</Label>
                        <div className="relative">
                          <BadgeDollarSign className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                          <Input
                            id="owner_expectation"
                            name="owner_expectation"
                            type="number"
                            step="0.01"
                            placeholder="Quanto ele quer?"
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                         <Label htmlFor="urgency" className="text-slate-300 text-xs uppercase font-bold tracking-tight">Nível de Urgência</Label>
                         <div className="grid grid-cols-3 gap-2">
                            {['BAIXA', 'MÉDIA', 'ALTA'].map((u) => (
                              <label key={u} className="cursor-pointer">
                                <input type="radio" name="urgency" value={u} className="hidden peer" defaultChecked={u === 'MÉDIA'} />
                                <div className="p-2 text-center text-[10px] font-bold border border-slate-700 rounded bg-slate-800/50 text-slate-500 peer-checked:bg-blue-600/20 peer-checked:border-blue-500 peer-checked:text-blue-400">
                                   {u}
                                </div>
                              </label>
                            ))}
                         </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 border-t border-slate-800 pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-11"
                  disabled={loading || success}
                >
                  {loading ? "Salvando..." : "Abrir Oportunidade"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
