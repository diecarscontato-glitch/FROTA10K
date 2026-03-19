"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getNotifications, markAsRead } from "@/app/actions/notifications";
import { Bell, CheckCircle2, Info, MessageSquare, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: Date;
}

export function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications();
      // Cast data to Notification[] since it comes from Prisma
      const castedData = data as unknown as Notification[];
      setNotifications(castedData);
      setUnreadCount(castedData.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Erro ao buscar notificações", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    
    // Simple polling for MVP (every 30s)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "INTEREST": return <Tag className="w-4 h-4 text-blue-500" />;
      case "NEGOTIATION": return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case "ASSET": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default: return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
        title="Ver notificações"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 border-2 border-slate-900 rounded-full text-[8px] font-black text-white flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Notificações</h3>
              <button onClick={() => setIsOpen(false)} title="Fechar">
                 <X className="w-4 h-4 text-slate-500 hover:text-white" />
              </button>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs italic">
                   Nenhuma notificação por enquanto.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={cn(
                      "p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group relative",
                      !notif.read && "bg-blue-600/5"
                    )}
                  >
                    <div className="flex gap-3">
                      <div className="mt-1 shrink-0">
                        {getIcon(notif.type)}
                      </div>
                      <Link 
                        href={notif.link || "#"} 
                        onClick={() => {
                          setIsOpen(false);
                          if (!notif.read) handleMarkAsRead(notif.id);
                        }}
                        className="flex-1"
                      >
                        <p className={cn("text-xs font-bold mb-1", notif.read ? "text-slate-300" : "text-white")}>
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-relaxed truncate">
                          {notif.message}
                        </p>
                        <p className="text-[9px] text-slate-600 mt-2">
                           {new Date(notif.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </Link>
                      {!notif.read && (
                        <button 
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Marcar como lida"
                        >
                           <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-3 bg-slate-800/50 border-t border-slate-800 text-center">
               <Link href="/notifications" className="text-[10px] font-bold uppercase text-blue-500 hover:text-blue-400 tracking-widest">
                  Ver Todas
               </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
