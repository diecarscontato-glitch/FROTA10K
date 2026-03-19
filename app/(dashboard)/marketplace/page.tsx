import React from "react";
import { getMarketplaceFeed } from "@/app/actions/marketplace";
import { 
  Search, 
  Filter, 
  Car, 
  Bike, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Calendar,
  Building2,
  Info
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MarketplaceTabs } from "@/components/marketplace-tabs";
import { MyPublicationsTab } from "@/components/my-publications-tab";

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
  const feed = await getMarketplaceFeed();

  const feedContent = (
    <>
      <div className="flex flex-wrap items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            placeholder="Buscar por modelo, marca ou palavra-chave..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-800/50 border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="border-slate-800 bg-slate-800/40 text-slate-300">
             <Filter className="w-3.5 h-3.5 mr-2" />
             Tipo
           </Button>
           <Button variant="outline" size="sm" className="border-slate-800 bg-slate-800/40 text-slate-300">
             Faixa de Preço
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {feed.length === 0 ? (
          <div className="col-span-full h-80 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
             <TrendingUp className="w-12 h-12 mb-4 opacity-20" />
             <p className="text-lg">Nenhuma oferta pública disponível no momento.</p>
             <p className="text-sm">Seja o primeiro a publicar uma oportunidade!</p>
          </div>
        ) : (
          feed.map((pub: any) => (
            <Card key={pub.id} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row overflow-hidden group">
              <div className="w-full md:w-64 h-48 md:h-auto bg-slate-800 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 relative">
                 {pub.asset?.type === "CAR" ? (
                   <Car className="w-16 h-16 text-slate-700 group-hover:scale-110 transition-transform duration-500" />
                 ) : (
                   <Bike className="w-16 h-16 text-slate-700 group-hover:scale-110 transition-transform duration-500" />
                 )}
                 <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                    {pub.asset?.type === 'CAR' ? 'Carro' : 'Moto'}
                 </div>
              </div>
              
              <div className="flex-1 flex flex-col">
                <CardHeader className="p-6 pb-2">
                   <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                         <Building2 className="w-3 h-3" />
                         {pub.account?.name || "Empresa"}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">#{pub.id?.slice(-6).toUpperCase() || "ID"}</p>
                   </div>
                   <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">
                     {pub.title || "Oferta"}
                   </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 pt-2 flex-1 space-y-4">
                   <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
                      &quot;{pub.description}&quot;
                   </p>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-slate-400">
                         <Calendar className="w-3.5 h-3.5" />
                         <span className="text-[11px] font-medium">{pub.asset?.year || "---"} / {pub.asset?.color || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                         <MapPin className="w-3.5 h-3.5" />
                         <span className="text-[11px] font-medium">--</span>
                      </div>
                   </div>

                   <div className="pt-4 border-t border-slate-800 flex items-end justify-between">
                      <div>
                         <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tight mb-0.5">Valor do Ágio</p>
                         <p className="text-2xl font-black text-white">R$ {pub.asking_price?.toLocaleString() || "---"}</p>
                      </div>
                      {pub.asset?.financing && (
                        <div className="text-right">
                           <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mb-0.5">&quot;Saldo para Quitação&quot;</p>
                           <p className="text-xs font-bold text-slate-300">R$ {pub.asset.financing.outstanding_balance?.toLocaleString() || "---"}</p>
                        </div>
                      )}
                   </div>
                </CardContent>
                
                <CardFooter className="p-0 border-t border-slate-800">
                   <Link href={`/marketplace/${pub.id}`} className="w-full">
                      <Button variant="ghost" className="w-full flex items-center justify-center gap-2 py-6 text-xs font-bold text-blue-400 hover:text-white hover:bg-blue-600 transition-all uppercase tracking-widest rounded-none">
                         Analisar Oportunidade
                         <ChevronRight className="w-4 h-4" />
                      </Button>
                   </Link>
                </CardFooter>
              </div>
            </Card>
          ))
        )}
      </div>
      
      <div className="flex items-center gap-3 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
         <Info className="w-5 h-5 text-blue-500" />
         <p className="text-xs text-blue-200/60">
            Todas as oportunidades listadas passam pelo comitê de triagem da plataforma para garantir a saúde técnica e financeira do ativo.
         </p>
      </div>
    </>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Marketplace Privado</h1>
          <p className="text-slate-400 mt-1">
            Explore oportunidades qualificadas de ágio e repasse na rede FROTA10K.
          </p>
        </div>
      </div>

      <MarketplaceTabs
        feedContent={feedContent}
        myPublicationsContent={<MyPublicationsTab />}
      />
    </div>
  );
}
