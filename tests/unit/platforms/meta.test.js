import { FacebookStrategy } from '../../../src/content/platforms/facebook.js';
import { InstagramStrategy } from '../../../src/content/platforms/instagram.js';

describe('Meta Strategies', () => {
  test('FacebookStrategy domain', () => {
    const strategy = new FacebookStrategy();
    expect(strategy.domain).toBe('facebook.com');
  });

  test('InstagramStrategy domain', () => {
    const strategy = new InstagramStrategy();
    expect(strategy.domain).toBe('instagram.com');
  });
});
