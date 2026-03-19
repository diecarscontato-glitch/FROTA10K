"use client";

import React, { useState } from "react";
import { inviteMember } from "@/app/actions/team";
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
import { UserPlus, X, Mail, User, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function InviteMemberModal() {
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
      email: formData.get("email") as string,
      role: formData.get("role") as string,
    };

    try {
      await inviteMember(data);
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Erro ao enviar convite");
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
        Convidar Membro
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <CardHeader className="relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 p-2 text-slate-500 hover:text-white transition-colors"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
              <CardTitle className="text-xl text-white">Convidar Colaborador</CardTitle>
              <CardDescription className="text-slate-400">
                O novo membro receberá um acesso para a plataforma.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                    Convite enviado com sucesso!
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">
                    Nome Completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="Ex: João Silva"
                      className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    E-mail Institucional
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="joao@frota10k.com.br"
                      className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-300">
                    Papel / Função
                  </Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
                    <select
                      id="role"
                      name="role"
                      className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-slate-800/50 border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      required
                    >
                      <option value="sdr">SDR / Captador</option>
                      <option value="analyst">Analista</option>
                      <option value="legal_ops">Jurídico / Operacional</option>
                      <option value="commercial">Comercial</option>
                      <option value="viewer">Visualizador</option>
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
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  disabled={loading || success}
                >
                  {loading ? "Enviando..." : "Enviar Convite"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
