# Feature Specification: YouTube Focus Mode & Custom UI

**Feature Branch**: `002-youtube-custom-ui`
**Created**: 2025-12-07
**Status**: Draft
**Input**: User description provided in the prompt.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Minimalist Homepage (Priority: P1)

As a user, I want a distraction-free YouTube homepage that only displays a search bar and the YouTube logo, so I can search for content without being tempted by the feed.

**Why this priority**: Establish the core "Focus" experience first.

**Independent Test**: Load `youtube.com`. Verify only logo and search bar are visible. Sidebar, feed, and other elements should be hidden.

**Acceptance Scenarios**:

1. **Given** I am on the YouTube homepage, **When** the page loads, **Then** I should see a centered search bar with rounded borders and the YouTube logo above it.
2. **Given** I am on the homepage, **When** the page loads, **Then** the video feed, sidebar, and other navigational elements MUST be hidden.
3. **Given** I type in the search bar, **When** I press enter, **Then** I should be taken to the search results page.

### User Story 2 - Minimalist Search Results (Priority: P2)

As a user, I want search results to be presented in a clean grid layout with minimal metadata, so I can find what I need efficiently.

**Why this priority**: High value for the core workflow (searching).

**Independent Test**: Perform a search. Verify grid layout. Check metadata fields.

**Acceptance Scenarios**:

1. **Given** I am viewing search results, **When** the page loads, **Then** videos should be displayed in a grid (not a list).
2. **Given** I see a video result, **When** I inspect it, **Then** it should display Title, Channel Name, Mini Description, View Count, and Upload Date.
3. **Given** I am on the search results page, **When** the page loads, **Then** the left sidebar should be hidden.
4. **Given** I view the thumbnails, **When** the "Small Thumbnails" option is active (default), **Then** thumbnails should be smaller than the standard YouTube size.

### User Story 3 - Extension Popup UI & State Management (Priority: P3)

As a user, I want a modern popup UI to toggle the extension per site and configure specific YouTube options.

**Why this priority**: Essential for configuration and multi-site support (even if YouTube is the only active one initially).

**Independent Test**: Click extension icon. Verify UI structure (Sidebar, Content). Toggle "Enable". Verify indicator color change.

**Acceptance Scenarios**:

1. **Given** I open the extension popup, **When** it loads, **Then** I should see a sidebar with platform icons (YouTube top/default, FB, Insta, etc.) and a main content area.
2. **Given** I am in the popup, **When** I click the "Enable Extension" toggle at the top right, **Then** the sidebar icon for that site should change color (e.g., Grey -> Brand Color).
3. **Given** I am on the YouTube settings tab, **When** I change an option (e.g., "Disable Comments"), **Then** the setting should be persisted.

### User Story 4 - YouTube Granular Options (Priority: P4)

As a user, I want granular control over YouTube elements (comments, suggestions, player mode) to customize my focus level.

**Why this priority**: Adds depth to the customization but relies on the UI infrastructure (US3).

**Independent Test**: Toggle options in popup. Refresh YouTube. Verify changes (e.g., comments gone, player looks like MP3).

**Acceptance Scenarios**:

1. **Given** "Disable Comments" is ON (default: OFF setting -> Comments hidden?), **When** I view a video, **Then** the comments section should be hidden. *(Note: Spec clarification - User said "disable comments (default: off)", implies comments are visible by default)*.
2. **Given** "Disable Video Playback" is ON, **When** I play a video, **Then** the video element should be hidden/replaced by an "MP3 Player" style UI (slider, controls only).
3. **Given** "Hide Live Chat" is ON (default), **When** I view a live stream, **Then** the chat sidebar should be hidden.

### Edge Cases

- **Theme Consistency**: Does the custom UI respect YouTube's Dark/Light mode? (Assume yes or force one for simplicity initially).
- **Player State**: If "MP3 Mode" is on, does the video actually stop rendering (saving bandwidth) or just visually hide? (Visual hide is simpler for V1).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a minimalist styling for `youtube.com/` (Home) with centered search and logo.
- **FR-002**: System MUST style `youtube.com/results` as a grid with specific metadata (Title, Channel, Desc, Views, Date).
- **FR-003**: System MUST provide a Popup UI with a sidebar navigation for supported platforms.
- **FR-004**: System MUST allow enabling/disabling the extension globally per site (domain level).
- **FR-005**: On YouTube, system MUST support a "Thumbnail Mode" option: [Disabled, Small (Default), Original].
- **FR-006**: On YouTube, system MUST support a "Search Auto-suggestions" toggle (Default: On).
- **FR-007**: On YouTube, system MUST support a "Video Sidebar Suggestions" toggle (Default: On) which respects the Thumbnail Mode.
- **FR-008**: On YouTube, system MUST support a "Disable Comments" toggle (Default: Off -> Comments visible).
- **FR-009**: On YouTube, system MUST support a "Audio Only / MP3 Mode" toggle (Default: Off -> Video visible).
- **FR-010**: When "Audio Only" is active, system MUST hide the video player and display a custom minimal control bar.
- **FR-011**: On YouTube, system MUST support "Hide Playlists" (Default: On) and "Hide Live Chat" (Default: On).
- **FR-012**: System MUST persist all configuration options in `chrome.storage`.

### Key Entities

- **SiteConfig**: Stores the "Enabled" boolean for each domain.
- **YouTubeOptions**: Stores the specific granular settings (thumbnailMode, audioOnly, etc.).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On Homepage load, 100% of "Feed" elements (video recommendations) are hidden 100% of the time.
- **SC-002**: Search Results display in a Grid layout on 100% of search queries.
- **SC-003**: User can toggle "Audio Only" mode and see the visual change within 500ms (no page reload required if using dynamic CSS).
- **SC-004**: Extension Popup loads and displays current state within 200ms of click.