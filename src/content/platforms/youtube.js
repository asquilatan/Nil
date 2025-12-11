import { BlockerStrategy } from '../core/strategy.js';

export class YouTubeStrategy extends BlockerStrategy {
  constructor() {
    super('youtube.com');
    this.currentSettings = null;
  }

  init() {
    // CSS is injected via manifest.
  }

  onUrlChange(url) {
    // Re-apply settings when YouTube's SPA navigates between pages.
    // This ensures the :has() CSS selectors are re-evaluated for the new page context.
    if (this.currentSettings) {
      this.onSettingsChange(this.currentSettings);
    }
  }

  onSettingsChange(settings) {
    this.currentSettings = settings;

    // Wait for body to exist (script runs at document_start)
    const applyClasses = () => {
      const body = document.body;
      if (!body) {
        requestAnimationFrame(applyClasses);
        return;
      }

      // Determine if we're on the homepage
      const isHomePage = window.location.pathname === '/' || window.location.pathname === '/feed/subscriptions' || window.location.pathname.startsWith('/feed/');
      const isActualHome = window.location.pathname === '/';

      // Clear all previous mode classes to prevent conflict
      body.classList.remove(
        'nil-yt-home-simplify', 'nil-yt-home-disable', 'nil-yt-oversimplified',
        'nil-yt-on-home', // Page context class
        'nil-yt-comments-simplify', 'nil-yt-comments-disable',
        'nil-yt-sidebar-simplify', 'nil-yt-sidebar-disable',
        'nil-yt-chat-simplify', 'nil-yt-chat-disable',
        'nil-yt-search-simplify',
        'nil-yt-navbar-simplify',
        'nil-yt-disable-playback'
      );

      // Only apply if platform is enabled
      if (!settings.enabled) {
        return;
      }

      // Add page context class for homepage
      if (isActualHome) {
        body.classList.add('nil-yt-on-home');
      }

      // Home Feed Logic
      // Always apply classes if enabled. CSS scoping handles where they take effect.
      if (settings.options?.oversimplifiedMode) {
        body.classList.add('nil-yt-oversimplified');
      } else if (settings.options?.homeFeedMode === 'simplify') {
        body.classList.add('nil-yt-home-simplify');
      } else if (settings.options?.homeFeedMode === 'disable') {
        body.classList.add('nil-yt-home-disable');
      }

      // Search Feed
      if (settings.options?.searchFeedMode === 'simplify') {
        body.classList.add('nil-yt-search-simplify');
      }

      // Comments
      if (settings.options?.commentsMode === 'simplify') {
        body.classList.add('nil-yt-comments-simplify');
      } else if (settings.options?.commentsMode === 'disable') {
        body.classList.add('nil-yt-comments-disable');
      }

      // Sidebar (Recommendations) & Live Chat (Merged)
      // Always apply classes if enabled. CSS scoping handles where they take effect.
      if (settings.options?.sidebarMode === 'simplify') {
        body.classList.add('nil-yt-sidebar-simplify');
        body.classList.add('nil-yt-chat-simplify');
      } else if (settings.options?.sidebarMode === 'disable') {
        body.classList.add('nil-yt-sidebar-disable');
        body.classList.add('nil-yt-chat-disable');
      }

      // Navbar
      if (settings.options?.navbarMode === 'simplify') {
        body.classList.add('nil-yt-navbar-simplify');
      }

      // Playback
      if (settings.options?.disablePlayback) {
        body.classList.add('nil-yt-disable-playback');
      }
    };

    applyClasses();
  }
}
