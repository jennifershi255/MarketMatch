import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import axios from 'axios';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PortfolioOptimizer from './pages/PortfolioOptimizer';
import MarketAnalysis from './pages/MarketAnalysis';
import BackendLoadingScreen from './components/BackendLoadingScreen';
import API_BASE_URL from './config/api';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff88',
      light: '#4dffa6',
      dark: '#00cc6a',
      contrastText: '#0a0a0f',
    },
    secondary: {
      main: '#00cc6a',
      light: '#33d685',
      dark: '#009954',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0a0f',
      paper: '#1e1e2e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3cc',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
    success: {
      main: '#00ff88',
      light: '#4dffa6',
      dark: '#00cc6a',
    },
    info: {
      main: '#00ccff',
      light: '#4dd9ff',
      dark: '#0099cc',
    },
    warning: {
      main: '#ffaa00',
      light: '#ffbb33',
      dark: '#cc8800',
    },
    error: {
      main: '#ff4444',
      light: '#ff6666',
      dark: '#cc3333',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '4.5rem',
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2.75rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 16,
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 100%)',
          '&::-webkit-scrollbar': {
            width: '10px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#111118',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
            borderRadius: '5px',
            opacity: 0.8,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#00ff88',
            opacity: 1,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(30, 30, 46, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 20,
          backdropFilter: 'blur(25px) saturate(180%)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.15), transparent)',
            transition: 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          '&:hover': {
            borderColor: 'rgba(0, 255, 136, 0.4)',
            boxShadow: '0 20px 50px rgba(0, 255, 136, 0.25), 0 0 80px rgba(0, 255, 136, 0.1)',
            transform: 'translateY(-12px) scale(1.01)',
            '&::before': {
              left: '100%',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          padding: '12px 32px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)',
            transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
          color: '#0a0a0f',
          boxShadow: '0 8px 24px rgba(0, 255, 136, 0.35), 0 0 0 1px rgba(0, 255, 136, 0.1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4dffa6 0%, #00ff88 100%)',
            boxShadow: '0 12px 32px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.2)',
            transform: 'translateY(-3px) scale(1.02)',
          },
          '&:active': {
            transform: 'translateY(-1px) scale(0.98)',
          },
        },
        outlined: {
          borderColor: '#00ff88',
          borderWidth: '2px',
          color: '#00ff88',
          '&:hover': {
            borderColor: '#4dffa6',
            borderWidth: '2px',
            backgroundColor: 'rgba(0, 255, 136, 0.12)',
            boxShadow: '0 8px 24px rgba(0, 255, 136, 0.25)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(30, 30, 46, 0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'rgba(0, 255, 136, 0.12)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          color: '#00ff88',
          fontWeight: 600,
          borderRadius: 10,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'rgba(0, 255, 136, 0.2)',
            borderColor: '#00ff88',
            boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: 'rgba(0, 255, 136, 0.4)',
          borderWidth: '2px',
          color: '#00ff88',
          '&:hover': {
            borderColor: '#00ff88',
            background: 'rgba(0, 255, 136, 0.15)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 8,
          height: 8,
          overflow: 'hidden',
        },
        bar: {
          background: 'linear-gradient(90deg, #00ff88 0%, #00ccff 100%)',
          borderRadius: 8,
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid',
          backdropFilter: 'blur(10px)',
          fontWeight: 500,
        },
        standardError: {
          background: 'rgba(255, 68, 68, 0.12)',
          borderColor: 'rgba(255, 68, 68, 0.4)',
          color: '#ff6666',
        },
        standardSuccess: {
          background: 'rgba(0, 255, 136, 0.12)',
          borderColor: 'rgba(0, 255, 136, 0.4)',
          color: '#00ff88',
        },
        standardInfo: {
          background: 'rgba(0, 204, 255, 0.12)',
          borderColor: 'rgba(0, 204, 255, 0.4)',
          color: '#4dd9ff',
        },
        standardWarning: {
          background: 'rgba(255, 170, 0, 0.12)',
          borderColor: 'rgba(255, 170, 0, 0.4)',
          color: '#ffbb33',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(30, 30, 46, 0.95) 0%, rgba(26, 26, 36, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 255, 136, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00ff88',
              boxShadow: '0 0 0 4px rgba(0, 255, 136, 0.1)',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '0.95rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        },
      },
    },
  },
});

function App() {
  const [backendReady, setBackendReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Connecting to backend...");

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const healthUrl = API_BASE_URL ? `${API_BASE_URL}/api/health` : '/api/health';
        const response = await axios.get(healthUrl, {
          timeout: 10000, // 10 second timeout
        });
        
        if (response.status === 200) {
          setLoadingMessage("Backend connected! Loading app...");
          setTimeout(() => {
            setBackendReady(true);
          }, 500);
        }
      } catch (error) {
        console.log(`Backend not ready yet (attempt ${retryCount + 1})...`, error.message);
        
        // Update message based on retry count
        if (retryCount < 3) {
          setLoadingMessage("Waking up backend server...");
        } else if (retryCount < 8) {
          setLoadingMessage("Backend is starting up, please wait...");
        } else if (retryCount < 15) {
          setLoadingMessage("Almost there, hang tight...");
        } else {
          setLoadingMessage("Still connecting (free tier takes time)...");
        }
        
        // Retry after delay
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 3000); // Retry every 3 seconds
      }
    };

    if (!backendReady) {
      checkBackendHealth();
    }
  }, [retryCount, backendReady]);

  // Show loading screen while backend is not ready
  if (!backendReady) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BackendLoadingScreen message={loadingMessage} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="matrix-bg"></div>
      <Box className="hero-gradient-bg" sx={{ minHeight: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        {/* Global Floating Orbs */}
        <div className="floating-orb floating-orb-1"></div>
        <div className="floating-orb floating-orb-2"></div>
        <div className="floating-orb floating-orb-3"></div>
      </Box>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          <Navbar />
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              p: 3,
              background: 'transparent',
              position: 'relative',
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/optimize" element={<PortfolioOptimizer />} />
              <Route path="/market-analysis" element={<MarketAnalysis />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 