import React, { useEffect, useState } from 'react';
import { connect, sendMessage } from './services/socketService';
import ImageDisplay from './components/ImageDisplay';
import TextConsole from './components/TextConsole';
import DebugConsole from './components/DebugConsole';
import { info, debug } from './services/loggerService';

function App() {
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    info('App initialized');
    const socket = connect();
    debug('Socket connection established');

    socket.on('message', (data) => {
      debug(`Received socket message: ${JSON.stringify(data)}`);
      if (data.type === 'text') {
        setMessages((prevMessages) => [...prevMessages, data.content]);
      } else if (data.type === 'image') {
        setImage(data.content);
      }
    });

    return () => {
      debug('Disconnecting socket');
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    const message = "Hello from the frontend!";
    info(`Sending message: ${message}`);
    sendMessage(message);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MNIST Visualizer</h1>
        <p>Welcome to the MNIST Visualizer application!</p>
        <button onClick={handleSendMessage}>Send Message to Backend</button>
        <TextConsole messages={messages} />
        <ImageDisplay image={image} />
      </header>
      <DebugConsole />
    </div>
  );
}

export default App;