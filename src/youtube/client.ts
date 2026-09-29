import { google } from 'googleapis';
import type { AppConfig } from '../config.js';
import { normalizeSubscription, normalizeVideo, type SubscriptionSummary, type VideoSummary } from './normalize.js';

export const YOUTUBE_READ_SCOPE = 'https://www.googleapis.com/auth/youtube.readonly';

export function createOAuthClient(config: AppConfig) {
  if (!config.googleClientId || !config.googleClientSecret) throw new Error('OAuth is not configured.');
  return new google.auth.OAuth2(config.googleClientId, config.googleClientSecret, config.googleRedirectUri);
}

export function createYouTubeClient(auth?: string | ReturnType<typeof createOAuthClient>) {
  return google.youtube({ version: 'v3', auth });
}

export async function getPublicVideos(apiKey: string, videoIds: string[]): Promise<VideoSummary[]> {
  if (videoIds.length === 0) return [];
  const youtube = createYouTubeClient(apiKey);
  const response = await youtube.videos.list({ part: ['snippet'], id: videoIds });
  return (response.data.items ?? []).map(normalizeVideo).filter((item): item is VideoSummary => Boolean(item));
}

export interface AuthenticatedSnapshot { subscriptions: SubscriptionSummary[]; playlists: number; likedVideos: VideoSummary[]; }

export async function getAuthenticatedSnapshot(auth: ReturnType<typeof createOAuthClient>): Promise<AuthenticatedSnapshot> {
  const youtube = createYouTubeClient(auth);
  const [subscriptionsResult, playlistsResult, channelResult] = await Promise.all([
    youtube.subscriptions.list({ part: ['snippet'], mine: true, maxResults: 25 }),
    youtube.playlists.list({ part: ['id'], mine: true, maxResults: 25 }),
    youtube.channels.list({ part: ['contentDetails'], mine: true }),
  ]);
  const likesId = channelResult.data.items?.[0]?.contentDetails?.relatedPlaylists?.likes;
  const likedVideos = likesId
    ? (await youtube.playlistItems.list({ part: ['snippet'], playlistId: likesId, maxResults: 25 })).data.items ?? []
    : [];
  return {
    subscriptions: (subscriptionsResult.data.items ?? []).map(normalizeSubscription).filter((item): item is SubscriptionSummary => Boolean(item)),
    playlists: playlistsResult.data.items?.length ?? 0,
    likedVideos: likedVideos.map((item) => item.snippet ? normalizeVideo({ id: item.snippet.resourceId?.videoId, snippet: item.snippet }) : undefined).filter((item): item is VideoSummary => Boolean(item)),
  };
}
