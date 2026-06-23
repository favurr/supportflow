import React from 'react';
import { useState } from 'react';

// Types
import { WidgetState } from '../types';

// CSS for the launcher (injected once)
const launcherCss = `
  .relay-launcher {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 60px;
    height: 60px;
    background-color: #006bff;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.2s ease;
  }
  .relay-launcher:hover {
    background-color: #0052cc;
    transform: scale(1.05);
  }
  .relay-launcher:active {
    transform: scale(0.95);
  }
  .relay-launcher.minimized {
    /* When widget is minimized, we show the launcher */
    display: flex;
  }
  .relay-launcher.hidden {
    /* When widget is maximized, we hide the launcher */
    display: none;
  }
  .relay-launcher-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background-color: #ff0000;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
    min-width: 18px;
    text-align: center;
    line-height: 18px;
    box-shadow: 0 0 0 2px white;
    font-weight: bold;
  }
  /* Light theme */
  .theme-light .relay-launcher {
    background-color: #006bff;
    color: white;
  }
  .theme-light .relay-launcher:hover {
    background-color: #0052cc;
  }
  /* Dark theme */
  .theme-dark .relay-launcher {
    background-color: #006bff;
    color: white;
  }
  .theme-dark .relay-launcher:hover {
    background-color: #0052cc;
  }
`;

let cssInjected = false;

const injectCss = () => {
  if (cssInjected) return;
  const style = document.createElement('style');
  style.textContent = launcherCss;
  document.head.appendChild(style);
  cssInjected = true;
};

interface LauncherProps {
  state: WidgetState;
  onOpen: () => void;
}

export const Launcher: React.FC<LauncherProps> = ({ state, onOpen }) => {
  // Inject CSS on mount
  React.useEffect(() => {
    injectCss();
  }, []);

  return (
    <div
      className={`relay-launcher theme-${state.theme} ${state.isVisible && !state.isMinimized ? 'hidden' : 'minimized'}`}
      onClick={onOpen}
      title="Live Chat"
    >
      {/* Chat icon */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7l10 5 10-5-10-5zm2 14l-2-4h-3l-2 4H7l2-4H4l2 4h6zm4-6h-4V7h4v4z" fill="currentColor"/>
      </svg>
      {/* Unread badge */}
      {state.unreadCount > 0 && (
        <span className="relay-launcher-badge">{state.unreadCount > 99 ? '99+' : state.unreadCount}</span>
      )}
    </div>
  );
};