import { Storage } from '../../../src/content/core/storage.js';

describe('Storage', () => {
  beforeEach(() => {
    chrome.storage.local.get.mockClear();
    chrome.storage.local.set.mockClear();
  });

  test('getSettings returns settings from storage', async () => {
    const mockSettings = { enabled: true };
    chrome.storage.local.get.mockResolvedValue({ settings: mockSettings });

    const settings = await Storage.getSettings();
    expect(settings).toEqual(mockSettings);
    expect(chrome.storage.local.get).toHaveBeenCalledWith('settings');
  });

  test('getSettings returns empty object if no settings', async () => {
    chrome.storage.local.get.mockResolvedValue({});

    const settings = await Storage.getSettings();
    expect(settings).toEqual({});
  });

  test('saveSettings saves settings to storage', async () => {
    const mockSettings = { enabled: true };
    await Storage.saveSettings(mockSettings);

    expect(chrome.storage.local.set).toHaveBeenCalledWith({ settings: mockSettings });
  });
});
