# YouTube Interest Radar — Phase 0

This repository is an API-feasibility spike, not a recommendation product. It only uses documented Google OAuth and YouTube Data API v3 endpoints; it does not scrape YouTube or infer unavailable private history.

## Run

```bash
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:3000/health`, then visit `http://localhost:3000/auth/google` to begin an OAuth test. OAuth credentials and consent-screen setup are required. The callback returns a **sanitized** summary and never logs credentials or tokens.

For a command-line feasibility run:

```bash
npm run feasibility
```

Without OAuth variables this still reports the documented capability matrix. Add `YOUTUBE_API_KEY` and public IDs to check public video metadata; add OAuth variables for the authenticated subscriptions/playlists/likes test. See [docs/api-feasibility.md](docs/api-feasibility.md).

## Scope boundary

Phase 0 stops after documenting and testing available APIs. In particular, it does not implement activity ingestion, interest inference, ranking, a database, or a polished frontend. PostgreSQL is deferred until Phase 1 because there is no persistence need in this spike.
