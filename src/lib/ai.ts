"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAIAdvice(userPrompt: string): Promise<string> {
  const supabase = await createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // if (!user) throw new Error("Not authenticated");

  let apiKey = process.env.GEMINI_API_KEY;
  const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";

  // Fetch from DB settings if available
  const { data: settings } = await supabase
    .from("settings")
    .select("gemini_api_key")
    .eq("user_id", DEFAULT_USER_ID)
    .single();

  if (settings?.gemini_api_key) {
    apiKey = settings.gemini_api_key;
  }

  if (!apiKey) {
    return "Bruh, I need a key. Add your Gemini API key in Settings so I can cook up some advice.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a Gen Z financial hypebeast and bestie. 
                  - Use slang like 'Start saving', 'No cap', 'Bet', 'Down bad', 'Stonks', 'W', 'L', 'Bag alert'.
                  - Be motivational but roast them slightly if they are spending too much.
                  - Keep it short (max 2-3 sentences).
                  - Financial advice should still be sound/safe, just the delivery is casual.
                  - Currency: Rs. (Pakistani Rupees).
                  
                  User Context:
                  ${userPrompt}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      return "System glitch! AI is taking a nap. Try again later.";
    }

    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Bag secured? Keep saving, legend."
    );
  } catch (error) {
    console.error("AI Error:", error);
    return "Wifi's acting up. Can't give advice rn.";
  }
}

export async function detectCategory(note: string): Promise<string> {
  const supabase = await createClient();
  const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";
  let apiKey = process.env.GEMINI_API_KEY;

  // Fetch from DB settings if available
  const { data: settings } = await supabase
    .from("settings")
    .select("gemini_api_key")
    .eq("user_id", DEFAULT_USER_ID)
    .single();

  if (settings?.gemini_api_key) {
    apiKey = settings.gemini_api_key;
  }

  if (!apiKey) return "Misc";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Categorize this expense into EXACTLY one of: Food, Transport, Bills, Entertainment, Misc. Reply with ONLY the category name, nothing else.\n\nExpense: "${note}"`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) return "Misc";

    const data = await response.json();
    const category =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Misc";
    const valid = ["Food", "Transport", "Bills", "Entertainment", "Misc"];
    return valid.includes(category) ? category : "Misc";
  } catch {
    return "Misc";
  }
}
