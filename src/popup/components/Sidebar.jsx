import { Youtube, Facebook, Instagram, MessageCircle, Settings } from 'lucide-preact';
import Logo from '../assets/logo.svg';

export function Sidebar({ active, onSelect }) {
  const items = [
    { id: 'youtube.com', icon: Youtube, label: 'YouTube' },
    { id: 'facebook.com', icon: Facebook, label: 'Facebook' },
    { id: 'instagram.com', icon: Instagram, label: 'Instagram' },
    { id: 'reddit.com', icon: MessageCircle, label: 'Reddit' },
  ];

  return (
    <div class="sidebar">
      {/* Header / Logo */}
      <div class="logo-area">
        <img src={Logo} alt="Nil Logo" class="logo-img" />
        <span class="logo-text">NIL</span>
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