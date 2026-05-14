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
            className="gradient-text-animated"
            sx={{
              fontWeight: 800,
            }}
          >
            MarketMatch
          </Typography>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          className="btn-ripple"
          sx={{
            color: '#00ff88',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(0, 255, 136, 0.15)',
              transform: 'rotate(90deg)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List sx={{ flexGrow: 1, pt: 3, px: 2 }}>
        {navItems.map((item, index) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleMobileNavClick}
            className={mounted ? `animate-slide-right delay-${(index + 1) * 100}` : ''}
            sx={{
              mb: 2,
              borderRadius: 3,
              color: isActive(item.path) ? '#00ff88' : '#b3b3cc',
              background: isActive(item.path) 
                ? 'rgba(0, 255, 136, 0.15)' 
                : 'transparent',
              border: isActive(item.path) 
                ? '2px solid rgba(0, 255, 136, 0.4)' 
                : '2px solid transparent',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              textDecoration: 'none',
              boxShadow: isActive(item.path) 
                ? '0 4px 20px rgba(0, 255, 136, 0.25)' 
                : 'none',
              '&:hover': {
                color: '#00ff88',
                background: 'rgba(0, 255, 136, 0.15)',
                borderColor: 'rgba(0, 255, 136, 0.5)',
                transform: 'translateX(15px) scale(1.02)',
                boxShadow: '0 6px 24px rgba(0, 255, 136, 0.35)',
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
            ? '1px solid rgba(0, 255, 136, 0.4)'
            : '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: trigger 
            ? '0 8px 32px rgba(0, 255, 136, 0.2), 0 0 60px rgba(0, 255, 136, 0.1)'
            : '0 4px 30px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 6 }, py: 1.5 }}>
          {/* Logo Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.05) translateY(-2px)',
              },
            }}
          >
            <TrendingUpIcon 
              sx={{ 
                mr: 2,
                fontSize: 36,
                color: '#00ff88',
                filter: 'drop-shadow(0 0 12px rgba(0, 255, 136, 0.7))',
                animation: mounted ? 'float 3s ease-in-out infinite' : 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  filter: 'drop-shadow(0 0 20px rgba(0, 255, 136, 1))',
                },
              }} 
            />
            <Typography
              variant="h5"
              component={Link}
              to="/"
              className={mounted ? 'gradient-text-animated' : ''}
              sx={{
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: { xs: '1.3rem', sm: '1.6rem' },
                letterSpacing: '0.5px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  filter: 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.5))',
                },
              }}
            >
              MarketMatch
            </Typography>
          </Box>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto' }}>
              {navItems.map((item, index) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  className={`btn-ripple ${mounted ? `animate-slide-right delay-${(index + 1) * 100}` : ''}`}
                  sx={{
                    color: isActive(item.path) ? '#00ff88' : '#b3b3cc',
                    fontWeight: isActive(item.path) ? 700 : 600,
                    fontSize: '1rem',
                    padding: '10px 24px',
                    borderRadius: '12px',
                    textTransform: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    border: isActive(item.path) 
                      ? '2px solid rgba(0, 255, 136, 0.4)' 
                      : '2px solid transparent',
                    background: isActive(item.path) 
                      ? 'rgba(0, 255, 136, 0.15)' 
                      : 'transparent',
                    backdropFilter: isActive(item.path) ? 'blur(10px)' : 'none',
                    boxShadow: isActive(item.path) 
                      ? '0 4px 20px rgba(0, 255, 136, 0.25)' 
                      : 'none',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.2), transparent)',
                      transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                    '&:hover': {
                      color: '#00ff88',
                      backgroundColor: 'rgba(0, 255, 136, 0.15)',
                      borderColor: 'rgba(0, 255, 136, 0.5)',
                      boxShadow: '0 6px 24px rgba(0, 255, 136, 0.35)',
                      transform: 'translateY(-3px) scale(1.05)',
                      '&::before': {
                        left: '100%',
                      },
                    },
                    '&:active': {
                      transform: 'translateY(-1px) scale(1.02)',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: isActive(item.path) ? '80%' : '0%',
                      height: '3px',
                      background: 'linear-gradient(90deg, #00ff88 0%, #00ccff 100%)',
                      transform: 'translateX(-50%)',
                      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      borderRadius: '2px',
                      boxShadow: '0 0 10px rgba(0, 255, 136, 0.8)',
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
              className="btn-ripple"
              sx={{
                ml: 'auto',
                color: '#00ff88',
                border: '2px solid rgba(0, 255, 136, 0.4)',
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'rgba(0, 255, 136, 0.15)',
                  borderColor: '#00ff88',
                  boxShadow: '0 4px 20px rgba(0, 255, 136, 0.4)',
                  transform: 'scale(1.1)',
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
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #00ff88, #00ccff, #00ff88, transparent)',
            opacity: trigger ? 1 : 0,
            transition: 'opacity 0.4s ease',
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
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