export interface User { id: string; googleSubject: string; displayName?: string; }
export interface Channel { id: string; title: string; thumbnailUrl?: string; }
export interface Video { id: string; title: string; channelId?: string; channelTitle?: string; thumbnailUrl?: string; description?: string; publishedAt?: string; }
export interface Playlist { id: string; title: string; description?: string; thumbnailUrl?: string; publishedAt?: string; }
export interface Subscription { channel: Channel; subscribedAt?: string; }
export interface LikedVideo { video: Video; likedAt?: string; }
export interface PlaylistWithVideos { playlist: Playlist; videos: Video[]; }
export interface OAuthAccount { providerAccountId: string; encryptedAccessToken?: string; encryptedRefreshToken?: string; accessTokenExpiresAt?: string; scope?: string; }
export interface IngestionRepository {
  upsertUser(user: User): Promise<User>;
  saveOAuthAccount(userId: string, account: OAuthAccount): Promise<void>;
  replaceSubscriptions(userId: string, subscriptions: Subscription[]): Promise<void>;
  replaceLikedVideos(userId: string, videos: LikedVideo[]): Promise<void>;
  replacePlaylists(userId: string, playlists: PlaylistWithVideos[]): Promise<void>;
  getUser(id: string): Promise<User | undefined>;
  getSubscriptions(userId: string): Promise<Subscription[]>;
  getLikedVideos(userId: string): Promise<LikedVideo[]>;
  getPlaylists(userId: string): Promise<PlaylistWithVideos[]>;
}
