import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <TrendingUpIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          MarketMatch
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              backgroundColor: isActive('/') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/optimize"
            sx={{
              backgroundColor: isActive('/optimize') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Portfolio Optimizer
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/market-analysis"
            sx={{
              backgroundColor: isActive('/market-analysis') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Market Analysis
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/about"
            sx={{
              backgroundColor: isActive('/about') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            About
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 