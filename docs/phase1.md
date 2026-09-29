# Phase 1 data ingestion

## Setup

```bash
cp .env.example .env
npm install
createdb youtube_interest_radar
# set DATABASE_URL and a locally-generated APP_ENCRYPTION_KEY in .env
npm run migrate
npm run dev
```

For a no-account development server, retain `DEMO_MODE=true` and run `npm run demo`. Fixture data is bundled in `src/fixtures/demo-data.ts`, is clearly synthetic, and never uses credentials. It is available through `/api/me`, `/api/me/subscriptions`, `/api/me/liked-videos`, `/api/me/playlists`, and `/api/me/status`.

For live mode set `DEMO_MODE=false`, configure an OAuth Web client redirect URI equal to `GOOGLE_REDIRECT_URI`, set PostgreSQL configuration and a 32-byte base64 encryption key, then visit `/auth/google`. The sole requested scope is `youtube.readonly`. The application writes encrypted OAuth credentials to `oauth_accounts`; it does not return or log them.

## Schema

`migrations/001_phase1_ingestion.sql` creates `users`, `oauth_accounts`, `youtube_channels`, `subscriptions`, `youtube_videos`, `liked_videos`, `youtube_playlists`, and `playlist_videos`. Composite primary keys prevent repeated relationship rows. User lookup indexes support endpoint reads.

## Known limits

The API cannot retrieve native watch or search history. Playlists and likes are imported as complete, paginated snapshots; this is ingestion only, not interest extraction or recommendation. API/quota, OAuth, malformed pagination, and database errors yield sanitized client errors; no provider error payload or secret is exposed.
