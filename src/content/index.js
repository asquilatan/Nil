(async () => {
  const { BlockerEngine } = await import(chrome.runtime.getURL('content/core/blocker-engine.js'));
  const { YouTubeStrategy } = await import(chrome.runtime.getURL('content/platforms/youtube.js'));
  const { FacebookStrategy } = await import(chrome.runtime.getURL('content/platforms/facebook.js'));
  const { InstagramStrategy } = await import(chrome.runtime.getURL('content/platforms/instagram.js'));
  const { RedditStrategy } = await import(chrome.runtime.getURL('content/platforms/reddit.js'));
  const { SettingsManager } = await import(chrome.runtime.getURL('content/core/settings-manager.js'));
  
  console.log('Social Media Blocker: Content script loaded');

  const engine = new BlockerEngine();
  let currentStrategy = null;

  const hostname = window.location.hostname;
  
  if (hostname.includes('youtube.com')) {
    currentStrategy = new YouTubeStrategy();
  } else if (hostname.includes('facebook.com')) {
    currentStrategy = new FacebookStrategy();
  } else if (hostname.includes('instagram.com')) {
    currentStrategy = new InstagramStrategy();
  } else if (hostname.includes('reddit.com')) {
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
})();
