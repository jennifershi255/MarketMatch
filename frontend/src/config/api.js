// API Configuration
let API_BASE_URL;

// Detect deployment environment
const isRenderDeployment = typeof window !== 'undefined' && (
  window.location.hostname.includes('onrender.com') ||
  window.location.hostname.includes('.onrender.com')
);

const isVercelDeployment = typeof window !== 'undefined' && (
  window.location.hostname.includes('vercel.app') ||
  window.location.hostname.includes('.vercel.app')
);

if (isRenderDeployment) {
  // On Render: Frontend and backend are served from the same origin
  // Use relative URLs (no hostname needed)
  API_BASE_URL = '';
  console.log('🚀 Detected Render deployment, using same-origin API (relative URLs)');
} else if (isVercelDeployment) {
  // On Vercel: Use production Render backend URL
  API_BASE_URL = 'https://marketmatch-033i.onrender.com';
  console.log('🚀 Detected Vercel deployment, using production API:', API_BASE_URL);
} else {
  // Local development: Use localhost
  API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  console.log('🚀 Using local development API:', API_BASE_URL);
}

// Debug logging
console.log('API Configuration:');
console.log('  Environment:', process.env.NODE_ENV);
console.log('  Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'N/A');
console.log('  API Base URL:', API_BASE_URL || '(same origin)');

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/health`,
  MARKET_DATA: `${API_BASE_URL}/api/market-data`,
  FILTER_STOCKS: `${API_BASE_URL}/api/filter-stocks`,
  RATE_STOCKS: `${API_BASE_URL}/api/rate-stocks`,
  OPTIMIZE_PORTFOLIO: `${API_BASE_URL}/api/optimize-portfolio`,
  UPLOAD_CSV: `${API_BASE_URL}/api/upload-csv`,
  TEST_CORS: `${API_BASE_URL}/api/test-cors`,
};

export default API_BASE_URL; 