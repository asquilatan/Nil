import { useState, useEffect } from 'preact/hooks';
import { Sidebar } from './components/Sidebar';
import { Toggle } from './components/Toggle';
import { Card } from './components/Card';
import { SegmentedControl } from './components/SegmentedControl';
import { Home, MessageSquare, Video, MessageCircle, Menu, Tv, Search } from 'lucide-preact';

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
        sidebarMode: 'simplify',
        navbarMode: 'simplify',
        chatMode: 'simplify',
        commentsMode: 'simplify'
      }
    }
  }
};


export function App() {
  const [settings, setSettings] = useState(null);
  const [activeTab, setActiveTab] = useState('youtube.com');

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get('settings', (data) => {
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
      });
    } else {
      setSettings(DEFAULT_SETTINGS);
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

  if (!settings) return <div class="loading-screen">Loading...</div>;

  const platform = settings.platforms[activeTab] || { enabled: false, options: {} };

  // Platform Display Names
  const displayNames = {
    'youtube.com': 'YouTube',
    'facebook.com': 'Facebook',
    'instagram.com': 'Instagram',
    'reddit.com': 'Reddit'
  };
  const platformName = displayNames[activeTab] || activeTab;

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
            <div class="option-row">
              <div class="setting-header">
                <Home size={16} class="setting-icon" />
                <span>Home Feed</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                <SegmentedControl
                  options={modeOptions3}
                  value={platform.options?.homeFeedMode || 'normal'}
                  onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'homeFeedMode'], v)}
                />
                <Toggle
                  label="Oversimplified (Google Style)"
                  checked={platform.options?.oversimplifiedMode || false}
                  onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'oversimplifiedMode'], v)}
                />
              </div>
            </div>

            <div class="h-2"></div>

            <div class="option-row">
              <div class="setting-header">
                <Search size={16} class="setting-icon" />
                <span>Search Feed</span>
              </div>
              <SegmentedControl
                options={modeOptions2}
                value={platform.options?.searchFeedMode || 'normal'}
                onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'searchFeedMode'], v)}
              />
            </div>

            <div class="h-2"></div>

            <div class="option-row">
              <div class="setting-header">
                <MessageSquare size={16} class="setting-icon" />
                <span>Comments</span>
              </div>
              <SegmentedControl
                options={modeOptions3}
                value={platform.options?.commentsMode || 'normal'}
                onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'commentsMode'], v)}
              />
            </div>

            <div class="h-2"></div>

            <div class="option-row">
              <div class="setting-header">
                <Video size={16} class="setting-icon" />
                <span>Sidebar Content</span>
              </div>
              <SegmentedControl
                options={modeOptions3}
                value={platform.options?.sidebarMode || 'normal'}
                onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'sidebarMode'], v)}
              />
            </div>

            <div class="h-2"></div>

            <div class="option-row">
              <div class="setting-header">
                <Menu size={16} class="setting-icon" />
                <span>Navigation Bar</span>
              </div>
              <SegmentedControl
                options={modeOptions2}
                value={platform.options?.navbarMode || 'normal'}
                onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'navbarMode'], v)}
              />
            </div>

            <div class="h-2"></div>

            <div class="option-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div class="setting-header" style={{ margin: 0 }}>
                <Tv size={16} class="setting-icon" />
                <span>Video Playback</span>
              </div>
              <Toggle checked={platform.options?.disablePlayback} onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'disablePlayback'], v)} />
            </div>
          </Card>
        );
      }

      // Reddit specific options
      return (
        <Card>
          <div class="option-row">
            <div class="setting-header">
              <Home size={16} class="setting-icon" />
              <span>Main Feed</span>
            </div>
            <SegmentedControl
              options={modeOptions3}
              value={platform.options?.feedMode || 'normal'}
              onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'feedMode'], v)}
            />
          </div>

          <div class="h-2"></div>

          <div class="option-row">
            <div class="setting-header">
              <Video size={16} class="setting-icon" />
              <span>Sidebar</span>
            </div>
            <SegmentedControl
              options={modeOptions3}
              value={platform.options?.sidebarMode || 'normal'}
              onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'sidebarMode'], v)}
            />
          </div>

          <div class="h-2"></div>

          <div class="option-row">
            <div class="setting-header">
              <Menu size={16} class="setting-icon" />
              <span>Top Navbar</span>
            </div>
            <SegmentedControl
              options={modeOptions3}
              value={platform.options?.navbarMode || 'normal'}
              onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'navbarMode'], v)}
            />
          </div>

          <div class="h-2"></div>

          <div class="option-row">
            <div class="setting-header">
              <MessageCircle size={16} class="setting-icon" />
              <span>Messages</span>
            </div>
            <SegmentedControl
              options={modeOptions3}
              value={platform.options?.chatMode || 'normal'}
              onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'chatMode'], v)}
            />
          </div>

          <div class="h-2"></div>

          <div class="option-row">
            <div class="setting-header">
              <MessageSquare size={16} class="setting-icon" />
              <span>Comments</span>
            </div>
            <SegmentedControl
              options={modeOptions3}
              value={platform.options?.commentsMode || 'normal'}
              onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'commentsMode'], v)}
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
          <Sidebar active={activeTab} onSelect={setActiveTab} statusMap={statusMap} />
        </div>

        {/* Main Content */}
        <div class="content-area">
          {/* Header */}
          <div class="header">
            <h2 class="header-title">{platformName}</h2>

            {/* Active Status Badge */}
            <div class={`status-badge ${platform.enabled ? 'active' : 'disabled'}`}>
              <div class={`status-dot ${platform.enabled ? 'active' : 'disabled'}`}></div>
              {platform.enabled ? 'Active' : 'Disabled'}
            </div>
          </div>

          {/* Scrollable Content */}
          <main class="scrollable-content">
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
          </main>
        </div>
      </div>
    </div>
  );
}