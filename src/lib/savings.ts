export function generateSavingsPlan(
  target: number,
  duration: number,
  startDate: string
): { date: string; amount: number }[] {
  const base = target / duration;
  const plan: { date: string; amount: number }[] = [];
  let totalSoFar = 0;

  // Chaotic Factor: ensuring no two days feel the same
  // We use a combination of Sine waves and Perlin-like noise
  for (let i = 0; i < duration; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Multi-frequency sine wave for "natural" fluctuation
    const wave1 = Math.sin((i / duration) * Math.PI * 4); // Long wave
    const wave2 = Math.cos(i * 0.5); // Short jitter

    // Random "Chaos" multiplier (0.5x to 1.5x swing)
    const chaos = (Math.random() * 1.5) + 0.5;

    // Combined variation
    const variation = (wave1 * 0.2) + (wave2 * 0.1);

    let amount = Math.round(base * chaos * (1 + variation));

    // Boundary checks
    if (amount < 10) amount = 10; // Minimum actionable savings
    if (amount > target - totalSoFar && i < duration - 1) {
      amount = Math.round((target - totalSoFar) / (duration - i));
    }

    plan.push({
      date: date.toISOString().split("T")[0],
      amount,
    });
    totalSoFar += amount;
  }

  // Adjust last day to match exact target
  let diff = target - totalSoFar;

  // Distribute diff backwards if it's too large for one day
  let dayIdx = duration - 1;
  while (diff !== 0 && dayIdx >= 0) {
    const current = plan[dayIdx].amount;
    if (diff > 0) {
      plan[dayIdx].amount += 1;
      diff -= 1;
    } else {
      if (current > 10) {
        plan[dayIdx].amount -= 1;
        diff += 1;
      }
    }
    dayIdx--;
    if (dayIdx < 0) dayIdx = duration - 1; // Cycle if needed
  }

  return plan;
}

export function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}
