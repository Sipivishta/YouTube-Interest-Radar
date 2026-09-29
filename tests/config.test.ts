import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';

describe('configuration loading', () => {
  it('parses optional variables and test IDs', () => {
    const config = loadConfig({ PORT: '4545', GOOGLE_CLIENT_ID: 'id', GOOGLE_CLIENT_SECRET: 'secret', YOUTUBE_TEST_VIDEO_IDS: ' one, two ,, ' });
    expect(config).toMatchObject({ port: 4545, googleClientId: 'id', googleClientSecret: 'secret', testVideoIds: ['one', 'two'] });
  });
  it('rejects incomplete OAuth configuration', () => {
    expect(() => loadConfig({ GOOGLE_CLIENT_ID: 'id' })).toThrow('set together');
  });
});
