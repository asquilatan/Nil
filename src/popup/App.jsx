import { useState, useEffect } from 'preact/hooks';
import { Sidebar } from './components/Sidebar';
import { Toggle } from './components/Toggle';
import { Card } from './components/Card';
import { SegmentedControl } from './components/SegmentedControl';
import { Home, MessageSquare, Video, MessageCircle, Menu, Tv, Search, ChevronDown } from 'lucide-preact';

const DEFAULT_SETTINGS = {
  enabled: true,
  platforms: {
    'youtube.com': {
      enabled: true,
      options: {
        homeFeedMode: 'simplify',
        commentsMode: 'simplify',
        sidebarMode: 'simplify',
        chatMode: 'simplify',
        navbarMode: 'simplify',
        searchFeedMode: 'simplify',
        disablePlayback: false,
        oversimplifiedMode: false,
        minimalSearchResults: true // Keeping for backward compat, though handled by searchFeedMode now
      }
    },
    'facebook.com': {
      enabled: true,
      options: {
        blockFeed: true,
        blockStories: true,
        blockRightRail: true,
        blockWatch: true
      }
    },
    'instagram.com': {
      enabled: true,
      options: {
        blockFeed: true,
        blockStories: true,
        blockExplore: true,
        blockReels: true
      }
    },
    'reddit.com': {
      enabled: true,
      options: {
        feedMode: 'simplify',
        sidebarContentMode: 'simplify',
        recentlyViewedMode: 'normal',
        chatMode: 'simplify',
        commentsMode: 'simplify'
      }
    }
  }
};


