# Nil: Distraction-free Social Media
<p align="center">
  <img src="banner/nil_logo.png" alt="Nil Banner">
</p>

Nil is an all-in-one browser extension that simplifies social media UIs by removing addicting elements.

## Current Features

### Extension UI
- **Theme Support**: Light, Dark, and System theme options
- **Settings Search**: Fuzzy search to quickly find settings
- **Clean Interface**: Modern, minimal design with dropdown controls and toggle switches
- **Collapsible Sections**: Organized settings with expandable categories

### YouTube
- **Home Feed Modes**: 
  - Normal: Standard YouTube homepage
  - Simplify: Reduced distractions
  - Oversimplified: Minimalist Google-style (logo + search bar only)
  - Disable: Completely hide home feed
- **Search Feed**: Toggle between clean list view (text-only) or standard grid
- **Content Blocking**: Simplify or disable Sidebar, Comments, and Navigation Bar
- **Video Playback**: Option to disable video playback
- **Smart Scoping**: Sidebar rules apply only to the Watch page

### Reddit
- **Feed Control**: Normal, Simplify (text-only), or Disable the Main Feed
- **Sidebar Content**: Simplify or Disable sidebar with optional subreddit description hiding
- **Content Toggles**: Disable Recently Viewed
- **Conversation Focus**: Simplify or Disable Comments and Messages

## Planned Features

Targeting doom-scrolling on other platforms:
- **Facebook**: Block News Feed, Stories, Watch Tab
- **Instagram**: Block Explore, Reels, Stories
- **Twitter/X**: Block "For You" timeline
- **TikTok**: Block "For You Page"
- **Advanced Customization**: Granular settings to toggle specific features across all platforms


## Installation

1. Clone repo & `npm install`
2. `npm run build:popup`
3. Load unpacked `src` folder in `chrome://extensions` (Developer Mode)

## Development

- `npm test`
- `npm run build:popup`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.