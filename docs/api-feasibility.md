# YouTube Data API feasibility — Phase 0

**Decision: FEASIBLE WITH MODIFICATIONS.** The documented API supports Google OAuth, subscriptions, user playlists, liked-video playlist items, and public metadata. It does **not** offer private watch-history or search-history retrieval. Therefore the MVP cannot infer "right now" interests from native YouTube history alone. It must begin with available signals and add an explicit, consented user-import path (for example, a Google Takeout export) before relying on recent activity.

## Evidence: official APIs investigated

| Capability | API available? | OAuth required? | Tested in this checkout? | Verified basis / compliant alternative |
|---|---:|---:|---:|---|
| Google OAuth authentication | Yes | N/A | No credentials supplied | [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2) |
| User subscriptions | Yes | Yes | No credentials supplied | `subscriptions.list` with `mine=true`; [reference](https://developers.google.com/youtube/v3/docs/subscriptions/list) |
| Watch history | **No** | N/A | Not applicable | The playlist-items reference says watch-history cannot be retrieved; [reference](https://developers.google.com/youtube/v3/docs/playlistItems/list). Use a user-consented import instead. |
| Search history | **No** | N/A | Not applicable | `search.list` executes a search and has no history resource; [reference](https://developers.google.com/youtube/v3/docs/search/list). Use a user-consented import instead. |
| Liked videos | Yes | Yes | No credentials supplied | Read the authenticated channel's likes playlist and list its items; [channel related playlists](https://developers.google.com/youtube/v3/docs/channels#contentDetails.relatedPlaylists.likes), [playlist items](https://developers.google.com/youtube/v3/docs/playlistItems/list). |
| User playlists | Yes | Yes | No credentials supplied | `playlists.list` with `mine=true`; [reference](https://developers.google.com/youtube/v3/docs/playlists/list) |
| Public video metadata | Yes | No for API-key reads | No API key supplied | `videos.list` by video ID; [reference](https://developers.google.com/youtube/v3/docs/videos/list) |

“Tested” means a live API call from this repository, not a claim based only on documentation. The repository deliberately reports the unavailable capabilities as not testable rather than fabricating results.

## Authorization and implementation

The prototype requests only `https://www.googleapis.com/auth/youtube.readonly`, which is listed for the relevant read endpoints. The browser route performs an authorization-code OAuth flow, validates a cryptographic `state`, reads a small sample of subscriptions/playlists/likes, and drops the returned credentials after the response. It neither logs nor returns OAuth tokens. API-key access is used only for known public video IDs.

Required development variables are documented in [`.env.example`](../.env.example): OAuth client ID/secret/redirect URI, optional API key, and public test IDs. Create a Web OAuth client and configure its exact redirect URI in Google Cloud before using the interactive test.

## Quota and operational concerns

The default YouTube Data API quota allocation is 10,000 units per day per project. `search.list` costs 100 units; common list/read calls cost 1 unit. The exact cost table and quota-monitoring guidance are in the [YouTube Data API quota guide](https://developers.google.com/youtube/v3/determine_quota_cost). Candidate retrieval must therefore cache within policy, batch IDs, avoid repeated search calls, expose quota failures, and budget costly search operations.

The project must comply with the [YouTube API Services Developer Policies](https://developers.google.com/youtube/terms/developer-policies), including user transparency/privacy obligations, permitted data use, required deletion/update handling, and restrictions on retaining/cacheing API data. OAuth-based access is also subject to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including its Limited Use requirements where applicable. Phase 1 needs a privacy review, retention/deletion design, and consent copy before any persistent storage. Do not scrape, use private endpoints, or attempt to reconstruct unavailable history.

## Recommended MVP architecture

```text
USER
  ↓
Google OAuth ──→ subscriptions / likes / playlists
  ↓                          ↓
Consented import adapter ─→ normalized activity events
  ↓
Activity / interest extraction
  ↓
Interest model
  ↓
Candidate video retrieval (documented public YouTube API)
  ↓
Recommendation ranking
  ↓
Personalized feed
```

Keep activity ingestion behind an interface. The OAuth source provides subscriptions, likes, and playlists; an import source provides optional recency events. Both normalize into the same later activity model, so absent native history does not force a recommendation-engine rewrite. PostgreSQL belongs in Phase 1 when consented data actually needs persistence; a separate recommendation service and embeddings are intentionally deferred.

## How to run the evidence gathering

```bash
cp .env.example .env
npm install
npm test
npm run typecheck
npm run dev
# visit http://localhost:3000/auth/google for an OAuth test
npm run feasibility
```

`npm run feasibility` writes only a sanitized development report to the ignored `data/feasibility-report.json`; it never stores secrets or tokens. The interactive endpoint returns a bounded sample rather than persisting user data.
