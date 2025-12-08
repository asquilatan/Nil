import { BlockerStrategy } from '../core/strategy.js';

export class RedditStrategy extends BlockerStrategy {
  constructor() {
    super('reddit.com');
  }

  init() {
  }

  onSettingsChange(settings) {
    const body = document.body;

    // Block Feed
    if (settings.options?.blockFeed) {
      body.classList.add('nil-reddit-no-feed');
    } else {
      body.classList.remove('nil-reddit-no-feed');
    }

    // Block Comments
    if (settings.options?.blockComments) {
      body.classList.add('nil-reddit-no-comments');
    } else {
      body.classList.remove('nil-reddit-no-comments');
    }
  }
}
