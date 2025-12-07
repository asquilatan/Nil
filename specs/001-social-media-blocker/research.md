# Research: Social Media Distraction Blocker

**Feature**: 001-social-media-blocker
**Date**: 2025-12-07

## Topic 1: Preventing "Flash of Unblocked Content" (FOUC) in Manifest V3

### Decision
Use **Static CSS Injection** via `manifest.json` with `run_at: "document_start"` for the initial page load, supplemented by **Dynamic CSS Injection** via `chrome.scripting.insertCSS` for specific sub-states if necessary.

### Rationale
- `run_at: "document_start"` ensures CSS is applied before the DOM is fully parsed, effectively eliminating FOUC.
- Static declaration is faster than waiting for JavaScript to run and insert styles.
- Security-safe and compliant with Manifest V3.

### Alternatives Considered
- **JavaScript `style.display = 'none'`**: Too slow; DOM element must exist first, causing a flash.
- **Request Blocking (`declarativeNetRequest`)**: Can block network requests for feed APIs, but this often breaks the entire page shell or causes infinite loading spinners. CSS hiding is safer for UX.

## Topic 2: Handling Single Page Application (SPA) Navigation

### Decision
Implement a hybrid approach:
1. **`MutationObserver`** in the content script to handle dynamic element insertion (lazy loading feeds).
2. **`chrome.runtime.onMessage`** listener in content script, triggered by `chrome.webNavigation.onHistoryStateUpdated` in the background script, to handle URL changes (e.g., navigating from Feed -> Profile).

### Rationale
- Modern frameworks (React/Facebook, Polymer/YouTube) update the DOM without full page reloads.
- `webNavigation` API reliably detects history changes that might not trigger a full DOM reset.
- `MutationObserver` captures the "lazy load" of feed items that happens *after* the navigation event.

### Alternatives Considered
- **`popstate` event listener**: Doesn't catch `pushState` (used when clicking links).
- **Monkey-patching `history.pushState`**: Requires injecting code into the main world (possible in V3 but messy and invasive).

## Topic 3: Robust Selector Strategy

### Decision
Prioritize **Semantic and Attribute-based Selectors** over Class-based selectors.

**Hierarchy of Selectors:**
1. **ID**: `id="primary"` (YouTube)
2. **ARIA Roles/Labels**: `[role="feed"]`, `[aria-label="Stories"]`
3. **Data Attributes**: `[data-pagelet="Feed"]` (Facebook often uses these)
4. **Structural**: `main > div:nth-child(2)` (Last resort, brittle)

### Rationale
- Platforms like Facebook and Instagram use obfuscated/randomized CSS classes (e.g., `.x1n2onr6`) which change frequently.
- Semantic attributes (`role`, `aria`) are necessary for accessibility and tend to be much more stable.

## Topic 4: Modularity Pattern

### Decision
Use a **Strategy Pattern** where the `ContentScript` detects the hostname and instantiates a specific `PlatformBlocker` class.

**Interface:**
```javascript
interface PlatformBlocker {
  domain: string;
  init(): void;           // Setup initial blocks
  onUrlChange(url): void; // Handle navigation
  cleanup(): void;        // Optional teardown
}
```

### Rationale
- Aligns with the Constitution's **Modular Extensibility** principle.
- Allows isolated testing of YouTube logic vs Reddit logic.
- Easy to add new platforms without touching core engine code.
