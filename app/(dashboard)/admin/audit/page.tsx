import React from "react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { 
  Shield, 
  Search, 
  Filter, 
  History, 
  User as UserIcon, 
  Activity,
  AlertTriangle,
  Info,
  ChevronRight
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function AuditLogPage() {
  const session = await auth();
  const userData = session?.user as { accountId: string } | undefined;

  if (!userData?.accountId) {
    return <div>Não autorizado</div>;
  }

  const logs = await db.auditLog.findMany({
    where: { account_id: userData.accountId },
    orderBy: { created_at: "desc" },
    include: {
      actor: true
    },
    take: 50
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "WARNING": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      default: return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return AlertTriangle;
      case "WARNING": return AlertTriangle;
      default: return Info;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            Audit Logs
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Rastreabilidade e histórico completo de todas as ações importantes no sistema.
          </p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="border-slate-800 text-slate-400 font-bold hover:bg-slate-800 gap-2">
              <Filter className="w-4 h-4" />
              Filtrar
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2">
              <Search className="w-4 h-4" />
              Exportar
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card className="bg-slate-900/40 border-slate-800 p-4">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Ações (24h)</p>
            <p className="text-2xl font-black text-white">{logs.length}</p>
         </Card>
         <Card className="bg-slate-900/40 border-slate-800 p-4">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Carga Horária Monitorada</p>
            <p className="text-2xl font-black text-white">24/7</p>
         </Card>
         <Card className="bg-slate-900/40 border-slate-800 p-4">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Nível de Compliance</p>
            <p className="text-2xl font-black text-emerald-500">EXCELENTE</p>
         </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800 overflow-hidden">
        <div className="bg-slate-800/30 border-b border-slate-800 px-6 py-4 flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-widest">
           <div className="w-[180px]">Data/Hora</div>
           <div className="flex-1 px-4">Usuário / Ação</div>
           <div className="w-[120px] text-center">Entidade</div>
           <div className="w-[100px] text-right">Severidade</div>
        </div>
        <CardContent className="p-0">
          {logs.length === 0 ? (
            <div className="p-12 text-center text-slate-600">Nenhum log registrado ainda.</div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {logs.map((log) => {
                const SeverityIcon = getSeverityIcon(log.severity);
                return (
                  <div key={log.id} className="px-6 py-4 flex items-center text-sm hover:bg-slate-800/20 transition-colors group">
                    <div className="w-[180px] text-slate-500 font-mono text-xs">
                       {new Date(log.created_at).toLocaleString('pt-BR')}
                    </div>
                    
                    <div className="flex-1 px-4 flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                          <UserIcon className="w-4 h-4 text-slate-400" />
                       </div>
                       <div>
                          <p className="text-white font-bold">{log.actor?.name || "Sistema"}</p>
                          <p className="text-xs text-slate-500 font-medium">{log.summary || log.event_type}</p>
                       </div>
                    </div>

                    <div className="w-[120px] text-center">
                       <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-black text-slate-400 border border-slate-700">
                          {log.target_entity_type || "N/A"}
                       </span>
                    </div>

                    <div className="w-[100px] text-right">
                       <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-black uppercase ${getSeverityColor(log.severity)}`}>
                          <SeverityIcon className="w-3 h-3" />
                          {log.severity}
                       </div>
                    </div>

                    <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-white">
                          <ChevronRight className="w-4 h-4" />
                       </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
