import {
  buildVisitorHash,
  getClientIp,
  getTrackingDateKey,
  loadDay,
  normalizePath,
  normalizeReferrer,
  saveDay,
} from './_lib/analytics.js';

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    return response.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return response.status(200).json({ ok: false, configured: false, message: 'Blob storage is not configured yet.' });
  }

  try {
    const payload = typeof request.body === 'string' ? JSON.parse(request.body || '{}') : request.body || {};
    const dateKey = getTrackingDateKey();
    const analytics = await loadDay(dateKey);

    const path = normalizePath(payload.path);
    const referrer = normalizeReferrer(payload.referrer, request.headers.host);
    const visitor = buildVisitorHash(getClientIp(request), request.headers['user-agent'], dateKey);

    analytics.pageViews += 1;
    analytics.pages[path] = (analytics.pages[path] || 0) + 1;
    analytics.referrers[referrer] = (analytics.referrers[referrer] || 0) + 1;

    if (!analytics.visitors[visitor]) {
      analytics.visitors[visitor] = Date.now();
      analytics.uniqueVisitors += 1;
    }

    analytics.updatedAt = new Date().toISOString();

    await saveDay(analytics);

    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Portfolio analytics tracking failed:', error);
    return response.status(200).json({ ok: false, message: 'Tracking failed gracefully.' });
  }
}
