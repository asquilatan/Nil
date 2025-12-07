import { BlockerStrategy } from '../core/strategy.js';

export class InstagramStrategy extends BlockerStrategy {
  constructor() {
    super('instagram.com');
  }

  init() {
    console.log('Instagram Focus Mode Active');
  }
}
