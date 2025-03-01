import { useEffect, useState } from 'react';
import { connect, disconnectSocket } from '../services/socket/socketService';
import { debug, error, received } from '../services/logger/loggerService';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    debug('Initializing socket connection');
    const socketInstance = connect();
    
    socketInstance.on('connect', () => {
      debug('Socket connected successfully to backend');
      setIsConnected(true);
    });
    
    socketInstance.on('disconnect', () => {
      debug('Socket disconnected from backend');
      setIsConnected(false);
    });
    
    socketInstance.on('connect_error', (err) => {
      error(`Connection error: ${err.message}`);
      setIsConnected(false);
    });
    
    setSocket(socketInstance);
    
    return () => {
      debug('Cleaning up socket connection');
      disconnectSocket();
    };
  }, []);
  
  return { socket, isConnected };
};

export default useSocket;