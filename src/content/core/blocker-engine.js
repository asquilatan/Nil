export class BlockerEngine {
  constructor() {
    this.styles = new Map();
  }

  /**
   * Inject CSS into the document.
   * @param {string} id - Unique identifier for the style tag
   * @param {string} css - CSS content
   */
  injectCss(id, css) {
    if (this.styles.has(id)) return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
    this.styles.set(id, style);
  }

  /**
   * Remove injected CSS.
   * @param {string} id - Unique identifier for the style tag
   */
  removeCss(id) {
    const style = this.styles.get(id);
    if (style) {
      style.remove();
      this.styles.delete(id);
    }
  }
}
