export const Storage = {
  /**
   * Get settings from storage.
   * @returns {Promise<Object>}
   */
  getSettings: async () => {
    const data = await chrome.storage.local.get('settings');
    return data.settings || {};
  },

  /**
   * Save settings to storage.
   * @param {Object} settings 
   */
  saveSettings: async (settings) => {
    await chrome.storage.local.set({ settings });
  }
};
