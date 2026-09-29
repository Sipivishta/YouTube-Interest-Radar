import { describe, expect, it } from 'vitest';
import { createYouTubeClient, createOAuthClient } from '../src/youtube/client.js';
import { getCapability } from '../src/youtube/capabilities.js';
import { normalizeSubscription, normalizeVideo } from '../src/youtube/normalize.js';

describe('YouTube client initialization', () => {
  it('creates an API client without making a network request', () => {
    const client = createYouTubeClient('test-api-key');
    expect(client.videos.list).toBeTypeOf('function');
  });
  it('creates OAuth only when OAuth config is complete', () => {
    expect(createOAuthClient({ port: 3000, googleClientId: 'id', googleClientSecret: 'secret', googleRedirectUri: 'http://localhost/callback', testVideoIds: [] }).generateAuthUrl).toBeTypeOf('function');
  });
});

describe('capability detection', () => {
  it('marks history as unavailable and subscriptions as OAuth-protected', () => {
    expect(getCapability('watchHistory')).toMatchObject({ available: false, testable: false });
    expect(getCapability('subscriptions')).toMatchObject({ available: true, oauthRequired: true });
  });
});

describe('response normalization', () => {
  it('normalizes valid public video metadata and rejects incomplete responses', () => {
    expect(normalizeVideo({ id: 'video-1', snippet: { title: 'Title', channelId: 'channel-1', channelTitle: 'Channel', publishedAt: '2026-01-01T00:00:00Z' } })).toEqual({ id: 'video-1', title: 'Title', channelId: 'channel-1', channelTitle: 'Channel', publishedAt: '2026-01-01T00:00:00Z' });
    expect(normalizeVideo({ id: 'video-1', snippet: { title: 'Title' } })).toBeUndefined();
  });
  it('normalizes subscription resource IDs and rejects missing channel IDs', () => {
    expect(normalizeSubscription({ snippet: { title: 'Channel', resourceId: { channelId: 'channel-1' } } })).toEqual({ channelId: 'channel-1', title: 'Channel', description: undefined });
    expect(normalizeSubscription({ snippet: { title: 'Channel', resourceId: {} } })).toBeUndefined();
  });
});
