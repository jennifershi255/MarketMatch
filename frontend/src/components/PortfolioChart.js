import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Grid, Typography } from '@mui/material';

const COLORS = [
  '#1976d2', '#f50057', '#ff9800', '#4caf50', '#9c27b0', 
  '#00bcd4', '#8bc34a', '#ff5722', '#607d8b', '#e91e63',
  '#3f51b5', '#009688', '#cddc39', '#ff6f00', '#795548',
  '#2196f3', '#f44336', '#ffeb3b', '#673ab7', '#ffc107',
  '#d32f2f', '#388e3c', '#1976d2', '#7b1fa2', '#0097a7'
];

const PortfolioChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="text.secondary">
          No portfolio data to display
        </Typography>
      </Box>
    );
  }

  // Prepare data for charts
  const chartData = data.map((stock, index) => ({
    ticker: stock.Ticker,
    weight: parseFloat(stock.Weight.toFixed(2)),
    value: stock.Value,
    shares: stock.Shares,
    price: stock.Price,
    color: COLORS[index % COLORS.length],
  }));

  // Sort by weight for better visualization
  const sortedData = [...chartData].sort((a, b) => b.weight - a.weight);

  // Custom tooltip for pie chart
  const renderPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p><strong>{data.ticker}</strong></p>
          <p>Weight: {data.weight}%</p>
          <p>Value: ${data.value.toLocaleString()}</p>
          <p>Shares: {data.shares}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const renderBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p><strong>{label}</strong></p>
          <p>Weight: {payload[0].value}%</p>
          <p>Value: ${data.value.toLocaleString()}</p>
          <p>Price: ${data.price}</p>
        </div>
      );
    }
    return null;
  };

  // Custom label for pie chart
  const renderLabel = ({ weight, ticker }) => {
    if (weight > 3) { // Only show labels for weights > 3%
      return `${ticker} (${weight}%)`;
    }
    return '';
  };

  return (
    <Grid container spacing={3}>
      {/* Pie Chart */}
      <Grid item xs={12} md={6}>
        <Box>
          <Typography variant="h6" gutterBottom align="center">
            Portfolio Weight Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="weight"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={renderPieTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Grid>

      {/* Bar Chart */}
      <Grid item xs={12} md={6}>
        <Box>
          <Typography variant="h6" gutterBottom align="center">
            Top Holdings by Weight
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={sortedData.slice(0, 10)} // Show top 10 holdings
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="ticker" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis 
                label={{ value: 'Weight (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={renderBarTooltip} />
              <Bar dataKey="weight" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Grid>

      {/* Summary Statistics */}
      <Grid item xs={12}>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Portfolio Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center" sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h6" color="primary">
                  {data.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Holdings
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center" sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h6" color="primary">
                  {Math.max(...chartData.map(d => d.weight)).toFixed(2)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Largest Position
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center" sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h6" color="primary">
                  {Math.min(...chartData.map(d => d.weight)).toFixed(2)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Smallest Position
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center" sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h6" color="primary">
                  {(chartData.reduce((sum, d) => sum + d.weight, 0) / chartData.length).toFixed(2)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Weight
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PortfolioChart; 