"use client";

import React, { useState } from "react";
import { submitReception } from "@/app/actions/reception";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PackageCheck,
  AlertCircle,
  Gauge,
  Radio,
  ShieldCheck,
  Sparkles,
  Key,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReceptionChecklistFormProps {
  asset: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReceptionChecklistForm({ asset, onSuccess, onCancel }: ReceptionChecklistFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [km, setKm] = useState<number>(asset.km || 0);
  const [tracker, setTracker] = useState(false);
  const [insurance, setInsurance] = useState(false);
  const [hygiene, setHygiene] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (km <= 0) {
      setError("Informe a quilometragem atual do veículo.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await submitReception({
        asset_id: asset.id,
        reception_km: km,
        tracker_installed: tracker,
        insurance_active: insurance,
        hygiene_done: hygiene,
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Erro ao registrar recepção");
    } finally {
      setLoading(false);
    }
  }

  const ToggleItem = ({
    label,
    description,
    icon: Icon,
    checked,
    onChange,
    color,
  }: {
    label: string;
    description: string;
    icon: any;
    checked: boolean;
    onChange: (v: boolean) => void;
    color: string;
  }) => (
    <label className="flex items-center gap-4 p-4 rounded-xl border border-slate-700 bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-all group">
      <div className={cn("p-2 rounded-lg shrink-0", checked ? color : "bg-slate-700/50")}>
        <Icon className={cn("w-5 h-5", checked ? "text-white" : "text-slate-500")} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
      </div>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 rounded-full bg-slate-700 peer-checked:bg-emerald-500 transition-colors" />
        <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
      </div>
    </label>
  );

  // Info from lead, if available
  const hasReserveKey = asset.lead?.has_reserve_key;
  const hasManual = asset.lead?.has_manual;

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-teal-500" />
          Checklist de Recepção do Veículo
        </CardTitle>
        <CardDescription className="text-slate-400">
          Registre as condições no momento em que o veículo é recebido pela operação.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              {error}
            </div>
          )}

          {/* KM Input */}
          <div className="space-y-2">
            <Label className="text-slate-300 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-500" />
              Quilometragem Atual
            </Label>
            <Input
              type="number"
              value={km}
              onChange={(e) => setKm(parseInt(e.target.value) || 0)}
              placeholder="Ex: 45000"
              className="bg-slate-800 border-slate-700 text-white font-mono text-lg h-12"
            />
            {asset.km && (
              <p className="text-[10px] text-slate-500">
                KM registrado no cadastro: <span className="text-slate-400 font-mono">{asset.km.toLocaleString()}</span>
              </p>
            )}
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verificações de Entrada</h3>
            <ToggleItem
              label="Rastreador Instalado"
              description="Dispositivo GPS/rastreador verificado e funcional."
              icon={Radio}
              checked={tracker}
              onChange={setTracker}
              color="bg-blue-600"
            />
            <ToggleItem
              label="Seguro Ativo"
              description="Apólice de seguro vigente confirmada."
              icon={ShieldCheck}
              checked={insurance}
              onChange={setInsurance}
              color="bg-emerald-600"
            />
            <ToggleItem
              label="Higienização Realizada"
              description="Veículo higienizado interna e externamente."
              icon={Sparkles}
              checked={hygiene}
              onChange={setHygiene}
              color="bg-purple-600"
            />
          </div>

          {/* Lead Info (read-only) */}
          {(hasReserveKey !== undefined || hasManual !== undefined) && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Informações do Lead</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                  <Key className={cn("w-4 h-4", hasReserveKey ? "text-emerald-500" : "text-red-400")} />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Chave Reserva</p>
                    <p className={cn("text-xs font-bold", hasReserveKey ? "text-emerald-400" : "text-red-400")}>
                      {hasReserveKey ? "Sim" : "Não"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                  <BookOpen className={cn("w-4 h-4", hasManual ? "text-emerald-500" : "text-red-400")} />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Manual</p>
                    <p className={cn("text-xs font-bold", hasManual ? "text-emerald-400" : "text-red-400")}>
                      {hasManual ? "Sim" : "Não"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-teal-400">Confirmação de Posse</p>
              <p className="text-xs text-teal-300/60 mt-1 leading-relaxed">
                Ao confirmar, o status do ativo será atualizado para <strong>EM OPERAÇÃO</strong> e a data de recebimento será registrada.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-slate-800 pt-6">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-slate-400 hover:text-white">
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-teal-600 hover:bg-teal-500 text-white px-10 h-11 font-bold"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Confirmar Recepção"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
