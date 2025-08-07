import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PortfolioOptimizer from './pages/PortfolioOptimizer';
import MarketAnalysis from './pages/MarketAnalysis';
import About from './pages/About';

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
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2.25rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
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
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 100%)',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#111118',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#00ff88',
            borderRadius: '4px',
            opacity: 0.7,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#00cc6a',
            opacity: 1,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1e1e2e 0%, #1a1a24 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          backdropFilter: 'blur(10px)',
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
            background: 'linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.1), transparent)',
            transition: 'left 0.8s',
          },
          '&:hover': {
            borderColor: 'rgba(0, 255, 136, 0.3)',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
            transform: 'translateY(-8px)',
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
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
          color: '#0a0a0f',
          boxShadow: '0 4px 15px rgba(0, 255, 136, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #00cc6a 0%, #00ff88 100%)',
            boxShadow: '0 6px 25px rgba(0, 255, 136, 0.5)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: '#00ff88',
          color: '#00ff88',
          '&:hover': {
            borderColor: '#00cc6a',
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1e1e2e 0%, #1a1a24 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'rgba(0, 255, 136, 0.1)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          color: '#00ff88',
          fontWeight: 500,
          '&:hover': {
            background: 'rgba(0, 255, 136, 0.2)',
            borderColor: '#00ff88',
          },
        },
        outlined: {
          borderColor: 'rgba(0, 255, 136, 0.3)',
          color: '#00ff88',
          '&:hover': {
            borderColor: '#00ff88',
            background: 'rgba(0, 255, 136, 0.1)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          height: 6,
        },
        bar: {
          background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
          borderRadius: 4,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid',
        },
        standardError: {
          background: 'rgba(255, 68, 68, 0.1)',
          borderColor: 'rgba(255, 68, 68, 0.3)',
          color: '#ff4444',
        },
        standardSuccess: {
          background: 'rgba(0, 255, 136, 0.1)',
          borderColor: 'rgba(0, 255, 136, 0.3)',
          color: '#00ff88',
        },
        standardInfo: {
          background: 'rgba(0, 204, 255, 0.1)',
          borderColor: 'rgba(0, 204, 255, 0.3)',
          color: '#00ccff',
        },
        standardWarning: {
          background: 'rgba(255, 170, 0, 0.1)',
          borderColor: 'rgba(255, 170, 0, 0.3)',
          color: '#ffaa00',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1e1e2e 0%, #1a1a24 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="matrix-bg"></div>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              p: 3,
              background: 'transparent',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/optimize" element={<PortfolioOptimizer />} />
              <Route path="/market-analysis" element={<MarketAnalysis />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 