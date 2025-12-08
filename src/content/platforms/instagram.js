import { BlockerStrategy } from '../core/strategy.js';

export class InstagramStrategy extends BlockerStrategy {
  constructor() {
    super('instagram.com');
  }

  init() {
    console.log('Instagram Focus Mode Active');
  }

  onSettingsChange(settings) {
    const body = document.body;

    // Block Feed
    if (settings.options?.blockFeed) {
      body.classList.add('nil-ig-no-feed');
    } else {
      body.classList.remove('nil-ig-no-feed');
    }

    // Block Stories
    if (settings.options?.blockStories) {
      body.classList.add('nil-ig-no-stories');
    } else {
      body.classList.remove('nil-ig-no-stories');
    }

    // Block Explore
    if (settings.options?.blockExplore) {
      body.classList.add('nil-ig-no-explore');
    } else {
      body.classList.remove('nil-ig-no-explore');
    }

    // Block Reels
    if (settings.options?.blockReels) {
      body.classList.add('nil-ig-no-reels');
    } else {
      body.classList.remove('nil-ig-no-reels');
    }
  }
}
