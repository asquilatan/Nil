# Research: YouTube Focus Mode & Custom UI

**Feature**: 002-youtube-custom-ui
**Date**: 2025-12-07

## Topic 1: React in Chrome Extension Popup

### Decision
Use **Preact** (via `preact/compat` if needed, or just Preact directly) instead of full React for the Popup UI. Build process will use **Vite** or **Webpack** to bundle the popup assets.

### Rationale
- **Size**: Preact is 3kb vs React's ~40kb. Extensions need to load instantly; a smaller bundle size ensures the popup opens < 200ms.
- **Complexity**: The "Granular Options" requirement (toggles for audio, thumbnails, comments, chat, playlists) involves significant state management. Doing this in Vanilla JS leads to "spaghetti code" of DOM listeners. A component-based library is justified.
- **Ecosystem**: Allows usage of standard React-like hooks (`useState`, `useEffect`) which developers are familiar with.

### Alternatives Considered
- **Vanilla JS**: Too verbose for the number of state permutations (US3 & US4).
- **Full React**: Overkill for a small popup, slower startup time.
- **Svelte**: Good candidate, but Preact is closer to standard React if the team scales.

## Topic 2: "Audio Only" Mode Implementation

### Decision
Implement "Audio Only" by **Visually Hiding** the `<video>` element (`visibility: hidden` or `opacity: 0`) and overlaying a custom control bar, but **keeping the video playing** in the DOM.

### Rationale
- **Simplicity**: Decoupling the audio stream from the video container is technically complex and prone to breaking with YouTube updates.
- **Functionality**: YouTube requires the video element to be "playing" to serve audio. Removing it breaks playback.
- **Bandwidth**: We cannot easily save bandwidth (force audio-only stream) without complex request blocking/redirecting which is flaky. The user's primary goal is "distraction free" (visual), not data saving.

### Alternatives Considered
- **Request Blocking**: Blocking video chunks (`.m4v` requests) often causes the player to error out or infinite buffer.

## Topic 3: Grid Layout for Search Results

### Decision
Use **CSS Grid** injection to override YouTube's list layout on `/results`.

### Rationale
- YouTube's search results are typically a vertical list of `<ytd-video-renderer>`.
- We can set the parent container to `display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));`.
- This is a pure CSS solution (fast, no FOUC if injected early).

## Topic 4: Dynamic Settings Application

### Decision
Use `chrome.storage.onChanged` listener in the **Content Script** to apply setting changes immediately without reload.

### Rationale
- UX Requirement: "User toggles option -> sees change immediately".
- The content script already runs on the page. It can listen for storage changes and toggle CSS classes on the `<body>` (e.g., `body.yt-audio-only`, `body.yt-hide-comments`).
- CSS Selectors then use these body classes: `body.yt-hide-comments #comments { display: none; }`.

### Alternatives Considered
- **Message Passing**: Sending a message from Popup -> Content Script. Storage listener is cleaner as it handles multiple open tabs automatically (sync).
