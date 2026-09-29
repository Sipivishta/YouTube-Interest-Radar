# Phase 0 architecture

Phase 0 is a small TypeScript/Node REST feasibility service. It has no database, frontend, recommendation engine, or background workers because none is necessary to validate API access. The Express server exposes health, documented capability data, and a narrow OAuth test. `googleapis` is isolated in `src/youtube/client.ts`; normalization is isolated in `src/youtube/normalize.ts`.

```text
USER
 ↓
Google OAuth
 ↓
YouTube data (subscriptions, likes, playlists; documented public metadata)
 ↓
Activity / interest extraction [future; imported activity is a separate source]
 ↓
Interest model [future]
 ↓
Candidate video retrieval [future]
 ↓
Recommendation ranking [future]
 ↓
Personalized feed [future]
```

## Design decisions

- **Frontend:** Deferred. Phase 0 uses JSON endpoints rather than prematurely creating a Next.js UI.
- **Backend:** Node.js + TypeScript + REST, with one deployable service.
- **Database:** PostgreSQL is the planned Phase 1 store, but is not installed or modeled in this validation-only phase.
- **Recommendation layer:** TypeScript initially if pursued; no LLM, embeddings, vector database, or microservice has been introduced.
- **Source boundary:** Later code must model OAuth-derived data and user-consented imports as separate adapters that emit normalized events. This is required because the official API cannot return private watch or search history.
- **Security:** configuration enters via environment variables. OAuth state is verified; tokens are not logged, returned, or persisted. Generated reports and credential/token paths are ignored by Git.
