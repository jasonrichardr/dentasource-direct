// POST /api/leads — agent/programmatic inquiry intake for the agent-ready storefront (Plan 02).
// Accepts JSON, drops it into the SAME lead pipeline a human form uses (status NEW →
// reviewed in /admin/leads). This is auth.md's "anonymous + claim-later" flow: an agent
// submits on a clinic's behalf, a human at DSD follows up and the clinic claims the thread.
// Defenses: honeypot + best-effort in-memory rate limit. No new login, no tokens (Phase 5 deferred).
import { submitLead } from '@/actions/lead';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Best-effort speed bump. Netlify functions are ephemeral so this resets per instance —
// the real defenses are the honeypot + human review of every NEW lead. Not a security boundary.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map(); // ip -> number[] (timestamps)

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(request) {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-nf-client-connection-ip') || 'unknown';
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400, headers: CORS });
  }

  // Honeypot: bots fill hidden fields. Pretend success, create nothing.
  if (body.company_website) {
    return Response.json({ success: true }, { headers: CORS });
  }

  if (rateLimited(clientIp(request))) {
    return Response.json(
      { error: 'rate_limited', retryAfterSeconds: WINDOW_MS / 1000 },
      { status: 429, headers: CORS }
    );
  }

  const { firstName, lastName, email, phone, clinicName, interest, message, agentNote } = body || {};
  if (!firstName || !lastName || !email || !phone || !interest) {
    return Response.json(
      {
        error: 'missing_fields',
        required: ['firstName', 'lastName', 'email', 'phone', 'interest'],
        optional: ['clinicName', 'message'],
        hint: 'See /auth.md for the inquiry contract.',
      },
      { status: 400, headers: CORS }
    );
  }

  // Tag provenance so the team sees this came through an agent (no schema change needed).
  const taggedMessage =
    `[Submitted via AI agent / auth.md]` +
    (agentNote ? ` (agent: ${String(agentNote).slice(0, 120)})` : '') +
    `\n\n` +
    (message || '');

  // Reuse the existing human-form pipeline (Prisma write + team email + revalidate).
  const fd = new FormData();
  fd.set('firstName', String(firstName));
  fd.set('lastName', String(lastName));
  fd.set('email', String(email));
  fd.set('phone', String(phone));
  if (clinicName) fd.set('clinicName', String(clinicName));
  fd.set('interest', String(interest));
  fd.set('message', taggedMessage);

  const result = await submitLead(fd);
  if (result?.error) {
    return Response.json({ error: result.error }, { status: 400, headers: CORS });
  }

  return Response.json(
    {
      success: true,
      message: 'Inquiry received. A DentaSource Direct team member will follow up by email/phone.',
    },
    { status: 201, headers: CORS }
  );
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  // Discoverability for a curious agent hitting the endpoint with GET.
  return Response.json(
    {
      endpoint: 'POST /api/leads',
      purpose: 'Submit a product inquiry on a clinic\'s behalf (anonymous lead flow).',
      contentType: 'application/json',
      required: ['firstName', 'lastName', 'email', 'phone', 'interest'],
      optional: ['clinicName', 'message', 'agentNote'],
      spec: 'https://dentasourcedirect.com/auth.md',
    },
    { status: 200, headers: CORS }
  );
}
