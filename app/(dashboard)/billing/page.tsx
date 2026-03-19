import React from "react";
import { 
  CreditCard, 
  ShieldCheck, 
  Settings2, 
  BarChart4, 
  Zap,
  ArrowUpRight,
  ExternalLink,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBillingInfo } from "@/app/actions/billing";
import { PaymentForm } from "@/components/payment-form";

export default async function BillingPage() {
  const billingInfo = await getBillingInfo();
  const paymentConfig = (billingInfo?.payment_config as any) || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-blue-500" />
            Faturamento e Pagamentos
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Gerencie seu plano e configure suas integrações de recebimento.
          </p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="border-slate-800 text-slate-400 font-bold hover:bg-slate-800">
              Histórico
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
              Upgrade de Plano
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
               <Zap className="w-5 h-5 text-yellow-500" />
               Meu Plano Atual
            </CardTitle>
            <CardDescription className="text-slate-500">
               Detalhes da sua subscrição ativa no FROTA10K.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-blue-600/5 rounded-3xl border border-blue-500/10">
               <div>
                  <p className="text-xs text-blue-400 font-black uppercase tracking-widest mb-1">Status</p>
                  <p className="text-2xl font-black text-white">{billingInfo?.plan_type || "STARTER"}</p>
               </div>
               <div className="text-right">
                  <p className="text-xs text-blue-400 font-black uppercase tracking-widest mb-1">Próxima Cobrança</p>
                  <p className="text-lg font-bold text-white">
                    {billingInfo?.next_billing_date ? new Date(billingInfo.next_billing_date).toLocaleDateString() : "---"}
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
               {[
                 { label: "Usuários", value: "Até 5", current: "3" },
                 { label: "Ativos", value: "Ilimitado", current: "142" },
                 { label: "Leads/mês", value: "500", current: "89" },
               ].map((stat) => (
                 <div key={stat.label} className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1">{stat.label}</p>
                    <p className="text-lg font-bold text-white leading-none">{stat.current}</p>
                    <p className="text-[10px] text-slate-600 mt-1">Limite: {stat.value}</p>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-blue-950/20 border-slate-800">
           <CardHeader>
              <CardTitle className="text-white text-sm">Resumo Financeiro</CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
              <div>
                 <p className="text-4xl font-black text-white">R$ 14.280</p>
                 <p className="text-xs text-slate-500 mt-1">Faturado este mês</p>
              </div>
              <div className="space-y-3">
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">A receber</span>
                    <span className="text-emerald-500 font-bold">R$ 5.400</span>
                 </div>
                 <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[70%]" />
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Pendências</span>
                    <span className="text-red-500 font-bold">R$ 1.250</span>
                 </div>
              </div>
              <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold gap-2 text-xs">
                 <BarChart4 className="w-4 h-4" />
                 Ver Analytics Financeiro
              </Button>
           </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Configurações BYOK</h2>
          <div className="h-px flex-1 bg-slate-800 ml-2" />
        </div>

        <Card className="bg-slate-900/60 border-slate-800 border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                   <Lock className="w-5 h-5 text-blue-500" />
                   Sua Chave de API (Marketplace)
                </CardTitle>
                <CardDescription className="text-slate-500">
                   Conecte sua própria conta do Stripe ou Pagar.me para receber pagamentos diretamente.
                </CardDescription>
              </div>
              <div className="hidden md:block">
                 <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Garantia FROTA10K</span>
                 </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex items-start gap-3">
               <Settings2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
               <p className="text-xs text-orange-200/70 leading-relaxed italic">
                  <strong>Importante:</strong> Ao utilizar sua própria chave, você é responsável pela gestão de chargebacks e disputas. O FROTA10K apenas orquestra a transação através da sua credencial.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <PaymentForm 
                    initialApiKey={paymentConfig.apiKey} 
                    initialProvider={paymentConfig.provider} 
                  />
               </div>

               <div className="space-y-4">
                  <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl space-y-4">
                     <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <ArrowUpRight className="w-4 h-4 text-blue-500" />
                        Tutorial Rápido
                     </h4>
                     <ul className="space-y-3">
                        {[
                          "Acesse o Dashboard do seu provedor.",
                          "Vá em Developers > API Keys.",
                          "Copie a 'Secret Key'.",
                          "Cole no campo ao lado e salve."
                        ].map((step, i) => (
                          <li key={i} className="flex items-start gap-3 text-xs text-slate-500">
                             <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-[10px] shrink-0">{i+1}</span>
                             {step}
                          </li>
                        ))}
                     </ul>
                     <Button variant="link" className="text-blue-500 text-xs gap-1 h-auto p-0">
                        Abrir Dashboard do Stripe <ExternalLink className="w-3 h-3" />
                     </Button>
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
