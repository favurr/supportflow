// Types for the Relay Widget SDK

export interface LiveChatConfig {
  /** The project's public widget key */
  widgetKey: string;
  /** Optional: Visitor identification */
  visitorId?: string;
  visitorName?: string;
  visitorEmail?: string;
  /** Optional: Theme override */
  theme?: 'light' | 'dark' | 'auto';
  /** Optional: Widget position */
  position?: 'bottom-left' | 'bottom-right';
  /** Optional: Enable/disable sound notifications */
  soundEnabled?: boolean;
  /** Optional: Custom welcome message */
  welcomeMessage?: string;
  /** Optional: Callback when a new message is received */
  onMessageReceived?: (message: Message) => void;
  /** Optional: Callback when the widget is opened/closed */
  onVisibilityChange?: (isVisible: boolean) => void;
}

export interface WidgetState {
  /** Whether the widget is currently visible */
  isVisible: boolean;
  /** Whether the widget is minimized */
  isMinimized: boolean;
  /** Current conversation ID */
  conversationId: string | null;
  /** Unread message count */
  unreadCount: number;
  /** Connection status */
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  /** Whether the other party is typing */
  isTyping: boolean;
  /** Current theme: 'light' or 'dark' (resolved from config) */
  theme: 'light' | 'dark';
  /** Current visitor info */
  visitor: Visitor | null;
  /** List of messages in the current conversation */
  messages: Message[];
}

export interface Visitor {
  id: string;
  name: string;
  email: string | null;
  /** Additional visitor data */
  [key: string]: any;
}

export interface Message {
  id: string;
  content: string;
  author: 'visitor' | 'ai' | 'human';
  createdAt: string; // ISO timestamp
  /** Optional: Attachments */
  attachments?: Attachment[];
}

export interface Attachment {
  url: string;
  name: string;
  type: string;
}

// Realtime event types
export interface RealtimeEvent {
  type: 'message' | 'typing' | 'connection_status' | 'visitor_update';
  payload: any;
}