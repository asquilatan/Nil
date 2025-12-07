document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url.match(/youtube|facebook|instagram|reddit/)) {
    document.getElementById('status').textContent = 'Inactive (Not a target site)';
    document.getElementById('status').style.color = 'gray';
    return;
  }

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_STATUS' });
    if (response && response.status === 'active') {
      document.getElementById('status').textContent = `Active on ${response.platform}`;
    }
  } catch (e) {
    // Content script might not be loaded yet or error
    console.log('Error querying content script', e);
  }
});
