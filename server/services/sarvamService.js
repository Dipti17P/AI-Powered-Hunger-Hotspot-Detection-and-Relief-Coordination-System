const axios = require("axios");

const analyzeReport = async (text) => {
  try {
    const response = await axios.post(
      "https://api.sarvam.ai/v1/chat/completions",
      {
        model: "sarvam-m",
        messages: [
          {
            role: "user",
            content: `Analyze this hunger report.

Return ONLY JSON like this:
{
 "severity": "low | medium | high",
 "summary": "short summary"
}

Report:
${text}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SARVAM_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const raw = response.data.choices[0].message.content;

    // Extract JSON block even if the model adds surrounding text
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found in Sarvam response");

    const result = JSON.parse(match[0]);

    // Normalise severity to lowercase and validate
    const severity = String(result.severity || "").toLowerCase().trim();
    result.severity = ["low", "medium", "high"].includes(severity) ? severity : "low";

    return result;

  } catch (error) {
    console.error("Sarvam AI error:", error.message);
    return null;
  }
};

module.exports = analyzeReport;