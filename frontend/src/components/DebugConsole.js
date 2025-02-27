import React, { useState, useEffect, useRef } from 'react';
import { getLogEntries, subscribe, clearLogs } from '../services/loggerService';
import '../styles/DebugConsole.css';

const DebugConsole = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const logContainerRef = useRef(null);

  useEffect(() => {
    // Load initial logs
    setLogs(getLogEntries());
    
    // Subscribe to new logs
    const unsubscribe = subscribe(newLogs => {
      setLogs(newLogs);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new logs come in
    if (logContainerRef.current && isVisible) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, isVisible]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Updated to use the clearLogs function from loggerService
  const handleClearLogs = () => {
    clearLogs();
  };

  return (
    <div className="debug-console-container">
      {isVisible && (
        <div className="debug-console">
          <div className="debug-console-header">
            <h3>Debug Console</h3>
            <button onClick={handleClearLogs}>Clear</button>
          </div>
          <div className="debug-console-logs" ref={logContainerRef}>
            {logs.length === 0 ? (
              <div className="no-logs">No logs to display</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`log-entry log-level-${log.level.toLowerCase()}`}>
                  <span className="log-timestamp">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className="log-level">{log.level}</span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <button className="debug-console-toggle" onClick={toggleVisibility}>
        {isVisible ? 'Hide Console' : 'Show Console'}
      </button>
    </div>
  );
};

export default DebugConsole;