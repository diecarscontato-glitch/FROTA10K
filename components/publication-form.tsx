"use client";

import React, { useState } from "react";
import { publishAsset } from "@/app/actions/marketplace";
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
import { Megaphone, X, BadgeDollarSign, AlignLeft, Info, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublicationFormProps {
  asset: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PublicationForm({ asset, onSuccess, onCancel }: PublicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      asset_id: asset.id,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      asking_price: parseFloat(formData.get("asking_price") as string),
      highlight_details: formData.get("highlight_details") as string,
      visibility: formData.get("visibility") as any,
    };

    try {
      await publishAsset(data);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Erro ao publicar anúncio");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
      <CardHeader className="relative border-b border-slate-800 pb-6">
        <CardTitle className="text-xl text-white flex items-center gap-2">
           <Megaphone className="w-5 h-5 text-emerald-500" />
           Configurar Publicação no Marketplace
        </CardTitle>
        <CardDescription className="text-slate-400">
           Transforme este ativo em uma oportunidade de negócio para a rede.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300">Título da Oportunidade</Label>
            <Input
              id="title"
              name="title"
              placeholder={`Ex: Repasse Honda Civic G10 - ${asset.year}`}
              defaultValue={`${asset.brand} ${asset.model} ${asset.year} - Oportunidade`}
              className="bg-slate-800/50 border-slate-700 text-white font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="asking_price" className="text-slate-300">Valor Unitário / Ágio (R$)</Label>
                <div className="relative">
                   <BadgeDollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                   <Input
                     id="asking_price"
                     name="asking_price"
                     type="number"
                     step="0.01"
                     placeholder="0.00"
                     className="pl-10 bg-slate-800/50 border-slate-700 text-white font-bold"
                     required
                   />
                </div>
             </div>
             <div className="space-y-2">
                <Label htmlFor="visibility" className="text-slate-300">Alcance da Publicação</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
                  <select
                    id="visibility"
                    name="visibility"
                    className="w-full h-11 pl-10 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm focus:ring-2 focus:ring-blue-500 appearance-none"
                    required
                  >
                    <option value="PUBLIC">Marketplace Aberto (Geral)</option>
                    <option value="PRIVATE">Somente Minha Rede</option>
                  </select>
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">Descrição Comercial</Label>
            <div className="relative">
               <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
               <textarea
                 id="description"
                 name="description"
                 rows={4}
                 placeholder="Destaque as qualidades e o estado do ativo..."
                 className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm focus:ring-2 focus:ring-blue-500"
                 required
               />
            </div>
          </div>

          <div className="space-y-2">
             <Label htmlFor="highlight_details" className="text-slate-300">Destaques (Tags/Bullets)</Label>
             <div className="relative">
                <Info className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  id="highlight_details"
                  name="highlight_details"
                  placeholder="Ex: Único dono, IPVA pago, Pneus novos"
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                />
             </div>
          </div>

          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-200/80 leading-relaxed">
             Ao publicar, outros operadores do **FROTA10K** poderão ver este ativo e iniciar negociações. Certifique-se de que as informações de financiamento estão atualizadas.
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
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 h-11 shadow-lg shadow-emerald-600/20"
            disabled={loading}
          >
            {loading ? "Publicando..." : "Confirmar Publicação"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
