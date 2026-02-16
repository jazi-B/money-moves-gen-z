"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
} from "recharts";
import type { SavingsPlanItem, Transaction } from "@/lib/types";
import { GlassCard } from "@/components/glass-card";
import { TrendingUp, PieChart } from "lucide-react";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) {
  if (!active || !payload) return null;
  return (
    <div className="bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-white/60 text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-white text-sm font-medium">
          Rs. {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export function SavingsChart({ plan }: { plan: SavingsPlanItem[] }) {
  const data = plan.slice(0, 30).map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-PK", {
      month: "short",
      day: "numeric",
    }),
    amount: item.amount,
    saved: item.completed ? item.amount : 0,
  }));

  return (
    <GlassCard>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-white font-semibold">Savings Progress</h3>
      </div>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.3)"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6ee7b7"
              strokeWidth={2}
              dot={false}
              name="Goal"
            />
            <Line
              type="monotone"
              dataKey="saved"
              stroke="#34d399"
              strokeWidth={2}
              dot={false}
              name="Saved"
              strokeDasharray="4 4"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[250px] flex items-center justify-center text-white/30 text-sm">
          Set up your savings plan to see progress
        </div>
      )}
    </GlassCard>
  );
}

export function ExpenseChart({ transactions }: { transactions: Transaction[] }) {
  const categoryTotals: Record<string, number> = {};
  transactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const colors: Record<string, string> = {
    Food: "#f59e0b",
    Transport: "#3b82f6",
    Bills: "#ef4444",
    Entertainment: "#a855f7",
    Misc: "#6b7280",
  };

  const data = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    fill: colors[category] || "#6b7280",
  }));

  return (
    <GlassCard>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
          <PieChart className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-white font-semibold">Expenses by Category</h3>
      </div>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="category"
              stroke="rgba(255,255,255,0.3)"
              tick={{ fontSize: 11 }}
            />
            <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[250px] flex items-center justify-center text-white/30 text-sm">
          No expenses recorded yet
        </div>
      )}
    </GlassCard>
  );
}
