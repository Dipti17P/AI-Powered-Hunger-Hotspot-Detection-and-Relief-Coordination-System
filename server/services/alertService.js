const nodemailer = require("nodemailer");

// Build transporter from env — skip silently if not configured
function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

/**
 * Send high-severity hunger alert to all NGO users.
 * @param {Object} report  - mongoose Report document
 * @param {string[]} ngoEmails - array of NGO user emails
 * @param {Array}   nearbyNGOs - nearby NGO objects from findNearbyNGO
 */
async function sendHighSeverityAlert(report, ngoEmails, nearbyNGOs = []) {
  const transporter = createTransporter();
  if (!transporter || ngoEmails.length === 0) return;

  const ngoList = nearbyNGOs.length
    ? nearbyNGOs.map((n) => `• ${n.name}`).join("\n")
    : "• Check your NGO dashboard for details";

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:auto;border:2px solid #ef4444;border-radius:12px;overflow:hidden;">
      <div style="background:#ef4444;padding:16px 24px;">
        <h2 style="color:white;margin:0;">🚨 High Severity Hunger Alert</h2>
      </div>
      <div style="padding:20px 24px;">
        <p><strong>Location:</strong> ${report.locationName}</p>
        <p><strong>Report Title:</strong> ${report.title}</p>
        <p><strong>Description:</strong> ${report.description}</p>
        <p><strong>AI Severity:</strong> <span style="color:#ef4444;font-weight:700;">HIGH</span></p>
        ${report.aiAnalysis ? `<p><strong>AI Analysis:</strong> ${report.aiAnalysis}</p>` : ""}
        <hr style="margin:16px 0;border-color:#f3f4f6;"/>
        <p><strong>Nearest NGOs:</strong></p>
        <pre style="background:#f9fafb;padding:12px;border-radius:8px;font-size:13px;">${ngoList}</pre>
        <p style="font-size:12px;color:#9ca3af;margin-top:20px;">
          This is an automated alert from the Hunger Hotspot Detection System.
          Please respond as soon as possible.
        </p>
      </div>
    </div>`;

  try {
    await transporter.sendMail({
      from: `"Hunger Hotspot System" <${process.env.SMTP_USER}>`,
      to: ngoEmails.join(", "),
      subject: `🚨 HIGH Severity Hunger Report – ${report.locationName}`,
      html,
    });
    console.log(`✅ Alert sent to ${ngoEmails.length} NGO(s)`);
  } catch (err) {
    console.error("Alert email error:", err.message);
  }
}

module.exports = { sendHighSeverityAlert };
