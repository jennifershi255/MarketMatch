import { Box, Typography, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

const BackendLoadingScreen = ({ message = "Connecting to backend..." }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: 'linear-gradient(135deg, rgba(30, 30, 46, 0.95) 0%, rgba(26, 26, 36, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 136, 0.3)',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 255, 136, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        minWidth: '280px',
        animation: 'slideIn 0.3s ease-out',
        '@keyframes slideIn': {
          '0%': { 
            transform: 'translateX(400px)',
            opacity: 0,
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: 1,
          },
        },
      }}
    >
      <CircularProgress 
        size={24}
        sx={{ 
          color: '#00ff88',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }} 
      />
      <Box>
        <Typography
          variant="body2"
          sx={{
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          {message}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(179, 179, 204, 0.7)',
            fontSize: '0.75rem',
          }}
        >
          this is what happens when you optimize for cost, not performance (hire me and I&apos;ll optimize both)
        </Typography>
      </Box>
    </Box>
  );
};

BackendLoadingScreen.propTypes = {
  message: PropTypes.string
};

export default BackendLoadingScreen;
