"use client";

import React from "react";
import { updateTaskStatus } from "@/app/actions/tasks";
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  MoreHorizontal,
  ClipboardList,
  Tag,
  Link2,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TaskListProps {
  tasks: any[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
         <ClipboardList className="w-12 h-12 mb-4 opacity-20" />
         <p className="text-lg font-medium">Nenhuma tarefa agendada.</p>
         <p className="text-sm">Tudo em dia por aqui! Use o botão "+" para criar um lembrete.</p>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "MEDIUM": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "LOW": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
     const newStatus = currentStatus === "PENDING" ? "COMPLETED" : "PENDING";
     try {
        await updateTaskStatus(taskId, newStatus as any);
     } catch (err) {
        console.error("Erro ao atualizar status", err);
     }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className={cn(
          "bg-slate-900/40 border-slate-800 hover:border-slate-700 transition-all group overflow-hidden",
          task.status === "COMPLETED" && "opacity-60"
        )}>
          <CardContent className="p-0">
             <div className="p-6 flex items-start gap-4">
                <button 
                  onClick={() => handleToggleStatus(task.id, task.status)}
                  className={cn(
                    "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    task.status === "COMPLETED" 
                      ? "bg-emerald-500 border-emerald-500 text-white" 
                      : "border-slate-700 hover:border-emerald-500 text-transparent"
                  )}
                >
                   <CheckCircle2 className="w-4 h-4" />
                </button>
                
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-3 mb-1">
                      <h3 className={cn(
                        "text-lg font-bold text-white transition-all truncate",
                        task.status === "COMPLETED" && "line-through text-slate-500"
                      )}>
                        {task.title}
                      </h3>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                        getPriorityColor(task.priority)
                      )}>
                        {task.priority === 'HIGH' ? 'Urgente' : task.priority === 'MEDIUM' ? 'Normal' : 'Baixa'}
                      </span>
                   </div>
                   
                   {task.description && (
                     <p className="text-sm text-slate-400 mb-4 line-clamp-2">{task.description}</p>
                   )}
                   
                   <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                         <Calendar className="w-3.5 h-3.5" />
                         {task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR') : 'Sem data'}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                         <User className="w-3.5 h-3.5" />
                         {task.user.name}
                      </div>
                      
                      {(task.asset || task.lead) && (
                        <div className="flex items-center gap-1.5 text-[11px] text-blue-400 font-bold uppercase tracking-tight bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10">
                           <Link2 className="w-3.5 h-3.5" />
                           {task.asset ? task.asset.model : task.lead.name}
                        </div>
                      )}
                   </div>
                </div>
                
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
                   <MoreHorizontal className="w-4 h-4" />
                </Button>
             </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
