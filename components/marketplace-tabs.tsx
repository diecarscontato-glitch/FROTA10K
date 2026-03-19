"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Store, Megaphone } from "lucide-react";

interface MarketplaceTabsProps {
  feedContent: React.ReactNode;
  myPublicationsContent: React.ReactNode;
}

export function MarketplaceTabs({ feedContent, myPublicationsContent }: MarketplaceTabsProps) {
  const [activeTab, setActiveTab] = useState<"FEED" | "MINE">("FEED");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab("FEED")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all",
            activeTab === "FEED"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          )}
        >
          <Store className="w-4 h-4" />
          Feed de Oportunidades
        </button>
        <button
          onClick={() => setActiveTab("MINE")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all",
            activeTab === "MINE"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          )}
        >
          <Megaphone className="w-4 h-4" />
          Meus Anúncios
        </button>
      </div>

      <div className={activeTab === "FEED" ? "block" : "hidden"}>
        {feedContent}
      </div>
      <div className={activeTab === "MINE" ? "block" : "hidden"}>
        {myPublicationsContent}
      </div>
    </div>
  );
}
