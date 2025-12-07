# Tasks: Social Media Distraction Blocker

**Input**: Design documents from `/specs/001-social-media-blocker/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included as the plan emphasizes high test coverage (unit/mocking) for the blocking logic and navigation handling.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Extension Root**: `src/`
- **Tests**: `tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure (src/, tests/, content/, background/, popup/) per implementation plan
- [x] T002 Initialize `package.json` with Jest and jest-chrome dev dependencies
- [x] T003 Create `manifest.json` with V3 permissions (storage, scripting) and host permissions
- [x] T004 Create `src/background/service-worker.js` for handling installation
- [x] T005 Create `src/styles/common.css` for shared blocking styles (if any)
- [x] T006 Configure Jest in `jest.config.js` and `tests/setup.js` for extension mocking

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Implement `BlockerStrategy` interface/base class in `src/content/core/strategy.js`
- [x] T008 [P] Implement `BlockerEngine` in `src/content/core/blocker-engine.js` (CSS injection logic)
- [x] T009 Implement `MutationObserver` logic in `src/content/core/observer.js` for SPA handling
- [x] T010 Implement navigation listener in `src/background/service-worker.js` and message handler in `src/content/index.js`
- [x] T011 [P] Create unit tests for BlockerEngine in `tests/unit/core/blocker-engine.test.js`

**Checkpoint**: Core engine ready to accept platform strategies

---

## Phase 3: User Story 1 - YouTube Focus Mode (Priority: P1) 🎯 MVP

**Goal**: Block YouTube Homepage feed and sidebar recommendations while allowing search and video playback.

**Independent Test**: Load unpacked extension, visit YouTube. Home feed should be hidden. Search should work. Video sidebar hidden.

### Tests for User Story 1

- [x] T012 [P] [US1] Create unit tests for YouTube strategy selectors in `tests/unit/platforms/youtube.test.js`

### Implementation for User Story 1

- [x] T013 [P] [US1] Create `src/styles/platforms/youtube.css` with hiding rules for Home grid (`ytd-browse[page-subtype="home"]`)
- [x] T014 [P] [US1] Update `src/styles/platforms/youtube.css` to hide Watch Next sidebar (`#secondary`) and Shorts (`ytd-reel-shelf-renderer`)
- [x] T015 [US1] Implement `YouTubeStrategy` class in `src/content/platforms/youtube.js` implementing `BlockerStrategy`
- [x] T016 [US1] Register YouTube strategy in `src/content/index.js` based on hostname
- [x] T017 [US1] Add `src/styles/platforms/youtube.css` to `manifest.json` under content_scripts (static injection)

**Checkpoint**: YouTube blocking functional. MVP Achieved.

---

## Phase 4: User Story 2 - Meta (Facebook/Instagram) Messaging & Search Only (Priority: P2)

**Goal**: Block News Feed and Stories on FB/Insta, allow Messages and Search.

**Independent Test**: Visit FB/Insta. Feeds hidden. Messages accessible.

### Tests for User Story 2

- [x] T018 [P] [US2] Create unit tests for Facebook/Instagram selectors in `tests/unit/platforms/meta.test.js`

### Implementation for User Story 2

- [x] T019 [P] [US2] Create `src/styles/platforms/facebook.css` hiding Feed (`[role="feed"]`) and Stories
- [x] T020 [P] [US2] Create `src/styles/platforms/instagram.css` hiding Feed (`article`), Stories, and Explore
- [x] T021 [US2] Implement `FacebookStrategy` in `src/content/platforms/facebook.js` handling message URL exceptions
- [x] T022 [US2] Implement `InstagramStrategy` in `src/content/platforms/instagram.js` handling Direct Message exceptions
- [x] T023 [US2] Register Meta strategies in `src/content/index.js`
- [x] T024 [US2] Update `manifest.json` to include FB/Insta CSS files

**Checkpoint**: Facebook and Instagram blocking functional.

---

## Phase 5: User Story 3 - Reddit Search Focus (Priority: P3)

**Goal**: Block Reddit Home/Popular feeds, allow specific post viewing and search.

**Independent Test**: Visit Reddit. Home feed hidden. Search works.

### Tests for User Story 3

- [x] T025 [P] [US3] Create unit tests for Reddit strategy in `tests/unit/platforms/reddit.test.js`

### Implementation for User Story 3

- [x] T026 [P] [US3] Create `src/styles/platforms/reddit.css` hiding main feed containers
- [x] T027 [US3] Implement `RedditStrategy` in `src/content/platforms/reddit.js`
- [x] T028 [US3] Register Reddit strategy in `src/content/index.js`
- [x] T029 [US3] Update `manifest.json` to include Reddit CSS

**Checkpoint**: All 4 platforms supported.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T030 Create basic Popup UI `src/popup/popup.html` showing status (Active/Inactive)
- [x] T031 Implement popup logic `src/popup/popup.js` to query content script status
- [x] T032 Add app icons and finalize `manifest.json` metadata
- [x] T033 Run manual regression test on all platforms (SPA navigation checks)
- [x] T034 [P] Update `README.md` and documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1. BLOCKS all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational. Can run in parallel or sequence.

### User Story Dependencies

- **User Story 1 (YouTube)**: Depends on Core Engine. Independent of other sites.
- **User Story 2 (Meta)**: Depends on Core Engine. Independent of YouTube.
- **User Story 3 (Reddit)**: Depends on Core Engine. Independent of others.

### Parallel Opportunities

- **CSS & Logic**: For each story, CSS file creation (T013, T019, T020, T026) can happen parallel to Strategy JS implementation (T015, T021, T022, T027).
- **Different Platforms**: Once Phase 2 is done, US1, US2, and US3 can be fully parallelized by different developers.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2.
2. Complete Phase 3 (YouTube).
3. Validate "No FOUC" on YouTube.
4. Release/Demo MVP.

### Incremental Delivery

1. Add Phase 4 (Meta).
2. Add Phase 5 (Reddit).
3. Polish UI.
