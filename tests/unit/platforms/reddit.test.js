import { RedditStrategy } from '../../../src/content/platforms/reddit.js';

describe('RedditStrategy', () => {
  let strategy;
  let body;

  beforeEach(() => {
    strategy = new RedditStrategy();
    // Reset body classes
    document.body.className = '';
    body = document.body;
  });

  test('domain is reddit.com', () => {
    expect(strategy.domain).toBe('reddit.com');
  });

  test('applies disable classes correctly', () => {
    const settings = {
      options: {
        feedMode: 'disable',
        sidebarMode: 'disable',
        navbarMode: 'disable',
        chatMode: 'disable',
        commentsMode: 'disable'
      }
    };

    strategy.onSettingsChange(settings);

    expect(body.classList.contains('nil-reddit-feed-disable')).toBe(true);
    expect(body.classList.contains('nil-reddit-sidebar-disable')).toBe(true);
    expect(body.classList.contains('nil-reddit-navbar-disable')).toBe(true);
    expect(body.classList.contains('nil-reddit-chat-disable')).toBe(true);
    expect(body.classList.contains('nil-reddit-comments-disable')).toBe(true);
  });

  test('applies simplify classes correctly', () => {
    const settings = {
      options: {
        feedMode: 'simplify',
        sidebarMode: 'simplify',
        navbarMode: 'simplify',
        chatMode: 'simplify',
        commentsMode: 'simplify'
      }
    };

    strategy.onSettingsChange(settings);

    expect(body.classList.contains('nil-reddit-feed-simplify')).toBe(true);
    expect(body.classList.contains('nil-reddit-sidebar-simplify')).toBe(true);
    expect(body.classList.contains('nil-reddit-navbar-simplify')).toBe(true);
    expect(body.classList.contains('nil-reddit-chat-simplify')).toBe(true);
    expect(body.classList.contains('nil-reddit-comments-simplify')).toBe(true);
  });

  test('removes classes in normal mode', () => {
    // Pre-apply classes
    body.classList.add('nil-reddit-feed-disable');

    const settings = {
      options: {
        feedMode: 'normal'
      }
    };

    strategy.onSettingsChange(settings);

    expect(body.classList.contains('nil-reddit-feed-disable')).toBe(false);
    expect(body.classList.contains('nil-reddit-feed-simplify')).toBe(false);
  });

  test('handles mixed modes', () => {
    const settings = {
      options: {
        feedMode: 'disable',
        sidebarMode: 'simplify',
        navbarMode: 'normal'
      }
    };

    strategy.onSettingsChange(settings);

    expect(body.classList.contains('nil-reddit-feed-disable')).toBe(true);
    expect(body.classList.contains('nil-reddit-sidebar-simplify')).toBe(true);
    expect(body.classList.contains('nil-reddit-navbar-disable')).toBe(false);
    expect(body.classList.contains('nil-reddit-navbar-simplify')).toBe(false);
  });
});
