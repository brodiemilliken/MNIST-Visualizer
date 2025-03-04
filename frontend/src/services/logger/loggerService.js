// Define log levels
const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  SENT: 'SENT',
  RECEIVED: 'RECEIVED'
};

// In-memory storage for logs
let logs = [];
const MAX_LOGS = 1000;
const subscribers = [];

// Add a log entry
const addLogEntry = (level, message) => {
  const timestamp = new Date().toISOString();
  
  // Push to end instead of unshift to maintain chronological order
  logs.push({
    timestamp,
    level,
    message
  });
  
  // Keep logs under max size
  if (logs.length > MAX_LOGS) {
    logs = logs.slice(-MAX_LOGS);
  }
  
  // Log to console with appropriate color
  let consoleMethod = 'log';
  let style = '';
  
  switch(level) {
    case LOG_LEVELS.DEBUG:
      consoleMethod = 'debug';
      break;
    case LOG_LEVELS.INFO:
      consoleMethod = 'info';
      break;
    case LOG_LEVELS.WARNING:
      consoleMethod = 'warn';
      break;
    case LOG_LEVELS.ERROR:
      consoleMethod = 'error';
      break;
    case LOG_LEVELS.SENT:
      consoleMethod = 'log';
      style = 'color: #c17aff';
      break;
    case LOG_LEVELS.RECEIVED:
      consoleMethod = 'log';
      style = 'color: #6bff8e';
      break;
  }
  
  if (style) {
    console[consoleMethod](`%c[${level}] ${message}`, style);
  } else {
    console[consoleMethod](`[${level}] ${message}`);
  }
  
  // Notify subscribers
  notifySubscribers();
};

// Notify all subscribers
const notifySubscribers = () => {
  subscribers.forEach(callback => callback([...logs]));
};

// Add clear logs functionality
export const clearLogs = () => {
  logs = [];
  info("Console logs cleared");
};

// Public logging functions
export const debug = (message) => addLogEntry(LOG_LEVELS.DEBUG, message);
export const info = (message) => addLogEntry(LOG_LEVELS.INFO, message);
export const warning = (message) => addLogEntry(LOG_LEVELS.WARNING, message);
export const error = (message) => addLogEntry(LOG_LEVELS.ERROR, message);
export const sent = (message) => addLogEntry(LOG_LEVELS.SENT, message);
export const received = (message) => addLogEntry(LOG_LEVELS.RECEIVED, message);

// Get all log entries
export const getLogEntries = () => [...logs];

// Subscribe to log changes
export const subscribe = (callback) => {
  subscribers.push(callback);
  return () => {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };
};