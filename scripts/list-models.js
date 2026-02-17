
const API_KEY = "AIzaSyBhglFpEuuwa-mZNuv3SmVlXSIugq4HYyU";

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("✅ Available Models:");
            data.models.forEach(m => console.log(`- ${m.name}`));
        } else {
            console.error("❌ Error listing models:", data);
        }
    } catch (error) {
        console.error("❌ Network Error:", error);
    }
}

listModels();
