import React, { useState, useEffect } from 'react';
import AuthContainer from './components/AuthContainer';
import Stars from './components/Stars';
import './App.css';

const CONFIG = {
  API_BASE_URL: 'http://localhost:3001/api',
  FRONTEND_URL: 'http://localhost:3000',
};

function App() {
  const [connectionStatus, setConnectionStatus] = useState('Connecting to server...');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await fetch(`${CONFIG.API_BASE_URL}/health`);
        setConnectionStatus('🟢 Connected to server');
        setIsConnected(true);
      } catch (error) {
        setConnectionStatus('🔴 Server offline');
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <Stars />
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {connectionStatus}
      </div>
      <AuthContainer config={CONFIG} />
    </div>
  );
}

export default App;