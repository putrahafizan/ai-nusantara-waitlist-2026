/**
 * Email Service
 * Send confirmation emails using Resend
 */

require('dotenv').config();

// Resend client (if API key is available)
let resend = null;
if (process.env.RESEND_API_KEY) {
  try {
    const { Resend } = require('resend');
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log('Resend client initialized');
  } catch (error) {
    console.error('Failed to initialize Resend:', error.message);
  }
}

/**
 * Send confirmation email
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name (optional)
 * @returns {Promise<Object>} Result
 */
async function sendConfirmationEmail(to, name = '') {
  const recipientName = name || 'Teman';

  const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Selamat Datang di AI NUSANTARA</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; width: 60px; height: 60px; background: #2563eb; border-radius: 12px; line-height: 60px; color: white; font-size: 24px; font-weight: bold;">
        AI
      </div>
      <h1 style="color: #111827; font-size: 28px; margin: 20px 0 10px;">AI NUSANTARA</h1>
      <p style="color: #6b7280; font-size: 16px; margin: 0;">Platform AI untuk Produktivitas Riset Akademik Indonesia</p>
    </div>

    <div style="background: #f9fafb; border-radius: 16px; padding: 40px; margin-bottom: 30px;">
      <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px;">Selamat Datang, ${recipientName}!</h2>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
        Terima kasih telah bergabung dengan <strong>AI NUSANTARA</strong> waitlist!
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
        Anda sekarang adalah salah satu dari <strong>100 pendaftar pertama</strong> yang akan mendapatkan:
      </p>

      <ul style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0 0 30px; padding-left: 20px;">
        <li style="margin-bottom: 10px;">Early access sebelum public launch</li>
        <li style="margin-bottom: 10px;"><strong>50% discount</strong> untuk early adopters</li>
        <li style="margin-bottom: 10px;">Updates eksklusif tentang development progress</li>
        <li style="margin-bottom: 10px;">Tips & tricks untuk produktivitas riset akademik</li>
      </ul>

      <div style="background: white; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <p style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 10px;">
          Apa Selanjutnya?
        </p>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0;">
          Kami akan menghubungi Anda dalam 3-6 bulan ketika platform kami siap untuk beta testing.
        </p>
      </div>

      <div style="text-align: center; margin-top: 40px;">
        <a href="https://linkedin.com" style="display: inline-block; background: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Connect di LinkedIn
        </a>
      </div>
    </div>

    <div style="text-align: center; color: #9ca3af; font-size: 14px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 10px;">
        Questions? Just reply to this email.
      </p>
      <p style="margin: 0; font-size: 12px;">
        &copy; 2026 AI NUSANTARA. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;

  // If Resend is configured and not in development mode
  if (resend && process.env.NODE_ENV !== 'test') {
    try {
      const result = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'AI NUSANTARA <noreply@ai-nusantara.id>',
        to: to,
        subject: 'Selamat Datang di AI NUSANTARA!',
        html: emailHtml
      });

      console.log('Confirmation email sent to:', to);
      return result;
    } catch (error) {
      console.error('Failed to send email via Resend:', error);
      return { success: false, error: error.message };
    }
  }

  // Development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('\n' + '='.repeat(60));
    console.log('EMAIL PREVIEW (Development Mode)');
    console.log('='.repeat(60));
    console.log('To:', to);
    console.log('Subject: Selamat Datang di AI NUSANTARA!');
    console.log('HTML length:', emailHtml.length, 'characters');
    console.log('='.repeat(60) + '\n');
  }

  return { success: true, mode: 'development' };
}

module.exports = {
  sendConfirmationEmail
};
