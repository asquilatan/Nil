# Data Model: YouTube Focus Mode & Custom UI

**Feature**: 002-youtube-custom-ui
**Date**: 2025-12-07

## Storage Schema (`chrome.storage.local`)

This schema expands the previous one to include granular options.

```json
{
  "settings": {
    "enabled": true, // Global kill switch
    "platforms": {
      "youtube.com": {
        "enabled": true,
        "options": {
          "minimalHomepage": true,       // US1: Search bar only
          "minimalSearchResults": true,  // US2: Grid view
          "thumbnailMode": "small",      // US2: "hidden" | "small" | "original"
          "searchSuggestions": true,     // US4: Auto-complete
          "sidebarSuggestions": true,    // US4: "Watch Next"
          "comments": true,              // US4: Show/Hide comments (default: true/visible)
          "audioOnly": false,            // US4: MP3 Mode
          "hidePlaylists": true,         // US4
          "hideLiveChat": true           // US4
        }
      },
      "facebook.com": { "enabled": true },
      "instagram.com": { "enabled": true },
      "reddit.com": { "enabled": true }
    }
  }
}
```

## Component State (Popup UI)

### `PopupState`
Managed by React/Preact in the popup.

| Field | Type | Description |
|-------|------|-------------|
| `activeTab` | `string` | Currently selected platform in sidebar (e.g., 'youtube.com'). |
| `globalEnabled` | `boolean` | Master toggle state. |
| `platformSettings` | `Object` | Copy of the storage data for rendering toggles. |

## DOM Classes (Content Script)

These classes are toggled on the `<body>` element of YouTube to trigger CSS rules.

| Class Name | Trigger Setting | Effect |
|------------|-----------------|--------|
| `nil-yt-home-minimal` | `minimalHomepage: true` | Hides feed, centers search. |
| `nil-yt-grid-results` | `minimalSearchResults: true` | Grid layout for results. |
| `nil-yt-thumb-hidden` | `thumbnailMode: "hidden"` | Hides thumbnails. |
| `nil-yt-thumb-small` | `thumbnailMode: "small"` | Scales thumbnails down. |
| `nil-yt-audio-only` | `audioOnly: true` | Hides video, shows control bar. |
| `nil-yt-no-comments` | `comments: false` | Hides comments section. |
| `nil-yt-no-chat` | `hideLiveChat: true` | Hides live chat sidebar. |
