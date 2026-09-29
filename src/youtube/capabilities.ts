export type CapabilityKey = 'oauth' | 'subscriptions' | 'watchHistory' | 'searchHistory' | 'likedVideos' | 'playlists' | 'publicVideoMetadata';

export interface Capability {
  key: CapabilityKey;
  available: boolean;
  oauthRequired: boolean;
  testable: boolean;
  officialDocs: string;
  notes: string;
  alternative: string;
}

export const capabilities: Capability[] = [
  { key: 'oauth', available: true, oauthRequired: false, testable: true, officialDocs: 'https://developers.google.com/identity/protocols/oauth2', notes: 'Google OAuth 2.0 can authorize a user for YouTube Data API access.', alternative: 'Not applicable.' },
  { key: 'subscriptions', available: true, oauthRequired: true, testable: true, officialDocs: 'https://developers.google.com/youtube/v3/docs/subscriptions/list', notes: 'subscriptions.list supports mine=true for the authenticated user.', alternative: 'User-exported channel list.' },
  { key: 'watchHistory', available: false, oauthRequired: true, testable: false, officialDocs: 'https://developers.google.com/youtube/v3/docs/playlistItems/list', notes: 'The documented API explicitly excludes retrieval of the watch-history playlist.', alternative: 'User-provided activity export, such as Google Takeout, subject to user consent and import design.' },
  { key: 'searchHistory', available: false, oauthRequired: true, testable: false, officialDocs: 'https://developers.google.com/youtube/v3/docs/search/list', notes: 'search.list searches YouTube; it does not expose a user search-history resource.', alternative: 'User-provided/imported search activity.' },
  { key: 'likedVideos', available: true, oauthRequired: true, testable: true, officialDocs: 'https://developers.google.com/youtube/v3/docs/channels#contentDetails.relatedPlaylists.likes', notes: 'The authenticated channel can expose its likes playlist ID, whose items can be listed.', alternative: 'Ask the user to select interests or import a permitted export.' },
  { key: 'playlists', available: true, oauthRequired: true, testable: true, officialDocs: 'https://developers.google.com/youtube/v3/docs/playlists/list', notes: 'playlists.list supports mine=true for playlists owned by the authenticated user.', alternative: 'User-provided playlist URLs.' },
  { key: 'publicVideoMetadata', available: true, oauthRequired: false, testable: true, officialDocs: 'https://developers.google.com/youtube/v3/docs/videos/list', notes: 'videos.list returns selected public video resource parts for known video IDs.', alternative: 'Not applicable.' },
];

export function getCapability(key: CapabilityKey): Capability {
  const capability = capabilities.find((item) => item.key === key);
  if (!capability) throw new Error(`Unknown capability: ${key}`);
  return capability;
}
