import { SettingsManager } from '../../../src/content/core/settings-manager.js';

describe('SettingsManager', () => {
  let manager;
  let mockStrategy;

  beforeEach(() => {
    mockStrategy = {
      domain: 'test.com',
      onSettingsChange: jest.fn()
    };
    manager = new SettingsManager(mockStrategy);
    chrome.storage.local.get.mockClear();
    // chrome.storage.onChanged.addListener.mockClear();
  });

  test('init loads settings and applies them', async () => {
    const mockSettings = {
      platforms: {
        'test.com': { enabled: true }
      }
    };
    chrome.storage.local.get.mockResolvedValue({ settings: mockSettings });

    await manager.init();

    expect(chrome.storage.local.get).toHaveBeenCalledWith('settings');
    expect(mockStrategy.onSettingsChange).toHaveBeenCalledWith({ enabled: true });
  });

  test('listens for storage changes', async () => {
    const addListenerSpy = jest.spyOn(chrome.storage.onChanged, 'addListener');
    await manager.init();
    expect(addListenerSpy).toHaveBeenCalled();
  });
});
