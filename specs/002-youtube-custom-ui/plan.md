# Implementation Plan: YouTube Focus Mode & Custom UI

**Branch**: `002-youtube-custom-ui` | **Date**: 2025-12-07 | **Spec**: [specs/002-youtube-custom-ui/spec.md](../spec.md)
**Input**: Feature specification from `/specs/002-youtube-custom-ui/spec.md`

## Summary

Build a Chrome Extension enhancement to the existing "Social Media Blocker" that introduces a minimalist, customizable UI for YouTube and a Popup control panel. The core technical approach uses CSS Injection (Manifest V3) for styling the homepage and search results, and React (or lightweight vanilla JS) for the Extension Popup. It leverages `chrome.storage` for persisting granular settings like "Audio Only" or "Thumbnail Mode".

## Technical Context

**Language/Version**: JavaScript (ES2022+), CSS3
**Primary Dependencies**: Chrome Extensions API (Manifest V3), React (for Popup UI - optional but recommended for state complexity), Lucide/Heroicons (for SVG icons)
**Storage**: `chrome.storage.local` (Required for user settings persistence)
**Testing**: Jest (Unit), React Testing Library (if React used for Popup)
**Target Platform**: Google Chrome Desktop
**Project Type**: Browser Extension
**Performance Goals**: < 200ms Popup load time, < 500ms visual application of "Audio Only" mode.
**Constraints**: Manifest V3 CSP, YouTube DOM volatility.
**Scale/Scope**: Single extension, multiple modules (YouTube, Popup).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **High Test Coverage**: ✅ Plan includes Jest for logic and RTL for Popup UI components.
- **Modular Extensibility**: ✅ Extends the existing `PlatformStrategy` pattern. The Popup will be built with a component-based architecture (React) to easily add new platform settings tabs later.
- **Consistent UI/UX**: ✅ Popup design will use a consistent Design System (Tailwind or custom CSS variables) adhering to the "Flat Colors / No Gradients" rule.
- **Simplicity**: ✅ "Audio Only" mode will be a visual hack (hiding video element) rather than a complex stream interception, favoring simplicity.

## Project Structure

### Documentation (this feature)

```text
specs/002-youtube-custom-ui/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── manifest.json
├── popup/                 # NEW: Popup UI
│   ├── index.html
│   ├── index.js           # Entry point (React root)
│   ├── App.jsx
│   ├── components/        # Sidebar, Toggle, layout
│   └── styles.css
├── content/
│   ├── platforms/
│   │   └── youtube.js     # UPDATED: Enhanced logic for new options
│   └── core/
│       └── storage.js     # NEW: Helper for reading settings
└── styles/
    ├── popup/             # NEW: Popup styles
    └── platforms/
        └── youtube.css    # UPDATED: New rules for Grid/Minimalist Home
```

**Structure Decision**: Expanding the existing extension structure. Adding a rich `popup/` directory for the new UI requirements.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| React for Popup | State management for multiple toggles/sites is complex in vanilla JS. | Vanilla JS scales poorly with "granular options" requirements (US4). |