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
  Button,
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
  ArrowForward,
  Code,
  Rocket,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const Dashboard = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarketData();
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

  const methodology = [
    {
      title: 'Market Capitalization Weighting',
      description: 'Stocks with higher market capitalization receive more weight, reflecting their influence on market indices like the S&P 500 and TSX 60.',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#00ff88',
    },
    {
      title: 'Returns Difference Analysis',
      description: 'Measures how closely individual stock returns align with market average returns to ensure consistency and reliability.',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      color: '#00ccff',
    },
    {
      title: 'Tracking Error Optimization',
      description: 'Calculates the standard deviation of (Portfolio Return - Benchmark Return) to minimize risk and ensure stable performance.',
      icon: <Timeline sx={{ fontSize: 40 }} />,
      color: '#ffaa00',
    },
  ];

  const techStack = [
    { 
      category: 'Backend', 
      technologies: ['Python', 'Flask', 'pandas', 'numpy', 'yfinance'],
      color: '#00ff88',
      icon: <Code />
    },
    { 
      category: 'Frontend', 
      technologies: ['React', 'Material-UI', 'Recharts', 'Axios'],
      color: '#00ccff',
      icon: <Rocket />
    },
    { 
      category: 'Data', 
      technologies: ['Yahoo Finance API', 'CSV Processing', 'Real-time Market Data'],
      color: '#ffaa00',
      icon: <AutoGraph />
    },
  ];

  const keyFeatures = [
    'Automated stock filtering based on currency (USD/CAD), volume, and listing status',
    'Multi-factor rating system combining market cap, returns, and tracking error',
    'Weight optimization with minimum and maximum position limits (2.1% - 15%)',
    'Real-time data integration using Yahoo Finance API',
    'Performance tracking with 98%+ correlation to market indices',
    'Portfolio export functionality for easy implementation',
  ];

  const handleScrollToHow = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      const yOffset = -100; // Offset to prevent overscrolling
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          pb: 8,
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography 
                variant="h1" 
                component="h1"
                sx={{ 
                  fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem', lg: '6.5rem' },
                  fontWeight: 900,
                  mb: 3,
                  lineHeight: 1,
                  color: '#00ff88',
                  textShadow: '0 0 80px rgba(0, 255, 136, 0.3)',
                }}
              >
                MarketMatch
              </Typography>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 5,
                    maxWidth: '900px',
                    mx: 'auto',
                    lineHeight: 1.6,
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                    fontWeight: 400,
                  }}
                >
                  Create optimized portfolios that  <br />  track the S&P 500 and TSX 60 indices.
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    to="/optimize"
                    variant="contained"
                    endIcon={<ArrowForward />}
                    sx={{
                      fontSize: { xs: '1rem', md: '1.2rem' },
                      padding: { xs: '14px 36px', md: '18px 54px' },
                      background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
                      color: '#000000',
                      fontWeight: 700,
                      borderRadius: '50px',
                      boxShadow: '0 10px 30px rgba(0, 255, 136, 0.4)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4dffa6 0%, #00ff88 100%)',
                        boxShadow: '0 15px 40px rgba(0, 255, 136, 0.6)',
                        transform: 'translateY(-3px) scale(1.05)',
                      },
                    }}
                  >
                    Let's Start
                  </Button>
                  <Button
                    onClick={handleScrollToHow}
                    variant="outlined"
                    sx={{
                      fontSize: { xs: '1rem', md: '1.2rem' },
                      padding: { xs: '14px 36px', md: '18px 54px' },
                      background: 'transparent',
                      color: '#ffffff',
                      fontWeight: 700,
                      borderRadius: '50px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                        transform: 'translateY(-3px)',
                      },
                    }}
                  >
                    See How It Works
                  </Button>
                </Box>
              </motion.div>


              {/* Animated Stats Row */}
              {marketData && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Grid container spacing={3} sx={{ mt: 8, maxWidth: '900px', mx: 'auto' }}>
                    {[
                      { label: 'S&P 500', value: `${marketData.performance?.sp500_return?.toFixed(2)}%`, color: '#00ff88' },
                      { label: 'TSX 60', value: `${marketData.performance?.tsx_return?.toFixed(2)}%`, color: '#00ccff' },
                      { label: 'Correlation', value: '98%+', color: '#ffaa00' },
                    ].map((stat, index) => (
                      <Grid item xs={12} sm={4} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                        >
                          <Box 
                            className="glass-effect"
                            sx={{ 
                              p: 3,
                              borderRadius: 4,
                              textAlign: 'center',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: `0 20px 40px ${stat.color}30`,
                              },
                            }}
                          >
                            <Typography 
                              variant="h3" 
                              sx={{ 
                                fontWeight: 800,
                                color: stat.color,
                                textShadow: `0 0 20px ${stat.color}60`,
                                mb: 1,
                              }}
                            >
                              {stat.value}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              {stat.label}
                            </Typography>
                          </Box>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              )}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Rest of Dashboard Content */}
      <Container maxWidth="xl" sx={{ py: 8, position: 'relative', zIndex: 2 }}>
        {/* Loading State */}
        {loading && (
          <Zoom in={loading} timeout={500}>
            <Box sx={{ mb: 4 }}>
              <Card className="futuristic-card glass-effect">
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

        {/* Features Grid */}
        <AnimatedSection>
          <Typography 
            variant="h2" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 8,
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Advanced Features
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card 
                    className="futuristic-card glass-effect"
                    sx={{ 
                      height: '100%',
                    }}
                  >
                    <CardContent sx={{ p: 5, textAlign: 'center', height: '100%' }}>
                      <Box 
                        sx={{ 
                          mb: 3,
                          '& svg': {
                            color: feature.color,
                            filter: `drop-shadow(0 0 12px ${feature.color}70)`,
                            animation: 'float 4s ease-in-out infinite',
                            animationDelay: `${index * 0.5}s`,
                          },
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography 
                        variant="h4" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 700,
                          color: feature.color,
                          mb: 3,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </AnimatedSection>

        {/* Key Benefits */}
        <AnimatedSection>
          <Card 
            className="futuristic-card glass-effect"
            sx={{ mt: 10, mb: 8 }}
          >
            <CardContent sx={{ p: 6 }}>
              <Typography 
                variant="h3" 
                gutterBottom
                sx={{ 
                  textAlign: 'center',
                  mb: 6,
                  fontWeight: 700,
                  color: 'primary.main',
                }}
              >
                Key Benefits
              </Typography>
              <Grid container spacing={4}>
                {benefits.map((benefit, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Box 
                        className="glass-effect"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          p: 3,
                          borderRadius: 3,
                          border: '1px solid rgba(0, 255, 136, 0.15)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'rgba(0, 255, 136, 0.1)',
                            borderColor: 'rgba(0, 255, 136, 0.4)',
                            transform: 'translateX(10px)',
                          },
                        }}
                      >
                        <Box sx={{ mr: 3, color: 'primary.main' }}>
                          {benefit.icon}
                        </Box>
                        <Box>
                          <Chip
                            label={benefit.label}
                            color={benefit.color}
                            variant="outlined"
                            sx={{ 
                              mb: 1,
                              fontWeight: 700,
                              fontSize: '0.95rem',
                            }}
                          />
                          <Typography 
                            variant="body1" 
                            color="text.secondary"
                            sx={{ lineHeight: 1.7, fontSize: '1.05rem' }}
                          >
                            {benefit.description}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Getting Started */}
        <AnimatedSection>
          <Card 
            className="futuristic-card"
            sx={{
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.08) 0%, rgba(0, 204, 106, 0.03) 100%)',
              border: '2px solid rgba(0, 255, 136, 0.3)',
            }}
          >
            <CardContent sx={{ p: 6 }}>
              <Typography 
                variant="h3" 
                gutterBottom
                className="gradient-text-animated"
                sx={{ textAlign: 'center', mb: 6, fontWeight: 700 }}
              >
                Getting Started
              </Typography>
              <Grid container spacing={4}>
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
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Box 
                        className="glass-effect"
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          p: 4,
                          borderRadius: 3,
                          border: '1px solid rgba(0, 255, 136, 0.15)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'rgba(0, 255, 136, 0.1)',
                            borderColor: 'rgba(0, 255, 136, 0.4)',
                            transform: 'translateY(-5px)',
                          },
                        }}
                      >
                        <Typography
                          variant="h2"
                          className="gradient-text-animated"
                          sx={{
                            mr: 4,
                            fontWeight: 900,
                            fontSize: '3rem',
                            minWidth: '80px',
                          }}
                        >
                          {item.step}
                        </Typography>
                        <Box>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: 700,
                              color: 'primary.main',
                              mb: 2,
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            color="text.secondary"
                            sx={{ lineHeight: 1.7, fontSize: '1.05rem' }}
                          >
                            {item.description}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* How It Works - About Section */}
        <Box id="how-it-works" sx={{ mt: 12 }}>
          {/* Project Overview */}
          <AnimatedSection>
            <Typography 
              variant="h2" 
              gutterBottom 
              align="center" 
              sx={{ 
                mb: 8,
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              How It Works
            </Typography>

            <Card className="futuristic-card glass-effect" sx={{ mb: 8 }}>
              <CardContent sx={{ p: 6 }}>
                <Typography variant="h6" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 3 }}>
                  MarketMatch is an advanced portfolio optimization system designed to create investment portfolios 
                  that closely track the performance of major market indices, specifically the S&P 500 and TSX 60. 
                  Our system employs a sophisticated multi-factor analysis approach to select and weight stocks 
                  optimally, achieving correlation rates exceeding 98% with target benchmarks.
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  This project was developed as a collaborative team effort, combining expertise in data science, 
                  financial analysis, and software engineering to create a comprehensive solution for portfolio 
                  optimization and market analysis.
                </Typography>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Methodology */}
          <AnimatedSection>
            <Typography 
              variant="h3" 
              gutterBottom 
              align="center" 
              sx={{ 
                mb: 6,
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              Our Methodology
            </Typography>
            
            <Grid container spacing={4} sx={{ mb: 8 }}>
              {methodology.map((method, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card 
                      className="futuristic-card glass-effect"
                      sx={{ 
                        height: '100%',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          borderColor: method.color,
                          boxShadow: `0 0 30px ${method.color}30`,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                        <Box 
                          sx={{ 
                            mb: 3,
                            '& svg': {
                              color: method.color,
                              filter: `drop-shadow(0 0 8px ${method.color}60)`,
                              animation: 'float 3s ease-in-out infinite',
                              animationDelay: `${index * 0.5}s`,
                            },
                          }}
                        >
                          {method.icon}
                        </Box>
                        <Typography 
                          variant="h5" 
                          gutterBottom
                          sx={{ 
                            fontWeight: 600,
                            color: method.color,
                            mb: 2,
                          }}
                        >
                          {method.title}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          color="text.secondary"
                          sx={{ lineHeight: 1.7 }}
                        >
                          {method.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </AnimatedSection>

          {/* Mathematical Foundation */}
          <AnimatedSection>
            <Card 
              className="futuristic-card glass-effect"
              sx={{ 
                mb: 8,
                border: '1px solid rgba(0, 255, 136, 0.2)',
              }}
            >
              <CardContent sx={{ p: 6 }}>
                <Typography 
                  variant="h3" 
                  gutterBottom
                  sx={{ 
                    textAlign: 'center', 
                    mb: 6,
                    fontWeight: 700,
                    color: 'primary.main',
                  }}
                >
                  Mathematical Foundation
                </Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" paragraph sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Tracking Error Formula:
                    </Typography>
                    <Box 
                      sx={{ 
                        background: 'rgba(0, 255, 136, 0.1)',
                        border: '1px solid rgba(0, 255, 136, 0.3)', 
                        p: 3, 
                        borderRadius: 2, 
                        mb: 3,
                        fontFamily: 'monospace',
                      }}
                    >
                      <Typography variant="body1" sx={{ fontFamily: 'inherit', color: 'primary.main' }}>
                        Tracking Error = Standard Deviation of (Portfolio Returns - Benchmark Returns)
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" paragraph sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Overall Rating Calculation:
                    </Typography>
                    <Box 
                      sx={{ 
                        background: 'rgba(0, 255, 136, 0.1)',
                        border: '1px solid rgba(0, 255, 136, 0.3)', 
                        p: 3, 
                        borderRadius: 2, 
                        mb: 3,
                        fontFamily: 'monospace',
                      }}
                    >
                      <Typography variant="body1" sx={{ fontFamily: 'inherit', color: 'primary.main' }}>
                        Rating = (Market Cap × 1.0) + (Returns × 0.001) + (Tracking Error × 0.1)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', textAlign: 'center' }}>
                  This weighted combination ensures that market capitalization has the primary influence, 
                  while returns consistency and tracking error provide fine-tuning for optimal selection.
                </Typography>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Features and Tech Stack */}
          <AnimatedSection>
            <Grid container spacing={4} sx={{ mb: 8 }}>
              <Grid item xs={12} lg={6}>
                <Card 
                  className="futuristic-card glass-effect"
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography 
                      variant="h4" 
                      gutterBottom
                      sx={{ 
                        textAlign: 'center', 
                        mb: 4,
                        fontWeight: 700,
                        color: 'primary.main',
                      }}
                    >
                      Key Features
                    </Typography>
                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                      {keyFeatures.map((feature, index) => (
                        <Box
                          component="li"
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            mb: 2.5,
                            pl: 0,
                            transition: 'all 0.3s ease',
                            borderRadius: 1,
                            p: 2,
                            '&:hover': {
                              background: 'rgba(0, 255, 136, 0.05)',
                              transform: 'translateX(10px)',
                            },
                          }}
                        >
                          <ShowChart sx={{ color: '#00ff88', mr: 2, mt: 0.5 }} />
                          <Typography 
                            variant="body1"
                            sx={{ lineHeight: 1.7, color: 'text.secondary' }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={6}>
                <Card 
                  className="futuristic-card glass-effect"
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography 
                      variant="h4" 
                      gutterBottom
                      sx={{ 
                        textAlign: 'center', 
                        mb: 4,
                        fontWeight: 700,
                        color: 'primary.main',
                      }}
                    >
                      Technology Stack
                    </Typography>
                    {techStack.map((stack, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ mr: 2, color: stack.color }}>
                            {stack.icon}
                          </Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600,
                              color: stack.color,
                            }}
                          >
                            {stack.category}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {stack.technologies.map((tech, techIndex) => (
                            <Chip
                              key={techIndex}
                              label={tech}
                              variant="outlined"
                              size="small"
                              sx={{
                                borderColor: stack.color,
                                color: stack.color,
                                '&:hover': {
                                  background: `${stack.color}20`,
                                  borderColor: stack.color,
                                },
                              }}
                            />
                          ))}
                        </Box>
                        {index < techStack.length - 1 && (
                          <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', my: 2 }} />
                        )}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </AnimatedSection>

          {/* Performance Results */}
          <AnimatedSection>
            <Card 
              className="futuristic-card glass-effect"
              sx={{ 
                mb: 8,
                border: '1px solid rgba(0, 255, 136, 0.3)',
              }}
            >
              <CardContent sx={{ p: 6 }}>
                <Typography 
                  variant="h3" 
                  gutterBottom
                  sx={{ 
                    textAlign: 'center', 
                    mb: 6,
                    fontWeight: 700,
                    color: 'primary.main',
                  }}
                >
                  Performance Results
                </Typography>
                <Grid container spacing={4}>
                  {[
                    {
                      value: '98%+',
                      label: 'Correlation with Market Indices',
                      color: '#00ff88',
                      icon: <Security sx={{ fontSize: 48 }} />
                    },
                    {
                      value: '24',
                      label: 'Optimally Selected Stocks',
                      color: '#00ccff',
                      icon: <Assessment sx={{ fontSize: 48 }} />
                    },
                    {
                      value: '3-Year',
                      label: 'Historical Analysis Period',
                      color: '#ffaa00',
                      icon: <Timeline sx={{ fontSize: 48 }} />
                    },
                  ].map((stat, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <Box 
                          sx={{ 
                            textAlign: 'center',
                            p: 4,
                            borderRadius: 3,
                            background: 'rgba(0, 255, 136, 0.05)',
                            border: '1px solid rgba(0, 255, 136, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(0, 255, 136, 0.1)',
                              borderColor: stat.color,
                              boxShadow: `0 10px 25px ${stat.color}30`,
                              transform: 'translateY(-10px) scale(1.02)',
                            },
                          }}
                        >
                          <Box sx={{ mb: 2, color: stat.color }}>
                            {stat.icon}
                          </Box>
                          <Typography 
                            variant="h2" 
                            sx={{ 
                              fontWeight: 700,
                              color: stat.color,
                              textShadow: `0 0 10px ${stat.color}60`,
                              mb: 1,
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                          >
                            {stat.label}
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </AnimatedSection>
        </Box>
      </Container>
    </Box>
  );
};

// Helper component for animated sections
const AnimatedSection = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default Dashboard; 