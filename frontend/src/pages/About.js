import React from 'react';
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
} from '@mui/icons-material';

const About = () => {
  const teamMembers = [
    { name: 'Jack', role: 'Data Analysis & Algorithm Development' },
    { name: 'Jennifer', role: 'Portfolio Optimization & Risk Management' },
    { name: 'Justus', role: 'Market Research & Validation' },
    { name: 'Precious', role: 'Performance Analysis & Testing' },
  ];

  const methodology = [
    {
      title: 'Market Capitalization Weighting',
      description: 'Stocks with higher market capitalization receive more weight, reflecting their influence on market indices like the S&P 500 and TSX 60.',
      icon: <TrendingUp sx={{ color: '#1976d2' }} />,
    },
    {
      title: 'Returns Difference Analysis',
      description: 'Measures how closely individual stock returns align with market average returns to ensure consistency and reliability.',
      icon: <Assessment sx={{ color: '#1976d2' }} />,
    },
    {
      title: 'Tracking Error Optimization',
      description: 'Calculates the standard deviation of (Portfolio Return - Benchmark Return) to minimize risk and ensure stable performance.',
      icon: <Timeline sx={{ color: '#1976d2' }} />,
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
    { category: 'Backend', technologies: ['Python', 'Flask', 'pandas', 'numpy', 'yfinance'] },
    { category: 'Frontend', technologies: ['React', 'Material-UI', 'Recharts', 'Axios'] },
    { category: 'Data', technologies: ['Yahoo Finance API', 'CSV Processing', 'Real-time Market Data'] },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4, color: '#1976d2' }}>
        About MarketMatch
      </Typography>

      {/* Project Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Project Overview
          </Typography>
          <Typography variant="body1" paragraph>
            MarketMatch is an advanced portfolio optimization system designed to create investment portfolios 
            that closely track the performance of major market indices, specifically the S&P 500 and TSX 60. 
            Our system employs a sophisticated multi-factor analysis approach to select and weight stocks 
            optimally, achieving correlation rates exceeding 98% with target benchmarks.
          </Typography>
          <Typography variant="body1" paragraph>
            This project was developed as a collaborative team effort, combining expertise in data science, 
            financial analysis, and software engineering to create a comprehensive solution for portfolio 
            optimization and market analysis.
          </Typography>
        </CardContent>
      </Card>

      {/* Methodology */}
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
        Our Methodology
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {methodology.map((method, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>{method.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {method.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {method.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Mathematical Foundation */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Mathematical Foundation
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Tracking Error Formula:</strong>
          </Typography>
          <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
              Tracking Error = Standard Deviation of (Portfolio Returns - Benchmark Returns)
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            <strong>Overall Rating Calculation:</strong>
          </Typography>
          <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
              Rating = (Market Cap Score × 1.0) + (Returns Score × 0.001) + (Tracking Error Score × 0.1)
            </Typography>
          </Box>
          <Typography variant="body1">
            This weighted combination ensures that market capitalization has the primary influence, 
            while returns consistency and tracking error provide fine-tuning for optimal selection.
          </Typography>
        </CardContent>
      </Card>

      {/* Team Information */}
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
        Our Team
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, backgroundColor: '#1976d2' }}>
                  {member.name.charAt(0)}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.role}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Key Features */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Key Features
              </Typography>
              <List>
                {features.map((feature, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon>
                      <ShowChart sx={{ color: '#1976d2' }} />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Technical Stack */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Technology Stack
              </Typography>
              {techStack.map((stack, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {stack.category}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {stack.technologies.map((tech, techIndex) => (
                      <Chip
                        key={techIndex}
                        label={tech}
                        variant="outlined"
                        size="small"
                        color="primary"
                      />
                    ))}
                  </Box>
                  {index < techStack.length - 1 && <Divider />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Results */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Performance Results
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                  98%+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correlation with Market Indices
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                  24
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Optimally Selected Stocks
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                  3-Year
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Historical Analysis Period
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* AI Usage Disclosure */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            AI Usage Disclosure
          </Typography>
          <Typography variant="body1" paragraph>
            In accordance with academic integrity guidelines, we disclose our use of AI assistance in the following areas:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Code sx={{ color: '#1976d2' }} />
              </ListItemIcon>
              <ListItemText primary="Code Debugging: Identifying and resolving issues in functions such as calculate_shares, calculate_value, and build_portfolio." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DataUsage sx={{ color: '#1976d2' }} />
              </ListItemIcon>
              <ListItemText primary="Code Optimization: Rewriting existing code for better readability and performance while ensuring adherence to assignment requirements." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Assessment sx={{ color: '#1976d2' }} />
              </ListItemIcon>
              <ListItemText primary="CSV Export Functionality: Providing code to export specific DataFrames to CSV files as required." />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default About; 