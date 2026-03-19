"use client";

import React, { useState, useRef, useEffect } from "react";
import { sendNegotiationMessage, updateNegotiationStatus } from "@/app/actions/negotiations";
import { Button } from "@/components/ui/button";
import { Send, Loader2, User, CheckCircle2, XCircle, BadgeDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: Date;
  user?: {
    name: string | null;
  };
}

interface NegotiationChatProps {
  negotiationId: string;
  messages: Message[];
  currentUserId: string;
  isOpen: boolean;
  isSeller: boolean;
}

export function NegotiationChat({ negotiationId, messages, currentUserId, isOpen, isSeller }: NegotiationChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const [proposalValue, setProposalValue] = useState("");
  const [showProposalInput, setShowProposalInput] = useState(false);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() && !proposalValue) return;
    if (!isOpen) return;

    setSending(true);
    try {
      await sendNegotiationMessage(negotiationId, newMessage.trim(), proposalValue ? parseFloat(proposalValue) : undefined);
      setNewMessage("");
      setProposalValue("");
      setShowProposalInput(false);
      window.location.reload();
    } catch (err) {
      console.error("Erro ao enviar mensagem", err);
    } finally {
      setSending(false);
    }
  }

  async function handleStatusUpdate(status: "ACCEPTED" | "REJECTED") {
    setSending(true);
    try {
      await updateNegotiationStatus(negotiationId, status);
      window.location.reload();
    } catch (err) {
      console.error("Erro ao atualizar status", err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/30">
      {/* Action Header (Seller only) */}
      {isOpen && isSeller && (
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Ações do Vendedor</p>
           </div>
           <div className="flex gap-2">
              <Button 
                onClick={() => handleStatusUpdate("REJECTED")}
                disabled={sending}
                variant="outline" 
                size="sm" 
                className="h-8 border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-bold uppercase transition-all"
              >
                 <XCircle className="w-3.5 h-3.5 mr-1.5" />
                 Recusar Proposta
              </Button>
              <Button 
                onClick={() => handleStatusUpdate("ACCEPTED")}
                disabled={sending}
                size="sm" 
                className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase shadow-lg shadow-emerald-600/20 transition-all border-none"
              >
                 <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                 Aceitar Acordo
              </Button>
           </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[400px] max-h-[600px] scrollbar-thin scrollbar-thumb-slate-800">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
            <div className="p-4 rounded-full bg-slate-800/30">
               <User className="w-10 h-10 opacity-20" />
            </div>
            <p className="text-sm font-medium">Nenhuma mensagem enviada.</p>
            <p className="text-xs text-slate-500 max-w-[200px] text-center leading-relaxed">Inicie a conversa para negociar os termos deste ativo.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user_id === currentUserId;
            return (
              <div key={msg.id} className={cn("flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300", isMe ? "flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 border",
                  isMe ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400"
                )}>
                  {msg.user?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 shadow-md",
                  isMe 
                    ? "bg-blue-600 text-white rounded-tr-sm" 
                    : "bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm"
                )}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <div className={cn(
                    "flex items-center gap-2 mt-2",
                    isMe ? "justify-end text-blue-200/60" : "text-slate-500"
                  )}>
                    <span className="text-[10px] font-medium">{msg.user?.name}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                    <span className="text-[10px]">
                      {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      {isOpen ? (
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md">
           {showProposalInput && (
             <div className="mb-4 p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-4">
                <div className="flex-1 space-y-1">
                   <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">Valor da sua Proposta (Opcional)</p>
                   <div className="relative">
                      <BadgeDollarSign className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                      <input 
                        type="number"
                        value={proposalValue}
                        onChange={(e) => setProposalValue(e.target.value)}
                        placeholder="0,00"
                        className="w-full bg-transparent border-none text-white font-black text-lg focus:outline-none pl-6 placeholder-slate-700"
                      />
                   </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setProposalValue(""); setShowProposalInput(false); }}
                  className="text-slate-500 hover:text-white"
                >
                   Remover
                </Button>
             </div>
           )}
           
           <form onSubmit={handleSend} className="flex items-center gap-3">
              <Button 
                type="button"
                onClick={() => setShowProposalInput(!showProposalInput)}
                variant="outline"
                className={cn(
                  "h-11 w-11 p-0 rounded-xl border-slate-700 transition-all",
                  showProposalInput ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                )}
                title="Inserir Valor da Proposta"
              >
                 <BadgeDollarSign className="w-5 h-5" />
              </Button>
              <div className="flex-1 relative">
                 <input
                   type="text"
                   value={newMessage}
                   onChange={(e) => setNewMessage(e.target.value)}
                   placeholder="Escreva sua mensagem ou proposta..."
                   className="w-full h-11 px-4 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 transition-all font-medium"
                   disabled={sending}
                 />
              </div>
              <Button
                type="submit"
                disabled={sending || (!newMessage.trim() && !proposalValue)}
                className="bg-blue-600 hover:bg-blue-700 text-white h-11 w-11 p-0 rounded-xl shadow-lg shadow-blue-600/20 group transition-all"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
              </Button>
           </form>
        </div>
      ) : (
        <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-500 bg-slate-900/80">
          Esta negociação foi encerrada. Não é possível enviar novas mensagens.
        </div>
      )}
    </div>
  );
}
