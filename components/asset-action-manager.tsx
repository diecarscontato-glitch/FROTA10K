"use client";

import React, { useState } from "react";
import { AnalysisForm } from "./analysis-form";
import { DecisionForm } from "./decision-form";
import { PublicationForm } from "./publication-form";
import { LegalAnalysisForm } from "./legal-analysis-form";
import { ReceptionChecklistForm } from "./reception-checklist-form";
import { Button } from "@/components/ui/button";
import { 
  ClipboardCheck, 
  Gavel, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  ShieldAlert,
  PackageCheck,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AssetActionManagerProps {
  asset: any;
}

type ViewState = "NONE" | "ANALYSIS" | "DECISION" | "PUBLISH" | "LEGAL" | "RECEPTION";

export function AssetActionManager({ asset }: AssetActionManagerProps) {
  const [view, setView] = useState<ViewState>("NONE");

  const reload = () => {
    setView("NONE");
    window.location.reload();
  };

  // Modal wrapper
  const Modal = ({ children, maxW = "max-w-2xl" }: { children: React.ReactNode; maxW?: string }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setView("NONE")} />
      <div className={cn("w-full relative z-10 max-h-[90vh] overflow-y-auto", maxW)}>{children}</div>
    </div>
  );

  if (view === "ANALYSIS") {
    return (
      <Modal>
        <AnalysisForm asset={asset} onSuccess={reload} onCancel={() => setView("NONE")} />
      </Modal>
    );
  }

  if (view === "DECISION") {
    return (
      <Modal maxW="max-w-3xl">
        <DecisionForm assetId={asset.id} onSuccess={reload} onCancel={() => setView("NONE")} />
      </Modal>
    );
  }

  if (view === "PUBLISH") {
    return (
      <Modal>
        <PublicationForm asset={asset} onSuccess={reload} onCancel={() => setView("NONE")} />
      </Modal>
    );
  }

  if (view === "LEGAL") {
    return (
      <Modal maxW="max-w-2xl">
        <LegalAnalysisForm asset={asset} onSuccess={reload} onCancel={() => setView("NONE")} />
      </Modal>
    );
  }

  if (view === "RECEPTION") {
    return (
      <Modal>
        <ReceptionChecklistForm asset={asset} onSuccess={reload} onCancel={() => setView("NONE")} />
      </Modal>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* SCREENING → Iniciar Análise */}
      {asset.status === "SCREENING" && (
        <Button 
          onClick={() => setView("ANALYSIS")}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full h-11"
        >
          <ClipboardCheck className="w-4 h-4" />
          Iniciar Análise Técnica
        </Button>
      )}

      {/* ANALYSIS or FINANCIAL_ANALYSIS → Comitê + Jurídico */}
      {(asset.status === "ANALYSIS" || asset.status === "FINANCIAL_ANALYSIS") && (
        <div className="space-y-3">
          <Button 
            onClick={() => setView("DECISION")}
            className="bg-amber-600 hover:bg-amber-500 text-white gap-2 w-full h-11 shadow-lg shadow-amber-600/20"
          >
            <Gavel className="w-4 h-4" />
            Enviar para Comitê
          </Button>
          <Button 
            onClick={() => setView("LEGAL")}
            variant="outline"
            className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300 w-full gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            Análise Jurídica
          </Button>
          <Button 
            variant="outline"
            onClick={() => setView("ANALYSIS")}
            className="border-slate-800 text-slate-400 hover:text-white w-full"
          >
            Nova Revisão Técnica
          </Button>
        </div>
      )}

      {/* COMMITTEE → Aguardando decisão */}
      {asset.status === "COMMITTEE" && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center gap-2 mb-1">
            <Gavel className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Em Comitê de Análise</span>
          </div>
          <Button 
            onClick={() => setView("DECISION")}
            className="bg-amber-600 hover:bg-amber-500 text-white gap-2 w-full h-11"
          >
            <Gavel className="w-4 h-4" />
            Definir Destino
          </Button>
          {!asset.legal_analysis && (
            <Button 
              onClick={() => setView("LEGAL")}
              variant="outline"
              className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300 w-full gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              Análise Jurídica
            </Button>
          )}
        </div>
      )}

      {/* APPROVED → Recepção + Destino + Publicar direto */}
      {asset.status === "APPROVED" && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Ativo Aprovado</span>
          </div>
          {!asset.received_at ? (
            <Button
              onClick={() => setView("RECEPTION")}
              className="bg-teal-600 hover:bg-teal-500 text-white gap-2 w-full h-11"
            >
              <PackageCheck className="w-4 h-4" />
              Receber Veículo
            </Button>
          ) : (
            <Button 
              onClick={() => setView("DECISION")}
              className="bg-amber-600 hover:bg-amber-500 text-white gap-2 w-full h-11"
            >
              <Gavel className="w-4 h-4" />
              Definir Destino
            </Button>
          )}
          <Button 
            onClick={() => setView("PUBLISH")}
            variant="outline"
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 w-full gap-2"
          >
            <Store className="w-4 h-4" />
            Publicar no Marketplace
          </Button>
          {!asset.legal_analysis && (
            <Button 
              onClick={() => setView("LEGAL")}
              variant="outline"
              className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300 w-full gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              Análise Jurídica
            </Button>
          )}
        </div>
      )}

      {/* IN_OPERATION → Destino + Publicar direto */}
      {asset.status === "IN_OPERATION" && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center gap-2">
            <PackageCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Veículo Recebido — Em Operação</span>
          </div>
          <Button 
            onClick={() => setView("DECISION")}
            className="bg-amber-600 hover:bg-amber-500 text-white gap-2 w-full h-11"
          >
            <Gavel className="w-4 h-4" />
            Definir Destino
          </Button>
          <Button 
            onClick={() => setView("PUBLISH")}
            variant="outline"
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 w-full gap-2"
          >
            <Store className="w-4 h-4" />
            Publicar no Marketplace
          </Button>
        </div>
      )}

      {/* MARKETPLACE → Publicar ou ver oportunidade */}
      {asset.status === "MARKETPLACE" && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
           <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-bold text-sm uppercase tracking-tight">Ativo Qualificado</span>
           </div>
           <p className="text-xs text-emerald-200/60 leading-relaxed">
             Este ativo está pronto para o Marketplace. Você pode gerenciar publicações agora.
           </p>
           
           {!asset.publications || asset.publications.length === 0 ? (
             <Button 
               onClick={() => setView("PUBLISH")}
               className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white h-10 gap-2"
             >
                <Megaphone className="w-3.5 h-3.5" />
                Publicar no Feed
             </Button>
           ) : (
             <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white h-10 gap-2">
                Ver Oportunidade
                <ArrowRight className="w-3.5 h-3.5" />
             </Button>
           )}
        </div>
      )}

      {/* NEGOTIATION */}
      {asset.status === "NEGOTIATION" && (
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
           <div className="flex items-center gap-2">
              <Gavel className="w-4 h-4" />
              <span className="font-bold text-sm uppercase tracking-tight">Em Negociação</span>
           </div>
           <p className="text-xs mt-1 text-indigo-200/60">Ativo em processo de negociação ativa.</p>
        </div>
      )}

      {/* REJECTED */}
      {asset.status === "REJECTED" && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
           <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="font-bold text-sm uppercase tracking-tight">Rejeitado / Vetado</span>
           </div>
           <p className="text-xs mt-1 text-red-200/60">Este ativo foi rejeitado pela análise ou veto jurídico.</p>
        </div>
      )}

      {/* SOLD */}
      {asset.status === "SOLD" && (
        <div className="p-4 rounded-xl bg-slate-800 text-slate-400 border border-slate-700">
           <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="font-bold text-sm uppercase tracking-tight">Status Final</span>
           </div>
           <p className="text-xs mt-1">Este processo foi encerrado ou o ativo foi removido da esteira.</p>
        </div>
      )}
    </div>
  );
}
