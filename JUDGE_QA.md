# MindScope — Judge Q&A Deck

## 1) PWA Basics (Short Q&A)

### Q: How do PWAs work on low/poor networks?

- Service worker caches the app shell and key data so UI loads offline.
- Background Sync queues actions and sends when online again.
- IndexedDB stores local data; runtime caching (stale‑while‑revalidate) reduces bandwidth.
- Progressive enhancement: lighter assets on slow connections.

### Q: How do I install the PWA on mobile?

- Android (Chrome/Edge): Visit site → “Add to Home Screen” prompt → tap to install.
- iOS (Safari): Share → Add to Home Screen.
- Requirements: HTTPS, valid `manifest.json` (name/icons/theme), and a registered service worker.

### Q: How does a PWA work under the hood?

- `manifest.json` describes install metadata (name, icons, colors, display).
- Service worker intercepts requests, serves cache, syncs in background, can receive push.
- App Shell model caches UI first; content streams in when available.
- HTTPS is mandatory for security.

## 2) Safety: Incorrect/Fake Info (Short Q&A)

### Q: What if users enter fake or incorrect info about their mental state?

- Treat as uncertainty: ask one clarifying question, provide neutral CBT/DBT coping steps, avoid labels.
- If crisis language appears anytime, show 988/911 and grounding steps.
- No punishment; private flag with audit trail; optional human handoff. Data is minimal, consented, encrypted.

## 3) Safety: Misread Emotions (Short Q&A)

### Q: If AI misreads emotions, when/how is fallback triggered?

- Triggers: low confidence, contradictions, user pushback (“that’s not how I feel”), crisis keywords, or concerning patterns.
- Response: switch to neutral guidance + 1 clarifying question; if high‑risk → crisis rails + one‑tap human handoff; all actions audited and role‑scoped.

## 4) Practical Integrations (LMS, SIS, Email, Calendars)

### Q: How do you integrate with LMS?

- Use LTI 1.3 + LTI Advantage for secure launch from Canvas/Moodle/Blackboard/Google Classroom.
- Pull courses/rosters via LMS APIs; post outcomes/grades back via Assignments & Grades Service.

### Q: How do you integrate with SIS?

- OneRoster (CSV nightly via SFTP or REST) or Ed‑Fi; or broker via Clever/ClassLink.
- Nightly full sync + incremental updates; idempotent upserts keyed by `source:externalId`.

### Q: Email integration?

- Send notifications with SendGrid/SES; handle bounces and rate limits.
- Optional “send as user” via Gmail API/Microsoft Graph (OAuth, user consent, least‑privilege scopes).

### Q: Calendar integration?

- Create/update events via Google Calendar API or Microsoft Graph.
- Support read‑only `.ics` feeds; use webhooks/watch channels to keep in sync.

### Security & SSO (applies across integrations)

- SSO with OIDC/SAML (Google/Azure), per‑tenant secrets, least‑privilege scopes, audit logs.

## 5) USP & Differentiation

- Privacy‑First: Minimal, consented data; encryption; strict RBAC; auditable actions.
- Offline‑First PWA: Reliable on weak/no network; instant startup; background sync.
- Safety‑Centric AI: Confidence‑aware fallbacks, crisis rails, and rapid human handoff.
- Education‑Ready Integrations: LTI for LMS, OneRoster/Ed‑Fi/Clever/ClassLink for SIS.
- Multimodal & Cultural Adaptation: Text + optional signals; multilingual support.
- Deployable Anywhere: Next.js 15 with edge‑ready APIs; managed SaaS or private VPC.

## 6) Monetization

- Institutional SaaS: Per‑student/year or seat‑based tiers for schools/universities.
- Tiered Plans: Core (assistant, journaling), Plus (integrations, analytics), Enterprise (SSO, SLAs, VPC).
- Add‑Ons: Crisis workflows, premium analytics, multilingual packs, white‑label branding, counselor seats.
- B2C Premium: Low‑cost subscription for individuals (advanced content and insights).
- Partnerships & Grants: University/health partners, CSR/grants to subsidize seats.

## 7) One‑Liners for Judges

- PWA: “Loads fast on weak networks, works offline, and syncs later.”
- Safety: “Unsure → neutral coping; risky → crisis rails; human handoff anytime.”
- Integrations: “Standards‑based (LTI/OneRoster/Graph/Google) with least‑privilege and audits.”
- USP: “Privacy‑first, offline‑first mental health AI built for education.”
- Monetization: “Institutional SaaS with premium add‑ons and B2C tiers.”
