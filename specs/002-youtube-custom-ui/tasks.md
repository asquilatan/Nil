# Tasks: YouTube Focus Mode & Custom UI

**Input**: Design documents from `/specs/002-youtube-custom-ui/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md
**Tests**: Unit tests for storage/strategy logic, Component tests for Popup.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Parallelizable
- **[Story]**: [US1] Homepage, [US2] Search, [US3] Popup, [US4] Options

## Path Conventions
- **Source**: `src/`
- **Popup**: `src/popup/`
- **Tests**: `tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize build tooling for Preact Popup and new storage utilities

- [x] T001 Initialize Vite + Preact configuration for `src/popup/`
- [x] T002 [P] Install dependencies (`preact`, `vite`, `lucide-preact`, `tailwindcss`)
- [x] T003 Create `src/content/core/storage.js` helper for reading/writing `chrome.storage.local`
- [x] T004 Update `src/content/core/strategy.js` to include `onSettingsChange` method in interface
- [x] T005 [P] Create `tests/unit/core/storage.test.js` to verify storage helpers

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic to handle dynamic class toggling on `<body>`

**⚠️ CRITICAL**: Must complete before implementing specific CSS rules

- [x] T006 Implement `SettingsManager` in `src/content/core/settings-manager.js` to listen for `chrome.storage.onChanged`
- [x] T007 Update `src/content/index.js` to initialize `SettingsManager`
- [x] T008 [P] Create unit test `tests/unit/core/settings-manager.test.js` verifying body class toggling

---

## Phase 3: User Story 1 - Minimalist Homepage (Priority: P1)

**Goal**: Logo + Search bar only.

- [x] T009 [US1] Update `src/content/platforms/youtube.js` to toggle `nil-yt-home-minimal` class based on settings
- [x] T010 [P] [US1] Create/Update `src/styles/platforms/youtube.css` with rules for `.nil-yt-home-minimal` (Hide feed, center search)
- [x] T011 [P] [US1] Verify selectors for YouTube Search Bar (`#search-form`) and Logo (`ytd-topbar-logo-renderer`)

---

## Phase 4: User Story 2 - Minimalist Search Results (Priority: P2)

**Goal**: Grid layout, small thumbnails.

- [x] T012 [US2] Update `src/content/platforms/youtube.js` to handle `nil-yt-grid-results` and `nil-yt-thumb-small` classes
- [x] T013 [P] [US2] Add CSS Grid rules to `src/styles/platforms/youtube.css` for `.nil-yt-grid-results ytd-section-list-renderer`
- [x] T014 [P] [US2] Add CSS rules for small thumbnails `.nil-yt-thumb-small ytd-thumbnail`

---

## Phase 5: User Story 3 - Extension Popup UI & State Management (Priority: P3)

**Goal**: Modern Popup UI with Sidebar and Toggles.

- [x] T015 [US3] Create `src/popup/components/Sidebar.jsx` with platform icons
- [x] T016 [US3] Create `src/popup/components/Toggle.jsx` generic component
- [x] T017 [US3] Implement `src/popup/App.jsx` with state management (Preact hooks) loading/saving to `chrome.storage`
- [x] T018 [US3] Implement `src/popup/index.js` entry point and mount to DOM
- [x] T019 [P] [US3] Style Popup using Tailwind/CSS in `src/popup/styles.css`
- [x] T020 [P] [US3] Update `manifest.json` to point `default_popup` to `popup/dist/index.html` (after build)

---

## Phase 6: User Story 4 - YouTube Granular Options (Priority: P4)

**Goal**: Audio Only, Comments, Chat toggles.

- [x] T021 [US4] Update `src/content/platforms/youtube.js` to handle `audioOnly`, `comments`, `hideLiveChat` settings
- [x] T022 [P] [US4] Add CSS rules for `.nil-yt-audio-only` (Hide video, show placeholder)
- [x] T023 [P] [US4] Add CSS rules for `.nil-yt-no-comments` and `.nil-yt-no-chat`
- [x] T024 [P] [US4] Create "Audio Mode" overlay UI in `src/content/platforms/youtube-audio-overlay.js` (Optional JS injection for controls)

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T025 Ensure "Audio Only" mode persists video playback (doesn't pause)
- [x] T026 [P] Add transition effects to CSS classes for smooth toggling
- [x] T027 Verify Dark Mode compatibility for Popup and Injected UI
- [x] T028 Update `README.md` with build instructions

---

## Dependencies & Execution Order

- **Phase 1 & 2** (Setup/Foundation) -> Blocks everything.
- **Phase 3 & 4** (YouTube CSS) -> Can run parallel to **Phase 5** (Popup UI).
- **Phase 6** (Granular) -> Depends on Phase 2 & 5.

## Parallel Opportunities

- **CSS vs JS**: Tasks marked [P] (CSS rules) can be written while JS logic is implemented.
- **Popup vs Content**: The Popup UI (React) is largely independent of the Content Script logic until integration.
