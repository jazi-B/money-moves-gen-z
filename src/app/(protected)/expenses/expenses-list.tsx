"use client";

import { useState, useTransition } from "react";
import { addTransaction, deleteTransaction } from "@/lib/actions/data";
import { detectCategory } from "@/lib/ai";
import { formatCurrency } from "@/lib/savings";
import { EXPENSE_CATEGORIES } from "@/lib/types";
import type { Transaction } from "@/lib/types";
import { GlassCard } from "@/components/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Trash2,
  Receipt,
  Sparkles,
  ShoppingBag,
  Car,
  Zap,
  Film,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

const categoryIcons: Record<string, React.ReactNode> = {
  Food: <ShoppingBag className="w-4 h-4" />,
  Transport: <Car className="w-4 h-4" />,
  Bills: <Zap className="w-4 h-4" />,
  Entertainment: <Film className="w-4 h-4" />,
  Misc: <HelpCircle className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  Food: "from-amber-400 to-amber-600",
  Transport: "from-blue-400 to-blue-600",
  Bills: "from-red-400 to-red-600",
  Entertainment: "from-purple-400 to-purple-600",
  Misc: "from-gray-400 to-gray-600",
};

export function ExpensesList({
  transactions,
  hasApiKey,
}: {
  transactions: Transaction[];
  hasApiKey: boolean;
}) {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState("Misc");
  const [detectingCategory, setDetectingCategory] = useState(false);

  async function handleNoteBlur(note: string) {
    if (!note || !hasApiKey) return;
    setDetectingCategory(true);
    try {
      const detected = await detectCategory(note);
      setCategory(detected);
    } catch {
      // keep current
    }
    setDetectingCategory(false);
  }

  function handleSubmit(formData: FormData) {
    formData.set("category", category);
    startTransition(async () => {
      const result = await addTransaction(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Expense added!");
        setShowModal(false);
        setCategory("Misc");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteTransaction(id);
      if (result?.error) toast.error(result.error);
      else toast.success("Expense deleted");
    });
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-white/50 text-sm">
          {transactions.length} expense{transactions.length !== 1 ? "s" : ""} recorded
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:from-emerald-600 hover:to-cyan-600 transition"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Expenses List */}
      <div className="space-y-2">
        {transactions.length === 0 ? (
          <GlassCard>
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">No expenses recorded yet.</p>
            </div>
          </GlassCard>
        ) : (
          transactions.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between p-4 rounded-xl backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                    categoryColors[t.category] || categoryColors.Misc
                  } flex items-center justify-center text-white`}
                >
                  {categoryIcons[t.category] || categoryIcons.Misc}
                </div>
                <div>
                  <p className="text-white font-medium">{t.note || t.category}</p>
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <span>{t.category}</span>
                    <span>·</span>
                    <span>
                      {new Date(t.date).toLocaleDateString("en-PK", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-white font-bold">{formatCurrency(t.amount)}</p>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={isPending}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md backdrop-blur-xl bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Add Expense</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form action={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Amount (Rs.)
                  </label>
                  <input
                    name="amount"
                    type="number"
                    min="1"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
                    placeholder="e.g. 500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Note
                    {hasApiKey && (
                      <span className="ml-2 text-xs text-purple-400">
                        <Sparkles className="w-3 h-3 inline" /> AI auto-categorize
                      </span>
                    )}
                  </label>
                  <input
                    name="note"
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
                    placeholder="e.g. Lunch at restaurant"
                    onBlur={(e) => handleNoteBlur(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Category
                    {detectingCategory && (
                      <span className="ml-2 text-xs text-purple-400 animate-pulse">
                        Detecting...
                      </span>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                          category === cat
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {categoryIcons[cat]}
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Date
                  </label>
                  <input
                    name="date"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:from-emerald-600 hover:to-cyan-600 transition disabled:opacity-50"
                >
                  {isPending ? "Adding..." : "Add Expense"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
