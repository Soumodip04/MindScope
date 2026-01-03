# MindScope Voice, AI Therapist, Security & Backend Architecture

_Last updated: 2025-09-19_

## Table of Contents
1. [Overview](#overview)
2. [Voice Technologies](#voice-technologies)
   - [Speech-to-Text (STT)](#speech-to-text-stt)
   - [Text-to-Speech (TTS)](#text-to-speech-tts)
   - [Streaming Architecture](#streaming-architecture)
   - [Latency & UX Optimizations](#latency--ux-optimizations)
   - [Privacy Enhancements](#privacy-enhancements)
3. [AI Therapist Architecture](#ai-therapist-architecture)
   - [High-Level Flow](#high-level-flow)
   - [Context Assembly](#context-assembly)
   - [LLM Orchestration & Tools](#llm-orchestration--tools)
   - [Emotion Detection Integration](#emotion-detection-integration)
   - [Memory Strategy](#memory-strategy)
   - [Recommendation Engine](#recommendation-engine)
   - [Safety & Escalation Workflow](#safety--escalation-workflow)
4. [Data Security & Encryption](#data-security--encryption)
   - [In-Transit](#in-transit)
   - [At-Rest](#at-rest)
   - [Field-Level / Application Encryption](#field-level--application-encryption)
   - [Hashing & Pseudonymization](#hashing--pseudonymization)
   - [Secrets & Key Management](#secrets--key-management)
   - [Logging & Observability](#logging--observability)
   - [Backup & Recovery](#backup--recovery)
   - [Compliance-Oriented Design](#compliance-oriented-design)
5. [Access Control Model](#access-control-model)
   - [Roles (RBAC)](#roles-rbac)
   - [Attributes (ABAC Extensions)](#attributes-abac-extensions)
   - [Break-Glass Procedure](#break-glass-procedure)
   - [Policy Enforcement Pipeline](#policy-enforcement-pipeline)
6. [Backend Components & Stack](#backend-components--stack)
   - [Current Indicators](#current-indicators)
   - [Recommended Architecture Layers](#recommended-architecture-layers)
   - [Data Model Concepts](#data-model-concepts)
   - [Scaling Plan](#scaling-plan)
   - [Performance Guidance](#performance-guidance)
   - [Observability Practices](#observability-practices)
7. [Illustrative Code Snippets](#illustrative-code-snippets)
8. [Priority Implementation Checklist](#priority-implementation-checklist)
9. [Risk Matrix & Mitigations](#risk-matrix--mitigations)
10. [Plain-Language Summary](#plain-language-summary)
11. [Glossary](#glossary)
12. [Next Steps](#next-steps)

---
## Overview
This document describes how MindScope handles voice interaction, AI therapist logic, data protection, access control, and backend system design. It is both a blueprint for implementation and a reference for engineering, compliance, and product decision-making.

---
## Voice Technologies
### Speech-to-Text (STT)
**Options:**
- Cloud: OpenAI Whisper (API / Realtime), Azure Speech, Google STT, Deepgram, AssemblyAI.
- Self-Hosted: Whisper (GPU), whisper.cpp (CPU/edge), Vosk, NVIDIA NeMo.

**Selection Criteria:** Accuracy, latency, multilingual support, privacy requirements, cost predictability, streaming support.

**Recommended Initial Approach:** Start with a cloud streaming API (rapid iteration), add optional self-hosted Whisper cluster for privacy-mode sessions later.

### Text-to-Speech (TTS)
**Options:** Azure Neural Voices, ElevenLabs, Google Cloud TTS, OpenAI Audio responses, Coqui TTS (self-hosted), XTTS.

**Streaming Playback:** Fetch audio in chunks (WebSocket / chunked HTTP) and append to a `MediaSource` buffer so speech begins before the full response is synthesized.

### Streaming Architecture
```
[Browser Mic] -> MediaRecorder -> WS -> /api/voice/stream -> STT Engine
                                             |                    |
                                             v                    v
                                      Partial Transcripts   Final Transcript
                                             |                    |
                                             +----> AI Orchestrator ----> LLM ----> Safety Filter ----> TTS Stream --> Browser Audio
```

### Latency & UX Optimizations
- 16 kHz mono PCM or Opus frames.
- Start inference on partial buffers (200–500 ms windows).
- Use VAD to segment (Silero / WebRTC VAD).
- Parallelize: Begin TTS on first complete sentence while later sentences still generating.
- Show “live captions” using interim transcript events.

### Privacy Enhancements
- Consent flag controls whether audio is retained.
- Optional local pre-processing: noise suppression, PII keyword redaction.
- Differential privacy for aggregate acoustic analytics (later phase).

---
## AI Therapist Architecture
### High-Level Flow
1. User speaks or types.
2. Transcription & emotion signals generated.
3. Context assembly (recent chat + user state + emotion snapshot + goals).
4. Policy-constrained prompt built.
5. LLM invoked (with optional tool calls).
6. Response validated (safety, tone, length) & optionally transformed.
7. Response delivered (text + optional TTS) & logged with anonymity safeguards.
8. Summarization and memory updates queued asynchronously.

### Context Assembly
Sources merged:
- Recent messages (rolling window N).
- Session summary (compressed every ~10 turns).
- Emotion snapshot (scores + confidence gating > threshold).
- User profile (preferences, sensitivities, language, pacing).
- Risk signals (previous self-harm flags, escalations).

### LLM Orchestration & Tools
Common internal tool functions (schema-based):
- `get_mood_trends(userId)`
- `fetch_journal_summary(userId)`
- `schedule_followup(userId, datetime)`
- `risk_assessment(text)`
- `fetch_breathing_recommendation(stressLevel)`

### Emotion Detection Integration
Modalities:
- Text sentiment & affect classification.
- (Optional) Facial expression model (CNN/Transformer) via user camera.
- Prosody analysis (pitch variance, energy, speech rate).
- Fusion: Weighted or learned model; only include in prompt if `confidence >= 0.7`.

### Memory Strategy
Memory tiers:
- Short-Term: Last N raw turns.
- Mid-Term: Periodic summary objects + embeddings.
- Long-Term: User preference / goals profile, updated sparingly.

Storage:
- Embeddings in `pgvector` or external vector DB.
- Summaries labeled with semantic tags ("anxiety coping", "sleep issues").

### Recommendation Engine
Approaches:
1. Rule-based MVP (threshold triggers).  
2. Pattern mining (moving averages on stress/mood).  
3. Embedding similarity (match to known improvement clusters).  
4. ML sequence model (long-term personalization).  

Output JSON contract:
```json
{
  "interventions": [
    {"type": "breathing", "duration": 300, "reason": "rising stress"},
    {"type": "journaling", "prompt": "Reflect on a calming recent moment"}
  ]
}
```

### Safety & Escalation Workflow
Severity levels:
- Low: Gentle grounding suggestions.
- Medium: Encourage reaching trusted contact / professional.
- High: Immediate crisis hotline resources + restrict general conversation scope.

Escalation pipeline:
1. Classify message risk.
2. If high: lock advanced features, show crisis UI.
3. Log `RiskEvent` + notify authorized staff channel.
4. Offer region-based hotline list.

---
## Data Security & Encryption
### In-Transit
- Enforce HTTPS (TLS 1.2+). HSTS. Secure WebSockets (`wss`).
- Content Security Policy limiting exfiltration vectors.

### At-Rest
- Cloud-managed disk encryption.
- Sensitive columns: field-level encryption (therapy notes, journal entries, raw biometrics).

### Field-Level / Application Encryption
Pattern: Envelope encryption.
- Generate Data Encryption Key (DEK) per record or per user.
- Encrypt DEK with Key Encryption Key (KEK) from KMS.
- Store `{encryptedDek, ciphertext, iv, tag}`.

### Hashing & Pseudonymization
- Argon2id for user reference hashing in logs.
- Replace direct user IDs with pseudonymous tokens in analytics.

### Secrets & Key Management
- Store secrets in platform vault (Vercel env vars, no client exposure).
- Key rotation schedule (quarterly or on incident).

### Logging & Observability
- Structured JSON logs (PII scrubbed at middleware layer).
- Separate high-sensitivity event index (restricted).
- Tamper-evidence: optional chained hash of log batches.

### Backup & Recovery
- Automated daily backups + point-in-time recovery.
- Quarterly restore drills.
- Encrypted backups (KMS wrapped).

### Compliance-Oriented Design
- Data minimization (only necessary signals).
- Explicit consent ledger (scope + timestamp + version).
- Right-to-delete cascade deletes embeddings & summaries.
- Role-based masking for support vs. clinical roles.

---
## Access Control Model
### Roles (RBAC)
- `user` – personal data only.
- `therapist` – assigned user therapeutic content.
- `counselor` – limited view (no raw sensitive notes unless consented).
- `admin` – platform ops (no therapy content by default).
- `system` – internal automation tasks.

### Attributes (ABAC Extensions)
- `license_status`, `consent_scope`, `region`, `risk_level`, `data_classification`.

### Break-Glass Procedure
Steps:
1. Request with justification.
2. Dual approval (admin + compliance).
3. Time-bound decryption token.
4. Automatic post-access review log.

### Policy Enforcement Pipeline
1. AuthN (session/JWT) → attach actor context.
2. Policy evaluation (Casbin/OPA or in-app rules).
3. Data filtering (strip ineligible fields before returning response).
4. Audit log (`ALLOW`/`DENY`).

---
## Backend Components & Stack
### Current Indicators
- Next.js App Router (TypeScript).
- Prisma / `schema.prisma` (Postgres expected).
- Modular React components for AI & emotion features.

### Recommended Architecture Layers
Layer | Responsibility | Example Tech
----- | -------------- | -----------
API & Routing | REST + Streaming endpoints | Next.js Route Handlers
Auth | Identity, sessions, role claims | NextAuth / custom JWT
LLM Orchestration | Prompt assembly, tool calls | Serverless / Edge runtime
Background Jobs | Async summarization & risk eval | BullMQ + Redis
DB | Relational core & embeddings | Postgres + pgvector
Cache | Session context, rate limits | Redis
File/Object Storage | Audio, exports | S3 / R2 (encrypted)
Vector Retrieval | Semantic memory | pgvector / Pinecone / Qdrant
Monitoring | Metrics & traces | OpenTelemetry + Grafana / Honeycomb
Content Safety | Moderation, risk scoring | OpenAI / custom classifier
Policy Engine | Access decisions | In-app or OPA

### Data Model Concepts
Entities (conceptual):
- `User(id, role, locale, consent_version, risk_flag)`
- `TherapySession(id, user_id, started_at, ended_at, summary_embed vector, risk_level)`
- `Message(id, session_id, sender_type, content_encrypted, created_at)`
- `JournalEntry(id, user_id, content_encrypted, sentiment, created_at)`
- `EmotionSnapshot(id, user_id, anxiety_score, mood_label, source, confidence, created_at)`
- `AccessAudit(id, actor_id, action, resource_type, resource_id, status, justification_hash, created_at)`
- `RiskEvent(id, user_id, type, severity, detected_at, handled_by)`

### Scaling Plan
Phase | Focus
----- | -----
1 | Single Postgres + serverless LLM calls.
2 | Add Redis + background jobs.
3 | Introduce vector indexing & GPU STT microservice.
4 | Multi-region read replicas; edge personalization.
5 | Advanced privacy modes (on-device partial STT/TTS).

### Performance Guidance
- Stream incremental AI tokens (SSE / WebSocket).
- Pre-warm system prompt & tool schema.
- Cache user profile & preference embedding.
- Sentence-level partial TTS.

### Observability Practices
- Attach `trace_id` to every user interaction.
- Dashboards: latency, token usage, risk events frequency, transcription word error rate.
- Alerting thresholds on failed moderation or elevated high-risk messages.

---
## Illustrative Code Snippets
### Field-Level Encryption (Node/TypeScript)
```ts
import crypto from 'crypto';
const ALG = 'aes-256-gcm';

export function encryptField(plaintext: string, base64Key: string) {
  const key = Buffer.from(base64Key, 'base64');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALG, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64')}.${tag.toString('base64')}.${enc.toString('base64')}`;
}

export function decryptField(payload: string, base64Key: string) {
  const [ivB64, tagB64, dataB64] = payload.split('.');
  const key = Buffer.from(base64Key, 'base64');
  const iv = Buffer.from(ivB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');
  const data = Buffer.from(dataB64, 'base64');
  const decipher = crypto.createDecipheriv(ALG, key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return dec.toString('utf8');
}
```

### Prompt Assembly (Conceptual)
```ts
function buildTherapyPrompt(ctx: {
  profileSummary: string;
  recentMessages: string[];
  emotionSummary?: string;
  goals?: string;
  riskSignals?: string;
}) {
  return `You are an empathetic, non-diagnostic AI therapist assistant.\n
User profile: ${ctx.profileSummary}\n
Recent exchange summary: ${summarize(ctx.recentMessages)}\n
Emotion indicators: ${ctx.emotionSummary || 'none'}\n
Risk signals: ${ctx.riskSignals || 'none'}\n
Instructions: Respond in <120 words, warm, supportive, avoid medical claims, encourage professional help when appropriate.`;
}
```

### Audit Logging Skeleton
```ts
async function audit(prisma, actorId: string, action: string, resource: string, status: 'ALLOW'|'DENY', meta?: any) {
  await prisma.accessAudit.create({
    data: {
      actorId,
      action,
      resourceType: resource.split(':')[0],
      resourceId: resource.split(':')[1] || null,
      status,
      metadata: meta ? JSON.stringify(meta) : null
    }
  });
}
```

---
## Priority Implementation Checklist
1. Implement RBAC middleware (`user`, `therapist`, `admin`).
2. Add encryption utility + migrate sensitive fields.
3. Create `/api/voice/stream` endpoint (stub) + choose initial STT provider.
4. Add moderation & risk classification layer.
5. Memory summarization job (every 10 messages → summary + embedding store).
6. Basic recommendation rules (stress → breathing suggestion).
7. Access audit logging table + helper.
8. Backup policy documentation & enable automated snapshots.
9. Monitoring: integrate OpenTelemetry exporter + minimal dashboards.
10. Add consent ledger & deletion cascade procedure.

---
## Risk Matrix & Mitigations
Risk | Impact | Mitigation
---- | ------ | ---------
Model hallucination | Misinformation | Guardrail prompt + post-filter classifier
Unauthorized data access | Privacy breach | Field encryption + RBAC + audits
Crisis missed | User safety | Multi-signal risk classifier + escalation UI
Latency spikes | Poor UX | Streaming + caching + progressive rendering
Vendor lock-in (STT/LLM) | Cost / inflexibility | Abstract provider interface

---
## Plain-Language Summary
MindScope listens to the user, understands mood signals, and replies in a caring way while protecting privacy. Sensitive text is encrypted so only allowed roles can see it. The system remembers themes (not all raw words) to stay helpful over time. If there’s a crisis sign, it quickly shifts to safety mode. Everything is logged so there is accountability.

---
## Glossary
- **STT:** Speech-to-Text.
- **TTS:** Text-to-Speech.
- **LLM:** Large Language Model.
- **VAD:** Voice Activity Detection.
- **RBAC/ABAC:** Role / Attribute-Based Access Control.
- **DEK/KEK:** Data / Key Encryption Key.
- **pgvector:** Postgres extension for vector similarity.

---
## Next Steps
- Decide initial STT/TTS vendors.
- Implement encryption & RBAC middleware.
- Build streaming voice route & test latency.
- Add emotion snapshot pipeline (start with text sentiment).
- Integrate memory summarization & embeddings.
- Stand up monitoring + risk classifier.

> For implementation assistance, open an issue or request specific code scaffolding.
