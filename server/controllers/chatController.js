const axios = require("axios");

exports.chatWithAI = async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await axios.post(
      "https://api.sarvam.ai/v1/chat/completions",
      {
        model: "sarvam-m",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant for a hunger relief platform called Hunger Hotspot Detection System. " +
              "Your job is to: guide citizens to submit hunger reports with location and photo, " +
              "explain how NGOs can respond to hotspots, suggest nearby food relief organisations, " +
              "and describe how the map and AI severity system works. " +
              "Keep answers concise, empathetic, and action-oriented. " +
              "If someone describes a hunger situation, encourage them to use the Report form immediately.",
          },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SARVAM_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Chat AI error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI service failed. Please try again." });
  }
};
