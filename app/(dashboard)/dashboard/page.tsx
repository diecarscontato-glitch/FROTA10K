import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  Car,
  ClipboardCheck,
  Megaphone,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Activity,
} from "lucide-react";
import { getDashboardMetrics } from "@/app/actions/dashboard";
import { getOperationalTimeline } from "@/app/actions/timeline";
import { OperationalTimeline } from "@/components/operational-timeline";

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();
  const timelineEvents = await getOperationalTimeline();

  const stats = [
    {
      title: "Leads Recebidos",
      value: metrics.leadsCount.toString(),
      description: "Novos leads ativos",
      icon: Users,
      trend: "neutral",
      color: "text-blue-500",
    },
    {
      title: "Ativos em Triagem",
      value: metrics.assetsScreeningCount.toString(),
      description: "Pendentes de análise",
      icon: Car,
      trend: "neutral",
      color: "text-emerald-500",
    },
    {
      title: "Comitê Pendente",
      value: metrics.committeeCount.toString(),
      description: "Aguardando decisão",
      icon: ClipboardCheck,
      trend: "neutral",
      color: "text-amber-500",
    },
    {
      title: "Publicações Ativas",
      value: metrics.publicationsCount.toString(),
      description: "No Marketplace",
      icon: Megaphone,
      trend: "neutral",
      color: "text-indigo-500",
    },
  ];

// 

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white">Bem-vindo ao Centro de Comando</h1>
        <p className="text-slate-400 mt-1">Aqui está o que está acontecendo na sua operação hoje.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" && <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
                  {stat.trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-500" />}
                  {stat.trend === "neutral" && <Clock className="w-3 h-3 text-slate-500" />}
                  <p className="text-xs text-slate-500 font-medium">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / Agenda */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Ativos Recentes</CardTitle>
            <CardDescription className="text-slate-500">Últimos veículos cadastrados na plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.recentAssets.length === 0 ? (
                <p className="text-sm text-slate-500 italic">Nenhum ativo recente encontrado.</p>
              ) : (
                metrics.recentAssets.map((asset, i) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                        {asset.brand?.slice(0, 2).toUpperCase() || "VE"}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {asset.brand} {asset.model} - {asset.year}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">Placa: {asset.plate || "N/A"} • Status: {asset.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                        {asset.status}
                      </span>
                      <button className="text-slate-500 hover:text-white transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-6 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Ver todos os ativos
            </button>
          </CardContent>
        </Card>

        {/* Operational Timeline */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl text-white">Atividade Recente</CardTitle>
              <CardDescription className="text-slate-500">Eventos de negócio em tempo real.</CardDescription>
            </div>
            <Activity className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <OperationalTimeline events={timelineEvents} />
            <button className="w-full mt-6 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Ver histórico completo
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
