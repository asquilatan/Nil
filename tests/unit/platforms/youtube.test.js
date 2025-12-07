import { YouTubeStrategy } from '../../../src/content/platforms/youtube.js';

describe('YouTubeStrategy', () => {
  let strategy;

  beforeEach(() => {
    strategy = new YouTubeStrategy();
  });

  test('domain is youtube.com', () => {
    expect(strategy.domain).toBe('youtube.com');
  });
});
