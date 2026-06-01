import { useBackend } from '../App';
import BackendLoadingScreen from './BackendLoadingScreen';
import PropTypes from 'prop-types';

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

WithBackendCheck.propTypes = {
  children: PropTypes.node.isRequired
};

export default WithBackendCheck;
