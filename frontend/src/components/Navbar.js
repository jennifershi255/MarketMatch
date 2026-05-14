import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useScrollTrigger,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Navbar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const isActive = (path) => location.pathname === path;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileNavClick = () => {
    setMobileOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/optimize', label: 'Portfolio Optimizer' },
    { path: '/market-analysis', label: 'Market Analysis' },
  ];

  const drawer = (
    <Box
      className="glass-effect"
      sx={{
        width: 300,
        height: '100%',
        background: 'linear-gradient(135deg, rgba(30, 30, 46, 0.95) 0%, rgba(26, 26, 36, 0.95) 100%)',
        backdropFilter: 'blur(20px) saturate(180%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          borderBottom: '2px solid rgba(0, 255, 136, 0.3)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TrendingUpIcon 
            sx={{ 
              mr: 1.5,
              fontSize: 32,
              color: '#00ff88',
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.7))',
            }} 
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: '#00ff88',
            }}
          >
            MarketMatch
          </Typography>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            color: '#00ff88',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(0, 255, 136, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List sx={{ flexGrow: 1, pt: 3, px: 2 }}>
        {navItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleMobileNavClick}
            sx={{
              mb: 2,
              borderRadius: 2,
              color: isActive(item.path) ? '#00ff88' : '#b3b3cc',
              background: isActive(item.path) 
                ? 'rgba(0, 255, 136, 0.1)' 
                : 'transparent',
              border: isActive(item.path) 
                ? '1px solid rgba(0, 255, 136, 0.3)' 
                : '1px solid transparent',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
              '&:hover': {
                color: '#00ff88',
                background: 'rgba(0, 255, 136, 0.1)',
                borderColor: 'rgba(0, 255, 136, 0.3)',
              },
            }}
          >
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: isActive(item.path) ? 700 : 600,
                fontSize: '1.1rem',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        className="glass-effect"
        sx={{
          background: trigger 
            ? 'rgba(30, 30, 46, 0.85)'
            : 'rgba(30, 30, 46, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: trigger 
            ? '1px solid rgba(0, 255, 136, 0.3)'
            : '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          boxShadow: trigger 
            ? '0 4px 20px rgba(0, 255, 136, 0.15)'
            : '0 2px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 6 }, py: 1.5 }}>
          {/* Logo Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            <TrendingUpIcon 
              sx={{ 
                mr: 2,
                fontSize: 36,
                color: '#00ff88',
                filter: 'drop-shadow(0 0 12px rgba(0, 255, 136, 0.7))',
              }} 
            />
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: { xs: '1.3rem', sm: '1.6rem' },
                letterSpacing: '0.5px',
                color: '#00ff88',
              }}
            >
              MarketMatch
            </Typography>
          </Box>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto' }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isActive(item.path) ? '#00ff88' : '#b3b3cc',
                    fontWeight: isActive(item.path) ? 700 : 600,
                    fontSize: '1rem',
                    padding: '10px 24px',
                    borderRadius: '12px',
                    textTransform: 'none',
                    border: isActive(item.path) 
                      ? '1px solid rgba(0, 255, 136, 0.3)' 
                      : '1px solid transparent',
                    background: isActive(item.path) 
                      ? 'rgba(0, 255, 136, 0.1)' 
                      : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#00ff88',
                      backgroundColor: 'rgba(0, 255, 136, 0.1)',
                      borderColor: 'rgba(0, 255, 136, 0.3)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                ml: 'auto',
                color: '#00ff88',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(0, 255, 136, 0.1)',
                  borderColor: 'rgba(0, 255, 136, 0.5)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
        
        {/* Animated border at bottom */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '1px',
            background: 'rgba(0, 255, 136, 0.2)',
            opacity: trigger ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            background: 'transparent',
            border: 'none',
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar; 