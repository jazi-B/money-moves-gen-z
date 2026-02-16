"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
  gradient,
}: {
  children: ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={`glass glass-hover rounded-2xl p-6 relative overflow-hidden ${className}`}
    >
      {gradient && (
        <div
          className={`absolute inset-0 opacity-20 bg-gradient-to-br ${gradient}`}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  color = "emerald",
}: {
  label: string;
  value: string;
  icon: ReactNode;
  color?: "emerald" | "cyan" | "purple" | "amber" | "red";
}) {
  const colorMap = {
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400",
    cyan: "from-cyan-500/20 to-cyan-500/5 text-cyan-400",
    purple: "from-purple-500/20 to-purple-500/5 text-purple-400",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-400",
    red: "from-red-500/20 to-red-500/5 text-red-400",
  };

  const iconColorMap = {
    emerald: "from-emerald-400 to-emerald-600",
    cyan: "from-cyan-400 to-cyan-600",
    purple: "from-purple-400 to-purple-600",
    amber: "from-amber-400 to-amber-600",
    red: "from-red-400 to-red-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden backdrop-blur-xl bg-white/[0.07] border border-white/[0.12] rounded-2xl p-5`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorMap[color]} opacity-30`}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm font-medium">{label}</span>
          <div
            className={`w-9 h-9 rounded-lg bg-gradient-to-br ${iconColorMap[color]} flex items-center justify-center`}
          >
            {icon}
          </div>
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
}
