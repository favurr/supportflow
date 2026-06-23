// WebSocket service for Relay Widget to connect to InsForge Realtime

import { WidgetState, Message } from '../types';

// InsForge Realtime endpoint (we assume it's provided via environment or config)
// In a real setup, we would get this from InsForge project settings
const REALTIME_URL = process.env.NEXT_PUBLIC_INSFORGE_REALTIME_URL || 'wss://insforge-instance.com/realtime';

/**
 * WebSocket connection manager
 */
export class RealtimeConnection {
  private ws: WebSocket | null = null;
  private readonly widgetKey: string;
  private readonly visitorId: string;
  private onMessageCallback: ((message: Message) => void) | null = null;
  private onTypingCallback: ((isTyping: boolean) => void) | null = null;
  private onConnectionChangeCallback: ((status: 'connected' | 'disconnected' | 'connecting') => void) | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectTimeout: number | null = null;

  constructor(widgetKey: string, visitorId: string) {
    this.widgetKey = widgetKey;
    this.visitorId = visitorId;
  }

  /**
   * Connect to the InsForge Realtime server
   */
  connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    this.setConnectionStatus('connecting');

    // Construct the URL with widget key and visitor ID as query params
    const url = `${REALTIME_URL}?widget_key=${this.widgetKey}&visitor_id=${this.visitorId}`;

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.info('Realtime connection opened');
      this.reconnectAttempts = 0;
      this.setConnectionStatus('connected');
      // Subscribe to the conversation channel (we don't have conversation ID yet)
      // We'll subscribe after we get a conversation ID from the dashboard via another channel?
      // For now, we'll subscribe to a general widget channel for broadcast events.
      this.subscribeToWidgetChannel();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (e) {
        console.error('Failed to parse realtime message:', e);
      }
    };

    this.ws.onclose = () => {
      console.warn('Realtime connection closed');
      this.setConnectionStatus('disconnected');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('Realtime connection error:', error);
      this.setConnectionStatus('disconnected');
      this.attemptReconnect();
    };
  }

  /**
   * Disconnect from the server
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Set a callback for incoming messages
   */
  onMessage(callback: (message: Message) => void) {
    this.onMessageCallback = callback;
  }

  /**
   * Set a callback for typing events
   */
  onTyping(callback: (isTyping: boolean) => void) {
    this.onTypingCallback = callback;
  }

  /**
   * Set a callback for connection status changes
   */
  onConnectionChange(callback: (status: 'connected' | 'disconnected' | 'connecting') => void) {
    this.onConnectionChangeCallback = callback;
  }

  /**
   * Send a message to the server
   */
  sendMessage(content: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('Cannot send message: WebSocket not connected');
      return;
    }

    const message = {
      type: 'message',
      payload: {
        content,
        visitor_id: this.visitorId,
        timestamp: new Date().toISOString(),
      },
    };

    this.ws.send(JSON.stringify(message));
  }

  /**
   * Start typing indicator
   */
  startTyping() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const typingMsg = {
      type: 'typing',
      payload: {
        visitor_id: this.visitorId,
        isTyping: true,
        timestamp: new Date().toISOString(),
      },
    };

    this.ws.send(JSON.stringify(typingMsg));
  }

  /**
   * Stop typing indicator
   */
  stopTyping() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const typingMsg = {
      type: 'typing',
      payload: {
        visitor_id: this.visitorId,
        isTyping: false,
        timestamp: new Date().toISOString(),
      },
    };

    this.ws.send(JSON.stringify(typingMsg));
  }

  /**
   * Subscribe to the widget's realtime channel for events
   */
  private subscribeToWidgetChannel() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const subscribeMsg = {
      type: 'subscribe',
      payload: {
        channel: `widget:${this.widgetKey}`,
      },
    };

    this.ws.send(JSON.stringify(subscribeMsg));
  }

  /**
   * Handle incoming messages from the server
   */
  private handleMessage(data: any) {
    switch (data.type) {
      case 'message':
        if (this.onMessageCallback) {
          const message: Message = {
            id: data.payload.id,
            content: data.payload.content,
            author: data.payload.author as 'visitor' | 'ai' | 'human',
            createdAt: data.payload.timestamp,
          };
          this.onMessageCallback(message);
        }
        break;
      case 'typing':
        if (this.onTypingCallback) {
          const isTyping = data.payload.isTyping === true;
          this.onTypingCallback(isTyping);
        }
        break;
      case 'connection_status':
        // Handle status updates from server
        break;
      default:
        console.debug('Unhandled realtime message type:', data.type);
    }
  }

  /**
   * Set connection status and notify callback
   */
  private setConnectionStatus(status: 'connected' | 'disconnected' | 'connecting') {
    if (this.onConnectionChangeCallback) {
      this.onConnectionChangeCallback(status);
    }
  }

  /**
   * Attempt to reconnect after a delay
   */
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached. Giving up.');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000); // Exponential backoff, max 30s

    console.info(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts})`);

    clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = window.setTimeout(() => {
      this.connect();
    }, delay);
  }
}