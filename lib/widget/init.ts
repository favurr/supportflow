import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  LiveChatConfig,
  WidgetState,
  Visitor
} from './types';
import { Launcher } from './ui/Launcher';
import { Container } from './ui/Container';
import { RealtimeConnection } from './core/ws';

// Default configuration
const DEFAULT_CONFIG: LiveChatConfig = {
  theme: 'auto',
  position: 'bottom-right',
  soundEnabled: true,
};

/**
 * LiveChat singleton object
 */
export const LiveChat = {
  /** Internal state */
  _state: {} as WidgetState,
  /** Configuration */
  _config: {} as LiveChatConfig,
  /** Whether the widget has been initialized */
  _initialized: false,
  /** Realtime connection instance */
  _realtime: null as RealtimeConnection | null,
  /** React root for the UI portal */
  _reactRoot: null as ReactDOM.Root | null,
  /** Container div for the portal */
  _containerDiv: null as HTMLDivElement | null,

  /**
   * Initialize the widget with configuration
   * @param config - LiveChat configuration
   */
  init(config: LiveChatConfig) {
    // Validate required config
    if (!config.widgetKey) {
      throw new Error('widgetKey is required to initialize LiveChat');
    }

    // Merge with defaults
    this._config = { ...DEFAULT_CONFIG, ...config };

    // Resolve theme: if auto, check system preference
    const resolveTheme = (theme: 'light' | 'dark' | 'auto'): 'light' | 'dark' => {
      if (theme !== 'auto') return theme;
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light'; // fallback
    };
    const resolvedTheme = resolveTheme(this._config.theme);

    // Initialize state with defaults
    this._state = {
      isVisible: false,
      isMinimized: true,
      conversationId: null,
      unreadCount: 0,
      connectionStatus: 'disconnected',
      isTyping: false,
      theme: resolvedTheme,
      visitor: null,
      messages: [],
    };

    // Set up visitor info if provided
    if (config.visitorId || config.visitorName || config.visitorEmail) {
      this._state.visitor = {
        id: config.visitorId || `visitor_${Math.random().toString(36).substr(2, 9)}`,
        name: config.visitorName || 'Anonymous',
        email: config.visitorEmail || null,
      };
    } else {
      // Generate anonymous visitor
      this._state.visitor = {
        id: `visitor_${Math.random().toString(36).substr(2, 9)}`,
        name: 'Anonymous',
        email: null,
      };
    }

    // Load persisted state from localStorage
    this._loadPersistedState();

    this._initialized = true;

    // Set up Realtime connection
    this._realtime = new RealtimeConnection(this._config.widgetKey, this._state.visitor.id);
    this._realtime.onMessage((message) => {
      this._addMessage(message);
    });
    this._realtime.onTyping((isTyping: boolean) => {
      this._setTyping(isTyping);
    });
    this._realtime.onConnectionChange((status) => {
      this._setConnectionStatus(status);
    });

    // Connect to realtime
    this._realtime.connect();

    // Create container div for the portal
    this._containerDiv = document.createElement('div');
    this._containerDiv.id = 'relay-widget-root';
    document.body.appendChild(this._containerDiv);

    // Create React root
    this._reactRoot = ReactDOM.createRoot(this._containerDiv);

    // Render the UI
    this._renderUI();

    console.info('LiveChat initialized with config:', this._config);
    return this;
  },

  /**
   * Load persisted state from localStorage
   */
  _loadPersistedState() {
    if (typeof window === 'undefined' || !localStorage) return;

    try {
      const key = `relay_widget_state_${this._config.widgetKey}`;
      const persisted = localStorage.getItem(key);
      if (persisted) {
        const parsed = JSON.parse(persisted);
        // Only persist UI state: isMinimized and unreadCount
        if (typeof parsed.isMinimized === 'boolean') {
          this._state.isMinimized = parsed.isMinimized;
        }
        if (typeof parsed.unreadCount === 'number') {
          this._state.unreadCount = parsed.unreadCount;
        }
        // If persisted state says minimized, we might want to start minimized but not visible?
        // Actually, we start with isVisible: false and isMinimized: true (from above).
        // If persisted isMinimized is false, we might want to open the widget?
        // But we don't want to automatically open on page load - that would be annoying.
        // So we only use persisted isMinimized to set the initial minimized state.
        // The widget will remain closed (isVisible: false) until the user opens it.
        // However, if the user had minimized the widget and then reloaded, we want it to stay minimized.
        // That is already handled by setting isMinimized.
        // We do not change isVisible based on persisted state.
      }
    } catch (e) {
      console.warn('Failed to load persisted widget state:', e);
    }
  },

  /**
   * Save persisted state to localStorage
   */
  _savePersistedState() {
    if (typeof window === 'undefined' || !localStorage) return;

    try {
      const key = `relay_widget_state_${this._config.widgetKey}`;
      const stateToPersist = {
        isMinimized: this._state.isMinimized,
        unreadCount: this._state.unreadCount,
      };
      localStorage.setItem(key, JSON.stringify(stateToPersist));
    } catch (e) {
      console.warn('Failed to persist widget state:', e);
    }
  },

  /**
   * Add a message to the state
   */
  _addMessage(message: any) {
    this._state.messages.push(message);
    // If the message is from visitor and we are not visible, increment unread count
    if (message.author === 'visitor' && !this._state.isVisible) {
      this._state.unreadCount += 1;
      this._savePersistedState(); // Save unread count change
    }
    // TODO: Update UI via re-render
    this._renderUI();
  },

  /**
   * Set typing status
   */
  _setTyping(isTyping: boolean) {
    this._state.isTyping = isTyping;
    this._renderUI();
  },

  /**
   * Set connection status
   */
  _setConnectionStatus(status: 'connected' | 'disconnected' | 'connecting') {
    this._state.connectionStatus = status;
    this._renderUI();
  },

  /**
   * Render the UI components (Launcher and Container) into the portal
   */
  _renderUI() {
    if (!this._reactRoot || !this._initialized) return;

    const element = (
      <React.Fragment>
        <Launcher
          state={this._state}
          onOpen={() => this.open()}
        />
        <Container
          state={this._state}
          onClose={() => this.close()}
          onSendMessage={(content) => this._sendMessage(content)}
          onTypingStart={() => this._startTyping()}
          onTypingStop={() => this._stopTyping()}
        />
      </React.Fragment>
    );

    this._reactRoot.render(element);
  },

  /**
   * Open the widget
   */
  open() {
    if (!this._initialized) {
      console.warn('LiveChat not initialized. Call init() first.');
      return;
    }
    this._state.isVisible = true;
    this._state.isMinimized = false;
    // Reset unread count when opening
    if (this._state.unreadCount > 0) {
      this._state.unreadCount = 0;
      this._savePersistedState(); // Save unread count reset
    }
    this._renderUI();
  },

  /**
   * Close the widget
   */
  close() {
    if (!this._initialized) {
      console.warn('LiveChat not initialized. Call init() first.');
      return;
    }
    this._state.isVisible = false;
    // When closing, we minimize (so the launcher shows)
    this._state.isMinimized = true;
    this._savePersistedState(); // Save minimized state
    this._renderUI();
  },

  /**
   * Toggle widget visibility
   */
  toggle() {
    if (!this._initialized) {
      console.warn('LiveChat not initialized. Call init() first.');
      return;
    }
    this._state.isVisible ? this.close() : this.open();
  },

  /**
   * Identify the visitor
   * @param visitorInfo - Visitor identification details
   */
  identify(visitorInfo: Partial<Visitor>) {
    if (!this._initialized) {
      console.warn('LiveChat not initialized. Call init() first.');
      return;
    }
    if (visitorInfo.id) {
      this._state.visitor.id = visitorInfo.id;
    }
    if (visitorInfo.name !== undefined) {
      this._state.visitor.name = visitorInfo.name;
    }
    if (visitorInfo.email !== undefined) {
      this._state.visitor.email = visitorInfo.email;
    }
    // Update the realtime connection with new visitor ID if needed
    if (visitorInfo.id && this._realtime) {
      // We would need to reconnect with the new visitor ID
      // For simplicity, we'll just update the state and note that the visitor ID changed
      console.warn('Visitor ID changed. Reconnection may be required for realtime updates.');
    }
    console.info('Visitor identified:', this._state.visitor);
  },

  /**
   * Track a custom event
   * @param eventName - Name of the event
   * @param payload - Optional payload
   */
  track(eventName: string, payload?: Record<string, any>) {
    if (!this._initialized) {
      console.warn('LiveChat not initialized. Call init() first.');
      return;
    }
    // TODO: Send event to analytics (could be via realtime or InsForge)
    console.info(`Event tracked: ${eventName}`, payload);
  },

  /**
   * Start typing indicator
   */
  _startTyping() {
    if (!this._initialized || !this._realtime) return;
    this._setTyping(true);
    this._realtime.startTyping();
    // Stop typing after 3 seconds of inactivity
    clearTimeout(this._typingTimeout);
    this._typingTimeout = window.setTimeout(() => {
      this._stopTyping();
    }, 3000);
  },

  /**
   * Stop typing indicator
   */
  _stopTyping() {
    if (!this._initialized || !this._realtime) return;
    this._setTyping(false);
    this._realtime.stopTyping();
    clearTimeout(this._typingTimeout);
  },

  /** Typing timeout ID */
  _typingTimeout: number | null = null,

  /**
   * Send a message from the visitor
   * @param content - Message content
   */
  _sendMessage(content: string) {
    if (!this._initialized || !this._realtime) {
      console.warn('LiveChat not initialized or realtime not connected.');
      return;
    }
    // Add the message to our state optimistically
    const message: any = {
      id: `msg_${Date.now()}`, // Temporary ID
      content,
      author: 'visitor',
      createdAt: new Date().toISOString(),
    };
    this._addMessage(message);

    // Send via realtime
    this._realtime.sendMessage(content);
    // Stop typing when sending a message
    this._stopTyping();
  },

  /**
   * Shut down the widget and clean up resources
   */
  shutdown() {
    if (!this._initialized) {
      return;
    }
    // Save final state before shutting down
    this._savePersistedState();
    // Clear typing timeout
    if (this._typingTimeout) {
      clearTimeout(this._typingTimeout);
      this._typingTimeout = null;
    }
    // Close realtime connection
    if (this._realtime) {
      this._realtime.disconnect();
    }
    // Remove the container div
    if (this._containerDiv) {
      document.body.removeChild(this._containerDiv);
      this._containerDiv = null;
    }
    // Unmount React root
    if (this._reactRoot) {
      this._reactRoot.unmount();
      this._reactRoot = null;
    }
    this._initialized = false;
    console.info('LiveChat shut down');
  },

  /** Get current state (read-only) */
  getState(): Readonly<WidgetState> {
    return { ...this._state };
  },
};