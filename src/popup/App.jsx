import { useState, useEffect } from 'preact/hooks';
import { Sidebar } from './components/Sidebar';
import { Toggle } from './components/Toggle';
import { Card } from './components/Card';

const DEFAULT_SETTINGS = {
  enabled: true,
  platforms: {
    'youtube.com': {
      enabled: true,
      options: {
        minimalHomepage: true,
        minimalSearchResults: true,
        thumbnailMode: 'small', // small, hidden, normal
        audioOnly: false,
        comments: true,
        hideLiveChat: true
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
        blockFeed: true,
        blockComments: false
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
        setSettings(data.settings || DEFAULT_SETTINGS);
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

  const renderOptions = () => {
    if (!platform.enabled) return null;

    if (activeTab === 'youtube.com') {
      return (
        <>
          <Card title="Content Feed" className="mb-6">
            <Toggle label="Hide video recommendations" checked={platform.options?.minimalHomepage} onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'minimalHomepage'], v)} />
            <div class="h-2"></div>
            <Toggle label="Hide comments section" checked={!platform.options?.comments} onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'comments'], !v)} />
            <div class="h-2"></div>
            <Toggle label="Hide Live Chat" checked={platform.options?.hideLiveChat} onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'hideLiveChat'], v)} />
          </Card>

          <Card title="Interface">
            <Toggle label="Grid Search Results" checked={platform.options?.minimalSearchResults} onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'minimalSearchResults'], v)} />
            <div class="h-2"></div>
            <Toggle label="Audio Only Mode" checked={platform.options?.audioOnly} onChange={(v) => updateSetting(['platforms', activeTab, 'options', 'audioOnly'], v)} />
          </Card>
        </>
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
          <Sidebar active={activeTab} onSelect={setActiveTab} />
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
            <div class="main-toggle-card">
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