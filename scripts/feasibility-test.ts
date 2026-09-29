import { writeFile } from 'node:fs/promises';
import { config } from '../src/config.js';
import { capabilities } from '../src/youtube/capabilities.js';
import { getPublicVideos } from '../src/youtube/client.js';

async function main() {
  const report = {
    generatedAt: new Date().toISOString(),
    oauthConfigured: Boolean(config.googleClientId && config.googleClientSecret),
    capabilities: capabilities.map(({ key, available, oauthRequired, testable }) => ({ key, available, oauthRequired, testable, tested: false })),
    publicVideos: [] as Awaited<ReturnType<typeof getPublicVideos>>,
    notes: [] as string[],
  };
  if (config.youtubeApiKey && config.testVideoIds.length) {
    report.publicVideos = await getPublicVideos(config.youtubeApiKey, config.testVideoIds);
    const item = report.capabilities.find((capability) => capability.key === 'publicVideoMetadata');
    if (item) item.tested = true;
  } else report.notes.push('Public metadata skipped: set YOUTUBE_API_KEY and YOUTUBE_TEST_VIDEO_IDS.');
  if (report.oauthConfigured) report.notes.push('OAuth is configured. Visit /auth/google while the server is running for the interactive, user-scoped test; this script never handles or writes OAuth tokens.');
  else report.notes.push('OAuth test skipped: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.');
  await writeFile('data/feasibility-report.json', JSON.stringify(report, null, 2), { mode: 0o600 });
  console.log(JSON.stringify({ reportPath: 'data/feasibility-report.json', publicVideosRetrieved: report.publicVideos.length, notes: report.notes }, null, 2));
}
main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : 'Feasibility test failed.'); process.exitCode = 1; });
