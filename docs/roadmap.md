# Roadmap

## Phase 0 — API feasibility (current)
Verify official capabilities, implement a minimal OAuth/public-metadata test, record constraints, and stop for architecture review.

## Phase 1 — Authentication + data ingestion
Add consent UX, a PostgreSQL schema, encrypted/managed credential handling if needed, subscriptions/likes/playlists ingestion, and an opt-in import adapter for user-provided activity data.

## Phase 2 — Interest extraction
Normalize permitted signals into events and derive transparent, time-weighted topic interests.

## Phase 3 — Recommendation engine
Retrieve compliant candidate videos and rank them using explicit interest signals, freshness, diversity, and source balance.

## Phase 4 — Personalized feed
Build the Next.js/TypeScript/Tailwind feed UI and recommendation explanations.

## Phase 5 — Feedback loop
Capture explicit user feedback, improve ranking, and implement data controls/deletion flows.

## Phase 6 — UI polish
Improve onboarding, accessibility, loading/error states, and mobile presentation.

## Phase 7 — Testing/deployment
Add integration/e2e tests, policy/security review, monitoring, quota handling, CI, and production deployment.

## Phase 1 status — implemented, pending environment verification
The repository now contains OAuth ingestion, PostgreSQL migration/schema, normalized subscription/like/playlist persistence, authenticated internal read endpoints, and fixture demo mode. Live OAuth/database validation requires local credentials and PostgreSQL. Phase 2 must not begin until this ingestion implementation is reviewed.
