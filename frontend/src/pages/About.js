import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  Assessment,
  Timeline,
  School,
  Code,
  DataUsage,
  ShowChart,
  Rocket,
  Speed,
  Security,
  AutoGraph,
} from '@mui/icons-material';

const About = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const teamMembers = [
    { 
      name: 'Jack', 
      role: 'Data Analysis & Algorithm Development',
      color: '#00ff88',
      icon: <DataUsage />
    },
    { 
      name: 'Jennifer', 
      role: 'Portfolio Optimization & Risk Management',
      color: '#00ccff',
      icon: <Assessment />
    },
    { 
      name: 'Justus', 
      role: 'Market Research & Validation',
      color: '#ffaa00',
      icon: <TrendingUp />
    },
    { 
      name: 'Precious', 
      role: 'Performance Analysis & Testing',
      color: '#ff4444',
      icon: <ShowChart />
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

  const features = [
    'Automated stock filtering based on currency (USD/CAD), volume, and listing status',
    'Multi-factor rating system combining market cap, returns, and tracking error',
    'Weight optimization with minimum and maximum position limits (2.1% - 15%)',
    'Real-time data integration using Yahoo Finance API',
    'Performance tracking with 98%+ correlation to market indices',
    'Portfolio export functionality for easy implementation',
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

  const performanceStats = [
    {
      value: '98%+',
      label: 'Correlation with Market Indices',
      color: '#00ff88',
      icon: <Security />
    },
    {
      value: '24',
      label: 'Optimally Selected Stocks',
      color: '#00ccff',
      icon: <Assessment />
    },
    {
      value: '3-Year',
      label: 'Historical Analysis Period',
      color: '#ffaa00',
      icon: <Timeline />
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
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #00ff88 0%, #00ccff 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
            }}
          >
            About MarketMatch
          </Typography>
        </Box>
      </Fade>

      {/* Project Overview */}
      <Card className="futuristic-card animate-slide-up delay-200" sx={{ mb: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            gutterBottom
            className="neon-text"
            sx={{ textAlign: 'center', mb: 4 }}
          >
            Project Overview
          </Typography>
          <Typography variant="h6" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
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

      {/* Methodology */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          gutterBottom 
          align="center" 
          className="animate-slide-up delay-300"
          sx={{ 
            mb: 5,
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          Our Methodology
        </Typography>
        
        <Grid container spacing={4}>
          {methodology.map((method, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                className={`futuristic-card animate-slide-up delay-${(index + 4) * 100}`}
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
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mathematical Foundation */}
      <Card 
        className="futuristic-card animate-slide-up delay-700"
        sx={{ 
          mb: 6,
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
                  fontFamily: 'JetBrains Mono, monospace',
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
                  fontFamily: 'JetBrains Mono, monospace',
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

      {/* Features and Tech Stack */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} lg={6}>
          <Card 
            className="futuristic-card animate-slide-left delay-1300"
            sx={{ height: '100%' }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h4" 
                gutterBottom
                className="neon-text"
                sx={{ textAlign: 'center', mb: 4 }}
              >
                Key Features
              </Typography>
              <List>
                {features.map((feature, index) => (
                  <ListItem 
                    key={index} 
                    sx={{ 
                      pl: 0,
                      transition: 'all 0.3s ease',
                      borderRadius: 1,
                      '&:hover': {
                        background: 'rgba(0, 255, 136, 0.05)',
                        transform: 'translateX(10px)',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <ShowChart sx={{ color: '#00ff88' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature}
                      primaryTypographyProps={{
                        sx: { lineHeight: 1.6, color: 'text.secondary' }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card 
            className="futuristic-card animate-slide-right delay-1300"
            sx={{ height: '100%' }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h4" 
                gutterBottom
                className="neon-text"
                sx={{ textAlign: 'center', mb: 4 }}
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
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Results */}
      <Card 
        className="futuristic-card animate-slide-up delay-1600"
        sx={{ 
          mb: 6,
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 204, 106, 0.05) 100%)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            gutterBottom
            className="neon-text"
            sx={{ textAlign: 'center', mb: 4 }}
          >
            Performance Results
          </Typography>
          <Grid container spacing={4}>
            {performanceStats.map((stat, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box 
                  className={`animate-slide-up delay-${(index + 17) * 100} animate-float`}
                  sx={{ 
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 2,
                    background: 'rgba(0, 255, 136, 0.05)',
                    border: '1px solid rgba(0, 255, 136, 0.1)',
                    transition: 'all 0.3s ease',
                    animationDelay: `${index * 0.5}s`,
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
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default About; 