"use client";

import { toggleSavingComplete } from "@/lib/actions/data";
import { formatCurrency } from "@/lib/savings";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";
import type { SavingsPlanItem } from "@/lib/types";

export function TimelineList({
  plan,
  today,
}: {
  plan: SavingsPlanItem[];
  today: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggle(item: SavingsPlanItem) {
    startTransition(async () => {
      const result = await toggleSavingComplete(item.id, !item.completed);
      if (result?.error) toast.error(result.error);
      else toast.success(item.completed ? "Marked as pending" : "Marked as saved!");
    });
  }

  if (plan.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-white/[0.07] border border-white/[0.12] rounded-2xl p-12 text-center">
        <CalendarDays className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <p className="text-white/40">
          No savings plan yet. Set up your goals in Settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {plan.map((item, index) => {
        const isToday = item.date === today;
        const isPast = item.date < today;
        const formattedDate = new Date(item.date).toLocaleDateString("en-PK", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
            className={`flex items-center justify-between p-4 rounded-xl backdrop-blur-xl border transition-all cursor-pointer ${
              isToday
                ? "bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20"
                : item.completed
                ? "bg-white/[0.05] border-white/[0.08]"
                : isPast
                ? "bg-red-500/5 border-red-500/10"
                : "bg-white/[0.03] border-white/[0.06]"
            }`}
            onClick={() => handleToggle(item)}
          >
            <div className="flex items-center gap-4">
              <button disabled={isPending} className="flex-shrink-0">
                {item.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Circle
                    className={`w-6 h-6 ${
                      isToday
                        ? "text-emerald-400/50"
                        : isPast
                        ? "text-red-400/50"
                        : "text-white/20"
                    }`}
                  />
                )}
              </button>
              <div>
                <p
                  className={`font-medium ${
                    isToday ? "text-emerald-400" : "text-white/80"
                  }`}
                >
                  {formattedDate}
                  {isToday && (
                    <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </p>
                <p className="text-white/40 text-sm">
                  {item.completed ? "Completed" : isPast ? "Missed" : "Pending"}
                </p>
              </div>
            </div>
            <p
              className={`text-lg font-bold ${
                item.completed
                  ? "text-emerald-400"
                  : isToday
                  ? "text-white"
                  : "text-white/60"
              }`}
            >
              {formatCurrency(item.amount)}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
