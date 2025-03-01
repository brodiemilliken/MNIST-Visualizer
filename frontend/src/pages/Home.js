import React from 'react';
import { sendMessage } from '../services/socket/socketService';
import Header from '../components/layout/Header';
import DebugConsole from '../components/debug/DebugConsole';
import '../styles/pages/Home.css';

const Home = () => {
  const handleSendMessage = () => {
    const message = "Hello from the frontend!";
    sendMessage(message);
  };

  return (
    <div className="home-page">
      <Header title="MNIST-Visualizer" onSendMessage={handleSendMessage} />
      
      <main className="content">
        <div className="visualization-area">
          {/* This will be where your main content, visualizations, 
              or controls will go in the future */}
          <p className="placeholder-text">
            Visualization area - future content will appear here
          </p>
        </div>
      </main>
      
      <DebugConsole />
    </div>
  );
};

export default Home;