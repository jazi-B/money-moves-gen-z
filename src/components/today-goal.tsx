"use client";

import { toggleSavingComplete } from "@/lib/actions/data";
import { formatCurrency } from "@/lib/savings";
import { GlassCard } from "@/components/glass-card";
import { Target, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useTransition } from "react";
import type { SavingsPlanItem } from "@/lib/types";

export function TodayGoal({ todayPlan }: { todayPlan: SavingsPlanItem | null }) {
  const [isPending, startTransition] = useTransition();

  if (!todayPlan) {
    return (
      <GlassCard>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-white font-semibold">Today&apos;s Saving Goal</h3>
        </div>
        <p className="text-white/50 text-sm">
          Set up your savings plan in Settings to see daily goals.
        </p>
      </GlassCard>
    );
  }

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleSavingComplete(
        todayPlan!.id,
        !todayPlan!.completed
      );
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(
          todayPlan!.completed ? "Marked as pending" : "Marked as saved!"
        );
      }
    });
  }

  const progress = todayPlan.completed ? 100 : 0;
  const circumference = 2 * Math.PI * 36;

  return (
    <GlassCard className="relative overflow-hidden">
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
          todayPlan.completed
            ? "bg-gradient-to-br from-emerald-500/20 to-emerald-500/5"
            : "bg-gradient-to-br from-amber-500/10 to-amber-500/5"
        }`}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                todayPlan.completed
                  ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                  : "bg-gradient-to-br from-amber-400 to-amber-600"
              }`}
            >
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Today&apos;s Goal</h3>
              <p className="text-white/50 text-xs">
                {todayPlan.completed ? "Completed" : "Pending"}
              </p>
            </div>
          </div>

          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke={todayPlan.completed ? "#34d399" : "#fbbf24"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{
                  strokeDashoffset:
                    circumference - (progress / 100) * circumference,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {todayPlan.completed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <Circle className="w-6 h-6 text-amber-400" />
              )}
            </div>
          </div>
        </div>

        <p className="text-3xl font-bold text-white mb-4">
          {formatCurrency(todayPlan.amount)}
        </p>

        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            todayPlan.completed
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
              : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600"
          } disabled:opacity-50`}
        >
          {isPending
            ? "Updating..."
            : todayPlan.completed
            ? "Undo - Mark as Pending"
            : "Mark as Saved"}
        </button>
      </div>
    </GlassCard>
  );
}
