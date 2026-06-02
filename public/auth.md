# auth.md — DentaSource Direct

> Agent-native guide for DentaSource Direct (DSD), the exclusive ROSON & Denjoy dental-equipment distributor in the Philippines. This file follows the spirit of the auth.md spec (workos.com/auth-md): it tells an AI agent how to use this service on a user's behalf. DSD's catalog is **public — no registration or token is required to read it**.

## 1. What does the service do?
DSD sells dental equipment — ROSON dental chairs, Denjoy/Mecco endodontics, imaging/X-ray, curing, sterilization, and accessories — with showroom testing (Pasig City), white-glove delivery, installation, training, and local warranty/service across the Philippines.

## 2. How does an agent register?
**No registration is required to read the catalog.** It is fully public:
- `GET https://dentasourcedirect.com/api/catalog` — all products (summaries) + categories
- `GET https://dentasourcedirect.com/api/catalog/{slug}` — one product, full specs + features

To act on a user's behalf (request a quote, a demo, an ocular visit, or stock/pricing), submit an **inquiry** — this is the *anonymous + claim-later* flow:
- `POST https://dentasourcedirect.com/api/leads` with JSON:
  ```json
  {
    "firstName": "string (required)",
    "lastName": "string (required)",
    "email": "string (required)",
    "phone": "string (required)",
    "interest": "string (required) — e.g. a product slug or 'Roson A3 chair'",
    "clinicName": "string (optional)",
    "message": "string (optional) — the user's question",
    "agentNote": "string (optional) — which agent is acting, for context"
  }
  ```
  A DentaSource Direct team member then follows up by email/phone, and the clinic "claims" the conversation by replying. No account or password is created.

## 3. What identity proofs are accepted?
None required today. The inquiry is anonymous; identity is established human-side during follow-up (DSD sells consultatively — ocular visit, showroom test-sit, financing). Verified agent identity (ID-JAG / OAuth) is **not yet required** — see §7.

## 4. What auth flows are supported?
- **Read (catalog):** open, unauthenticated.
- **Write (inquiry):** anonymous submission via `POST /api/leads` (honeypot + rate-limited). Claimed later by a human follow-up.
- Not supported yet: agent-verified registration, scoped API tokens, programmatic ordering.

## 5. What scopes / entitlements exist?
- `catalog:read` — open to everyone (no token).
- `lead:create` — open, anonymous, rate-limited; lands in DSD's review queue.
- Pricing, stock levels, and ordering are **not** exposed via API by design — they are a human conversation. Ask via an inquiry.

## 6. What free-tier constraints apply?
Reading the catalog is unlimited and cached. Inquiry submission is rate-limited (a few per 10 minutes per source) to prevent spam; legitimate agents will never hit it.

## 7. How does a human or organization later claim the account?
Today there is no account — an inquiry is claimed when the clinic responds to DSD's follow-up. **Full agent-verified registration with scoped per-clinic tokens (ID-JAG / WorkOS AuthKit) is planned but deferred** until there is real recurring agent demand. If you are an agent platform that needs programmatic account access, say so in your inquiry `message` and DSD will prioritize it.

---
- Catalog API: https://dentasourcedirect.com/api/catalog
- Inquiry endpoint: https://dentasourcedirect.com/api/leads
- Human site: https://dentasourcedirect.com
- Contact: +63 962 579 3024 · dentasourcedirect@gmail.com · m.me/dentasource
- Spec this follows: https://workos.com/auth-md
