import { debug, warning } from './loggerService';

// Store for pending messages awaiting confirmation
const pendingMessages = {};

// Configuration
const CONFIRMATION_TIMEOUT = 500; // 0.5 seconds in milliseconds

// Interval ID for the checker
let checkerInterval = null;

/**
 * Track a message that was sent to the server
 * @param {object} messageData - The message that was sent
 */
export const trackMessage = (messageData) => {
  const id = messageData.id;
  if (!id) {
    debug('Cannot track message without ID');
    return;
  }
  
  pendingMessages[id] = {
    timestamp: Date.now(),
    data: messageData
  };
  
  // Start the checker if it's not already running
  ensureCheckerRunning();
};

/**
 * Confirm a message was received by the server
 * @param {string|number} messageId - The ID of the message to confirm
 * @returns {boolean} - Whether the message was found and confirmed
 */
export const confirmMessage = (messageId) => {
  if (messageId in pendingMessages) {
    const elapsed = (Date.now() - pendingMessages[messageId].timestamp) / 1000;
    debug(`Message ${messageId} confirmed after ${elapsed.toFixed(3)}s`);
    delete pendingMessages[messageId];
    return true;
  }
  return false;
};

/**
 * Check for expired messages and issue warnings
 */
const checkExpiredMessages = () => {
  const now = Date.now();
  const expiredIds = [];
  
  // Find expired messages
  Object.entries(pendingMessages).forEach(([id, info]) => {
    const elapsed = now - info.timestamp;
    if (elapsed > CONFIRMATION_TIMEOUT) {
      warning(`Message ${id} not confirmed after ${(elapsed/1000).toFixed(2)}s`);
      expiredIds.push(id);
    }
  });
  
  // Remove expired messages
  expiredIds.forEach(id => {
    delete pendingMessages[id];
  });
  
  // Stop checker if no more pending messages
  if (Object.keys(pendingMessages).length === 0 && checkerInterval) {
    clearInterval(checkerInterval);
    checkerInterval = null;
  }
};

/**
 * Ensure the message checker is running
 */
const ensureCheckerRunning = () => {
  if (!checkerInterval) {
    checkerInterval = setInterval(checkExpiredMessages, 100);
  }
};

// Export functions for testing
export const __pendingMessages = pendingMessages;