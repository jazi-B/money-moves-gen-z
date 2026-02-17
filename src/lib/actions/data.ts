"use server";

import { createClient } from "@/lib/supabase/server";
import { generateSavingsPlan } from "@/lib/savings";
import { revalidatePath } from "next/cache";

const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function saveSettings(formData: FormData) {
  if (isDemo) {
    // Simulate delay
    await new Promise(r => setTimeout(r, 500));
    revalidatePath("/dashboard");
    return { success: true };
  }

  const supabase = await createClient();
  const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";
  const user = { id: DEFAULT_USER_ID };
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // if (!user) return { error: "Not authenticated" };

  const income = parseInt(formData.get("income") as string) || 0;
  const target = parseInt(formData.get("target") as string) || 0;
  const duration = parseInt(formData.get("duration") as string) || 30;
  const start_date = (formData.get("start_date") as string) || new Date().toISOString().split("T")[0];

  const { error } = await supabase.from("settings").upsert(
    {
      user_id: user.id,
      income,
      target,
      duration,
      start_date,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) return { error: error.message };

  // Generate savings plan
  const plan = generateSavingsPlan(target, duration, start_date);

  // Delete old plan
  await supabase.from("savings_plan").delete().eq("user_id", user.id);

  // Insert new plan
  const planRows = plan.map((p) => ({
    user_id: user.id,
    date: p.date,
    amount: p.amount,
    completed: false,
  }));

  // Insert in batches of 50
  for (let i = 0; i < planRows.length; i += 50) {
    await supabase.from("savings_plan").insert(planRows.slice(i, i + 50));
  }

  revalidatePath("/dashboard");
  revalidatePath("/timeline");
  return { success: true };
}

export async function saveGeminiKey(formData: FormData) {
  if (isDemo) return { success: true };

  const supabase = await createClient();
  const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";
  const user = { id: DEFAULT_USER_ID };

  const gemini_api_key = formData.get("gemini_api_key") as string;

  // Check if settings exist
  const { data: existing } = await supabase
    .from("settings")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("settings")
      .update({ gemini_api_key, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("settings").insert({
      user_id: user.id,
      gemini_api_key,
      income: 0,
      target: 0,
      duration: 30,
      start_date: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function toggleSavingComplete(planId: string, completed: boolean) {
  if (isDemo) {
    revalidatePath("/dashboard");
    return { success: true };
  }

  const supabase = await createClient();
  const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";
  const user = { id: DEFAULT_USER_ID };

  const { error } = await supabase
    .from("savings_plan")
    .update({ completed })
    .eq("id", planId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/timeline");
  return { success: true };
}

export async function addTransaction(formData: FormData) {
  if (isDemo) {
    await new Promise(r => setTimeout(r, 500));
    revalidatePath("/dashboard");
    return { success: true };
  }

  const supabase = await createClient();
  const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";
  const user = { id: DEFAULT_USER_ID };

  const amount = parseInt(formData.get("amount") as string) || 0;
  const category = formData.get("category") as string;
  const date = (formData.get("date") as string) || new Date().toISOString().split("T")[0];
  const note = formData.get("note") as string;

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    amount,
    category,
    date,
    note,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/expenses");
  return { success: true };
}

export async function deleteTransaction(transactionId: string) {
  if (isDemo) {
    revalidatePath("/dashboard");
    return { success: true };
  }

  const supabase = await createClient();
  const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";
  const user = { id: DEFAULT_USER_ID };

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/expenses");
  return { success: true };
}

export async function resetAllData() {
  if (isDemo) return { success: true };

  const supabase = await createClient();
  const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";
  const user = { id: DEFAULT_USER_ID };

  await supabase.from("savings_plan").delete().eq("user_id", user.id);
  await supabase.from("transactions").delete().eq("user_id", user.id);
  await supabase.from("settings").delete().eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/timeline");
  revalidatePath("/settings");
  revalidatePath("/expenses");
  return { success: true };
}
