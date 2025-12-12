import { Youtube, Facebook, Instagram, Settings } from 'lucide-preact';
import Logo from '../assets/nil_dark.png';
import RedditIconSvg from '../assets/reddit_icon.svg';

// Custom Reddit Icon Component
// Custom Reddit Icon Component
const RedditIcon = ({ size = 24, className, ...props }) => (
  <div
    className={className}
    style={{
      width: size,
      height: size,
      backgroundColor: 'currentColor',
      maskImage: `url(${RedditIconSvg})`,
      WebkitMaskImage: `url(${RedditIconSvg})`,
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
      display: 'inline-block'
    }}
    {...props}
  />
);

export function Sidebar({ active, onSelect, statusMap = {} }) {
  const items = [
    { id: 'youtube.com', icon: Youtube, label: 'YouTube' },
    { id: 'facebook.com', icon: Facebook, label: 'Facebook' },
    { id: 'instagram.com', icon: Instagram, label: 'Instagram' },
    { id: 'reddit.com', icon: RedditIcon, label: 'Reddit' },
  ];

  return (
    <div class="sidebar">
      {/* Header / Logo */}
      <div class="logo-area">
        <img src={Logo} alt="Nil Logo" class="logo-img" />
      </div>

      {/* Navigation */}
      <div class="nav-list">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            class={`nav-item ${active === item.id ? 'active' : ''}`}
          >
            <item.icon size={18} strokeWidth={2} class="nav-icon" />
            <span>{item.label}</span>
            <div class={`nav-indicator ${statusMap[item.id] ? 'active' : ''}`}></div>
          </button>
        ))}
      </div>

      {/* Footer Settings */}
      <div class="sidebar-footer">
        <button class="settings-btn">
          <Settings size={18} strokeWidth={2} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}