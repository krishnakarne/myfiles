import crypto from 'node:crypto';
import { list, put } from '@vercel/blob';

export const REPORT_TIMEZONE = process.env.REPORT_TIMEZONE || 'America/New_York';
export const DEFAULT_REPORT_TO = process.env.REPORT_TO || 'karnekrishna6@gmail.com';

function makeDateKey(date = new Date(), timeZone = REPORT_TIMEZONE) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const lookup = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );

  return `${lookup.year}-${lookup.month}-${lookup.day}`;
}

export function getTrackingDateKey(date = new Date()) {
  return makeDateKey(date, REPORT_TIMEZONE);
}

export function getReportDateKey(date = new Date()) {
  const shifted = new Date(date.getTime() - 2 * 60 * 60 * 1000);
  return makeDateKey(shifted, REPORT_TIMEZONE);
}

export function createEmptyDay(dateKey) {
  return {
    date: dateKey,
    timezone: REPORT_TIMEZONE,
    pageViews: 0,
    uniqueVisitors: 0,
    pages: {},
    referrers: {},
    visitors: {},
    updatedAt: null,
  };
}

export async function loadDay(dateKey) {
  const { blobs } = await list({ prefix: `analytics/${dateKey}.json`, limit: 1 });

  if (!blobs.length) {
    return createEmptyDay(dateKey);
  }

  const response = await fetch(blobs[0].url, { cache: 'no-store' });

  if (!response.ok) {
    return createEmptyDay(dateKey);
  }

  const parsed = await response.json();

  return {
    ...createEmptyDay(dateKey),
    ...parsed,
    date: dateKey,
  };
}

export async function saveDay(day) {
  return put(`analytics/${day.date}.json`, JSON.stringify(day, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

export function getClientIp(request) {
  const forwarded = request.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded || request.socket?.remoteAddress || 'unknown';
  return String(raw).split(',')[0].trim();
}

export function buildVisitorHash(ip, userAgent, dateKey) {
  return crypto
    .createHash('sha256')
    .update(`${dateKey}|${ip || 'unknown'}|${userAgent || 'unknown'}`)
    .digest('hex')
    .slice(0, 24);
}

export function normalizePath(inputPath) {
  if (!inputPath) {
    return '/';
  }

  try {
    return new URL(inputPath, 'https://portfolio.local').pathname || '/';
  } catch {
    return '/';
  }
}

export function normalizeReferrer(referrer, host) {
  if (!referrer) {
    return 'Direct / Unknown';
  }

  try {
    const refUrl = new URL(referrer);
    const refHost = refUrl.hostname.replace(/^www\./, '');
    const currentHost = String(host || '').replace(/^www\./, '');

    if (!refHost || refHost === currentHost) {
      return 'Direct / Internal';
    }

    return refHost;
  } catch {
    return 'Direct / Unknown';
  }
}

export function sortEntries(record = {}, limit = 5) {
  return Object.entries(record)
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildEmailHtml(day) {
  const topPages = sortEntries(day.pages);
  const topReferrers = sortEntries(day.referrers);

  const pageRows = topPages.length
    ? topPages.map(([path, count]) => `<li><strong>${escapeHtml(path)}</strong> — ${count}</li>`).join('')
    : '<li>No page views recorded yet.</li>';

  const referrerRows = topReferrers.length
    ? topReferrers.map(([source, count]) => `<li><strong>${escapeHtml(source)}</strong> — ${count}</li>`).join('')
    : '<li>No referrer data recorded yet.</li>';

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 8px;">Portfolio analytics report</h2>
      <p style="margin-top: 0; color: #4b5563;">Report date: <strong>${escapeHtml(day.date)}</strong> (${escapeHtml(day.timezone || REPORT_TIMEZONE)})</p>
      <div style="margin: 20px 0; padding: 16px; border: 1px solid #dbeafe; border-radius: 12px; background: #eff6ff;">
        <p style="margin: 0 0 8px;"><strong>Unique visitors:</strong> ${day.uniqueVisitors}</p>
        <p style="margin: 0;"><strong>Total page views:</strong> ${day.pageViews}</p>
      </div>
      <h3>Top pages</h3>
      <ul>${pageRows}</ul>
      <h3>Top referrers</h3>
      <ul>${referrerRows}</ul>
      <p style="color: #6b7280; font-size: 13px;">This report is generated from your portfolio's first-party analytics tracker and sent once per day.</p>
    </div>
  `;
}

export function buildEmailText(day) {
  const topPages = sortEntries(day.pages)
    .map(([path, count]) => `- ${path}: ${count}`)
    .join('\n') || '- No page views recorded yet.';

  const topReferrers = sortEntries(day.referrers)
    .map(([source, count]) => `- ${source}: ${count}`)
    .join('\n') || '- No referrer data recorded yet.';

  return [
    `Portfolio analytics report — ${day.date}`,
    `Timezone: ${day.timezone || REPORT_TIMEZONE}`,
    '',
    `Unique visitors: ${day.uniqueVisitors}`,
    `Total page views: ${day.pageViews}`,
    '',
    'Top pages:',
    topPages,
    '',
    'Top referrers:',
    topReferrers,
  ].join('\n');
}
