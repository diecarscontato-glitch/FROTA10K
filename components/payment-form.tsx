"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { updatePaymentConfig } from "@/app/actions/billing";
import { useRouter } from "next/navigation";

interface PaymentFormProps {
  initialApiKey?: string;
  initialProvider?: string;
}

export function PaymentForm({ initialApiKey, initialProvider = "STRIPE" }: PaymentFormProps) {
  const [apiKey, setApiKey] = useState(initialApiKey || "");
  const [provider, setProvider] = useState(initialProvider);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await updatePaymentConfig({
        provider: provider as "STRIPE" | "PAGARME",
        apiKey,
      });
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      alert("Erro ao salvar configuração de pagamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-slate-400 text-xs font-bold uppercase tracking-widest">Provedor</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setProvider("STRIPE")}
            className={`flex items-center justify-center p-4 border-2 rounded-2xl transition-all ${
              provider === "STRIPE" ? "border-blue-500 bg-blue-500/10" : "border-slate-800 bg-slate-900/50 grayscale opacity-50"
            }`}
          >
            <span className="text-white font-black italic tracking-tighter text-xl">Stripe</span>
          </button>
          <button
            type="button"
            onClick={() => setProvider("PAGARME")}
            className={`flex items-center justify-center p-4 border-2 rounded-2xl transition-all ${
              provider === "PAGARME" ? "border-emerald-500 bg-emerald-500/10" : "border-slate-800 bg-slate-900/50 grayscale opacity-50"
            }`}
          >
            <span className="text-white font-black italic tracking-tighter text-xl">pagar.me</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiKey" className="text-slate-400 text-xs font-bold uppercase tracking-widest">Secret Key (sk_test_...)</Label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <Input
            id="apiKey"
            type="password"
            placeholder="Insira sua chave secreta"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-slate-950 border-slate-800 pl-10 text-white focus:border-blue-500"
            required
          />
        </div>
        <p className="text-[10px] text-slate-500 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          Sua chave será armazenada de forma segura na nuvem FROTA10K.
        </p>
      </div>

      <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 items-center">
        {success && (
          <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Configuração salva!
          </span>
        )}
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Configurações"}
        </Button>
      </div>
    </form>
  );
}
