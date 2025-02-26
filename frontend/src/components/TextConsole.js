import React from 'react';

function TextConsole({ messages }) {
  return (
    <div className="text-console">
      <h2>Text Console</h2>
      <div className="messages">
        {messages && messages.length > 0 ? (
          messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))
        ) : (
          <p>No messages received yet.</p>
        )}
      </div>
    </div>
  );
}

export default TextConsole;