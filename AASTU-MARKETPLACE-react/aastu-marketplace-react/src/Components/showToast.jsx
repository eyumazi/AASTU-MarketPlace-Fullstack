import React from "react";  
const defaultOptions = {
    message: '',
    type: 'success', // 'success', 'error', 'warning', 'info'
    position: 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
    duration: 3000, // in ms
    showIcon: true,
  };
  
  const icons = {
    success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>`,
    error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12" y2="16"></line>
    </svg>`,
    warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12" y2="17"></line>
    </svg>`,
    info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12" y2="8"></line>
    </svg>`,
  };
  
  const positions = {
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
  };
  
  const addStyles = () => {
    if (document.getElementById('toast-styles')) return;
  
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      .toast-notification {
        position: fixed;
        padding: 15px 25px;
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.5s forwards;
      }
  
      .toast-success { background-color: #4CAF50; }
      .toast-error { background-color: #F44336; }
      .toast-warning { background-color: #FF9800; }
      .toast-info { background-color: #2196F3; }
  
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
  
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
  
    document.head.appendChild(style);
  };
  
  const showToast = (options = {}) => {
    const config = { ...defaultOptions, ...options };
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${config.type}`;
    
    // Set position
    Object.assign(toast.style, positions[config.position]);
    
    // Add content
    if (config.showIcon) {
      const icon = icons[config.type] || icons.success;
      toast.innerHTML = `${icon}<span>${config.message}</span>`;
    } else {
      toast.textContent = config.message;
    }
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Add styles if not already present
    addStyles();
    
    // Auto-remove after duration
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.5s forwards';
      setTimeout(() => toast.remove(), 500);
    }, config.duration);
    
    return toast;
  };
  
  export default showToast;