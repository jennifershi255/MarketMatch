import React, { useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import {
  CloudUpload,
  PlayArrow,
  Download,
  Assessment,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import PortfolioChart from '../components/PortfolioChart';
import { API_ENDPOINTS } from '../config/api';

const PortfolioOptimizer = () => {
  const [tickers, setTickers] = useState([]);
  const [numStocks, setNumStocks] = useState(24);
  const [budget, setBudget] = useState(1000000);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await axios.post(API_ENDPOINTS.UPLOAD_CSV, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setTickers(response.data.tickers);
        setError(null);
      } catch (err) {
        setError('Failed to upload file: ' + (err.response?.data?.error || err.message));
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const handleOptimize = async () => {
    if (tickers.length === 0) {
      setError('Please upload a CSV file with stock tickers first');
      return;
    }

    setLoading(true);
    setError(null);
    
    console.log('🚀 Starting optimization...');
    console.log('API URL:', API_ENDPOINTS.OPTIMIZE_PORTFOLIO);
    console.log('Request data:', { tickers: tickers.slice(0, 5), num_stocks: numStocks, budget });
    
    try {
      // First test CORS with a simple request
      console.log('🧪 Testing CORS connection...');
      const testResponse = await axios.post(API_ENDPOINTS.TEST_CORS || `${API_ENDPOINTS.OPTIMIZE_PORTFOLIO.replace('/optimize-portfolio', '/test-cors')}`, {
        test: true
      }, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('✅ CORS test successful:', testResponse.data);
      
      // Now do the actual optimization
      console.log('🚀 Starting actual optimization...');
      const response = await axios.post(API_ENDPOINTS.OPTIMIZE_PORTFOLIO, {
        tickers: tickers, // Use all tickers
        num_stocks: parseInt(numStocks),
        budget: parseFloat(budget),
      }, {
        timeout: 180000, // 3 minute timeout for larger datasets
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('✅ Optimization successful:', response.data);
      setResults(response.data);
    } catch (err) {
      console.error('❌ Optimization error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config?.url
      });
      
      let errorMessage = 'Optimization failed: ';
      if (err.code === 'NETWORK_ERROR' || err.message === 'Network Error') {
        errorMessage += 'Cannot connect to server. Please check if the backend is running.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage += 'Request timeout. The operation is taking too long.';
      } else {
        errorMessage += (err.response?.data?.error || err.message);
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    // Sample tickers based on the original notebook
    const sampleTickers = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'JNJ', 'V',
      'PG', 'UNH', 'HD', 'MA', 'BAC', 'ADBE', 'CRM', 'NFLX', 'DIS', 'CSCO',
      'PEP', 'TMO', 'ACN', 'LLY', 'ABBV', 'CVX', 'KO', 'MRK', 'COST', 'DHR',
      'RY.TO', 'TD.TO', 'CNR.TO', 'SU.TO', 'ENB.TO', 'CPX.TO', 'TRI.TO'
    ];
    setTickers(sampleTickers);
    setError(null);
  };

  const exportResults = () => {
    if (!results) return;
    
    const csvContent = [
      ['Ticker', 'Shares', 'Price', 'Value', 'Weight'],
      ...results.portfolio.map(stock => [
        stock.Ticker,
        stock.Shares,
        stock.Price,
        stock.Value,
        stock.Weight.toFixed(2) + '%'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized_portfolio.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
        Portfolio Optimizer
      </Typography>

      <Grid container spacing={3}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Stock Tickers
              </Typography>
              
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed #1976d2',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDragActive ? '#f5f5f5' : 'transparent',
                  transition: 'background-color 0.2s',
                  mb: 2,
                }}
              >
                <input {...getInputProps()} />
                <CloudUpload sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                <Typography variant="body1">
                  {isDragActive
                    ? 'Drop the CSV file here...'
                    : 'Drag & drop a CSV file here, or click to select'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CSV should contain stock tickers in the first column
                </Typography>
              </Box>

              <Button
                variant="outlined"
                onClick={loadSampleData}
                fullWidth
                sx={{ mb: 2 }}
              >
                Load Sample Data
              </Button>

              {tickers.length > 0 && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Loaded {tickers.length} stock tickers
                </Alert>
              )}

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Parameters
              </Typography>
              
              <TextField
                label="Number of Stocks"
                type="number"
                value={numStocks}
                onChange={(e) => setNumStocks(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                inputProps={{ min: 1, max: 50 }}
              />
              
              <TextField
                label="Budget (CAD)"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                inputProps={{ min: 1000 }}
              />

              <Button
                variant="contained"
                onClick={handleOptimize}
                disabled={loading || tickers.length === 0}
                startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
                fullWidth
                size="large"
              >
                {loading ? 'Optimizing...' : 'Optimize Portfolio'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {results && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Portfolio Summary
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={exportResults}
                    size="small"
                  >
                    Export
                  </Button>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="primary">
                        ${results.summary?.final_value?.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Final Value
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="primary">
                        {results.summary?.portfolio_return?.toFixed(4)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Portfolio Return
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="primary">
                        {results.summary?.num_stocks}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stocks Selected
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="primary">
                        ${results.summary?.total_fees?.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Fees
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Filtering Results:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    label={`${results.filtering_results?.total_filtered} Accepted`}
                    color="success"
                    size="small"
                  />
                  <Chip
                    label={`${results.filtering_results?.total_removed} Removed`}
                    color="error"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Portfolio Table */}
        {results && results.portfolio && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Optimized Portfolio
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell><strong>Ticker</strong></TableCell>
                        <TableCell align="right"><strong>Price (CAD)</strong></TableCell>
                        <TableCell align="right"><strong>Shares</strong></TableCell>
                        <TableCell align="right"><strong>Value (CAD)</strong></TableCell>
                        <TableCell align="right"><strong>Weight (%)</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.portfolio.map((stock, index) => (
                        <TableRow key={index} hover>
                          <TableCell component="th" scope="row">
                            <strong>{stock.Ticker}</strong>
                          </TableCell>
                          <TableCell align="right">${stock.Price.toFixed(2)}</TableCell>
                          <TableCell align="right">{stock.Shares.toFixed(2)}</TableCell>
                          <TableCell align="right">${stock.Value.toLocaleString()}</TableCell>
                          <TableCell align="right">{stock.Weight.toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Portfolio Visualization */}
        {results && results.portfolio && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Portfolio Allocation
                </Typography>
                <PortfolioChart data={results.portfolio} />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default PortfolioOptimizer; 