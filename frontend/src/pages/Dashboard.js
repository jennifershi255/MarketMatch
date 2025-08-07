import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  LinearProgress,
  Alert,
  Fade,
  Zoom,
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  FilterList,
  ShowChart,
  Security,
  Speed,
  AutoGraph,
  Timeline,
} from '@mui/icons-material';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const Dashboard = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetchMarketData();
    setMounted(true);
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.MARKET_DATA);
      setMarketData(response.data);
    } catch (err) {
      setError('Failed to fetch market data');
      console.error('Market data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FilterList sx={{ fontSize: 40 }} />,
      title: 'Smart Filtering',
      description: 'AI-powered stock filtering based on currency, volume, and listing status with real-time updates.',
      color: '#00ff88',
    },
    {
      icon: <Assessment sx={{ fontSize: 40 }} />,
      title: 'Portfolio Optimization',
      description: 'Advanced algorithms optimize weights using market cap, returns, and tracking error minimization.',
      color: '#00ccff',
    },
    {
      icon: <ShowChart sx={{ fontSize: 40 }} />,
      title: 'Data Visualization',
      description: 'Interactive charts and graphs showing portfolio performance vs market indices in real-time.',
      color: '#ffaa00',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Market Tracking',
      description: 'High-precision tracking of S&P 500 and TSX 60 indices with correlation accuracy.',
      color: '#ff4444',
    },
  ];

  const benefits = [
    {
      icon: <Security sx={{ fontSize: 24 }} />,
      label: 'High Correlation',
      description: 'Achieves 98%+ correlation with market indices',
      color: 'success',
    },
    {
      icon: <Speed sx={{ fontSize: 24 }} />,
      label: 'Risk Management',
      description: 'Uses tracking error to minimize portfolio risk',
      color: 'info',
    },
    {
      icon: <AutoGraph sx={{ fontSize: 24 }} />,
      label: 'Automated Filtering',
      description: 'Removes delisted and low-volume stocks automatically',
      color: 'warning',
    },
    {
      icon: <Timeline sx={{ fontSize: 24 }} />,
      label: 'Multi-Factor Analysis',
      description: 'Considers market cap, returns, and tracking error',
      color: 'secondary',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Fade in={mounted} timeout={1000}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            className="neon-text animate-slide-up"
            sx={{ 
              fontSize: '4rem',
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #00ff88 0%,rgb(159, 222, 159) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
            }}
          >
            Market Match
          </Typography>
          <Typography 
            variant="h5" 
            className="animate-slide-up delay-200"
            sx={{ 
              color: 'text.secondary',
              mb: 4,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: '1.2rem',
            }}
          >
            Create optimized portfolios that track the S&P 500 and TSX 60 indices.
          </Typography>
        </Box>
      </Fade>

      {/* Market Data Overview */}
      {loading && (
        <Zoom in={loading} timeout={500}>
          <Box sx={{ mb: 4 }}>
            <Card className="futuristic-card">
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box className="loading-dots animate-pulse" sx={{ mr: 2 }}>
                    <Typography variant="h6" color="primary">
                      Loading market data
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress 
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
                      animation: 'pulse 2s ease-in-out infinite',
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Box>
        </Zoom>
      )}

      {error && (
        <Fade in={!!error} timeout={500}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              borderRadius: 2,
              border: '1px solid rgba(255, 68, 68, 0.3)',
              background: 'rgba(255, 68, 68, 0.1)',
            }}
          >
            {error}
          </Alert>
        </Fade>
      )}

      {marketData && (
        <Zoom in={!!marketData} timeout={800}>
          <Card 
            className="futuristic-card animate-slide-up delay-300"
            sx={{ 
              mb: 6, 
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 204, 106, 0.05) 100%)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              boxShadow: '0 0 30px rgba(0, 255, 136, 0.2)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h4" 
                gutterBottom
                className="neon-text"
                sx={{ textAlign: 'center', mb: 4 }}
              >
                Market Performance Overview
              </Typography>
              <Grid container spacing={4}>
                {[
                  { label: 'S&P 500', value: marketData.performance?.sp500_return, delay: '100' },
                  { label: 'TSX 60', value: marketData.performance?.tsx_return, delay: '200' },
                  { label: 'Average', value: marketData.performance?.avg_return, delay: '300' },
                ].map((item, index) => (
                  <Grid item xs={12} md={4} key={item.label}>
                    <Box 
                      className={`animate-slide-up delay-${item.delay} animate-float`}
                      sx={{ 
                        textAlign: 'center',
                        p: 3,
                        borderRadius: 2,
                        background: 'rgba(0, 255, 136, 0.05)',
                        border: '1px solid rgba(0, 255, 136, 0.1)',
                        transition: 'all 0.3s ease',
                        animationDelay: `${index * 0.5}s`,
                        '&:hover': {
                          transform: 'translateY(-10px) scale(1.02)',
                          boxShadow: '0 10px 25px rgba(0, 255, 136, 0.3)',
                          borderColor: 'rgba(0, 255, 136, 0.5)',
                        },
                      }}
                    >
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        {item.label}
                      </Typography>
                      <Typography 
                        variant="h3" 
                        className="neon-text"
                        sx={{ 
                          fontWeight: 700,
                          my: 1,
                          fontSize: '2.5rem',
                        }}
                      >
                        {item.value?.toFixed(2)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        3-Year Return
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Zoom>
      )}

      {/* Features Grid */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          gutterBottom 
          align="center" 
          className="animate-slide-up delay-400"
          sx={{ 
            mb: 5,
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          Advanced Features
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                className={`futuristic-card animate-slide-up delay-${(index + 5) * 100}`}
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: feature.color,
                    boxShadow: `0 0 30px ${feature.color}30`,
                  },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                  <Box 
                    sx={{ 
                      mb: 3,
                      '& svg': {
                        color: feature.color,
                        filter: `drop-shadow(0 0 8px ${feature.color}60)`,
                        animation: 'float 3s ease-in-out infinite',
                        animationDelay: `${index * 0.5}s`,
                      },
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      color: feature.color,
                      mb: 2,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Key Benefits */}
      <Card 
        className="futuristic-card animate-slide-up delay-900"
        sx={{ mb: 6 }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              textAlign: 'center',
              mb: 4,
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            Highlights
          </Typography>
          <Grid container spacing={3}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box 
                  className={`animate-slide-left delay-${(index + 10) * 100}`}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(0, 255, 136, 0.03)',
                    border: '1px solid rgba(0, 255, 136, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(0, 255, 136, 0.08)',
                      borderColor: 'rgba(0, 255, 136, 0.3)',
                      transform: 'translateX(10px)',
                    },
                  }}
                >
                  <Box sx={{ mr: 2, color: 'primary.main' }}>
                    {benefit.icon}
                  </Box>
                  <Box>
                    <Chip
                      label={benefit.label}
                      color={benefit.color}
                      variant="outlined"
                      sx={{ 
                        mb: 1,
                        fontWeight: 600,
                        '& .MuiChip-label': {
                          fontSize: '0.875rem',
                        },
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {benefit.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card 
        className="futuristic-card animate-slide-up delay-1300"
        sx={{
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 204, 106, 0.02) 100%)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            gutterBottom
            className="neon-text"
            sx={{ textAlign: 'center', mb: 4 }}
          >
            Getting Started
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                step: '01',
                title: 'Portfolio Optimizer',
                description: 'Upload your stock tickers or use our sample data to get started.',
              },
              {
                step: '02',
                title: 'Configure Parameters',
                description: 'Set your portfolio parameters including number of stocks and budget.',
              },
              {
                step: '03',
                title: 'Review Results',
                description: 'Analyze the optimized portfolio and performance metrics.',
              },
              {
                step: '04',
                title: 'Market Analysis',
                description: 'Explore market trends and insights in the analysis section.',
              },
            ].map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box 
                  className={`animate-slide-right delay-${(index + 14) * 100}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    p: 3,
                    borderRadius: 2,
                    background: 'rgba(0, 255, 136, 0.03)',
                    border: '1px solid rgba(0, 255, 136, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(0, 255, 136, 0.08)',
                      borderColor: 'rgba(0, 255, 136, 0.3)',
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    className="neon-text"
                    sx={{
                      mr: 3,
                      fontWeight: 700,
                      fontSize: '2rem',
                      minWidth: '60px',
                    }}
                  >
                    {item.step}
                  </Typography>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'primary.main',
                        mb: 1,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard; 