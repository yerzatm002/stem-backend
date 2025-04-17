const axios = require("axios");

exports.chatWithGPT4All = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Send the user message to the local GPT4All API
    const response = await axios.post("http://localhost:4891/v1/chat/completions", {
      model: "gpt4all", // Default model (Change if using a specific one)
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
      max_tokens: 100,
    });

    const botResponse = response.data.choices[0]?.message?.content || "Қате: жауап алынбады.";

    res.json({ response: botResponse });
  } catch (error) {
    console.error("❌ GPT4All серверіне қосылу қатесі:", error.message);
    res.status(500).json({ error: "GPT4All серверіне қосылу мүмкін емес." });
  }
};
