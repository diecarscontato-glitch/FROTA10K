import React from "react";
import { getAssetById } from "@/app/actions/assets";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRightLeft, 
  TrendingUp, 
  Share2, 
  Home,
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { DestinoSelector } from "@/components/destino-selector";

export default async function DestinoPage({ params }: { params: { id: string } }) {
  const asset = await getAssetById(params.id);

  if (!asset) return <div>Ativo não encontrado.</div>;

  const fipe = asset.fipe_value || 0;
  
  const options = [
    {
      id: "AGIO_SALE",
      title: "Venda de Ágio",
      subtitle: "Compra até 30% da FIPE e saída alvo em 50%",
      benefits: ["Alta Margem", "Fluxo de Caixa Rápido"],
      metrics: [
        `Compra: R$ ${(fipe * 0.3).toLocaleString('pt-BR')}`, 
        `Alvo: R$ ${(fipe * 0.5).toLocaleString('pt-BR')}`
      ],
      color: "emerald",
      icon: TrendingUp
    },
    {
      id: "DIRECT_REPASSE",
      title: "Repasse Direto",
      subtitle: "Giro rápido sem imobilizar capital próprio",
      benefits: ["Risco Zero", "Velocidade Máxima"],
      metrics: [
        `Repasse: R$ ${(fipe * 0.25).toLocaleString('pt-BR')}`, 
        `Caixa: R$ 0`
      ],
      color: "blue",
      icon: Share2,
      recommended: true
    },
    {
      id: "RENTAL_FLEET",
      title: "Frota de Locação",
      subtitle: "Absorção para geração de receita recorrente",
      benefits: ["Recorrência", "Patrimonial"],
      metrics: [
        `Receita: R$ ${(fipe * 0.05).toLocaleString('pt-BR')}/m`, 
        `Apto: ${fipe > 0 ? 'Sim' : 'Avaliar'}`
      ],
      color: "purple",
      icon: Home
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-500 text-sm font-bold uppercase tracking-widest mb-1">
            <ArrowRightLeft className="w-4 h-4" />
            Comitê de Destino
          </div>
          <h1 className="text-3xl font-bold text-white">
            Decisão de Destino: {asset.brand} {asset.model}
          </h1>
          <p className="text-slate-400 mt-1">
            Selecione o melhor caminho estratégico para este ativo com base no laudo técnico.
          </p>
        </div>
        <Link href={`/assets/${asset.id}`}>
          <Button variant="ghost" className="text-slate-400 hover:text-white">
            Voltar para Ficha
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <Card 
              key={option.id} 
              className={cn(
                "relative bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all cursor-pointer group",
                option.recommended && "ring-2 ring-blue-500/50 border-blue-500/30"
              )}
            >
              {option.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  Recomendado
                </div>
              )}
              <CardHeader>
                <div className={`p-3 bg-${option.color}-500/10 rounded-xl w-fit mb-4`}>
                  <Icon className={`w-6 h-6 text-${option.color}-500`} />
                </div>
                <CardTitle className="text-white">{option.title}</CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  {option.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {option.metrics.map((m, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-500">{m.split(":")[0]}</span>
                      <span className="text-slate-200 font-bold">{m.split(":")[1]}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-800 space-y-2">
                   {option.benefits.map((b, i) => (
                     <div key={i} className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                       <CheckCircle2 className={`w-3 h-3 text-${option.color}-500`} />
                       {b}
                     </div>
                   ))}
                </div>
              </CardContent>
              <div className="p-4 pt-0">
                <DestinoSelector 
                  assetId={asset.id} 
                  optionId={option.id} 
                  recommended={option.recommended} 
                />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-lg">Inteligência do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl flex gap-4">
              <AlertCircle className="w-6 h-6 text-blue-400 shrink-0" />
              <div className="space-y-2">
                <p className="text-sm text-slate-300 leading-relaxed">
                  O sistema sugere <strong>Repasse Direto</strong> porque o ativo apresenta score estrutural excelente (9/10), alta liquidez no Marketplace interno e o capital atual da conta está direcionado para expansão de frota pesada.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-lg">Histórico de Decisões Semelhantes</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-3">
               {[
                 { model: "Onix 2020", decision: "Repasse", margin: "R$ 8.400" },
                 { model: "HB20 2021", decision: "Repasse", margin: "R$ 7.900" },
               ].map((h, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-800/50 bg-slate-800/20">
                    <span className="text-sm text-slate-400">{h.model}</span>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-blue-400 border-blue-400/30 font-bold">{h.decision}</Badge>
                      <span className="text-sm font-bold text-emerald-400">+{h.margin}</span>
                    </div>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
