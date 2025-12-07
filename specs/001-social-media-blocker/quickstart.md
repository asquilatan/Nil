# Quickstart: Social Media Distraction Blocker

## Prerequisites
- Google Chrome (or Chromium-based browser like Brave, Edge)
- Node.js & npm (for running tests/linting)

## Setup

1. **Build the project** (if build steps exist, otherwise skip):
   ```bash
   # No build step for MVP (Vanilla JS)
   ```

2. **Load into Chrome**:
   1. Open Chrome and navigate to `chrome://extensions`.
   2. Enable **Developer mode** (toggle in the top right corner).
   3. Click **Load unpacked**.
   4. Select the `src` folder of this repository.

## Verification

1. **YouTube Test**:
   - Go to `https://www.youtube.com`.
   - **Expect**: Homepage video grid is HIDDEN. Search bar is VISIBLE.

2. **Facebook Test**:
   - Go to `https://www.facebook.com`.
   - **Expect**: News Feed is HIDDEN.
   - Go to `https://www.facebook.com/messages`.
   - **Expect**: Messages are VISIBLE.

## Development Loop

1. Make changes to `src/` files.
2. Go to `chrome://extensions`.
3. Click the **Refresh** (circular arrow) icon on the "Social Media Blocker" card.
4. Refresh the target website (e.g., YouTube) to see changes.

## Running Tests

```bash
# Run unit tests
npm test
```
