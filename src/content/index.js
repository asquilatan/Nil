// Helper to wait for DOM to be ready
function waitForBody() {
  return new Promise((resolve) => {
    if (document.body) {
      resolve();
    } else {
      const observer = new MutationObserver((mutations, obs) => {
        if (document.body) {
          obs.disconnect();
          resolve();
        }
      });
      observer.observe(document.documentElement, { childList: true });
    }
  });
}

(async () => {
  try {
    // Wait for body to exist before doing anything
    await waitForBody();

    // Core dependencies - specific strategy loaded based on hostname
    const { BlockerEngine } = await import(chrome.runtime.getURL('content/core/blocker-engine.js'));
    const { SettingsManager } = await import(chrome.runtime.getURL('content/core/settings-manager.js'));

    console.log('[Nil] Social Media Blocker: Content script loaded');

    const engine = new BlockerEngine();
    let currentStrategy = null;

    const hostname = window.location.hostname;

    // Load ONLY the strategy required for the current platform
    if (hostname.includes('youtube.com')) {
      const { YouTubeStrategy } = await import(chrome.runtime.getURL('content/platforms/youtube.js'));
      currentStrategy = new YouTubeStrategy();
    } else if (hostname.includes('facebook.com')) {
      const { FacebookStrategy } = await import(chrome.runtime.getURL('content/platforms/facebook.js'));
      currentStrategy = new FacebookStrategy();
    } else if (hostname.includes('instagram.com')) {
      const { InstagramStrategy } = await import(chrome.runtime.getURL('content/platforms/instagram.js'));
      currentStrategy = new InstagramStrategy();
    } else if (hostname.includes('reddit.com')) {
      const { RedditStrategy } = await import(chrome.runtime.getURL('content/platforms/reddit.js'));
      currentStrategy = new RedditStrategy();
    }

    if (currentStrategy) {
      currentStrategy.init();
      const settingsManager = new SettingsManager(currentStrategy);
      settingsManager.init();
    }

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'URL_CHANGED') {
        if (currentStrategy) {
          currentStrategy.onUrlChange(message.payload.url);
        }
      } else if (message.type === 'GET_STATUS') {
        sendResponse({
          status: currentStrategy ? 'active' : 'inactive',
          platform: currentStrategy ? currentStrategy.domain : null
        });
      }
    });
  } catch (error) {
    console.error('[Nil] Content script error:', error);
  }
})();
