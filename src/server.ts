import crypto from 'node:crypto';
import express from 'express';
import { config } from './config.js';
import { capabilities } from './youtube/capabilities.js';
import { createOAuthClient, getAuthenticatedSnapshot, YOUTUBE_READ_SCOPE } from './youtube/client.js';

const app = express();
const pendingStates = new Set<string>();

app.get('/health', (_request, response) => response.json({ status: 'ok', phase: 0 }));
app.get('/capabilities', (_request, response) => response.json({ capabilities }));

app.get('/auth/google', (_request, response) => {
  if (!config.googleClientId || !config.googleClientSecret) {
    return response.status(503).json({ error: 'OAuth is not configured. Copy .env.example to .env and supply OAuth client variables.' });
  }
  const state = crypto.randomBytes(24).toString('base64url');
  pendingStates.add(state);
  const url = createOAuthClient(config).generateAuthUrl({ access_type: 'offline', scope: [YOUTUBE_READ_SCOPE], state, prompt: 'consent' });
  response.redirect(url);
});

app.get('/auth/google/callback', async (request, response) => {
  const code = typeof request.query.code === 'string' ? request.query.code : undefined;
  const state = typeof request.query.state === 'string' ? request.query.state : undefined;
  if (!code || !state || !pendingStates.delete(state)) return response.status(400).json({ error: 'Invalid or expired OAuth callback.' });
  try {
    const oauth = createOAuthClient(config);
    const { tokens } = await oauth.getToken(code);
    oauth.setCredentials(tokens);
    const snapshot = await getAuthenticatedSnapshot(oauth);
    // Tokens deliberately remain in memory only for this request and are never logged or returned.
    return response.json({ testedAt: new Date().toISOString(), data: snapshot, limitations: ['Watch history and search history are not returned because documented endpoints do not provide them.'] });
  } catch (error) {
    // Do not serialize provider errors because they can contain sensitive request details.
    return response.status(502).json({ error: 'The YouTube API request did not complete. Check OAuth consent configuration and granted scope.' });
  }
});

app.listen(config.port, () => console.log(`Phase 0 server listening on http://localhost:${config.port}`));
