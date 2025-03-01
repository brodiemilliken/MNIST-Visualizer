import React from 'react';
import Home from './pages/Home';
import useSocket from './hooks/useSocket';
import './styles/App.css';

function App() {
  // Initialize socket connection
  useSocket();
  
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;