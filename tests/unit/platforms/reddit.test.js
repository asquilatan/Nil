import { RedditStrategy } from '../../../src/content/platforms/reddit.js';

describe('RedditStrategy', () => {
  test('domain is reddit.com', () => {
    const strategy = new RedditStrategy();
    expect(strategy.domain).toBe('reddit.com');
  });
});
