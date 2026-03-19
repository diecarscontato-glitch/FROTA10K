"use client";

import React, { useState } from "react";
import { createTask } from "@/app/actions/tasks";
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
import { X, Calendar, User, AlignLeft, Flag, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateTaskModalProps {
  members: any[];
  assets: any[];
  leads: any[];
}

export function CreateTaskModal({ members, assets, leads }: CreateTaskModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      due_date: formData.get("due_date") ? new Date(formData.get("due_date") as string) : undefined,
      priority: formData.get("priority") as string,
      user_id: formData.get("user_id") as string,
      asset_id: formData.get("asset_id") as string || undefined,
      lead_id: formData.get("lead_id") as string || undefined,
    };

    try {
      await createTask(data);
      setIsOpen(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Erro ao criar tarefa");
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
        <Plus className="w-4 h-4" />
        Nova Tarefa
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <Card className="w-full max-w-lg bg-slate-900 border-slate-800 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <CardHeader className="relative border-b border-slate-800 pb-6">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 p-2 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <CardTitle className="text-xl text-white">Novo Compromisso</CardTitle>
              <CardDescription className="text-slate-400">
                Agende uma atividade para você ou para sua equipe.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6 max-h-[70vh] overflow-y-auto">
                {error && (
                  <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-300">O que precisa ser feito?</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Ex: Ligar para proponente Honda Civic"
                    className="bg-slate-800/50 border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300">Descrição / Detalhes</Label>
                  <div className="relative">
                    <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      placeholder="Instruções adicionais..."
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label htmlFor="due_date" className="text-slate-300">Data Limite</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input
                          id="due_date"
                          name="due_date"
                          type="date"
                          className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="priority" className="text-slate-300">Prioridade</Label>
                      <div className="relative">
                        <Flag className="absolute left-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
                        <select
                          id="priority"
                          name="priority"
                          className="w-full h-11 pl-10 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm focus:ring-2 focus:ring-blue-500 appearance-none"
                          required
                        >
                          <option value="LOW">Baixa</option>
                          <option value="MEDIUM" selected>Média</option>
                          <option value="HIGH">Urgente</option>
                        </select>
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_id" className="text-slate-300">Responsável</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
                    <select
                      id="user_id"
                      name="user_id"
                      className="w-full h-11 pl-10 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm focus:ring-2 focus:ring-blue-500 appearance-none"
                      required
                    >
                      <option value="">Selecione um membro...</option>
                      {members.map(member => (
                        <option key={member.id} value={member.id}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label htmlFor="asset_id" className="text-slate-300">Vincular Ativo (Opcional)</Label>
                      <select
                        id="asset_id"
                        name="asset_id"
                        className="w-full h-11 px-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm focus:ring-2 focus:ring-blue-500 appearance-none"
                      >
                        <option value="">Nenhum ativo</option>
                        {assets.map(asset => (
                          <option key={asset.id} value={asset.id}>{asset.model} ({asset.plate})</option>
                        ))}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="lead_id" className="text-slate-300">Vincular Lead (Opcional)</Label>
                      <select
                        id="lead_id"
                        name="lead_id"
                        className="w-full h-11 px-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm focus:ring-2 focus:ring-blue-500 appearance-none"
                      >
                        <option value="">Nenhum lead</option>
                        {leads.map(lead => (
                          <option key={lead.id} value={lead.id}>{lead.name}</option>
                        ))}
                      </select>
                   </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 border-t border-slate-800 pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Descartar
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-11"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Criar Tarefa"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
