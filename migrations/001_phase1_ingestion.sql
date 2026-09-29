CREATE TABLE users (
  id UUID PRIMARY KEY,
  google_subject TEXT NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE oauth_accounts (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'google',
  provider_account_id TEXT NOT NULL,
  encrypted_refresh_token TEXT,
  encrypted_access_token TEXT,
  access_token_expires_at TIMESTAMPTZ,
  scope TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider, provider_account_id)
);
CREATE TABLE youtube_channels (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE subscriptions (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL REFERENCES youtube_channels(id) ON DELETE CASCADE,
  subscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, channel_id)
);
CREATE TABLE youtube_videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  channel_id TEXT REFERENCES youtube_channels(id) ON DELETE SET NULL,
  channel_title TEXT,
  thumbnail_url TEXT,
  description TEXT,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE liked_videos (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL REFERENCES youtube_videos(id) ON DELETE CASCADE,
  liked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, video_id)
);
CREATE TABLE youtube_playlists (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE playlist_videos (
  playlist_id TEXT NOT NULL REFERENCES youtube_playlists(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL REFERENCES youtube_videos(id) ON DELETE CASCADE,
  position INTEGER,
  added_at TIMESTAMPTZ,
  PRIMARY KEY (playlist_id, video_id)
);
CREATE INDEX subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX liked_videos_user_id_idx ON liked_videos(user_id);
CREATE INDEX youtube_playlists_user_id_idx ON youtube_playlists(user_id);
