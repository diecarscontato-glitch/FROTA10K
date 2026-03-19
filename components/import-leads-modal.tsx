"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUp, Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { importLeadsAction } from "@/app/actions/import-leads";

export function ImportLeadsModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setSuccess(null);

    try {
      const text = await file.text();
      const lines = text.split("\n");
      const headers = lines[0].split(",");
      
      const leads = lines.slice(1).filter(line => line.trim() !== "").map(line => {
        const values = line.split(",");
        const lead: { [key: string]: string | undefined } = {};
        headers.forEach((header, index) => {
          const key = header.trim().toLowerCase();
          lead[key] = values[index]?.trim();
        });
        return lead as { name: string; phone?: string; city?: string; state?: string; source?: string; };
      });

      const res = await importLeadsAction(leads);
      setSuccess(res.imported);
      setTimeout(() => {
        setOpen(false);
        setSuccess(null);
        setFile(null);
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Erro ao importar arquivo. Verifique se o formato CSV está correto (nome,telefone,cidade,estado,origem)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-slate-800 bg-slate-800/40 text-slate-300 gap-2 font-bold h-10 px-4 rounded-xl hover:bg-slate-800 transition-all">
          <FileUp className="w-4 h-4" />
          Importar CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-black italic tracking-tighter">
            <FileUp className="w-6 h-6 text-blue-500" />
            IMPORTAÇÃO EM MASSA
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Suba sua planilha de leads para processamento instantâneo.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {!success ? (
            <>
              <div className="border-2 border-dashed border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 bg-slate-950/50 hover:border-blue-500/50 transition-colors group cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".csv" 
                  title="Escolher arquivo CSV"
                  aria-label="Escolher arquivo CSV para importação"
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFileChange}
                />
                <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:bg-blue-600 transition-colors">
                  <FileUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-200">
                    {file ? file.name : "Arraste seu CSV ou clique aqui"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Apenas arquivos .csv permitidos</p>
                </div>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest leading-none">Formato Esperado</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Sua planilha deve conter o cabeçalho: <code className="text-white bg-slate-800 px-1 rounded">nome,telefone,cidade,estado,origem</code>.
                  </p>
                </div>
              </div>

              <Button 
                variant="ghost" 
                className="w-full text-slate-500 hover:text-white text-xs gap-2"
                onClick={() => {
                  const csvContent = "nome,telefone,cidade,estado,origem\nJoão Exemplo,11999998888,São Paulo,SP,Facebook";
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.setAttribute('hidden', '');
                  a.setAttribute('href', url);
                  a.setAttribute('download', 'modelo_importacao_leads.csv');
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                <Download className="w-4 h-4" />
                Baixar Planilha Modelo
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-4 animate-in zoom-in duration-300">
               <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-4 border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
               </div>
               <div className="text-center">
                  <h4 className="text-xl font-black text-white italic underline decoration-emerald-500">SUCESSO!</h4>
                  <p className="text-slate-400 mt-2">{success} leads foram importados com sucesso.</p>
               </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {!success && (
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black italic tracking-tighter" 
              disabled={!file || loading}
              onClick={handleImport}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "PROCESSAR IMPORTAÇÃO"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
