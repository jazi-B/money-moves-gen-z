export type Settings = {
  id: string;
  user_id: string;
  income: number;
  target: number;
  duration: number;
  start_date: string;
  gemini_api_key: string | null;
  created_at: string;
  updated_at: string;
};

export type SavingsPlanItem = {
  id: string;
  user_id: string;
  date: string;
  amount: number;
  completed: boolean;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  date: string;
  note: string | null;
  created_at: string;
};

export type UserFinancialData = {
  settings: Settings | null;
  savingsPlan: SavingsPlanItem[];
  transactions: Transaction[];
  totalSaved: number;
  totalSpent: number;
  freeCapital: number;
  remainingDays: number;
};

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Entertainment",
  "Misc",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
