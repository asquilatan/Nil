# Implementation Plan: Social Media Distraction Blocker

**Branch**: `001-social-media-blocker` | **Date**: 2025-12-07 | **Spec**: [specs/001-social-media-blocker/spec.md](../spec.md)
**Input**: Feature specification from `/specs/001-social-media-blocker/spec.md`

## Summary

The goal is to build a Chrome Extension (Manifest V3) that selectively blocks distracting content (feeds, reels, recommendations) on YouTube, Facebook, Instagram, and Reddit while preserving productive features (search, messaging). The technical approach involves CSS injection for immediate blocking and JavaScript MutationObservers for handling Single Page Application (SPA) navigation and dynamic content loading.

## Technical Context

**Language/Version**: JavaScript (ES2022+), HTML5, CSS3
**Primary Dependencies**: Chrome Extensions API (Manifest V3)
**Storage**: `chrome.storage.local` (for toggling features per site, if needed in future, minimal usage for MVP)
**Testing**: Jest (Unit), `jest-chrome` (Mocking), Puppeteer (E2E - optional but good for regression)
**Target Platform**: Google Chrome Desktop (Chromium-based browsers)
**Project Type**: Browser Extension
**Performance Goals**: < 500ms visual flash of unblocked content (Target: 0ms via `document_start` CSS)
**Constraints**: Manifest V3 security policies (no remote code execution), DOM structure volatility (selectors change).
**Scale/Scope**: 4 major platforms, client-side only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **High Test Coverage**: Plan includes Jest and `jest-chrome` to unit test the URL matching and blocking logic.
- **Modular Extensibility**: Plan mandates a Strategy pattern where each platform (YouTube, Reddit, etc.) is a separate module implementing a common interface (`BlockerStrategy`), making it easy to add new sites.
- **Consistent UI/UX**: Popup UI (if added) will use flat colors and simple controls per "Design & UI Guidelines".
- **Simplicity**: Solution favors CSS-based blocking (simple, fast) over complex JS where possible.

## Project Structure

### Documentation (this feature)

```text
specs/001-social-media-blocker/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (Internal interfaces)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── manifest.json
├── background/
│   └── service-worker.js      # Handling install/updates
├── content/
│   ├── index.js               # Entry point, selects strategy
│   ├── core/
│   │   ├── blocker-engine.js  # Common blocking logic (CSS injection, Observers)
│   │   └── utils.js
│   └── platforms/
│       ├── youtube.js         # YouTube specific selectors/rules
│       ├── facebook.js        # Facebook specific selectors/rules
│       ├── instagram.js       # Instagram specific selectors/rules
│       └── reddit.js          # Reddit specific selectors/rules
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
└── styles/
    ├── common.css
    └── platforms/             # CSS files injected by manifest or JS
        ├── youtube.css
        ├── facebook.css
        ├── instagram.css
        └── reddit.css

tests/
├── unit/
│   ├── core/
│   └── platforms/
└── e2e/
    └── navigation.spec.js
```

**Structure Decision**: Standard Chrome Extension structure with a modular `platforms/` directory to satisfy the "Modular Extensibility" principle.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (None)    |            |                                     |