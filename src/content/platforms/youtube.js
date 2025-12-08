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
    
    // Minimal Homepage
    if (settings.options?.minimalHomepage) {
      body.classList.add('nil-yt-home-minimal');
    } else {
      body.classList.remove('nil-yt-home-minimal');
    }

    // Grid Results
    if (settings.options?.minimalSearchResults) {
      body.classList.add('nil-yt-grid-results');
    } else {
      body.classList.remove('nil-yt-grid-results');
    }

    // Thumbnail Mode
    body.classList.remove('nil-yt-thumb-hidden', 'nil-yt-thumb-small');
    if (settings.options?.thumbnailMode === 'hidden') {
      body.classList.add('nil-yt-thumb-hidden');
    } else if (settings.options?.thumbnailMode === 'small') {
      body.classList.add('nil-yt-thumb-small');
    }

    // Audio Only
    if (settings.options?.audioOnly) {
      body.classList.add('nil-yt-audio-only');
    } else {
      body.classList.remove('nil-yt-audio-only');
    }

    // Comments (Default true, so check if false)
    if (settings.options?.comments === false) {
      body.classList.add('nil-yt-no-comments');
    } else {
      body.classList.remove('nil-yt-no-comments');
    }

    // Live Chat
    if (settings.options?.hideLiveChat) {
      body.classList.add('nil-yt-no-chat');
    } else {
      body.classList.remove('nil-yt-no-chat');
    }
  }
}
