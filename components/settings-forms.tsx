"use client";

import React, { useState } from "react";
import { updateProfile, updateAccount } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Building2, 
  Save, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface SettingsFormsProps {
  user: any;
  account: any;
}

export function SettingsForms({ user, account }: SettingsFormsProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "account">("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    const formData = new FormData(e.currentTarget);
    try {
      await updateProfile({
        name: formData.get("name") as string,
        display_name: formData.get("display_name") as string,
        phone: formData.get("phone") as string,
      });
      setSuccess("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    const formData = new FormData(e.currentTarget);
    try {
      await updateAccount({
        name: formData.get("account_name") as string,
        public_name: formData.get("public_name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
      });
      setSuccess("Dados da conta matriz atualizados!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 p-1 bg-slate-900/50 border border-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "profile" 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <User className="w-4 h-4" />
          Meu Perfil
        </button>
        <button
          onClick={() => setActiveTab("account")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "account" 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Conta Matriz
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-500 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {activeTab === "profile" ? (
        <form onSubmit={handleProfileSubmit} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-700">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Informações Pessoais</h3>
              <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Papel: {user.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-400">Nome Completo</Label>
              <Input 
                name="name" 
                defaultValue={user.name} 
                className="bg-slate-800/50 border-slate-700" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">Nome Social / Display</Label>
              <Input 
                name="display_name" 
                defaultValue={user.display_name} 
                className="bg-slate-800/50 border-slate-700" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">E-mail (Inalterável)</Label>
              <Input 
                disabled 
                value={user.email} 
                className="bg-slate-800/20 border-slate-800 text-slate-600" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">Telefone / WhatsApp</Label>
              <Input 
                name="phone" 
                defaultValue={user.phone} 
                className="bg-slate-800/50 border-slate-700" 
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <Button disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[160px] gap-2">
              {loading ? "Salvando..." : <><Save className="w-4 h-4" /> Salvar Alterações</>}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleAccountSubmit} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-700">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Dados da Organização</h3>
              <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Status: {account.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-400">Razão Social</Label>
              <Input 
                name="account_name" 
                defaultValue={account.name} 
                className="bg-slate-800/50 border-slate-700" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">Nome Fantasia (Público)</Label>
              <Input 
                name="public_name" 
                defaultValue={account.public_name} 
                className="bg-slate-800/50 border-slate-700" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">E-mail Corporativo</Label>
              <Input 
                name="email" 
                defaultValue={account.email} 
                className="bg-slate-800/50 border-slate-700" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">Telefone de Contato</Label>
              <Input 
                name="phone" 
                defaultValue={account.phone} 
                className="bg-slate-800/50 border-slate-700" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">Cidade Sede</Label>
              <Input 
                name="city" 
                defaultValue={account.city} 
                className="bg-slate-800/50 border-slate-700" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">Estado (UF)</Label>
              <Input 
                name="state" 
                defaultValue={account.state} 
                className="bg-slate-800/50 border-slate-700" 
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <Button disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[160px] gap-2">
              {loading ? "Salvando..." : <><Save className="w-4 h-4" /> Salvar Dados da Conta</>}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
