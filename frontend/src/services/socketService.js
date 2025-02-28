import { io } from 'socket.io-client';
import { info, debug, warning, error, sent, received } from './loggerService';
import { trackMessage, confirmMessage } from './messageTracker';

// Try a different connection approach
const URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'http://backend:5000';

// Create a socket instance
let socket;
let messageId = 0;

// Connect to the server and return the socket
export const connect = () => {
  socket = io(URL, {
    transports: ['polling', 'websocket'], // Try polling first, then websocket
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    timeout: 20000 // Increase timeout
  });
  return socket;
};

// Generate a unique ID for messages
const getMessageId = () => {
  return ++messageId;
};

export const sendMessage = (message) => {
  if (!socket || !socket.connected) {
    error('Socket not connected, cannot send message');
    return false;
  }
  
  // Create message object with ID
  const messageData = { 
    type: 'text', 
    content: message,
    id: getMessageId()
  };
  
  // Track the message before sending
  trackMessage(messageData);
  
  socket.emit('message', messageData);
  sent(`Sending message: ${message} (ID: ${messageData.id})`);
  return true;
};

export const sendConfirmation = (message) => {
  if (!socket || !socket.connected) {
    error('Socket not connected, cannot send confirmation');
    return false;
  }
  
  socket.emit('recieved_message', message);
  debug(`Confirmation sent: ${message.content}`);
  return true;
};

// Handle received confirmation
export const handleConfirmation = (data) => {
  confirmMessage(data.id);
};

// Disconnect the socket
export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

// Export socket for direct access if needed
export { socket };