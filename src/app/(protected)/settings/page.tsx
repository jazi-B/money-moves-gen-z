import { getUserFinancialData } from "@/lib/data";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const data = await getUserFinancialData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/50 text-sm mt-1">
          Configure your savings plan and preferences
        </p>
      </div>
      <SettingsForm settings={data.settings} />
    </div>
  );
}
