import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,   // your Gmail e.g. rikibiswas2005@gmail.com
    pass: process.env.SMTP_PASS,   // Gmail App Password (NOT your real password)
  },
})

export async function sendPasswordResetEmail({
  toEmail,
  resetLink,
}: {
  toEmail: string
  resetLink: string
}) {
  const mailOptions = {
    from: `"LeadDesk Admin" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: '🔐 Password Reset — LeadDesk Mini',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Your Password</title>
      </head>
      <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#2563eb,#4f46e5);padding:36px 40px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">🔐 LeadDesk Mini</h1>
                    <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Admin Password Reset</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;font-weight:700;">Reset Your Password</h2>
                    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                      We received a request to reset your LeadDesk admin password. Click the button below to set a new password.
                    </p>

                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding:8px 0 32px;">
                          <a href="${resetLink}"
                            style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#2563eb,#4f46e5);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:10px;letter-spacing:0.3px;">
                            Reset My Password →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <div style="background:#f8fafc;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
                      <p style="margin:0;color:#64748b;font-size:13px;">
                        ⏰ <strong>This link expires in 15 minutes.</strong><br/>
                        If you did not request a password reset, you can safely ignore this email.
                      </p>
                    </div>

                    <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
                      If the button doesn't work, copy and paste this link in your browser:<br/>
                      <a href="${resetLink}" style="color:#2563eb;word-break:break-all;">${resetLink}</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center;">
                    <p style="margin:0;color:#94a3b8;font-size:12px;">
                      LeadDesk Mini · Digital Heroes<br/>
                      <a href="mailto:contact@digitalheroesco.com" style="color:#2563eb;text-decoration:none;">contact@digitalheroesco.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }

  await transporter.sendMail(mailOptions)
}
