import React from "react";
import { getFinancialSummary } from "@/app/actions/financial";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Car,
  Banknote,
  Shield,
  BadgeDollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AddRecordForm } from "@/components/add-record-form";

export const dynamic = "force-dynamic";

const CATEGORY_CONFIG: Record<string, { label: string; description: string; icon: any; color: string; borderColor: string; bgColor: string }> = {
  OPERACAO: {
    label: "Caixa Operacional",
    description: "Despesas gerais, folha, aluguel, marketing",
    icon: Wallet,
    color: "text-blue-500",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/5",
  },
  AQUISICAO: {
    label: "Caixa de Aquisição",
    description: "Entrada de ativos, negociação, quitação parcial",
    icon: Banknote,
    color: "text-amber-500",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/5",
  },
  FROTA: {
    label: "Caixa da Frota",
    description: "Receita de aluguel, manutenção, seguro, IPVA",
    icon: Car,
    color: "text-emerald-500",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-500/5",
  },
  QUITACAO: {
    label: "Caixa de Contingência",
    description: "Reserva para quitações, multas, imprevistos",
    icon: Shield,
    color: "text-violet-500",
    borderColor: "border-violet-500/30",
    bgColor: "bg-violet-500/5",
  },
};

export default async function FinancialsPage() {
  const { summary, recentRecords } = await getFinancialSummary();

  const totalBalance = Object.values(summary).reduce((acc, cat) => acc + cat.balance, 0);
  const totalIncome = Object.values(summary).reduce((acc, cat) => acc + cat.income, 0);
  const totalExpense = Object.values(summary).reduce((acc, cat) => acc + cat.expense, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-emerald-600/10 rounded-lg border border-emerald-500/20">
            <BadgeDollarSign className="w-7 h-7 text-emerald-500" />
          </div>
          Hub Financeiro
        </h1>
        <p className="text-slate-400 mt-2">Controle de caixa por fundo, receitas e despesas da operação.</p>
      </div>

      {/* Grand Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="pt-6">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Saldo Total</p>
            <p className={cn("text-3xl font-black font-mono", totalBalance >= 0 ? "text-emerald-400" : "text-red-400")}>
              R$ {totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Total Entradas</p>
              <p className="text-xl font-bold text-emerald-400 font-mono">
                R$ {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-red-500/10">
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Total Saídas</p>
              <p className="text-xl font-bold text-red-400 font-mono">
                R$ {totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4 Caixas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          const cat = summary[key];
          const Icon = config.icon;
          return (
            <Card key={key} className={cn("bg-slate-900/50 border", config.borderColor)}>
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <div className={cn("p-3 rounded-xl", config.bgColor)}>
                  <Icon className={cn("w-6 h-6", config.color)} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg text-white">{config.label}</CardTitle>
                  <p className="text-[11px] text-slate-500 mt-0.5">{config.description}</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-xl font-bold font-mono", cat.balance >= 0 ? "text-emerald-400" : "text-red-400")}>
                    R$ {cat.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 mb-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs text-slate-400">Entradas:</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      R$ {cat.income.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-xs text-slate-400">Saídas:</span>
                    <span className="text-xs font-bold text-red-400 font-mono">
                      R$ {cat.expense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                {cat.records.length > 0 ? (
                  <div className="space-y-2">
                    {cat.records.slice(0, 5).map((record) => (
                      <div key={record.id} className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2">
                          {record.type === "INCOME" ? (
                            <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-500" />
                          )}
                          <span className="text-xs text-slate-300 truncate max-w-[200px]">{record.description}</span>
                        </div>
                        <span className={cn("text-xs font-mono font-bold", record.type === "INCOME" ? "text-emerald-400" : "text-red-400")}>
                          {record.type === "INCOME" ? "+" : "-"} R$ {record.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 italic text-center py-4">Nenhum lançamento neste caixa.</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Record Form */}
      <AddRecordForm />

      {/* Recent Activity */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Últimos Lançamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {recentRecords.length > 0 ? (
            <div className="space-y-3">
              {recentRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      record.type === "INCOME" ? "bg-emerald-500/10" : "bg-red-500/10"
                    )}>
                      {record.type === "INCOME" ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{record.description}</p>
                      <p className="text-[10px] text-slate-500 uppercase">
                        {CATEGORY_CONFIG[record.category]?.label || record.category} • {new Date(record.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <span className={cn("text-sm font-bold font-mono", record.type === "INCOME" ? "text-emerald-400" : "text-red-400")}>
                    {record.type === "INCOME" ? "+" : "-"} R$ {record.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Wallet className="w-8 h-8 mx-auto mb-3 text-slate-600" />
              <p>Nenhum lançamento financeiro registrado.</p>
              <p className="text-xs mt-1">Use o formulário acima para adicionar receitas e despesas.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
