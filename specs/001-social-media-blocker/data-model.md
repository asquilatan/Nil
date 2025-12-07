# Data Model: Social Media Distraction Blocker

**Feature**: 001-social-media-blocker
**Date**: 2025-12-07

## Core Entities

### 1. PlatformStrategy (Interface)
Represents the blocking logic for a specific social media site.

| Field | Type | Description |
|-------|------|-------------|
| `domain` | `string` | The hostname this strategy applies to (e.g., "youtube.com"). |
| `name` | `string` | Human-readable name (e.g., "YouTube"). |
| `selectors` | `SelectorSet` | Collection of CSS selectors used for blocking. |

### 2. SelectorSet
Defines what to block on a specific platform.

| Field | Type | Description |
|-------|------|-------------|
| `feed` | `string[]` | CSS selectors for the main news feed. |
| `sidebar` | `string[]` | CSS selectors for recommendations/sidebar. |
| `stories` | `string[]` | CSS selectors for stories/reels containers. |
| `shorts` | `string[]` | CSS selectors for Shorts/TikTok-style feeds. |

### 3. NavigationEvent (Internal)
Represents a navigation action detected by the background script.

| Field | Type | Description |
|-------|------|-------------|
| `url` | `string` | The new URL. |
| `timestamp` | `number` | When the navigation occurred. |
| `transitionType` | `string` | Type of transition (link, reload, etc.). |

## Storage Schema (`chrome.storage.local`)
*Note: MVP does not require persistent storage, but this structure is reserved for future "Toggle" features.*

```json
{
  "settings": {
    "enabled": true,
    "platforms": {
      "youtube.com": { "enabled": true },
      "facebook.com": { "enabled": true },
      "instagram.com": { "enabled": true },
      "reddit.com": { "enabled": true }
    }
  }
}
```

## State Management

### Content Script State
- **`currentPath`**: `string` - The current path segment of the URL (e.g., `/watch`).
- **`isBlocked`**: `boolean` - Whether blocking logic is currently active for this path.
