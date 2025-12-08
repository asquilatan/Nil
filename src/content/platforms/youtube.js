import { BlockerStrategy } from '../core/strategy.js';

export class YouTubeStrategy extends BlockerStrategy {
  constructor() {
    super('youtube.com');
    this.observer = null;
    this.navObserver = null;
    this.currentSettings = null;
    this.lastUrl = null;
  }

  init() {
    // CSS is injected via manifest.
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

      // Clear all previous mode classes to prevent conflict
      body.classList.remove(
        'nil-yt-home-simplify', 'nil-yt-home-disable', 'nil-yt-oversimplified',
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

      // Home Feed Logic (Oversimplified vs Standard)
      // Check if we are on the homepage
      const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';

      if (isHomePage) {
        if (settings.options?.oversimplifiedMode) {
          // Oversimplified overrides everything else on Home
          body.classList.add('nil-yt-oversimplified');
        } else if (settings.options?.homeFeedMode === 'simplify') {
          // Only apply simplify if NOT oversimplified
          body.classList.add('nil-yt-home-simplify');
        } else if (settings.options?.homeFeedMode === 'disable') {
          body.classList.add('nil-yt-home-disable');
        }
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

      // Sidebar (Recommendations) & Live Chat (Merged) - ONLY on Watch Page
      const isWatchPage = window.location.pathname === '/watch';

      if (isWatchPage) {
        if (settings.options?.sidebarMode === 'simplify') {
          body.classList.add('nil-yt-sidebar-simplify');
          body.classList.add('nil-yt-chat-simplify');
        } else if (settings.options?.sidebarMode === 'disable') {
          body.classList.add('nil-yt-sidebar-disable');
          body.classList.add('nil-yt-chat-disable');
        }
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

    // Re-apply on navigation (SPA handling) - Setup one-time observer
    if (!this.navObserver) {
      this.lastUrl = location.href;
      this.navObserver = new MutationObserver(() => {
        const url = location.href;
        if (url !== this.lastUrl) {
          this.lastUrl = url;
          console.log('[Nil] URL changed, re-applying classes');
          // Re-run the logic with the CURRENT stored settings
          if (this.currentSettings) {
            this.onSettingsChange(this.currentSettings);
          }
        }
      });
      this.navObserver.observe(document, { subtree: true, childList: true });
    }
  }
}
