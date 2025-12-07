# Feature Specification: Social Media Distraction Blocker

**Feature Branch**: `001-social-media-blocker`
**Created**: 2025-12-07
**Status**: Draft
**Input**: User description: "I want a social media blocker chrome extension, which only allows me to search up videos in youtube (no feed or anything), message people and search in facebook and instagram, search up posts in reddit. (other social media sites will come later)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - YouTube Focus Mode (Priority: P1)

As a user, I want to use YouTube only for searching and watching specific videos, so I avoid getting distracted by the homepage feed and sidebar recommendations.

**Why this priority**: YouTube is a major source of distraction, and the core request specifically mentions "no feed or anything" for video search.

**Independent Test**: Install extension, navigate to YouTube. Verify Homepage feed is hidden. Perform a search. Verify results appear. Click a video. Verify video plays but sidebar recommendations are hidden.

**Acceptance Scenarios**:

1. **Given** the extension is active, **When** I visit `youtube.com`, **Then** the homepage video feed should not be visible (blank or custom message).
2. **Given** I am on YouTube, **When** I use the search bar, **Then** search results should be displayed normally.
3. **Given** I am watching a video, **When** the page loads, **Then** the "Up Next" and recommended videos sidebar should be hidden.
4. **Given** I am on YouTube, **When** I navigate via internal links (SPA navigation), **Then** the blocking rules should persist without reload.

---

### User Story 2 - Meta (Facebook/Instagram) Messaging & Search Only (Priority: P2)

As a user, I want to use Facebook and Instagram only for messaging and searching, so I don't get sucked into the news feed, stories, or reels.

**Why this priority**: Covers two major platforms (Meta) requested for messaging/search specific workflow.

**Independent Test**: Log into Facebook/Instagram. Verify Feeds/Stories are hidden. Open Messenger/DM. Verify messaging works. Use Search. Verify results appear.

**Acceptance Scenarios**:

1. **Given** the extension is active, **When** I visit `facebook.com` or `instagram.com`, **Then** the main news feed, stories bar, and reels sections should be hidden.
2. **Given** I am on Facebook/Instagram, **When** I navigate to Messenger or Direct Messages, **Then** the messaging interface should be fully functional.
3. **Given** I am on Facebook/Instagram, **When** I use the search feature, **Then** search results should be visible and accessible.

---

### User Story 3 - Reddit Search Focus (Priority: P3)

As a user, I want to use Reddit to find specific answers via search, without seeing the "Popular" or "Home" feeds.

**Why this priority**: Completes the requested set of platforms.

**Independent Test**: Visit Reddit. Verify Home/Popular feeds are hidden. Type in search. Verify results. Click a post. Verify post content is visible.

**Acceptance Scenarios**:

1. **Given** the extension is active, **When** I visit `reddit.com`, **Then** the main post feed (Home/Popular/All) should be hidden.
2. **Given** I am on Reddit, **When** I perform a search, **Then** results should be visible.
3. **Given** I click a search result, **When** the post loads, **Then** the post content and comments should be visible.

### Edge Cases

- What happens when a platform updates its layout or code structure? (Extension may fail to hide elements -> Requirements for robust identification or maintenance plan).
- How does the system handle "Shorts" or "Reels" direct links? (Should likely hide the player or redirect, but basic requirement is hiding feeds/discovery).
- What happens on mobile view (if browser is resized)? (Layouts might change).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST be a Chrome Extension.
- **FR-002**: System MUST visually suppress specific content areas (feeds, sidebars) on `youtube.com`, `facebook.com`, `instagram.com`, and `reddit.com`.
- **FR-003**: On YouTube, system MUST hide the homepage video grid.
- **FR-004**: On YouTube, system MUST hide the "Watch Next" / recommendation sidebar on video pages.
- **FR-005**: On YouTube, system MUST hide YouTube Shorts shelves/tabs.
- **FR-006**: On Facebook, system MUST hide the main News Feed and Stories container.
- **FR-007**: On Facebook, system MUST allow access to `facebook.com/messages` and embedded chat windows.
- **FR-008**: On Instagram, system MUST hide the main Feed, Stories bar, and "Explore" grid.
- **FR-009**: On Instagram, system MUST allow access to Direct Messages (`instagram.com/direct/`).
- **FR-010**: On Reddit, system MUST hide the main feed containers on Home, Popular, and r/all.
- **FR-011**: On Reddit, system MUST hide the "Trending Today" or sidebar recommendations if they contain feed content.
- **FR-012**: System MUST apply hiding logic immediately upon page load to minimize "flash of unblocked content".
- **FR-013**: System MUST re-apply hiding logic on dynamic page updates (single-page application navigation) for all supported sites.

### Key Entities

- **BlockRule**: Defines a domain and the set of content areas to hide.
- **SiteState**: Tracks whether the user is currently in a "permitted" area (e.g., Search, Messages) vs a "blocked" area (Feed).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users see ZERO feed items on YouTube Homepage, Facebook Feed, Instagram Feed, or Reddit Home upon loading the page.
- **SC-002**: Users can successfully access the Search bar and view results on all 4 platforms 100% of the time.
- **SC-003**: Users can successfully send a message on Facebook or Instagram without disabling the extension.
- **SC-004**: "Flash of unblocked content" (feed appearing before being hidden) lasts less than 500ms on 90% of page loads.
