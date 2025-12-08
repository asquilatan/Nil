export class SettingsManager {
  constructor(strategy) {
    this.strategy = strategy;
  }

  async init() {
    // Initial load
    const { settings } = await chrome.storage.local.get('settings');
    this.applySettings(settings);

    // Listener
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.settings) {
        this.applySettings(changes.settings.newValue);
      }
    });
  }

  applySettings(settings) {
    if (!settings) return;
    
    if (this.strategy && this.strategy.onSettingsChange) {
      const domain = this.strategy.domain;
      const platformSettings = settings.platforms?.[domain];
      if (platformSettings) {
        this.strategy.onSettingsChange(platformSettings);
      }
    }
  }
}
