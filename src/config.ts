import 'dotenv/config';

export interface AppConfig {
  port: number;
  googleClientId?: string;
  googleClientSecret?: string;
  googleRedirectUri: string;
  youtubeApiKey?: string;
  testVideoIds: string[];
}

function optional(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function parsePort(value: string | undefined): number {
  if (!value) return 3000;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }
  return port;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const clientId = env.GOOGLE_CLIENT_ID?.trim() || undefined;
  const clientSecret = env.GOOGLE_CLIENT_SECRET?.trim() || undefined;
  if (Boolean(clientId) !== Boolean(clientSecret)) {
    throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set together.');
  }

  return {
    port: parsePort(env.PORT),
    googleClientId: clientId,
    googleClientSecret: clientSecret,
    googleRedirectUri: env.GOOGLE_REDIRECT_URI?.trim() || 'http://localhost:3000/auth/google/callback',
    youtubeApiKey: env.YOUTUBE_API_KEY?.trim() || undefined,
    testVideoIds: (env.YOUTUBE_TEST_VIDEO_IDS || '').split(',').map((id) => id.trim()).filter(Boolean),
  };
}

export const config = loadConfig();
