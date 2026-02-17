
const API_KEY = ""; // I will read this from .env.local via process.env in the next step, or just paste it if I see it.
// Wait, I saw GEMINI_API_KEY in Step 517: "AIzaSyBhglFpEuuwa-mZNuv3SmVlXSIugq4HYyU"

async function testGemini() {
    const apiKey = "AIzaSyBhglFpEuuwa-mZNuv3SmVlXSIugq4HYyU";
    console.log("Testing Gemini API with key:", apiKey.slice(0, 5) + "...");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Say hello!" }] }]
            })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("❌ Gemini API Failed:", response.status, response.statusText);
            console.error("Error Body:", err);
        } else {
            const data = await response.json();
            console.log("✅ Gemini API Success!");
            console.log("Response:", data.candidates[0].content.parts[0].text);
        }
    } catch (error) {
        console.error("❌ Network Error:", error);
    }
}

testGemini();
