import { BlockerStrategy } from '../core/strategy.js';

export class FacebookStrategy extends BlockerStrategy {
  constructor() {
    super('facebook.com');
  }

  init() {
  }

  onSettingsChange(settings) {
    const body = document.body;

    // Block Feed
    if (settings.options?.blockFeed) {
      body.classList.add('nil-fb-no-feed');
    } else {
      body.classList.remove('nil-fb-no-feed');
    }

    // Block Stories
    if (settings.options?.blockStories) {
      body.classList.add('nil-fb-no-stories');
    } else {
      body.classList.remove('nil-fb-no-stories');
    }

    // Block Right Rail
    if (settings.options?.blockRightRail) {
      body.classList.add('nil-fb-no-right-rail');
    } else {
      body.classList.remove('nil-fb-no-right-rail');
    }

    // Block Watch
    if (settings.options?.blockWatch) {
      body.classList.add('nil-fb-no-watch');
    } else {
      body.classList.remove('nil-fb-no-watch');
    }
  }
}
