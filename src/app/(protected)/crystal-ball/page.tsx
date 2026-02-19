
import { getUserFinancialData } from "@/lib/data";
import { ProjectionChart } from "@/components/charts";
import { getAIAdvice } from "@/lib/ai";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CrystalBallPage() {
    const data = await getUserFinancialData();

    const income = data.settings?.income || 0;
    // Estimate monthly spend based on recent transactions (naive calculation: total spent / days passed * 30)
    // For simplicity, let's use the total spent this month so far. 
    // Ideally we need "Monthly Average Burn", but let's stick to (Income - Savings Goal).
    const targetSavings = data.settings?.target || 0; // This is TOTAL target.
    const monthlyGoal = (data.settings?.target || 0) / (data.settings?.duration || 1) * 30;
    // Actually, simpler: Income - Total Spent (Projected).

    // Real Calculation:
    // Net Flow = Income - (Expenses). 
    // Let's assume user spends similar amount every month.
    const monthlyNet = income - data.totalSpent; // This is simplistic but works for "Current Month Projection"

    // Better Metric: "Free Capital" is basically what's left.
    const projectionValue = data.freeCapital;

    const fortune = await getAIAdvice(`
    Project my future based on:
    - Monthly Income: ${income}
    - Current Savings: ${data.totalSaved}
    - Monthly Burn Rate: ${data.totalSpent}
    - Net Flow: ${projectionValue}
    
    Tell me where I will be in 6 months. Be dramatic. Use emoji.
    If positive: "You're going to the moon!" 
    If negative: "You're cooked."
  `);

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Future Crystal Ball 🔮</h1>
                    <p className="text-white/60">AI-Powered Financial Projection</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <ProjectionChart currentBalance={data.totalSaved} monthlyNet={projectionValue} />

                    <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-2xl backdrop-blur-md">
                        <h3 className="text-indigo-400 font-bold mb-2 uppercase text-xs tracking-widest">The Oracle Says</h3>
                        <p className="text-xl md:text-2xl font-medium text-white leading-relaxed">
                            "{fortune}"
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700">
                        <h3 className="text-white font-bold mb-4">Reality Check</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Current Rate</span>
                                <span className={projectionValue >= 0 ? "text-emerald-400" : "text-red-400"}>
                                    {projectionValue >= 0 ? "+" : ""}{projectionValue.toLocaleString()} / mo
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">6 Month Forecast</span>
                                <span className="text-white font-bold">
                                    Rs. {(data.totalSaved + projectionValue * 6).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5">
                            <Link href="/dashboard">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                    Back to Reality <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
