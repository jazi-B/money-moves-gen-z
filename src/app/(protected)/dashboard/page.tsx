import { getUserFinancialData } from "@/lib/data";
import { getTodayStr, formatCurrency } from "@/lib/savings";
import { AIGuide } from "@/components/ai-guide";
import { TodayGoal } from "@/components/today-goal";
import { SavingsChart, ExpenseChart } from "@/components/charts";
import { StatCard } from "@/components/glass-card";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Zap,
} from "lucide-react";

function getVibe(freeCapital: number, income: number) {
  if (income === 0) return { text: "Ghost Mode 👻", color: "text-white/50" };
  const ratio = freeCapital / income;
  if (ratio < 0) return { text: "Down Bad 💀", color: "text-red-400" };
  if (ratio < 0.1) return { text: "Living on the Edge 🧗", color: "text-orange-400" };
  if (ratio < 0.3) return { text: "Vibing 😎", color: "text-cyan-400" };
  return { text: "Absolute Unit 🚀", color: "text-emerald-400" };
}

export default async function DashboardPage() {
  const data = await getUserFinancialData();
  const today = getTodayStr();
  const todayPlan = data.savingsPlan.find((s) => s.date === today) || null;
  const vibe = getVibe(data.freeCapital, data.settings?.income || 0);

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Vibe Check */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 animate-gradient-x pb-2">
            Money Moves
          </h1>
          <p className="text-white/60 font-medium">
            Financial OS <span className="mx-2">•</span> <span className={`${vibe.color} font-bold`}>{vibe.text}</span>
          </p>
        </div>
        <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold text-white/80 border-white/10 uppercase tracking-widest">
          <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          Gen Z Mode Active
        </div>
      </div>

      {/* AI Commander */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <AIGuide
          income={data.settings?.income || 0}
          totalSaved={data.totalSaved}
          totalSpent={data.totalSpent}
          remainingDays={data.remainingDays}
          freeCapital={data.freeCapital}
          hasApiKey={!!data.settings?.gemini_api_key}
        />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Monthly Flow"
          value={formatCurrency(data.settings?.income || 0)}
          icon={<Wallet className="w-5 h-5 text-emerald-400" />}
          color="emerald"
        />
        <StatCard
          label="Stashed"
          value={formatCurrency(data.totalSaved)}
          icon={<TrendingUp className="w-5 h-5 text-cyan-400" />}
          color="cyan"
        />
        <StatCard
          label="Burn Rate"
          value={formatCurrency(data.totalSpent)}
          icon={<TrendingDown className="w-5 h-5 text-purple-400" />}
          color="purple"
        />
        <StatCard
          label="Play Money"
          value={formatCurrency(data.freeCapital)}
          icon={<DollarSign className="w-5 h-5 text-amber-400" />}
          color={data.freeCapital < 0 ? "red" : "amber"}
        />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Column: Charts (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass p-1 rounded-2xl">
            <SavingsChart plan={data.savingsPlan} />
          </div>
          <div className="glass p-1 rounded-2xl">
            <ExpenseChart transactions={data.transactions} />
          </div>
        </div>

        {/* Right Column: Today's Action (1/3 width) */}
        <div className="space-y-6">
          <TodayGoal todayPlan={todayPlan} />

          <StatCard
            label="Countdown"
            value={`${data.remainingDays} Days`}
            icon={<Calendar className="w-5 h-5 text-pink-400" />}
            color="cyan"
          />

          {/* Daily Wisdom / Decoration */}
          <div className="glass p-6 rounded-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-2">Daily Mantra</p>
            <p className="text-white/90 font-medium italic">
              "Do not save what is left after spending, but spend what is left after saving."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
