import { BlockerStrategy } from '../core/strategy.js';

export class YouTubeStrategy extends BlockerStrategy {
  constructor() {
    super('youtube.com');
  }

  init() {
    console.log('YouTube Focus Mode Active');
    // CSS is injected via manifest.
  }

  onSettingsChange(settings) {
    const body = document.body;

    // Clear all previous mode classes to prevent conflict
    body.classList.remove(
      'nil-yt-home-simplify', 'nil-yt-home-disable',
      'nil-yt-comments-simplify', 'nil-yt-comments-disable',
      'nil-yt-sidebar-simplify', 'nil-yt-sidebar-disable',
      'nil-yt-chat-simplify', 'nil-yt-chat-disable',
      'nil-yt-navbar-simplify',
      'nil-yt-disable-playback'
    );

    // Home Feed
    if (settings.options?.homeFeedMode === 'simplify') {
      body.classList.add('nil-yt-home-simplify');
    } else if (settings.options?.homeFeedMode === 'disable') {
      body.classList.add('nil-yt-home-disable');
    }

    // Comments
    if (settings.options?.commentsMode === 'simplify') {
      body.classList.add('nil-yt-comments-simplify');
    } else if (settings.options?.commentsMode === 'disable') {
      body.classList.add('nil-yt-comments-disable');
    }

    // Sidebar (Recommendations)
    if (settings.options?.sidebarMode === 'simplify') {
      body.classList.add('nil-yt-sidebar-simplify');
    } else if (settings.options?.sidebarMode === 'disable') {
      body.classList.add('nil-yt-sidebar-disable');
    }

    // Live Chat
    if (settings.options?.chatMode === 'simplify') {
      body.classList.add('nil-yt-chat-simplify');
    } else if (settings.options?.chatMode === 'disable') {
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
  }
}
