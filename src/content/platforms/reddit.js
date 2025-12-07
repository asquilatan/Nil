import { BlockerStrategy } from '../core/strategy.js';

export class RedditStrategy extends BlockerStrategy {
  constructor() {
    super('reddit.com');
  }

  init() {
    console.log('Reddit Focus Mode Active');
  }
}
