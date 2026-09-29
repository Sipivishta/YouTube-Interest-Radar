import type { IngestionRepository, LikedVideo, OAuthAccount, PlaylistWithVideos, Subscription, User } from '../domain.js';
import { demoLikedVideos, demoPlaylists, demoSubscriptions, demoUser } from '../fixtures/demo-data.js';
export class MemoryRepository implements IngestionRepository {
  private users = new Map([[demoUser.id, demoUser]]); private subscriptions = new Map([[demoUser.id, demoSubscriptions]]); private likes = new Map([[demoUser.id, demoLikedVideos]]); private playlists = new Map([[demoUser.id, demoPlaylists]]);
  async upsertUser(user: User) { this.users.set(user.id, user); return user; }
  async saveOAuthAccount(_id: string, _account: OAuthAccount) { }
  async replaceSubscriptions(id: string, values: Subscription[]) { this.subscriptions.set(id, dedupe(values, (v) => v.channel.id)); }
  async replaceLikedVideos(id: string, values: LikedVideo[]) { this.likes.set(id, dedupe(values, (v) => v.video.id)); }
  async replacePlaylists(id: string, values: PlaylistWithVideos[]) { this.playlists.set(id, dedupe(values, (v) => v.playlist.id)); }
  async getUser(id: string) { return this.users.get(id); }
  async getSubscriptions(id: string) { return this.subscriptions.get(id) ?? []; }
  async getLikedVideos(id: string) { return this.likes.get(id) ?? []; }
  async getPlaylists(id: string) { return this.playlists.get(id) ?? []; }
}
function dedupe<T>(values: T[], key: (value: T) => string): T[] { return [...new Map(values.map((value) => [key(value), value])).values()]; }
