import React, { useEffect, useRef, useState } from 'react';
import { useState as useHookState } from 'react';

// Types
import { WidgetState, Message } from '../types';

// CSS for the container
const containerCss = `
  .relay-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 320px;
    height: 500px;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    /* Animation for showing/hiding */
    opacity: 0;
    visibility: hidden;
    transform: scale(0.95) translateY(20px);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .relay-container.visible {
    opacity: 1;
    visibility: visible;
    transform: scale(1) translateY(0);
  }
  .relay-container-header {
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }
  .relay-container-title {
    font-weight: 600;
    font-size: 14px;
    color: #333;
  }
  .relay-container-typing {
    font-size: 12px;
    color: #666;
    font-style: italic;
    margin-left: 8px;
  }
  .relay-container-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    color: #999;
  }
  .relay-container-close:hover {
    color: #666;
  }
  .relay-container-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .relay-message {
    max-width: 80%;
    word-wrap: break-word;
  }
  .relay-message.visitor {
    align-self: flex-end;
    background-color: #006bff;
    color: white;
    padding: 8px 12px;
    border-radius: 18px 18px 4px 18px;
  }
  .relay-message.ai, .relay-message.human {
    align-self: flex-start;
    background-color: #f0f0f0;
    color: #333;
    padding: 8px 12px;
    border-radius: 18px 18px 18px 4px;
  }
  .relay-message-text {
    margin: 0;
  }
  .relay-container-input {
    display: flex;
    padding: 12px;
    border-top: 1px solid #eee;
    gap: 8px;
  }
  .relay-container-input textarea {
    flex: 1;
    min-height: 44px;
    max-height: 120px;
    resize: vertical;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 16px;
    font-family: inherit;
    font-size: 14px;
  }
  .relay-container-input button {
    background-color: #006bff;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
  }
  .relay-container-input button:hover {
    background-color: #0052cc;
  }
  .relay-container-input button:active {
    transform: scale(0.95);
  }
  /* Light theme */
  .theme-light .relay-container {
    background-color: white;
  }
  .theme-light .relay-container-header {
    border-bottom-color: #eee;
  }
  .theme-light .relay-container-title {
    color: #333;
  }
  .theme-light .relay-container-typing {
    color: #666;
  }
  .theme-light .relay-container-close {
    color: #999;
  }
  .theme-light .relay-container-close:hover {
    color: #666;
  }
  .theme-light .relay-message.visitor {
    background-color: #006bff;
    color: white;
  }
  .theme-light .relay-message.ai, .theme-light .relay-message.human {
    background-color: #f0f0f0;
    color: #333;
  }
  /* Dark theme */
  .theme-dark .relay-container {
    background-color: #1a1a1a;
  }
  .theme-dark .relay-container-header {
    border-bottom-color: #333;
  }
  .theme-dark .relay-container-title {
    color: #f0f0f0;
  }
  .theme-dark .relay-container-typing {
    color: #888;
  }
  .theme-dark .relay-container-close {
    color: #666;
  }
  .theme-dark .relay-container-close:hover {
    color: #999;
  }
  .theme-dark .relay-message.visitor {
    background-color: #006bff;
    color: white;
  }
  .theme-dark .relay-message.ai, .theme-dark .relay-message.human {
    background-color: #2d2d2d;
    color: #f0f0f0;
  }
`;

let containerCssInjected = false;

const injectContainerCss = () => {
  if (containerCssInjected) return;
  const style = document.createElement('style');
  style.textContent = containerCss;
  document.head.appendChild(style);
  containerCssInjected = true;
};

interface ContainerProps {
  state: WidgetState;
  onClose: () => void;
  onSendMessage: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
}

export const Container: React.FC<ContainerProps> = ({ state, onClose, onSendMessage, onTypingStart, onTypingStop }) => {
  // Inject CSS on mount
  useEffect(() => {
    injectContainerCss();
  }, []);

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  const handleSend = () => {
    if (inputValue.trim() !== '') {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Notify typing start when user types
    onTypingStart();
  };

  const handleBlur = () => {
    // Notify typing stop when user leaves textarea
    onTypingStop();
  };

  // Determine if container should be visible (for animation)
  const isContainerVisible = state.isVisible && !state.isMinimized;

  return (
    <div
      className={`relay-container theme-${state.theme} ${isContainerVisible ? 'visible' : ''}`}
    >
      <div className="relay-container-header">
        <div className="relay-container-title">Support</div>
        {state.isTyping && <span className="relay-container-typing">The other party is typing...</span>}
        <button className="relay-container-close" onClick={onClose} aria-label="Close chat">
          ×
        </button>
      </div>
      <div className="relay-container-messages" ref={messagesEndRef}>
        {state.messages.map((msg) => (
          <div key={msg.id} className={`relay-message ${msg.author}`}>
            <p className="relay-message-text">{msg.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
      </div>
      <div className="relay-container-input">
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} aria-label="Send message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4v16.172l8.461-4.835L4 4zM16.538 8.016L23 12l-6.462 3.984V8.016z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );
};