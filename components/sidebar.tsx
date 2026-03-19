"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Car,
  ClipboardCheck,
  Building2,
  Megaphone,
  MessageSquare,
  CheckSquare,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
  CarFront,
  CreditCard,
  HelpCircle,
  Wallet,
} from "lucide-react";
import { signOut } from "next-auth/react";

const sidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Leads", icon: Users, href: "/leads" },
  { label: "Ativos", icon: Car, href: "/assets" },
  { label: "Marketplace", icon: Megaphone, href: "/marketplace" },
  { label: "Negociações", icon: MessageSquare, href: "/negotiations" },
  { label: "Tarefas", icon: CheckSquare, href: "/tasks" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Financeiro", icon: Wallet, href: "/financials" },
  { label: "Minha Equipe", icon: Building2, href: "/team" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <CarFront className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            FROTA<span className="text-blue-500">10K</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600/10 text-blue-500"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800 space-y-1">
        <Link
          href="/billing"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/billing" ? "bg-blue-600/10 text-blue-500" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          )}
        >
          <CreditCard className="w-4 h-4" />
          Faturamento
        </Link>
        <Link
          href="/help"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/help" ? "bg-blue-600/10 text-blue-500" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          )}
        >
          <HelpCircle className="w-4 h-4" />
          Central de Ajuda
        </Link>
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/settings" ? "bg-blue-600/10 text-blue-500" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          )}
        >
          <Settings className="w-4 h-4" />
          Configurações
        </Link>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 hover:text-red-300"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  );
}
