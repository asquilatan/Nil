import { BlockerStrategy } from '../core/strategy.js';

export class FacebookStrategy extends BlockerStrategy {
  constructor() {
    super('facebook.com');
  }

  init() {
    console.log('Facebook Focus Mode Active');
  }
}
