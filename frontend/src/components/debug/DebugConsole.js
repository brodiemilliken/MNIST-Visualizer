import React, { useState, useEffect, useRef } from 'react';
import { getLogEntries, subscribe, clearLogs } from '../../services/logger/loggerService';
import '../../styles/components/debug/DebugConsole.css';

const LOG_LEVELS = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'SENT', 'RECEIVED'];

const DebugConsole = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const logContainerRef = useRef(null);
  const [activeFilters, setActiveFilters] = useState(() => {
    // Load saved filters from localStorage, or use all by default
    const savedFilters = localStorage.getItem('frontendLogFilters');
    if (savedFilters) {
      try {
        return new Set(JSON.parse(savedFilters));
      } catch (e) {
        console.error('Error loading saved filters', e);
      }
    }
    return new Set(LOG_LEVELS); // Default: all filters active
  });

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

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('frontendLogFilters', JSON.stringify([...activeFilters]));
  }, [activeFilters]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleClearLogs = () => {
    clearLogs();
  };

  const toggleFilter = (level) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(level)) {
      newFilters.delete(level);
    } else {
      newFilters.add(level);
    }
    setActiveFilters(newFilters);
  };

  // Filter logs based on active filters
  const filteredLogs = logs.filter(log => activeFilters.has(log.level));

  return (
    <div className="debug-console-container">
      {isVisible && (
        <div className="debug-console">
          <div className="debug-console-header">
            {/* Header text removed */}
            
            <div className="debug-console-filters">
              {LOG_LEVELS.map(level => (
                <div 
                  key={level} 
                  className={`filter-label ${activeFilters.has(level) ? 'filter-active' : 'filter-inactive'} filter-label-${level.toLowerCase()}`}
                  onClick={() => toggleFilter(level)}
                >
                  {level}
                </div>
              ))}
            </div>
            
            <button onClick={handleClearLogs}>Clear</button>
          </div>
          
          <div className="debug-console-logs" ref={logContainerRef}>
            {filteredLogs.length === 0 ? (
              <div className="no-logs">No logs to display</div>
            ) : (
              filteredLogs.map((log, index) => (
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