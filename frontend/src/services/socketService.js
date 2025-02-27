import { io } from 'socket.io-client';

// Try a different connection approach
const URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'http://backend:5000';

// Create a socket instance
let socket;

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

// Send a text message
export const sendMessage = (message) => {
  if (!socket || !socket.connected) {
    console.error('Socket not connected, cannot send message');
    return false;
  }
  socket.emit('message', { type: 'text', content: message });
  return true;
};

// Disconnect the socket
export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

// Export socket for direct access if needed
export { socket };