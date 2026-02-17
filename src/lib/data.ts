import { createClient } from "@/lib/supabase/server";
import type { Settings, SavingsPlanItem, Transaction, UserFinancialData } from "@/lib/types";
import { getTodayStr } from "@/lib/savings";

export async function getUserFinancialData(): Promise<UserFinancialData> {
  // --- SINGLE USER MODE ---
  const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000"; // Use a valid UUID format
  const user = { id: DEFAULT_USER_ID };

  const supabase = await createClient();

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

