// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/health`,
  MARKET_DATA: `${API_BASE_URL}/api/market-data`,
  FILTER_STOCKS: `${API_BASE_URL}/api/filter-stocks`,
  RATE_STOCKS: `${API_BASE_URL}/api/rate-stocks`,
  OPTIMIZE_PORTFOLIO: `${API_BASE_URL}/api/optimize-portfolio`,
  UPLOAD_CSV: `${API_BASE_URL}/api/upload-csv`,
};

export default API_BASE_URL; 