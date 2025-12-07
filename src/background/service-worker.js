// Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Social Media Distraction Blocker installed.');
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.frameId === 0) { // Top-level frame
    chrome.tabs.sendMessage(details.tabId, {
      type: 'URL_CHANGED',
      payload: {
        url: details.url,
        tabId: details.tabId
      }
    }).catch(err => {
      // Content script might not be ready or page is unloading
      // console.debug('Could not send URL_CHANGED message', err);
    });
  }
});
