import { getUserFinancialData } from "@/lib/data";
import { getTodayStr } from "@/lib/savings";
import { TimelineList } from "./timeline-list";

export default async function TimelinePage() {
  const data = await getUserFinancialData();
  const today = getTodayStr();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Savings Timeline</h1>
        <p className="text-white/50 text-sm mt-1">
          Your daily saving goals and progress
        </p>
      </div>
      <TimelineList plan={data.savingsPlan} today={today} />
    </div>
  );
}
