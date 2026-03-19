"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

interface ReportChartsProps {
  leadsByStatus: any[];
  assetsByType: any[];
  assetsByStatus: any[];
}

export function ReportCharts({ leadsByStatus, assetsByType, assetsByStatus }: ReportChartsProps) {
  const leadsData = leadsByStatus.map(item => ({
    name: item.status,
    value: item._count.status
  }));

  const assetsTypeData = assetsByType.map(item => ({
    name: item.type === 'CAR' ? 'Carro' : 'Moto',
    value: item._count.type
  }));

  const assetsStatusData = assetsByStatus.map(item => ({
    name: item.status,
    value: item._count.status
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Leads by Status */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-80">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Leads por Etapa</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={leadsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
              itemStyle={{ color: '#fff', fontSize: '12px' }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Assets by Type (Pie) */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-80">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Distribuição de Ativos</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={assetsTypeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {assetsTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
              itemStyle={{ color: '#fff', fontSize: '12px' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Assets by Status */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-80 lg:col-span-2">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Status dos Ativos na Esteira</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={assetsStatusData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
              itemStyle={{ color: '#fff', fontSize: '12px' }}
            />
            <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
