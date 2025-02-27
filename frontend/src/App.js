import React, { useEffect, useState } from 'react';
import { connect, sendMessage } from './services/socketService';
import DebugConsole from './components/DebugConsole';
import { info, debug, warn, error, sent, received } from './services/loggerService';
import './styles/App.css';

function App() {
  useEffect(() => {
    debug('App initialized');
    const socket = connect();
    debug('Socket connection established');

    socket.on('connect', () => {
      debug('Socket connected successfully to backend');
    });
    
    socket.on('connect_error', (err) => {
      error(`Connection error: ${err.message}`);
    });

    socket.on('message', (data) => {
      received(`Message from backend: ${data.content}`);
    });

    socket.on('received_message', (data) => {
      debug(`Confirmation: ${(data.content)}`);
    });

    return () => {
      debug('Disconnecting socket');
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    const message = "Hello from the frontend!";
    sent(`Sending message: ${message}`);
    sendMessage(message);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MNIST-Visualizer</h1>
        <button onClick={handleSendMessage}>Send Message to Backend</button>
      </header>
      <DebugConsole />
    </div>
  );
}

export default App;