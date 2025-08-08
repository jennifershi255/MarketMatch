// API Configuration - Updated for deployment fix
let API_BASE_URL;

// Detect if we're on any Vercel domain (production or preview)
const isVercelDeployment = typeof window !== 'undefined' && (
  window.location.hostname.includes('vercel.app') ||
  window.location.hostname.includes('.vercel.app') ||
  window.location.hostname === 'market-match-app.vercel.app' ||
  window.location.hostname.includes('jennifers-projects-371c99ef.vercel.app')
);

if (isVercelDeployment) {
  // Force production URL for all Vercel deployments
  API_BASE_URL = 'https://marketmatch-033i.onrender.com';
  console.log('Detected Vercel deployment, using production API:', API_BASE_URL);
  console.log('Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'N/A');
} else {
  // Use environment variable or localhost for development
  API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
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