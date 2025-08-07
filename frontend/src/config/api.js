// API Configuration
let API_BASE_URL;

// Detect if we're on the deployed Vercel domain
if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
  // Force production URL for Vercel deployments
  API_BASE_URL = 'https://marketmatch-033i.onrender.com';
  console.log('Detected Vercel deployment, using production API:', API_BASE_URL);
} else {
  // Use environment variable or localhost for development
  API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  console.log('Using environment/local API:', API_BASE_URL);
}

// Debug logging
console.log('Final API Configuration:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('API_BASE_URL:', API_BASE_URL);

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/health`,
  MARKET_DATA: `${API_BASE_URL}/api/market-data`,
  FILTER_STOCKS: `${API_BASE_URL}/api/filter-stocks`,
  RATE_STOCKS: `${API_BASE_URL}/api/rate-stocks`,
  OPTIMIZE_PORTFOLIO: `${API_BASE_URL}/api/optimize-portfolio`,
  UPLOAD_CSV: `${API_BASE_URL}/api/upload-csv`,
};

export default API_BASE_URL; 