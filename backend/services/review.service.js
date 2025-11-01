import fetch from "node-fetch";

const reviewService = async (code) => {
    try {
        if (!code || code.trim() === "") {
            console.warn("No code provided to reviewService.");
            return "No code to review.";
        }

        const prompt = `You are a helpful assistant. Review the following code and suggest improvements, point out bugs or issues:

${code}`;

        console.log("Sending prompt to LLM...");

        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gemma3:1b",
                prompt,
                max_new_tokens: 300,
                temperature: 0.2,
                stream: false
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log("Received review from LLM.");
        return data.response || "LLM did not return a review."; // doar textul review-ului

    } catch (err) {
        console.error("Error in reviewService:", err);
        return "Error generating code review.";
    }
};

export default reviewService;
