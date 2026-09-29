import type { youtube_v3 } from 'googleapis';

export interface VideoSummary { id: string; title: string; channelId: string; channelTitle: string; publishedAt?: string; }
export interface SubscriptionSummary { channelId: string; title: string; description?: string; }

export function normalizeVideo(item: youtube_v3.Schema$Video): VideoSummary | undefined {
  if (!item.id || !item.snippet?.title || !item.snippet.channelId || !item.snippet.channelTitle) return undefined;
  return { id: item.id, title: item.snippet.title, channelId: item.snippet.channelId, channelTitle: item.snippet.channelTitle, publishedAt: item.snippet.publishedAt ?? undefined };
}

export function normalizeSubscription(item: youtube_v3.Schema$Subscription): SubscriptionSummary | undefined {
  const channelId = item.snippet?.resourceId?.channelId;
  const title = item.snippet?.title;
  if (!channelId || !title) return undefined;
  return { channelId, title, description: item.snippet.description ?? undefined };
}
