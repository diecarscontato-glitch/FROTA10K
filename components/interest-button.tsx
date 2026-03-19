"use client";

import React, { useState } from "react";
import { manifestInterest } from "@/app/actions/marketplace";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface InterestButtonProps {
  publicationId: string;
  isOwner: boolean;
}

export function InterestButton({ publicationId, isOwner }: InterestButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleInterest() {
    if (isOwner) return;
    
    setLoading(true);
    try {
      const result = await manifestInterest(publicationId);
      setSuccess(true);
      if (result.negotiation?.id) {
        router.push(`/negotiations/${result.negotiation.id}`);
      } else {
        router.push("/negotiations");
      }
    } catch (err) {
      console.error("Erro ao manifestar interesse", err);
      alert("Erro ao manifestar interesse. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (isOwner) {
    return (
      <Button disabled className="w-full bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700">
        Este anúncio é seu
      </Button>
    );
  }

  if (success) {
    return (
      <Button className="w-full bg-emerald-600 text-white gap-2" disabled>
        <CheckCircle2 className="w-4 h-4" />
        Interesse Registrado
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleInterest} 
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 gap-2 shadow-lg shadow-blue-600/20"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <MessageSquare className="w-4 h-4" />
      )}
      Manifestar Interesse / Negociar
    </Button>
  );
}
