import type { LikedVideo, PlaylistWithVideos, Subscription, User } from '../domain.js';
export const demoUser: User = { id: '00000000-0000-4000-8000-000000000001', googleSubject: 'demo-google-subject', displayName: 'Demo YouTube User' };
export const demoSubscriptions: Subscription[] = [
  { channel: { id: 'UC-ai-lab', title: 'Applied AI Lab', thumbnailUrl: 'https://example.invalid/channels/ai.jpg' }, subscribedAt: '2026-07-08T10:00:00Z' },
  { channel: { id: 'UC-cloud-dev', title: 'Cloud Build Notes', thumbnailUrl: 'https://example.invalid/channels/cloud.jpg' }, subscribedAt: '2026-08-01T12:00:00Z' },
  { channel: { id: 'UC-systems', title: 'Systems Classroom' }, subscribedAt: '2026-08-14T09:30:00Z' },
];
export const demoLikedVideos: LikedVideo[] = [
  { likedAt: '2026-09-01T08:00:00Z', video: { id: 'demo-agent-1', title: 'Building Reliable Agent Workflows', channelId: 'UC-ai-lab', channelTitle: 'Applied AI Lab', thumbnailUrl: 'https://example.invalid/videos/agent.jpg', description: 'A fixture video, not data from YouTube.', publishedAt: '2026-08-30T12:00:00Z' } },
  { likedAt: '2026-09-02T08:00:00Z', video: { id: 'demo-cloud-1', title: 'Practical Cloud Deployments', channelId: 'UC-cloud-dev', channelTitle: 'Cloud Build Notes', publishedAt: '2026-08-28T12:00:00Z' } },
];
export const demoPlaylists: PlaylistWithVideos[] = [{ playlist: { id: 'demo-playlist-1', title: 'Things to explore', description: 'Bundled development fixture only.' }, videos: demoLikedVideos.map((item) => item.video) }];
