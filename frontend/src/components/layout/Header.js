import React from 'react';
import '../../styles/components/layout/Header.css';

const Header = ({ title, onSendMessage }) => {
  return (
    <header className="app-header">
      <h1>{title}</h1>
      {onSendMessage && (
        <button onClick={onSendMessage} className="send-button">
          Send Test Message
        </button>
      )}
    </header>
  );
};

export default Header;