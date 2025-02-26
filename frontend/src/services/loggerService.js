// Define log levels
const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
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
  
  // Log to console as well
  console[level.toLowerCase() === 'debug' ? 'log' : level.toLowerCase()](`[${level}] ${message}`);
  
  // Notify subscribers
  subscribers.forEach(callback => callback([...logs]));
};

// Public logging functions
export const debug = (message) => addLogEntry(LOG_LEVELS.DEBUG, message);
export const info = (message) => addLogEntry(LOG_LEVELS.INFO, message);
export const warn = (message) => addLogEntry(LOG_LEVELS.WARN, message);
export const error = (message) => addLogEntry(LOG_LEVELS.ERROR, message);

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