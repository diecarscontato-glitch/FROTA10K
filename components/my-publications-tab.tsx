"use client";

import React, { useState, useEffect } from "react";
import { getMyPublications, togglePublicationStatus } from "@/app/actions/marketplace";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Megaphone, 
  Eye, 
  EyeOff, 
  Car, 
  Bike,
  ArrowRight,
  Package,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function MyPublicationsTab() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPublications() {
    try {
      const pubs = await getMyPublications();
      setPublications(pubs);
    } catch {
      // no-op
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPublications();
  }, []);

  async function handleToggle(pubId: string, currentStatus: string) {
    try {
      await togglePublicationStatus(pubId, currentStatus);
      fetchPublications();
    } catch {
      // no-op
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (publications.length === 0) {
    return (
      <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
        <Package className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-lg">Você ainda não publicou nenhum ativo.</p>
        <p className="text-sm mt-1">
          Vá até a ficha de um ativo aprovado e clique em &quot;Publicar no Marketplace&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {publications.map((pub: any) => {
        const isActive = pub.status === "ACTIVE";
        return (
          <Card key={pub.id} className={cn(
            "bg-slate-900/50 border transition-all",
            isActive ? "border-emerald-500/20 hover:border-emerald-500/40" : "border-slate-800 opacity-70"
          )}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={cn(
                  "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                  isActive 
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
                    : "text-slate-500 bg-slate-800 border-slate-700"
                )}>
                  {isActive ? "Ativo" : "Pausado"}
                </div>
                <span className="text-[10px] text-slate-600 font-mono">
                  {pub._count?.interests || 0} interessados
                </span>
              </div>
              <CardTitle className="text-base text-white mt-2">
                {pub.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                  {pub.asset?.type === "CAR" ? (
                    <Car className="w-5 h-5 text-slate-600" />
                  ) : (
                    <Bike className="w-5 h-5 text-slate-600" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {pub.asset?.brand} {pub.asset?.model}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {pub.asset?.year} • {pub.asset?.plate || "N/A"}
                  </p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-bold">Valor Pedido</p>
                  <p className="text-lg font-black text-white">
                    R$ {pub.asking_price?.toLocaleString("pt-BR") || "---"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-9 w-9 rounded-lg",
                      isActive 
                        ? "text-amber-400 hover:bg-amber-500/10" 
                        : "text-emerald-400 hover:bg-emerald-500/10"
                    )}
                    onClick={() => handleToggle(pub.id, pub.status)}
                    title={isActive ? "Pausar Anúncio" : "Reativar Anúncio"}
                  >
                    {isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Link href={`/marketplace/${pub.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg text-blue-400 hover:bg-blue-500/10"
                      title="Ver Anúncio"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
