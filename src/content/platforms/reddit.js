import { BlockerStrategy } from '../core/strategy.js';

export class RedditStrategy extends BlockerStrategy {
  constructor() {
    super('reddit.com');
  }

  init() {
  }

  onSettingsChange(settings) {
    const body = document.body;
    const options = settings.options || {};

    // Helper to apply mode classes
    const applyMode = (feature, mode) => {
      // Remove all potential classes for this feature
      body.classList.remove(`nil-reddit-${feature}-disable`, `nil-reddit-${feature}-simplify`);

      if (mode === 'disable') {
        body.classList.add(`nil-reddit-${feature}-disable`);
      } else if (mode === 'simplify') {
        body.classList.add(`nil-reddit-${feature}-simplify`);
      }
    };

    applyMode('feed', options.feedMode);
    applyMode('sidebar', options.sidebarMode);
    applyMode('navbar', options.navbarMode);
    applyMode('chat', options.chatMode);
    applyMode('comments', options.commentsMode);
  }
}
