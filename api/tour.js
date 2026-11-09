// Vercel serverless function: receives the tour form and emails the lead through Resend.
//
// Environment variables (set in Vercel > Project > Settings > Environment Variables):
//   RESEND_API_KEY   required. A Resend API key with sending access.
//   LEAD_FROM_EMAIL  optional. A sender on a domain verified in Resend,
//                    for example "AZ Cardominiums <leads@azcardominiums.com>".
//                    If unset, the first verified domain on the Resend account is
//                    used as "AZ Cardominiums <leads@that-domain>" (needs a full
//                    access API key so the function can list domains).
//   LEAD_TO_EMAIL    optional. Where leads go. Defaults to AzCardominiums@gmail.com.
//                    Separate several addresses with commas.

const DEFAULT_TO = 'AzCardominiums@gmail.com';
const ALLOWED_ORIGINS = [
  'https://www.azcardominiums.com',
  'https://azcardominiums.com',
  'https://azcardominiums.vercel.app',
];

const LIMITS = { name: 120, phone: 40, email: 200, interested_in: 120, message: 4000 };

function clean(value, max) {
  return String(value == null ? '' : value).replace(/\r/g, '').trim().slice(0, max);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function originAllowed(origin) {
  if (!origin) return true; // same-origin form posts from some browsers omit it
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Vercel preview deployments for this project
  return /^https:\/\/azcardominiums-[a-z0-9-]+\.vercel\.app$/.test(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin);
}

let cachedFrom = null;

// Finds a sender on the first verified domain in the Resend account.
async function resolveFrom(apiKey) {
  if (process.env.LEAD_FROM_EMAIL) return process.env.LEAD_FROM_EMAIL;
  if (cachedFrom) return cachedFrom;
  const r = await fetch('https://api.resend.com/domains', { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!r.ok) throw new Error('Could not list Resend domains (' + r.status + '). Set LEAD_FROM_EMAIL.');
  const json = await r.json();
  const domain = (json.data || []).find((d) => d.status === 'verified');
  if (!domain) throw new Error('No verified Resend domain found. Set LEAD_FROM_EMAIL.');
  cachedFrom = `AZ Cardominiums <leads@${domain.name}>`;
  console.log('Tour form: sending from', cachedFrom);
  return cachedFrom;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  if (!originAllowed(req.headers.origin)) {
    return res.status(403).json({ ok: false, error: 'Forbidden' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};

  // Honeypot: a filled "company" field means a bot. Report success, send nothing.
  if (clean(body.company, 200) !== '') {
    return res.status(200).json({ ok: true });
  }

  const lead = {};
  for (const key of Object.keys(LIMITS)) lead[key] = clean(body[key], LIMITS[key]);

  const errors = [];
  if (!lead.name) errors.push('name');
  if (lead.phone.replace(/\D/g, '').length < 10) errors.push('phone');
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) errors.push('email');
  if (errors.length) {
    return res.status(422).json({ ok: false, error: 'Invalid fields', fields: errors });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = (process.env.LEAD_TO_EMAIL || DEFAULT_TO).split(',').map((s) => s.trim()).filter(Boolean);
  if (!apiKey) {
    console.error('Tour form: RESEND_API_KEY is not set');
    return res.status(500).json({ ok: false, error: 'Email is not configured' });
  }
  let from;
  try {
    from = await resolveFrom(apiKey);
  } catch (err) {
    console.error('Tour form:', err.message);
    return res.status(500).json({ ok: false, error: 'Email is not configured' });
  }

  const rows = [
    ['Name', lead.name],
    ['Phone', lead.phone],
    ['Email', lead.email || '(not given)'],
    ['Interested in', lead.interested_in || '(not chosen)'],
  ];
  const text =
    'New tour request from azcardominiums.com\n\n' +
    rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
    '\n\nMessage:\n' + (lead.message || '(none)') + '\n';

  const phoneHref = 'tel:' + lead.phone.replace(/[^\d+]/g, '');
  const html =
    '<div style="font-family:Arial,sans-serif;font-size:15px;color:#1C1C1C;line-height:1.5">' +
    '<h2 style="margin:0 0 12px;font-size:20px">New tour request</h2>' +
    '<table cellpadding="6" style="border-collapse:collapse">' +
    rows.map(([k, v]) => {
      let val = escapeHtml(v);
      if (k === 'Phone') val = `<a href="${escapeHtml(phoneHref)}">${val}</a>`;
      if (k === 'Email' && lead.email) val = `<a href="mailto:${escapeHtml(lead.email)}">${val}</a>`;
      return `<tr><td style="color:#4A4540;font-weight:bold;vertical-align:top">${k}</td><td>${val}</td></tr>`;
    }).join('') +
    '</table>' +
    '<p style="margin:16px 0 4px;color:#4A4540;font-weight:bold">Message</p>' +
    `<p style="margin:0;white-space:pre-wrap">${escapeHtml(lead.message || '(none)')}</p>` +
    '<p style="margin:24px 0 0;color:#777;font-size:12px">Sent from the tour form on azcardominiums.com</p>' +
    '</div>';

  const payload = {
    from,
    to,
    subject: `Tour request: ${lead.name}${lead.interested_in ? ' (' + lead.interested_in + ')' : ''}`,
    text,
    html,
  };
  if (lead.email) payload.reply_to = lead.email;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      console.error('Tour form: Resend error', r.status, await r.text());
      return res.status(502).json({ ok: false, error: 'Could not send' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Tour form: request failed', err);
    return res.status(502).json({ ok: false, error: 'Could not send' });
  }
};
