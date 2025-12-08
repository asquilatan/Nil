# Internal Contracts: YouTube Focus Mode

**Feature**: 002-youtube-custom-ui

## 1. Storage Interface (Shared)

**File**: `src/content/core/storage.js` & `src/popup/hooks/useSettings.js`

```javascript
/**
 * Reads settings for a specific domain.
 * @param {string} domain 
 * @returns {Promise<Object>} The options object for that domain.
 */
function getPlatformSettings(domain) {}

/**
 * Updates a specific option.
 * @param {string} domain 
 * @param {string} key 
 * @param {any} value 
 */
function updatePlatformSetting(domain, key, value) {}
```

## 2. Platform Strategy Interface (Extension)

The existing `PlatformStrategy` (from 001) is extended to handle dynamic updates.

```javascript
interface PlatformStrategy {
  // Existing
  domain: string;
  init(): void;
  onUrlChange(url: string): void;

  // New
  /**
   * Called when chrome.storage.onChanged fires for this domain.
   * @param {Object} newOptions - The updated options object.
   */
  onSettingsChange(newOptions: Object): void;
}
```
