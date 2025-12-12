import { BlockerStrategy } from '../core/strategy.js';

export class RedditStrategy extends BlockerStrategy {
  constructor() {
    super('reddit.com');
    this.currentSettings = null;
  }

  init() {
  }

  onUrlChange(url) {
    // Re-apply settings when Reddit's SPA navigates between pages.
    // This ensures page context classes are updated for feed vs post pages.
    if (this.currentSettings) {
      this.onSettingsChange(this.currentSettings);
    }
  }

  onSettingsChange(settings) {
    this.currentSettings = settings;
    const body = document.body;
    const options = settings.options || {};

    // 0. CHECK MASTER SWITCH (Global Enable/Disable)
    if (settings.enabled === false) {
      // CLEAR ALL NIL CLASSES
      const classesToRemove = [
        'nil-reddit-on-feed',
        'nil-reddit-on-post',
        'nil-reddit-hide-sidebar-description',
        'nil-reddit-active'
      ];
      // Also remove dynamic feature classes
      ['feed', 'recently-viewed', 'sidebar-content', 'chat', 'comments', 'navbar'].forEach(feature => {
        classesToRemove.push(`nil-reddit-${feature}-disable`, `nil-reddit-${feature}-simplify`);
      });
      body.classList.remove(...classesToRemove);

      // RESTORE DOM MODIFICATIONS

      // 1. Comments Media: Remove placeholders and show original
      const placeholders = document.querySelectorAll('.nil-view-image-placeholder');
      placeholders.forEach(el => el.remove());
      const processedMedia = document.querySelectorAll('.nil-processed');
      processedMedia.forEach(el => {
        el.classList.remove('nil-processed', 'nil-show-media');
        // Ensure display is restored if it was hidden by class removal?? 
        // Actually removing the 'nil-reddit-comments-simplify' class takes care of the visual hiding.
        // We just need to clean up the markers.
      });

      // 2. Chat: Restore visibility
      if (this.chatObserver) {
        this.chatObserver.disconnect();
        this.chatObserver = null;
      }
      this.toggleChatNodes(false);

      return; // EXIT EARLY
    }

    // Add a global class indicating the extension is active
    body.classList.add('nil-reddit-active');

    // Determine page context
    const isPostPage = window.location.pathname.includes('/comments/');

    // Clear page context classes
    body.classList.remove('nil-reddit-on-feed', 'nil-reddit-on-post');

    // Add page context class
    if (isPostPage) {
      body.classList.add('nil-reddit-on-post');
    } else {
      body.classList.add('nil-reddit-on-feed');
    }

    // Helper to apply mode classes
    const applyMode = (feature, mode) => {
      // Remove all potential classes for this feature
      body.classList.remove(`nil-reddit-${feature}-disable`, `nil-reddit-${feature}-simplify`);

      if (mode === 'disable') {
        body.classList.add(`nil-reddit-${feature}-disable`);
      } else if (mode === 'simplify') {
        body.classList.add(`nil-reddit-${feature}-simplify`);
      }
    };

    applyMode('feed', options.feedMode);
    applyMode('recently-viewed', options.recentlyViewedMode);
    applyMode('sidebar-content', options.sidebarContentMode);

    // NEW: Sidebar Description Toggle
    if (options.hideSubredditDescription) {
      body.classList.add('nil-reddit-hide-sidebar-description');
    } else {
      body.classList.remove('nil-reddit-hide-sidebar-description');
    }

    applyMode('chat', options.chatMode);
    applyMode('comments', options.commentsMode);

    // Feed Simplification - Shadow DOM element hiding
    if (this.feedSimplifyObserver) {
      this.feedSimplifyObserver.disconnect();
      this.feedSimplifyObserver = null;
    }

    // Restore hidden elements if turning OFF feed simplify
    if (options.feedMode !== 'simplify') {
      document.querySelectorAll('.nil-feed-hidden').forEach(el => {
        el.style.display = '';
        el.classList.remove('nil-feed-hidden');
      });
      // Remove injected styles from shadow roots
      document.querySelectorAll('shreddit-post').forEach(post => {
        if (post.shadowRoot) {
          const injectedStyle = post.shadowRoot.querySelector('#nil-feed-simplify-style');
          if (injectedStyle) injectedStyle.remove();
        }
      });
    }

    if (options.feedMode === 'simplify') {
      const hideFeedElements = () => {
        // Inject style into each shreddit-post shadow root
        const posts = document.querySelectorAll('shreddit-post');
        posts.forEach(post => {
          if (post.shadowRoot && !post.shadowRoot.querySelector('#nil-feed-simplify-style')) {
            const style = document.createElement('style');
            style.id = 'nil-feed-simplify-style';
            style.textContent = `
              [data-testid="action-row"] { display: none !important; }
              shreddit-content-tags { display: none !important; }
              .content-tags { display: none !important; }
            `;
            post.shadowRoot.appendChild(style);
          }
        });

        // Also hide shreddit-content-tags at the document level (host element)
        const contentTags = document.querySelectorAll('shreddit-content-tags');
        contentTags.forEach(tag => {
          if (!tag.classList.contains('nil-feed-hidden')) {
            tag.style.display = 'none';
            tag.classList.add('nil-feed-hidden');
          }
        });

        // Hide action rows that might be in the light DOM
        const actionRows = document.querySelectorAll('[data-testid="action-row"]');
        actionRows.forEach(row => {
          if (!row.classList.contains('nil-feed-hidden')) {
            row.style.display = 'none';
            row.classList.add('nil-feed-hidden');
          }
        });
      };

      hideFeedElements();
      this.feedSimplifyObserver = new MutationObserver(() => {
        hideFeedElements();
      });
      this.feedSimplifyObserver.observe(document.body, { childList: true, subtree: true });
    }
    // Navbar option was removed in previous tasks, but logic might still check it? 
    // User asked to remove Notif badge "by default" -> likely tied to Navbar Simplify if enabled? 
    // Or just global? User said "remove the red icon... by default". 
    // If it's a "simplify" feature, I'll add the class if navbarMode is simplify.
    // Assuming navbarMode exists in options even if UI doesn't show it? 
    // Wait, task 15 said "Remove Navbar settings option". So options.navbarMode might be gone or unused.
    // I will add a rule to `nil-reddit-navbar-simplify` if that mode persists, 
    // but if the option is gone from UI, how to trigger it? 
    // The user said "by default". This implies it should be active normally? 
    // Or maybe just ALWAYS hide it when extension is active? 
    // I'll check if navbarMode IS getting passed. 
    // Ideally I'd put it in 'nil-reddit-on-feed' or just a global 'nil-reddit-enabled' rule.
    // Let's assume global active for now, but scoped to the extension being enabled.
    // Since I'm in the "enabled" block, I can add a specific class for badging if needed,
    // or just rely on CSS knowing the extension is active? 
    // There isn't a single "nil-active" class on body. 
    // I'll stick to targeted feature classes. If badge hiding is desired, maybe I should assume 
    // we want a 'nil-reddit-clean-navbar' class or similar? 
    // I'll update CSS for `.nil-reddit-on-feed, .nil-reddit-on-post` to hide badge? 
    // Or just `body[class*="nil-reddit"]`?
    // Let's just use `nil-reddit-hide-badge` and map it to `options.hideNotificationBadge` if I add it?
    // User said "by default". I'll default it to true if absent? 
    // For now, I'll put it in CSS under `body` if Nil is active? 
    // I'll add a class `nil-reddit-active` to body at top of enabled block.


    // Media Handling for Comments Simplify
    if (this.mediaObserver) {
      this.mediaObserver.disconnect();
      this.mediaObserver = null;
    }

    // Clean up previous placeholders if we're turning OFF simplify
    if (options.commentsMode !== 'simplify') {
      const placeholders = document.querySelectorAll('.nil-view-image-placeholder');
      placeholders.forEach(el => el.remove());
      const processedMedia = document.querySelectorAll('.nil-processed');
      processedMedia.forEach(el => el.classList.remove('nil-processed', 'nil-show-media'));
    }

    if (options.commentsMode === 'simplify') {
      const processMedia = () => {
        const mediaEls = document.querySelectorAll('shreddit-comment figure.rte-media:not(.nil-processed)');
        mediaEls.forEach(el => {
          el.classList.add('nil-processed');

          const placeholder = document.createElement('a');
          placeholder.className = 'nil-view-image-placeholder';
          placeholder.textContent = '<View Image>';

          placeholder.addEventListener('click', (e) => {
            e.preventDefault();
            el.classList.add('nil-show-media');
            placeholder.style.display = 'none';
          });

          // Insert before the media element
          el.parentNode.insertBefore(placeholder, el);
        });
      };

      processMedia();
      this.mediaObserver = new MutationObserver((mutations) => {
        processMedia();
      });
      this.mediaObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Active Enforcement for Chat Disable (Shadow DOM / Dynamic Content)
    if (this.chatObserver) {
      this.chatObserver.disconnect();
      this.chatObserver = null;
    }

    if (options.chatMode === 'disable') {
      // Hide immediately
      this.toggleChatNodes(true);

      // Run on mutation to catch lazy-loaded chat
      this.chatObserver = new MutationObserver((mutations) => {
        this.toggleChatNodes(true);
      });

      this.chatObserver.observe(document.body, { childList: true, subtree: true });
    } else {
      // Explicitly show elements if not disabled (Restores icon/window)
      this.toggleChatNodes(false);
    }
  }

  toggleChatNodes(shouldHide) {
    const targetSelectors = [
      '#header-action-item-chat-button',
      'reddit-chat-header-button',
      '[data-testid="chat-button"]',
      '#resizable', // Chat window
      'rs-app',     // Chat app root
      '[data-testid="reddit-chat-client"]', // Top level chat container
      'faceplate-alert-reporter' // Wrapper often used for chat
    ];

    // Function to check an individual root (document or shadowRoot)
    const checkRoot = (root) => {
      targetSelectors.forEach(sel => {
        const els = root.querySelectorAll(sel);
        els.forEach(el => {
          if (shouldHide) {
            if (el.style.display !== 'none') el.style.display = 'none';
          } else {
            // Restore visibility if it was hidden
            if (el.style.display === 'none') el.style.display = '';
          }
        });
      });

      // Recursively check all children for shadowRoots
      const allNodes = root.querySelectorAll('*');
      allNodes.forEach(node => {
        if (node.shadowRoot) {
          checkRoot(node.shadowRoot);
        }
      });
    };

    checkRoot(document);
  }
}

