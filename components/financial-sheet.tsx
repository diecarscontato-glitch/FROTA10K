import React from "react";
import { getAssetFinancials } from "@/app/actions/financial";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, BadgeDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialSheetProps {
  assetId: string;
}

export async function FinancialSheet({ assetId }: FinancialSheetProps) {
  const data = await getAssetFinancials(assetId);

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <BadgeDollarSign className="w-5 h-5 text-emerald-500" />
          Ficha Financeira do Ativo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-center">
            <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Receitas</p>
            <p className="text-sm font-bold text-emerald-400 font-mono">
              R$ {data.income.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-center">
            <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Despesas</p>
            <p className="text-sm font-bold text-red-400 font-mono">
              R$ {data.expense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className={cn("p-3 rounded-lg border text-center", data.net >= 0 ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20")}>
            <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Resultado</p>
            <p className={cn("text-sm font-bold font-mono", data.net >= 0 ? "text-emerald-400" : "text-red-400")}>
              R$ {data.net.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {data.records.length > 0 ? (
          <div className="space-y-2 pt-2">
            {data.records.slice(0, 8).map((record) => (
              <div key={record.id} className="flex items-center justify-between py-1.5 border-b border-slate-800/50 last:border-0">
                <div className="flex items-center gap-2">
                  {record.type === "INCOME" ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-500" />
                  )}
                  <span className="text-xs text-slate-300 truncate max-w-[180px]">{record.description}</span>
                </div>
                <span className={cn("text-xs font-mono font-bold", record.type === "INCOME" ? "text-emerald-400" : "text-red-400")}>
                  {record.type === "INCOME" ? "+" : "-"} R$ {record.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-600 italic text-center py-4">Nenhum lançamento para este ativo.</p>
        )}
      </CardContent>
    </Card>
  );
}
