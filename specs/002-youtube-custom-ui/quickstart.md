# Quickstart: YouTube Focus Mode & Custom UI

## Prerequisites
- Node.js & npm (Required for building the Popup UI)

## Building the Popup
The Popup UI is built with Preact/Vite and must be bundled before loading the extension.

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Build Popup**:
   ```bash
   npm run build:popup
   # This outputs the bundled JS/CSS to src/popup/dist/
   ```

## Loading into Chrome
1. Go to `chrome://extensions`.
2. Enable **Developer Mode**.
3. Click **Load Unpacked**.
4. Select the `src/` directory.

## Verification Steps

1. **Check Popup**:
   - Click the extension icon.
   - Verify the sidebar has YouTube selected by default.
   - Verify toggles exist for "Audio Only", "Comments", etc.

2. **Check YouTube Homepage**:
   - Go to `youtube.com`.
   - **Expect**: Only Search Bar + Logo. No feed.

3. **Check Search Results**:
   - Search for "test".
   - **Expect**: Grid view, small thumbnails.

4. **Check Audio Mode**:
   - Open a video.
   - Open Popup -> Toggle "Audio Only" ON.
   - **Expect**: Video turns black/hidden immediately (no reload).
