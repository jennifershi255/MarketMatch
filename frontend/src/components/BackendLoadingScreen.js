import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

const BackendLoadingScreen = ({ message = "Waking up backend server..." }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Animated rings */}
      {[0, 1, 2, 3, 4].map((index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            width: `${120 + index * 80}px`,
            height: `${120 + index * 80}px`,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: index % 2 === 0 ? 'rgba(0, 255, 136, 0.3)' : 'rgba(0, 204, 255, 0.3)',
            animation: `spin ${3 + index * 0.5}s linear infinite`,
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg) scale(1)', opacity: 0.8 },
              '50%': { transform: `rotate(180deg) scale(${0.8 - index * 0.1})`, opacity: 0.4 },
              '100%': { transform: 'rotate(360deg) scale(1)', opacity: 0.8 },
            },
          }}
        />
      ))}

      {/* Center content */}
      <Box sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        {/* Logo */}
        <TrendingUp
          sx={{
            fontSize: 80,
            color: '#00ff88',
            mb: 3,
            filter: 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.8))',
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1, transform: 'scale(1)' },
              '50%': { opacity: 0.7, transform: 'scale(1.1)' },
            },
          }}
        />

        {/* Brand */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            background: 'linear-gradient(135deg, #00ff88 0%, #00ccff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          MarketMatch
        </Typography>

        {/* Loading message */}
        <Typography variant="h6" sx={{ color: '#b3b3cc', mb: 3 }}>
          {message}
        </Typography>

        {/* Progress */}
        <CircularProgress 
          sx={{ 
            color: '#00ff88',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }} 
        />

        {/* Info */}
        <Typography variant="body2" sx={{ color: 'rgba(179, 179, 204, 0.6)', mt: 3, maxWidth: '400px' }}>
          Backend is starting up (free tier)
          <br />
          This may take up to 60 seconds on first visit
        </Typography>
      </Box>
    </Box>
  );
};

export default BackendLoadingScreen;
