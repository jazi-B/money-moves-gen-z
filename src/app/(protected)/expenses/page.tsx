import { getUserFinancialData } from "@/lib/data";
import { ExpensesList } from "./expenses-list";

export default async function ExpensesPage() {
  const data = await getUserFinancialData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Expenses</h1>
        <p className="text-white/50 text-sm mt-1">
          Track and categorize your spending
        </p>
      </div>
      <ExpensesList
        transactions={data.transactions}
        hasApiKey={!!data.settings?.gemini_api_key}
      />
    </div>
  );
}
