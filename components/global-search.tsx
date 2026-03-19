"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Users, Car, Megaphone, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { globalSearch } from "@/app/actions/search";
import Link from "next/link";
import { useClickAway } from "react-use";

interface SearchResults {
  leads: { id: string, name: string, phone: string | null }[];
  assets: { id: string, brand: string | null, model: string | null, plate: string | null, year: number | null }[];
  publications: { id: string, title: string | null, asking_price: number | null }[];
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const resultsRef = useRef(null);

  useClickAway(resultsRef, () => setIsOpen(false));

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        setIsOpen(true);
        try {
          const data = await globalSearch(query);
          setResults(data);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults(null);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const hasResults = results && (results.leads.length > 0 || results.assets.length > 0 || results.publications.length > 0);

  return (
    <div className="flex items-center flex-1 max-w-md relative" ref={resultsRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
      <Input
        placeholder="Busca global (Ativos, Leads...)"
        className="pl-10 bg-slate-800/50 border-slate-700 text-sm h-9 focus-visible:ring-blue-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setIsOpen(true)}
      />
      {query && (
        <button 
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <X className="w-3 h-3 text-slate-500 hover:text-white" />
        </button>
      )}

      {isOpen && (
        <div className="absolute top-11 left-0 right-0 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-2">
            {loading ? (
              <div className="p-8 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                <p className="text-xs text-slate-500">Buscando na plataforma...</p>
              </div>
            ) : hasResults ? (
              <div className="space-y-4 p-2">
                {results.leads.length > 0 && (
                  <div>
                    <h4 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Users className="w-3 h-3" /> Leads
                    </h4>
                    {results.leads.map((lead) => (
                      <Link 
                        key={lead.id} 
                        href={`/leads/${lead.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors group"
                      >
                        <div>
                          <p className="text-sm text-slate-200 group-hover:text-white font-medium">{lead.name}</p>
                          <p className="text-[10px] text-slate-500">{lead.phone || 'Sem telefone'}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {results.assets.length > 0 && (
                  <div>
                    <h4 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Car className="w-3 h-3" /> Ativos
                    </h4>
                    {results.assets.map((asset) => (
                      <Link 
                        key={asset.id} 
                        href={`/assets/${asset.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors group"
                      >
                        <div>
                          <p className="text-sm text-slate-200 group-hover:text-white font-medium">
                            {asset.brand} {asset.model}
                          </p>
                          <p className="text-[10px] text-slate-500">{asset.plate || 'Sem placa'} • {asset.year}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {results.publications.length > 0 && (
                  <div>
                    <h4 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Megaphone className="w-3 h-3" /> Marketplace
                    </h4>
                    {results.publications.map((pub) => (
                      <Link 
                        key={pub.id} 
                        href={`/marketplace/${pub.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors group"
                      >
                        <div>
                          <p className="text-sm text-slate-200 group-hover:text-white font-medium">{pub.title}</p>
                          <p className="text-[10px] text-slate-500">R$ {pub.asking_price?.toLocaleString('pt-BR')}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">Nenhum resultado encontrado para &quot;{query}&quot;</p>
              </div>
            )}
          </div>
          {hasResults && !loading && (
            <div className="p-3 bg-slate-800/50 border-t border-slate-800 text-center">
              <p className="text-[10px] text-slate-500">Pressione ESC para fechar</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
