import React, { useState, useEffect, useRef } from 'react';
import { getLogEntries, subscribe } from '../services/loggerService';
import '../styles/DebugConsole.css';

function DebugConsole() {
  const [logs, setLogs] = useState([]);
  const [visible, setVisible] = useState(false);
  const logEndRef = useRef(null);

  useEffect(() => {
    // Get existing logs
    setLogs(getLogEntries());
    
    // Subscribe to new logs
    const unsubscribe = subscribe((newLogs) => {
      setLogs(newLogs);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      // Auto-scroll to bottom when new logs arrive
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, visible]);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  // Format timestamp to show only HH:MM:SS
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    // Extract only the time portion (HH:MM:SS) from ISO timestamp
    const timePart = timestamp.split('T')[1];
    if (!timePart) return timestamp;
    
    return timePart.split('.')[0];
  };

  return (
    <div className="debug-console-container">
      <button 
        className="debug-console-toggle" 
        onClick={toggleVisibility}
      >
        {visible ? 'Hide Debug' : 'Show Debug'}
      </button>
      
      {visible && (
        <div className="debug-console">
          <div className="debug-console-header">
            <h3>Debug Console</h3>
            <div className="console-controls">
              <small>{logs.length} messages</small>
            </div>
          </div>
          
          <div className="debug-console-logs">
            {logs.length === 0 ? (
              <p className="no-logs">No logs available</p>
            ) : (
              logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`log-entry log-level-${log.level.toLowerCase()}`}
                >
                  <span className="log-timestamp">[{formatTimestamp(log.timestamp)}]</span>
                  <span className="log-level">[{log.level}]</span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}

export default DebugConsole;