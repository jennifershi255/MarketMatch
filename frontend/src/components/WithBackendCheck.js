import React, { useEffect } from 'react';
import { useBackend } from '../App';
import BackendLoadingScreen from './BackendLoadingScreen';

const WithBackendCheck = ({ children }) => {
  const { backendReady, checkingBackend } = useBackend();

  // Show loading screen only if backend is not ready yet
  if (!backendReady) {
    const message = checkingBackend 
      ? "Waking up backend server..." 
      : "Backend is starting up, please wait...";
    
    return <BackendLoadingScreen message={message} />;
  }

  // Backend is ready, show the actual page
  return children;
};

export default WithBackendCheck;