export function App() {
  const [settings, setSettings] = useState(null);
  const [activeTab, setActiveTab] = useState(null); // Start with null to load from storage
  const [theme, setTheme] = useState('dark'); // Theme state
  const [settingsSearch, setSettingsSearch] = useState(''); // Settings search query

  // Fuzzy match function - checks if search chars appear in order in text
  const fuzzyMatch = (text, search) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    const textLower = text.toLowerCase();

    let searchIndex = 0;
    for (let i = 0; i < textLower.length && searchIndex < searchLower.length; i++) {
      if (textLower[i] === searchLower[searchIndex]) {
        searchIndex++;
      }
    }
    return searchIndex === searchLower.length;
  };

  // Define all searchable settings
  const allSettings = [
    { section: 'Appearance', key: 'theme', label: 'Theme', keywords: ['theme', 'dark', 'light', 'mode', 'appearance', 'color'] }
  ];

  // Filter settings based on search
  const filterSettings = (sectionName) => {
    if (!settingsSearch) return true;
    const sectionSettings = allSettings.filter(s => s.section === sectionName);
    return sectionSettings.some(s =>
      fuzzyMatch(s.label, settingsSearch) ||
      fuzzyMatch(s.section, settingsSearch) ||
      s.keywords.some(k => fuzzyMatch(k, settingsSearch))
    );
  };

  const filterSettingItem = (label, keywords = []) => {
    if (!settingsSearch) return true;
    return fuzzyMatch(label, settingsSearch) || keywords.some(k => fuzzyMatch(k, settingsSearch));
  };

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      // Load settings, active tab, and theme
      chrome.storage.local.get(['settings', 'activeTab', 'theme'], (data) => {
        // Merge defaults to handle schema migration/updates
        const loadedFn = data.settings || DEFAULT_SETTINGS;
        // Simple merge for now - in production might need deeper merge, 
        // but resetting to default structure for dev is safer if schema changed significantly.
        // Let's protect against missing new keys by spreading defaults.
        const merged = { ...DEFAULT_SETTINGS, ...loadedFn, platforms: { ...DEFAULT_SETTINGS.platforms, ...loadedFn.platforms } };

        // Ensure youtube options have new keys if they don't exist
        if (merged.platforms['youtube.com']) {
          merged.platforms['youtube.com'].options = {
            ...DEFAULT_SETTINGS.platforms['youtube.com'].options,
            ...loadedFn.platforms['youtube.com']?.options
          };
        }

        setSettings(merged);

        // Load active tab, default to youtube.com if not set
        setActiveTab(data.activeTab || 'youtube.com');

        // Load theme
        const savedTheme = data.theme || 'dark';
        setTheme(savedTheme);

        // Determine actual theme to apply
        let actualTheme = savedTheme;
        if (savedTheme === 'system') {
          actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', actualTheme);
      });
    } else {
      setSettings(DEFAULT_SETTINGS);
      setActiveTab('youtube.com');
    }
  }, []);

  const updateSetting = (path, value) => {
    const newSettings = JSON.parse(JSON.stringify(settings));

    let current = newSettings;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;

    setSettings(newSettings);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ settings: newSettings });
    }
  };

  // Handler for tab changes that persists selection
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ activeTab: newTab });
    }
  };

  if (!settings || activeTab === null) return <div class="loading-screen">Loading...</div>;

  const platform = settings.platforms[activeTab] || { enabled: false, options: {} };

  // Platform Display Names
  const displayNames = {
    'youtube.com': 'YouTube',
    'facebook.com': 'Facebook',
    'instagram.com': 'Instagram',
    'reddit.com': 'Reddit',
    'settings': 'Settings'
  };
  const platformName = displayNames[activeTab] || activeTab;

  // Toggle theme handler
  const toggleTheme = (newTheme) => {
    setTheme(newTheme);

    // Determine actual theme to apply
    let actualTheme = newTheme;
    if (newTheme === 'system') {
      // Use system preference
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', actualTheme);

    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ theme: newTheme });
    }
  };

  // Create status map for sidebar indicators
  const statusMap = Object.entries(settings.platforms).reduce((acc, [key, val]) => {
    acc[key] = val.enabled;
    return acc;
  }, {});

  const renderOptions = () => {
    if (!platform.enabled) return null;

    if (activeTab === 'youtube.com' || activeTab === 'reddit.com') {
      const isReddit = activeTab === 'reddit.com';

      const modeOptions3 = [
        { label: 'Normal', value: 'normal' },
        { label: 'Simplify', value: 'simplify' },
        { label: 'Disable', value: 'disable' }
      ];
      const modeOptions2 = [
        { label: 'Normal', value: 'normal' },
        { label: 'Simplify', value: 'simplify' }
      ];



      // Youtube specific options
      if (!isReddit) {
        return (
          <Card>
            {/* Home Feed - 4 choices → dropdown (includes Oversimplified) */}
            <div class="platform-setting-row">
              <div class="platform-setting-label">
                <Home size={16} class="setting-icon" />
                <span>Home Feed</span>
              </div>
              <select
                class="platform-select"
                value={platform.options?.homeFeedMode || 'normal'}
                onChange={(e) => updateSetting(['platforms', activeTab, 'options', 'homeFeedMode'], e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="simplify">Simplify</option>
                <option value="oversimplified">Oversimplified</option>
                <option value="disable">Disable</option>
              </select>
            </div>

            {/* Search Feed - 2 choices → toggle */}
            <div class="platform-setting-row">
              <div class="platform-setting-label">
                <Search size={16} class="setting-icon" />
                <span>Search Feed</span>
              </div>
              <Toggle
                checked={platform.options?.searchFeedMode === 'simplify'}
                onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'searchFeedMode'], v ? 'simplify' : 'normal')}
              />
            </div>

            {/* Comments - 3 choices → dropdown */}
            <div class="platform-setting-row">
              <div class="platform-setting-label">
                <MessageSquare size={16} class="setting-icon" />
                <span>Comments</span>
              </div>
              <select
                class="platform-select"
                value={platform.options?.commentsMode || 'normal'}
                onChange={(e) => updateSetting(['platforms', activeTab, 'options', 'commentsMode'], e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="simplify">Simplify</option>
                <option value="disable">Disable</option>
              </select>
            </div>

            {/* Sidebar Content - 3 choices → dropdown */}
            <div class="platform-setting-row">
              <div class="platform-setting-label">
                <Video size={16} class="setting-icon" />
                <span>Sidebar Content</span>
              </div>
              <select
                class="platform-select"
                value={platform.options?.sidebarMode || 'normal'}
                onChange={(e) => updateSetting(['platforms', activeTab, 'options', 'sidebarMode'], e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="simplify">Simplify</option>
                <option value="disable">Disable</option>
              </select>
            </div>

            {/* Navigation Bar - 2 choices → toggle */}
            <div class="platform-setting-row">
              <div class="platform-setting-label">
                <Menu size={16} class="setting-icon" />
                <span>Navigation Bar</span>
              </div>
              <Toggle
                checked={platform.options?.navbarMode === 'simplify'}
                onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'navbarMode'], v ? 'simplify' : 'normal')}
              />
            </div>

            {/* Video Playback - toggle */}
            <div class="platform-setting-row">
              <div class="platform-setting-label">
                <Tv size={16} class="setting-icon" />
                <span>Disable Playback</span>
              </div>
              <Toggle
                checked={platform.options?.disablePlayback || false}
                onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'disablePlayback'], v)}
              />
            </div>
          </Card>
        );
      }

      // Reddit specific options
      return (
        <Card>
          {/* Main Feed - 3 choices → dropdown */}
          <div class="platform-setting-row">
            <div class="platform-setting-label">
              <Home size={16} class="setting-icon" />
              <span>Main Feed</span>
            </div>
            <select
              class="platform-select"
              value={platform.options?.feedMode || 'normal'}
              onChange={(e) => updateSetting(['platforms', activeTab, 'options', 'feedMode'], e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="simplify">Simplify</option>
              <option value="disable">Disable</option>
            </select>
          </div>

          {/* Recently Viewed - 2 choices → toggle */}
          <div class="platform-setting-row">
            <div class="platform-setting-label">
              <Video size={16} class="setting-icon" />
              <span>Recently Viewed</span>
            </div>
            <Toggle
              checked={platform.options?.recentlyViewedMode === 'disable'}
              onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'recentlyViewedMode'], v ? 'disable' : 'normal')}
            />
          </div>

          {/* Sidebar Content - 3 choices → dropdown */}
          <div class="platform-setting-row">
            <div class="platform-setting-label">
              <Video size={16} class="setting-icon" />
              <span>Sidebar Content</span>
            </div>
            <select
              class="platform-select"
              value={platform.options?.sidebarContentMode || 'normal'}
              onChange={(e) => updateSetting(['platforms', activeTab, 'options', 'sidebarContentMode'], e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="simplify">Simplify</option>
              <option value="disable">Disable</option>
            </select>
          </div>

          {/* Hide Subreddit Description - sub-setting toggle */}
          {platform.options?.sidebarContentMode !== 'normal' && (
            <div class="platform-setting-row sub-setting">
              <span class="platform-setting-sublabel">Hide Subreddit Description</span>
              <Toggle
                checked={platform.options?.hideSubredditDescription || false}
                onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'hideSubredditDescription'], v)}
              />
            </div>
          )}

          {/* Comments - 3 choices → dropdown */}
          <div class="platform-setting-row">
            <div class="platform-setting-label">
              <MessageSquare size={16} class="setting-icon" />
              <span>Comments</span>
            </div>
            <select
              class="platform-select"
              value={platform.options?.commentsMode || 'normal'}
              onChange={(e) => updateSetting(['platforms', activeTab, 'options', 'commentsMode'], e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="simplify">Simplify</option>
              <option value="disable">Disable</option>
            </select>
          </div>

          {/* Messages - 2 choices → toggle */}
          <div class="platform-setting-row">
            <div class="platform-setting-label">
              <MessageCircle size={16} class="setting-icon" />
              <span>Messages</span>
            </div>
            <Toggle
              checked={platform.options?.chatMode === 'disable'}
              onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'chatMode'], v ? 'disable' : 'normal')}
            />
          </div>
        </Card>
      );
    }

    // Default generic render for other platforms
    return (
      <Card title="Blocking Options">
        {Object.entries(platform.options || {}).map(([key, value]) => (
          <div class="option-row">
            <Toggle
              label={key.replace(/block/g, 'Block ').replace(/([A-Z])/g, ' $1').trim()}
              checked={value}
              onChange={(v) => updateSetting(['platforms', activeTab, 'options', key], v)}
            />
          </div>
        ))}
      </Card>
    );
  };

  return (
    <div class="app-wrapper">
      {/* Main Container - Glassmorphic & Rounded */}
      <div class="main-container">

        {/* Background Gradients */}
        <div class="gradient-blob-1"></div>
        <div class="gradient-blob-2"></div>

        {/* Sidebar */}
        <div class="sidebar-wrapper">
          <Sidebar active={activeTab} onSelect={handleTabChange} statusMap={statusMap} theme={theme} />
        </div>

        {/* Main Content */}
        <div class="content-area">
          {/* Header */}
          <div class="header">
            <h2 class="header-title">{platformName}</h2>

            {/* Active Status Badge - only show for platforms, not settings */}
            {activeTab !== 'settings' && (
              <div class={`status-badge ${platform.enabled ? 'active' : 'disabled'}`}>
                <div class={`status-dot ${platform.enabled ? 'active' : 'disabled'}`}></div>
                {platform.enabled ? 'Active' : 'Disabled'}
              </div>
            )}
          </div>

          {/* Scrollable Content */}
          <main class="scrollable-content">
            {activeTab === 'settings' ? (
              /* Settings Content */
              <>
                {/* Settings Search Bar */}
                <div class="settings-search">
                  <Search size={16} class="settings-search-icon" />
                  <input
                    type="text"
                    placeholder="Search settings..."
                    class="settings-search-input"
                    value={settingsSearch}
                    onInput={(e) => setSettingsSearch(e.target.value)}
                  />
                  {settingsSearch && (
                    <button
                      class="settings-search-clear"
                      onClick={() => setSettingsSearch('')}
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Appearance Section - Collapsible */}
                {filterSettings('Appearance') && (
                  <div class={`settings-section ${settingsSearch ? '' : ''}`}>
                    <button
                      class="settings-section-header"
                      onClick={(e) => {
                        if (!settingsSearch) {
                          const section = e.currentTarget.parentElement;
                          section.classList.toggle('collapsed');
                        }
                      }}
                    >
                      <span>Appearance</span>
                      {!settingsSearch && <ChevronDown size={18} class="settings-section-chevron" />}
                    </button>
                    <div class="settings-section-content">
                      {filterSettingItem('Theme', ['dark', 'light', 'mode', 'color']) && (
                        <div class="settings-row">
                          <span class="settings-row-label">Theme</span>
                          <div class="theme-select-wrapper">
                            <select
                              class="theme-select"
                              value={theme}
                              onChange={(e) => toggleTheme(e.target.value)}
                            >
                              <option value="light">Light</option>
                              <option value="dark">Dark</option>
                              <option value="system">System</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* No results message */}
                {settingsSearch && !filterSettings('Appearance') && (
                  <div class="settings-no-results">
                    <p>No settings found for "{settingsSearch}"</p>
                  </div>
                )}
              </>
            ) : (
              /* Platform Content */
              <>
                {/* Main Enable Toggle */}
                <div class={`main-toggle-card ${platform.enabled ? 'active' : ''}`}>
                  <div class="main-toggle-text">
                    <h3>Enable Blocking</h3>
                    <p>Master switch for this platform</p>
                  </div>
                  <Toggle
                    label=""
                    checked={platform.enabled}
                    onChange={(v) => updateSetting(['platforms', activeTab, 'enabled'], v)}
                  />
                </div>

                {renderOptions()}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}