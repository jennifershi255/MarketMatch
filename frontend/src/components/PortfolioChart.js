import React, { useState, useEffect } from 'react';
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
import { Box, Grid, Typography, Card, CardContent, Fade } from '@mui/material';

const COLORS = [
  '#00ff88', '#00ccff', '#ffaa00', '#ff4444', '#8c5cf6', 
  '#06d6a0', '#f72585', '#4cc9f0', '#7209b7', '#fb8500',
  '#219ebc', '#8ecae6', '#023047', '#ffb3c6', '#90e0ef',
  '#00f5ff', '#bde0ff', '#ffc2d1', '#fffffc', '#f72585',
  '#560bad', '#480ca8', '#3a0ca3', '#3f37c9', '#4361ee'
];

const PortfolioChart = ({ data }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!data || data.length === 0) {
    return (
      <Fade in={true} timeout={500}>
        <Card className="futuristic-card">
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" className="neon-text" sx={{ mb: 2 }}>
              No Portfolio Data
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Upload your portfolio data to see interactive visualizations
            </Typography>
          </CardContent>
        </Card>
      </Fade>
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
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1e1e2e 0%, #1a1a24 100%)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 10px 25px rgba(0, 255, 136, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="subtitle2" className="neon-text" sx={{ mb: 1 }}>
            {data.ticker}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Weight: <span style={{ color: '#00ff88' }}>{data.weight}%</span>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Value: <span style={{ color: '#00ff88' }}>${data.value.toLocaleString()}</span>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Shares: <span style={{ color: '#00ff88' }}>{data.shares}</span>
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const renderBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1e1e2e 0%, #1a1a24 100%)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 10px 25px rgba(0, 255, 136, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="subtitle2" className="neon-text" sx={{ mb: 1 }}>
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Weight: <span style={{ color: '#00ff88' }}>{payload[0].value}%</span>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Value: <span style={{ color: '#00ff88' }}>${data.value.toLocaleString()}</span>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: <span style={{ color: '#00ff88' }}>${data.price}</span>
          </Typography>
        </Box>
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

  const stats = [
    {
      label: 'Total Holdings',
      value: data.length,
      color: '#00ff88',
    },
    {
      label: 'Largest Position',
      value: `${Math.max(...chartData.map(d => d.weight)).toFixed(2)}%`,
      color: '#00ccff',
    },
    {
      label: 'Smallest Position',
      value: `${Math.min(...chartData.map(d => d.weight)).toFixed(2)}%`,
      color: '#ffaa00',
    },
    {
      label: 'Average Weight',
      value: `${(chartData.reduce((sum, d) => sum + d.weight, 0) / chartData.length).toFixed(2)}%`,
      color: '#ff4444',
    },
  ];

  return (
    <Fade in={mounted} timeout={1000}>
      <Grid container spacing={4}>
        {/* Pie Chart */}
        <Grid item xs={12} lg={6}>
          <Card className="futuristic-card animate-slide-left">
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                align="center"
                className="neon-text"
                sx={{ mb: 3 }}
              >
                Portfolio Weight Distribution
              </Typography>
              <Box sx={{ height: 400, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.weight > 3 ? `${entry.ticker}` : ''}
                      outerRadius={130}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="weight"
                      stroke="rgba(0, 255, 136, 0.3)"
                      strokeWidth={1}
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          filter="url(#glow)"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={renderPieTooltip} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} lg={6}>
          <Card className="futuristic-card animate-slide-right">
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                align="center"
                className="neon-text"
                sx={{ mb: 3 }}
              >
                Top Holdings by Weight
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sortedData.slice(0, 10)} // Show top 10 holdings
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00ff88" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#00cc6a" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="rgba(255, 255, 255, 0.1)"
                    />
                    <XAxis 
                      dataKey="ticker" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fill: '#b3b3cc', fontSize: 12 }}
                      axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                    />
                    <YAxis 
                      label={{ 
                        value: 'Weight (%)', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle', fill: '#b3b3cc' }
                      }}
                      tick={{ fill: '#b3b3cc', fontSize: 12 }}
                      axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                    />
                    <Tooltip content={renderBarTooltip} />
                    <Bar 
                      dataKey="weight" 
                      fill="url(#barGradient)"
                      stroke="#00ff88"
                      strokeWidth={1}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Statistics */}
        <Grid item xs={12}>
          <Card className="futuristic-card animate-slide-up delay-300">
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom
                className="neon-text"
                sx={{ textAlign: 'center', mb: 4 }}
              >
                Portfolio Statistics
              </Typography>
              <Grid container spacing={3}>
                {stats.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box 
                      className={`animate-slide-up delay-${(index + 4) * 100} animate-float`}
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
                      <Typography 
                        variant="h3" 
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
                        variant="body2" 
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
        </Grid>
      </Grid>
    </Fade>
  );
};

export default PortfolioChart; 