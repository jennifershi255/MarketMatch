import React, { useState, useEffect } from 'react';
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
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setMounted(true);
  }, []);

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
    { path: '/about', label: 'About' },
  ];

  const drawer = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        background: 'linear-gradient(135deg, #1e1e2e 0%, #1a1a24 100%)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid rgba(0, 255, 136, 0.2)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TrendingUpIcon 
            sx={{ 
              mr: 1,
              fontSize: 28,
              color: '#00ff88',
              filter: 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.6))',
            }} 
          />
          <Typography
            variant="h6"
            sx={{
              color: '#00ff88',
              fontWeight: 700,
              textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
            }}
          >
            MarketMatch
          </Typography>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            color: '#00ff88',
            '&:hover': {
              background: 'rgba(0, 255, 136, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {navItems.map((item, index) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleMobileNavClick}
            className={mounted ? `animate-slide-right delay-${(index + 1) * 100}` : ''}
            sx={{
              mx: 2,
              mb: 1,
              borderRadius: 2,
              color: isActive(item.path) ? '#00ff88' : '#b3b3cc',
              background: isActive(item.path) 
                ? 'rgba(0, 255, 136, 0.1)' 
                : 'transparent',
              border: isActive(item.path) 
                ? '1px solid rgba(0, 255, 136, 0.3)' 
                : '1px solid transparent',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              '&:hover': {
                color: '#00ff88',
                background: 'rgba(0, 255, 136, 0.1)',
                borderColor: 'rgba(0, 255, 136, 0.3)',
                transform: 'translateX(10px)',
              },
            }}
          >
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: isActive(item.path) ? 600 : 500,
                fontSize: '1rem',
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
        sx={{
          background: trigger 
            ? 'linear-gradient(135deg, rgba(30, 30, 46, 0.95) 0%, rgba(26, 26, 36, 0.95) 100%)'
            : 'linear-gradient(135deg, #1e1e2e 0%, #1a1a24 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: trigger 
            ? '1px solid rgba(0, 255, 136, 0.3)'
            : '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: trigger 
            ? '0 4px 20px rgba(0, 255, 136, 0.15)'
            : '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          {/* Logo Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <TrendingUpIcon 
              sx={{ 
                mr: 2,
                fontSize: 32,
                color: '#00ff88',
                filter: 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.6))',
                animation: mounted ? 'float 3s ease-in-out infinite' : 'none',
              }} 
            />
            <Typography
              variant="h5"
              component={Link}
              to="/"
              className={mounted ? 'neon-text animated-underline' : ''}
              sx={{
                textDecoration: 'none',
                color: '#00ff88',
                fontWeight: 700,
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                letterSpacing: '0.5px',
                textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  textShadow: '0 0 15px rgba(0, 255, 136, 0.8)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              MarketMatch
            </Typography>
          </Box>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
              {navItems.map((item, index) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  className={mounted ? `animate-slide-right delay-${(index + 1) * 100}` : ''}
                  sx={{
                    color: isActive(item.path) ? '#00ff88' : '#b3b3cc',
                    fontWeight: isActive(item.path) ? 600 : 500,
                    fontSize: '0.875rem',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    textTransform: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    border: isActive(item.path) 
                      ? '1px solid rgba(0, 255, 136, 0.3)' 
                      : '1px solid transparent',
                    background: isActive(item.path) 
                      ? 'rgba(0, 255, 136, 0.1)' 
                      : 'transparent',
                    backdropFilter: isActive(item.path) ? 'blur(5px)' : 'none',
                    boxShadow: isActive(item.path) 
                      ? '0 0 15px rgba(0, 255, 136, 0.2)' 
                      : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.1), transparent)',
                      transition: 'left 0.5s',
                    },
                    '&:hover': {
                      color: '#00ff88',
                      backgroundColor: 'rgba(0, 255, 136, 0.1)',
                      borderColor: 'rgba(0, 255, 136, 0.3)',
                      boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
                      transform: 'translateY(-2px)',
                      '&::before': {
                        left: '100%',
                      },
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: isActive(item.path) ? '80%' : '0%',
                      height: '2px',
                      background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
                      transform: 'translateX(-50%)',
                      transition: 'width 0.3s ease',
                      borderRadius: '1px',
                    },
                    '&:hover::after': {
                      width: '80%',
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
                '&:hover': {
                  background: 'rgba(0, 255, 136, 0.1)',
                  borderColor: '#00ff88',
                  boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)',
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
            background: 'linear-gradient(90deg, transparent, #00ff88, transparent)',
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
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            background: 'transparent',
            border: 'none',
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(5px)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar; 