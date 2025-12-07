export class DomObserver {
  constructor(callback) {
    this.callback = callback;
    this.observer = null;
  }

  start() {
    if (this.observer) return;
    
    this.observer = new MutationObserver((mutations) => {
      this.callback(mutations);
    });

    const target = document.body || document.documentElement;
    this.observer.observe(target, {
      childList: true,
      subtree: true
    });
  }

  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
