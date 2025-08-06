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
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  FilterList,
  ShowChart,
} from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await axios.get('/api/market-data');
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
      icon: <FilterList sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Stock Filtering',
      description: 'Automatically filters stocks based on currency (USD/CAD), volume, and listing status.',
    },
    {
      icon: <Assessment sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Weight Optimization',
      description: 'Uses market cap, returns, and tracking error to optimize portfolio weights.',
    },
    {
      icon: <ShowChart sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Data Visualization',
      description: 'Provides intuitive charts showing portfolio performance vs market indices.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Market Tracking',
      description: 'Tracks S&P 500 and TSX 60 indices with high correlation accuracy.',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Welcome to MarketMatch
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Create optimized portfolios that track the S&P 500 and TSX 60 indices
        </Typography>
      </Box>

      {/* Market Data Overview */}
      {loading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Loading market data...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {marketData && (
        <Card sx={{ mb: 4, background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)' }}>
          <CardContent sx={{ color: 'white' }}>
            <Typography variant="h5" gutterBottom>
              Market Performance Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography variant="h6">S&P 500</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {marketData.performance?.sp500_return?.toFixed(2)}%
                  </Typography>
                  <Typography variant="body2">3-Year Return</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography variant="h6">TSX 60</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {marketData.performance?.tsx_return?.toFixed(2)}%
                  </Typography>
                  <Typography variant="body2">3-Year Return</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography variant="h6">Average</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {marketData.performance?.avg_return?.toFixed(2)}%
                  </Typography>
                  <Typography variant="body2">3-Year Return</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Features Grid */}
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
        Features
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Key Benefits */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Why Choose MarketMatch?
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  label="High Correlation"
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 2 }}
                />
                <Typography variant="body2">
                  Achieves 98%+ correlation with market indices
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  label="Risk Management"
                  color="secondary"
                  variant="outlined"
                  sx={{ mr: 2 }}
                />
                <Typography variant="body2">
                  Uses tracking error to minimize portfolio risk
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  label="Automated Filtering"
                  color="success"
                  variant="outlined"
                  sx={{ mr: 2 }}
                />
                <Typography variant="body2">
                  Removes delisted and low-volume stocks automatically
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  label="Multi-Factor Analysis"
                  color="warning"
                  variant="outlined"
                  sx={{ mr: 2 }}
                />
                <Typography variant="body2">
                  Considers market cap, returns, and tracking error
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Getting Started
          </Typography>
          <Typography variant="body1" paragraph>
            1. Navigate to the <strong>Portfolio Optimizer</strong> to upload your stock tickers or use our sample data.
          </Typography>
          <Typography variant="body1" paragraph>
            2. Configure your portfolio parameters (number of stocks, budget).
          </Typography>
          <Typography variant="body1" paragraph>
            3. Review the optimized portfolio and performance metrics.
          </Typography>
          <Typography variant="body1">
            4. Analyze market trends in the <strong>Market Analysis</strong> section.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard; 