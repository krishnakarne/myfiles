import {
  buildEmailHtml,
  buildEmailText,
  DEFAULT_REPORT_TO,
  getReportDateKey,
  loadDay,
} from './_lib/analytics.js';

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'GET') {
    return response.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const authHeader = request.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401).json({ ok: false, message: 'Unauthorized' });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
    return response.status(500).json({
      ok: false,
      message: 'Missing RESEND_API_KEY or RESEND_FROM environment variables.',
    });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return response.status(500).json({
      ok: false,
      message: 'Missing BLOB_READ_WRITE_TOKEN environment variable.',
    });
  }

  try {
    const dateKey = getReportDateKey();
    const analytics = await loadDay(dateKey);

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM,
        to: [process.env.REPORT_TO || DEFAULT_REPORT_TO],
        subject: `Portfolio analytics report — ${dateKey}`,
        html: buildEmailHtml(analytics),
        text: buildEmailText(analytics),
      }),
    });

    const resendJson = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend daily report failed:', resendJson);
      return response.status(500).json({ ok: false, resend: resendJson });
    }

    return response.status(200).json({ ok: true, date: dateKey, result: resendJson });
  } catch (error) {
    console.error('Daily analytics email failed:', error);
    return response.status(500).json({ ok: false, message: 'Daily analytics email failed.' });
  }
}
