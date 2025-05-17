// Telegram Web App API wrapper
// See documentation: https://core.telegram.org/bots/webapps

// Define the WebApp interface based on Telegram's WebApp API
interface TelegramWebApp {
  ready(): void;
  expand(): void;
  close(): void;
  isExpanded: boolean;
  initData: string;
  initDataUnsafe: any;
  colorScheme: 'light' | 'dark';
  themeParams: any;
  onEvent(eventType: string, eventHandler: () => void): void;
  offEvent(eventType: string, eventHandler: () => void): void;
  sendData(data: any): void;
  openLink(url: string): void;
  showAlert(message: string, callback?: () => void): void;
  showConfirm(message: string, callback: (confirmed: boolean) => void): void;
  showPopup(params: { title?: string, message: string, buttons?: Array<{ id?: string, type?: string, text?: string }> }, callback?: (buttonId: string) => void): void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive: boolean): void;
    hideProgress(): void;
  };
}

// Declare global WebApp property
declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

// Access Telegram Web App
export const tg = window.Telegram?.WebApp;

// Initialize Telegram Web App
export function initTelegramApp() {
  if (!tg) {
    console.warn('Telegram WebApp not available. Running in browser mode.');
    return;
  }

  // Initialize Telegram Web App
  try {
    // Set proper viewport for Telegram Web App
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    // Expand the Web App to full screen
    tg.expand();
    
    // Notify Telegram that the Web App is ready
    tg.ready();
    
    // Apply dark theme if Telegram is in dark mode
    if (tg.colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // Set up event handlers
    tg.onEvent('backButtonClicked', () => {
      tg.close();
    });

    tg.onEvent('close', () => {
      tg.close();
    });

    console.log('Telegram WebApp initialized');
  } catch (error) {
    console.error('Error initializing Telegram WebApp:', error);
  }
}

// Show a native Telegram alert
export function showAlert(message: string, callback?: () => void) {
  if (tg) {
    tg.showAlert(message, callback);
  } else {
    alert(message);
    if (callback) callback();
  }
}

// Show a native Telegram confirmation dialog
export function showConfirm(message: string, callback: (confirmed: boolean) => void) {
  if (tg) {
    tg.showConfirm(message, callback);
  } else {
    const result = window.confirm(message);
    callback(result);
  }
}

// Show a native Telegram popup
export function showPopup(params: { title?: string, message: string, buttons?: Array<{ id?: string, type?: string, text?: string }> }, callback?: (buttonId: string) => void) {
  if (tg) {
    tg.showPopup(params, callback);
  } else {
    alert(params.title ? `${params.title}\n${params.message}` : params.message);
    if (callback) callback('ok');
  }
}

// Get user information from Telegram
export function getUserInfo() {
  if (tg?.initDataUnsafe?.user) {
    return tg.initDataUnsafe.user;
  }
  return null;
}

// Copy text to clipboard and show confirmation
export function copyToClipboard(text: string, successMessage: string = 'Copied to clipboard!') {
  navigator.clipboard.writeText(text).then(() => {
    showPopup({
      title: 'Success',
      message: successMessage,
      buttons: [{type: 'ok'}]
    });
  }).catch(err => {
    console.error('Could not copy text: ', err);
    showAlert('Failed to copy to clipboard');
  });
}

// No-op haptic feedback function
export function hapticFeedback(type: 'impact' | 'notification' | 'selection', style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'error' | 'success' | 'warning') {
  // Haptic feedback is not essential for Telegram Mini App
  // This function is kept as a no-op to maintain compatibility with existing code
}
