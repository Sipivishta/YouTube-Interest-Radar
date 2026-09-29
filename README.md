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

## Phase 1 ingestion

Phase 1 adds PostgreSQL-backed, OAuth-authorized ingestion for subscriptions, liked videos, playlists, and playlist items. See [Phase 1 setup](docs/phase1.md). `DEMO_MODE=true` runs with bundled synthetic fixtures and needs neither a Google account nor a database. Set `DEMO_MODE=false`, configure OAuth and PostgreSQL values, apply `npm run migrate`, and visit `/auth/google` for live ingestion.

This remains deliberately outside the recommendation-engine boundary: native watch and search history are unavailable through the documented API, and no activity importer is implemented yet.
