"use client";

import { useState } from "react";
import { getAIAdvice } from "@/lib/ai";
import { GlassCard } from "@/components/glass-card";
import { Bot, RefreshCw, Sparkles, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AIGuide({
  income,
  totalSaved,
  totalSpent,
  remainingDays,
  freeCapital,
  hasApiKey,
}: {
  income: number;
  totalSaved: number;
  totalSpent: number;
  remainingDays: number;
  freeCapital: number;
  hasApiKey: boolean;
}) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchAdvice() {
    setLoading(true);
    try {
      const prompt = `User's financial snapshot:
- Monthly Income: Rs. ${income.toLocaleString()}
- Total Saved: Rs. ${totalSaved.toLocaleString()}
- Total Spent: Rs. ${totalSpent.toLocaleString()}
- Free Capital: Rs. ${freeCapital.toLocaleString()}
- Remaining saving days: ${remainingDays}

Give personalized financial advice based on this data.`;
      const result = await getAIAdvice(prompt);
      setAdvice(result);
    } catch {
      setAdvice("Ghosted by the server. Try again later.");
    }
    setLoading(false);
  }

  return (
    <GlassCard className="relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-cyan-500/10 rounded-2xl group-hover:opacity-75 transition duration-500" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg tracking-tight">Gemini Coach 🧞‍♂️</h3>
              <p className="text-white/50 text-xs font-medium">Your AI Bestie</p>
            </div>
          </div>
          <button
            onClick={fetchAdvice}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 border border-white/5"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 text-purple-300" />
            )}
            {loading ? "Cooking..." : "Spill the Tea ☕️"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {advice ? (
            <motion.div
              key="advice"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-inner"
            >
              <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {advice}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-dashed border-white/10"
            >
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              <p className="text-white/60 text-sm font-medium">
                {(hasApiKey || process.env.GEMINI_API_KEY)
                  ? 'Tap "Spill the Tea" for a vibe check on your wallet.'
                  : "Add your Gemini API key in Settings to unlock the magic."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
