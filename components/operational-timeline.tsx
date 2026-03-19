"use client";

import React from "react";
import { 
  Users, 
  Target, 
  MessageSquare, 
  Bell, 
  Calendar,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import { TimelineEvent } from "@/app/actions/timeline";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function OperationalTimeline({ events }: { events: TimelineEvent[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "LEAD": return <Users className="w-4 h-4 text-blue-500" />;
      case "INTEREST": return <Target className="w-4 h-4 text-purple-500" />;
      case "NEGOTIATION": return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      default: return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "LEAD": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "INTEREST": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "NEGOTIATION": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
      {events.map((event, index) => (
        <div key={event.id} className="relative pl-12 group">
          {/* Dot/Icon */}
          <div className={cn(
            "absolute left-0 top-0 w-10 h-10 rounded-xl border flex items-center justify-center z-10 transition-transform group-hover:scale-110",
            getBadgeColor(event.type),
            "bg-slate-900" 
          )}>
            {getIcon(event.type)}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
               <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                 {event.title}
                 <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-widest">
                    {event.type}
                 </span>
               </h4>
               <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3" />
                  {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true, locale: ptBR })}
               </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-[90%]">
              {event.description}
            </p>
            
            <div className="pt-2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1 hover:underline">
                  Ver Detalhes <ArrowUpRight className="w-3 h-3" />
               </button>
               <div className="w-1 h-1 rounded-full bg-slate-700" />
               <button className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                  Ignorar
               </button>
            </div>
          </div>
        </div>
      ))}

      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
           <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-slate-600" />
           </div>
           <p className="text-sm text-slate-500">Nenhuma atividade recente encontrada.</p>
        </div>
      )}
    </div>
  );
}
