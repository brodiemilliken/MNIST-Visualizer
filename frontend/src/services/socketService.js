import { io } from 'socket.io-client';

const URL = 'http://localhost:5000';

// Create a socket instance
let socket;

// Connect to the server and return the socket
export const connect = () => {
  socket = io(URL);
  return socket;
};

// Send a text message
export const sendMessage = (message) => {
  socket.emit('message', { type: 'text', content: message });
};

// Disconnect the socket
export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

// Export socket for direct access if needed
export { socket };