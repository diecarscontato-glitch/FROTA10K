import React from "react";
import { getLeadById } from "@/app/actions/leads";
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Tag, 
  ChevronLeft, 
  Car, 
  Bike,
  Plus,
  ArrowRight,
  ClipboardList
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { EditLeadModal } from "@/components/edit-lead-modal";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = await getLeadById(params.id);

  if (!lead) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "CONTACTED":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "QUALIFIED":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "DISCARDED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const statusMap: Record<string, string> = {
    NEW: "Novo",
    CONTACTED: "Contatado",
    QUALIFIED: "Qualificado",
    DISCARDED: "Descartado",
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Link href="/leads" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para Leads
        </Link>
        <div className="flex gap-3">
          <EditLeadModal lead={lead} />
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Nova Tarefa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Lead Profile */}
        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="text-center pb-8 border-b border-slate-800">
              <div className="w-20 h-20 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto mb-4">
                <User className="w-10 h-10" />
              </div>
              <CardTitle className="text-2xl text-white">{lead.name}</CardTitle>
              <CardDescription>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border inline-block mt-2",
                  getStatusBadge(lead.status)
                )}>
                  {statusMap[lead.status] || lead.status}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Telefone</p>
                  <p className="font-semibold">{lead.phone || "Não informado"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Localização</p>
                  <p className="font-semibold">{lead.city ? `${lead.city}/${lead.state}` : "Não informada"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Origem</p>
                  <p className="font-semibold">{lead.source || "Geral"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">No Sistema Desde</p>
                  <p className="font-semibold">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Assets and Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white">Ativos Vinculados</CardTitle>
                <CardDescription>Veículos e motocicletas registrados para este lead.</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="border-slate-800 bg-slate-900 text-slate-400">
                <Plus className="w-4 h-4 mr-2" /> Vincular Novo
              </Button>
            </CardHeader>
            <CardContent>
              {lead.assets.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-600">
                  <Car className="w-10 h-10 mb-2 opacity-20" />
                  <p>Nenhum ativo vinculado a este lead.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lead.assets.map((asset: any) => (
                    <Link key={asset.id} href={`/assets/${asset.id}`}>
                      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 transition-all group cursor-pointer">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                            {asset.type === "CAR" ? <Car className="w-6 h-6" /> : <Bike className="w-6 h-6" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{asset.model}</h4>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{asset.brand} • {asset.year}</p>
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Status</span>
                            <span className="text-slate-300 font-medium">{asset.status}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Valor Est.</span>
                            <span className="text-emerald-500 font-bold">R$ {asset.estimated_value?.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center text-[10px] font-bold text-blue-500 uppercase tracking-widest pt-2 border-t border-slate-800 group-hover:gap-2 transition-all">
                          Ver Ficha Completa <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-purple-500" />
                Timeline de Interações
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-800 before:via-slate-800 before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 group-hover:border-blue-500 transition-colors z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                       <Plus className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-800 bg-slate-900/40">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Hoje</span>
                       <p className="text-sm text-slate-300">Lead entrou no sistema via **{lead.source || "Geral"}**.</p>
                    </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
