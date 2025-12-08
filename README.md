# Nil

A Chrome Extension to block distracting content (feeds, reels, recommendations) on YouTube, Facebook, Instagram, and Reddit.

## Features

- **YouTube**: Blocks Home Feed, Watch Next Sidebar, Shorts.
- **Facebook**: Blocks News Feed, Stories, Watch Tab.
- **Instagram**: Blocks Feed, Stories, Explore, Reels.
- **Reddit**: Blocks Main Feed, Sidebar.

## Installation

1. Clone this repository.
2. Install dependencies: `npm install`
3. Build the Popup UI: `npm run build:popup`
4. Open Chrome and go to `chrome://extensions`.
5. Enable "Developer mode".
6. Click "Load unpacked" and select the `src` folder.

## Development

- Run tests: `npm test`
- Rebuild popup after changes: `npm run build:popup`
