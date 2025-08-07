import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const MarketAnalysis = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.MARKET_DATA);
      setMarketData(response.data);
    } catch (err) {
      setError('Failed to fetch market data: ' + (err.response?.data?.error || err.message));
      console.error('Market data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <LinearProgress />
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Loading market analysis data...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  // Prepare chart data
  const chartData = marketData ? Object.keys(marketData.combined_returns).map(date => ({
    date,
    sp500: marketData.sp500_data[date]?.Close || 0,
    tsx: marketData.tsx_data[date]?.Close || 0,
    returns: marketData.combined_returns[date] * 100, // Convert to percentage
  })) : [];

  // Calculate normalized data (relative to first value)
  const normalizedData = chartData.length > 0 ? chartData.map((item, index) => {
    const firstSP500 = chartData[0].sp500;
    const firstTSX = chartData[0].tsx;
    return {
      ...item,
      sp500_normalized: firstSP500 > 0 ? (item.sp500 / firstSP500) : 1,
      tsx_normalized: firstTSX > 0 ? (item.tsx / firstTSX) : 1,
    };
  }) : [];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p><strong>{formatDate(label)}</strong></p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(4)}
              {entry.dataKey === 'returns' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
        Market Analysis
      </Typography>

      {/* Performance Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                S&P 500
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {marketData?.performance?.sp500_return?.toFixed(2)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3-Year Total Return
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                TSX 60
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#f50057' }}>
                {marketData?.performance?.tsx_return?.toFixed(2)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3-Year Total Return
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Combined Average
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {marketData?.performance?.avg_return?.toFixed(2)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3-Year Total Return
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Price Performance" />
          <Tab label="Normalized Performance" />
          <Tab label="Monthly Returns" />
        </Tabs>
      </Paper>

      {/* Charts */}
      <Card>
        <CardContent>
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom align="center">
                S&P 500 and TSX 60 Price Performance (2021-2024)
              </Typography>
              <ResponsiveContainer width="100%" height={500}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sp500"
                    stroke="#1976d2"
                    strokeWidth={2}
                    name="S&P 500"
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="tsx"
                    stroke="#f50057"
                    strokeWidth={2}
                    name="TSX 60"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom align="center">
                Normalized Performance Comparison (Base = 1.0)
              </Typography>
              <ResponsiveContainer width="100%" height={500}>
                <AreaChart data={normalizedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="sp500_normalized"
                    stackId="1"
                    stroke="#1976d2"
                    fill="#1976d2"
                    fillOpacity={0.3}
                    name="S&P 500 (Normalized)"
                  />
                  <Area
                    type="monotone"
                    dataKey="tsx_normalized"
                    stackId="2"
                    stroke="#f50057"
                    fill="#f50057"
                    fillOpacity={0.3}
                    name="TSX 60 (Normalized)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom align="center">
                Combined Monthly Returns (%)
              </Typography>
              <ResponsiveContainer width="100%" height={500}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="returns"
                    stroke="#ff9800"
                    fill="#ff9800"
                    fillOpacity={0.6}
                    name="Combined Returns (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Analysis Insights */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Insights
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Market Correlation:</strong> The S&P 500 and TSX 60 indices show strong correlation 
                in their price movements, indicating interconnected North American markets.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Performance Trends:</strong> Both indices experienced similar market cycles, 
                including the recovery period and subsequent growth phases.
              </Typography>
              <Typography variant="body2">
                <strong>Portfolio Strategy:</strong> This correlation justifies using a combined approach 
                to track both indices simultaneously for optimal portfolio performance.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Investment Implications
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Diversification:</strong> Including both US and Canadian markets provides 
                geographical diversification while maintaining correlation benefits.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Risk Management:</strong> The similar volatility patterns help in creating 
                stable portfolios that track market performance effectively.
              </Typography>
              <Typography variant="body2">
                <strong>Long-term Growth:</strong> The 3-year performance demonstrates the potential 
                for sustained growth through market cycle optimization.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MarketAnalysis; 