import { BlockerStrategy } from '../core/strategy.js';

export class YouTubeStrategy extends BlockerStrategy {
  constructor() {
    super('youtube.com');
  }

  init() {
    console.log('YouTube Focus Mode Active');
    // CSS is injected via manifest.
    // Future: Add MutationObserver logic here if CSS is insufficient.
  }
}
