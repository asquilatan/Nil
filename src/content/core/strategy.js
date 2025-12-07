export class BlockerStrategy {
  constructor(domain) {
    this.domain = domain;
  }

  /**
   * Initialize the strategy.
   * Should set up initial blocking rules.
   */
  init() {
    throw new Error('Method "init" must be implemented.');
  }

  /**
   * Handle URL changes (SPA navigation).
   * @param {string} url 
   */
  onUrlChange(url) {
    // Optional override
  }

  /**
   * Clean up resources/listeners.
   */
  cleanup() {
    // Optional override
  }
}
