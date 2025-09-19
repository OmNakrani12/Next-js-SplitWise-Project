export function loginEmailTemplate({ userName, loginDate, userIp, deviceInfo, resetLink }) {
  return `
    <div style="font-family:Arial,sans-serif;background:#f9fafb;padding:20px">
      <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;padding:24px">
        <h1 style="text-align:center;font-size:20px;color:#111827;">🔐 Login Successful</h1>
        <p style="font-size:14px;color:#374151;line-height:1.6;">
          Hi <strong>${userName}</strong>,<br><br>
          We noticed a new login:
          <br><br>
          <b>Date:</b> ${loginDate}<br>
          <b>IP:</b> ${userIp}<br>
          <b>Device:</b> ${deviceInfo}<br><br>
          If this was you, ignore this email. Otherwise, reset your password immediately.
        </p>
        <div style="text-align:center;margin:20px 0;">
          <a href="${resetLink}"
             style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;
             text-decoration:none;font-weight:bold;">Reset Password</a>
        </div>
        <p style="font-size:12px;color:#6b7280;text-align:center">
          © 2025 Split Sharing App. Automated email, don’t reply.
        </p>
      </div>
    </div>
  `;
}
