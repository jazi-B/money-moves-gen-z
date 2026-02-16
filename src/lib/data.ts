import { createClient } from "@/lib/supabase/server";
import type { Settings, SavingsPlanItem, Transaction, UserFinancialData } from "@/lib/types";
import { getTodayStr } from "@/lib/savings";

export async function getUserFinancialData(): Promise<UserFinancialData> {
  const supabase = await createClient();

  // Safe Auth Check
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (e) {
    // Keys might be missing or invalid
  }

  // --- MOCK DATA MODE (If no DB or keys or no User) ---
  if (!user || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const today = getTodayStr();
    // Generate a quick mock plan
    const mockPlan = Array.from({ length: 30 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + (i - 5)); // 5 days ago to future
      const dateStr = d.toISOString().split("T")[0];
      return {
        id: `mock-${i}`,
        user_id: 'mock-user',
        date: dateStr,
        amount: Math.round(Math.random() * 500) + 100,
        completed: i < 5, // Past days completed
        created_at: new Date().toISOString()
      } as SavingsPlanItem;
    });

    return {
      settings: {
        id: 'mock-settings',
        user_id: 'mock-user',
        income: 150000,
        target: 1000000,
        duration: 365,
        start_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        gemini_api_key: null, // Use ENV fallback
        created_at: new Date().toISOString()
      },
      savingsPlan: mockPlan,
      transactions: [
        { id: '1', user_id: 'mock', amount: 1200, category: 'Food', note: 'Burgers w/ friends', date: today, created_at: today },
        { id: '2', user_id: 'mock', amount: 500, category: 'Transport', note: 'Uber to mall', date: today, created_at: today },
        { id: '3', user_id: 'mock', amount: 4500, category: 'Entertainment', note: 'Concert tickets', date: today, created_at: today },
      ] as Transaction[],
      totalSaved: 25000,
      totalSpent: 45000,
      freeCapital: 80000, // Rich mock user
      remainingDays: 25,
    };
  }

  // --- REAL DATA FETCHING ---
  const [settingsRes, planRes, transactionsRes] = await Promise.all([
    supabase.from("settings").select("*").eq("user_id", user.id).single(),
    supabase
      .from("savings_plan")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true }),
    supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false }),
  ]);

  const settings = (settingsRes.data as Settings) || null;
  const savingsPlan = (planRes.data as SavingsPlanItem[]) || [];
  const transactions = (transactionsRes.data as Transaction[]) || [];

  const totalSaved = savingsPlan
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + s.amount, 0);

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  const income = settings?.income || 0;
  const freeCapital = income - totalSpent - totalSaved;

  const today = getTodayStr();
  const remainingDays = savingsPlan.filter(
    (s) => s.date >= today && !s.completed
  ).length;

  return {
    settings,
    savingsPlan,
    transactions,
    totalSaved,
    totalSpent,
    freeCapital,
    remainingDays,
  };
}
