# MarketMatch - Portfolio Optimization System

⭐️ **Advanced portfolio optimization system that creates portfolios matching S&P 500 and TSX 60 index performance with 98%+ correlation.**

![MarketMatch Dashboard](https://img.shields.io/badge/Dashboard-React-blue)
![Backend](https://img.shields.io/badge/Backend-Flask-green)
![Analysis](https://img.shields.io/badge/Analysis-Python-yellow)

## 🚀 Features

### 🔍 **Intelligent Stock Filtering**

- Automatically filters stocks based on currency (USD/CAD), volume thresholds, and listing status
- Removes delisted and low-liquidity stocks to ensure portfolio stability

### ⚖️ **Advanced Weight Optimization**

- Multi-factor analysis combining market capitalization, returns correlation, and tracking error
- Sophisticated weight allocation with minimum (2.1%) and maximum (15%) position limits
- Achieves optimal risk-return balance through mathematical optimization

### 📊 **Comprehensive Data Visualization**

- Interactive portfolio allocation charts (pie charts, bar charts)
- Real-time market performance comparison dashboards
- Historical trend analysis with S&P 500 and TSX 60 benchmarks

### 🎯 **High-Performance Tracking**

- Achieves 98%+ correlation with target market indices
- Real-time portfolio performance monitoring
- Export functionality for easy portfolio implementation

## 🏗️ Architecture

```
MarketMatch/
├── backend/                 # Flask API server
│   ├── app.py              # Main application with optimization logic
│   └── requirements.txt    # Python dependencies
├── frontend/               # React web application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   └── App.js         # Main React component
│   ├── public/            # Static assets
│   └── package.json       # Node.js dependencies
├── Tickers.csv            # Sample stock ticker data
└── README.md              # This file
```

## 🛠️ Installation & Setup

### Prerequisites

- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git** for version control

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**

   ```bash
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate

   # On Windows
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Start the Flask development server:**

   ```bash
   python app.py
   ```

   The backend API will be available at `http://localhost:5001`

### Frontend Setup

1. **Open a new terminal and navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**

   ```bash
   npm install
   ```

3. **Start the React development server:**

   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## 📱 Usage Guide

### 1. **Dashboard Overview**

- View current market performance (S&P 500, TSX 60)
- Explore application features and methodology
- Access navigation to different sections

### 2. **Portfolio Optimization**

- **Upload CSV**: Drag and drop a CSV file with stock tickers in the first column
- **Sample Data**: Use the "Load Sample Data" button to try with pre-selected tickers
- **Configure Parameters**:
  - Set number of stocks to include (default: 24)
  - Set investment budget in CAD (default: $1,000,000)
- **Optimize**: Click "Optimize Portfolio" to run the analysis
- **Results**: View optimized portfolio with weights, shares, and performance metrics
- **Export**: Download results as CSV for implementation

### 3. **Market Analysis**

- View historical performance charts for S&P 500 and TSX 60
- Compare normalized performance trends
- Analyze monthly returns and volatility patterns

### 4. **About Section**

- Learn about the methodology and mathematical foundations
- View team information and technical specifications
- Understand the AI usage and academic integrity disclosures

## 🧮 Methodology

### Mathematical Foundation

**Portfolio Rating Formula:**

```
Rating = (Market Cap Score × 1.0) + (Returns Score × 0.001) + (Tracking Error Score × 0.1)
```

**Tracking Error Calculation:**

```
Tracking Error = Standard Deviation of (Portfolio Returns - Benchmark Returns)
```

### Three-Factor Analysis

1. **Market Capitalization Weighting**: Larger companies receive higher weights, reflecting their index influence
2. **Returns Difference Analysis**: Ensures individual stock returns align with market averages
3. **Tracking Error Optimization**: Minimizes portfolio volatility relative to benchmarks

### Time Frame Selection

- **3-Year Analysis Period** (2021-2024): Captures multiple market cycles and reduces short-term volatility impact
- **Monthly Data Intervals**: Provides sufficient granularity while reducing noise
- **Real-time Implementation**: Current market data for portfolio construction

## 🔧 API Endpoints

### Backend API Reference

| Endpoint                  | Method | Description                             |
| ------------------------- | ------ | --------------------------------------- |
| `/api/health`             | GET    | Health check for API status             |
| `/api/market-data`        | GET    | Get S&P 500 and TSX 60 performance data |
| `/api/filter-stocks`      | POST   | Filter stocks based on criteria         |
| `/api/rate-stocks`        | POST   | Rate stocks using multi-factor analysis |
| `/api/optimize-portfolio` | POST   | Complete portfolio optimization         |
| `/api/upload-csv`         | POST   | Upload and parse CSV ticker files       |

### Request/Response Examples

**Portfolio Optimization Request:**

```json
{
  "tickers": ["AAPL", "MSFT", "GOOGL", ...],
  "num_stocks": 24,
  "budget": 1000000
}
```

**Portfolio Optimization Response:**

```json
{
  "portfolio": [
    {
      "Ticker": "AAPL",
      "Price": 150.25,
      "Shares": 100.5,
      "Value": 15100.13,
      "Weight": 5.25
    }
  ],
  "summary": {
    "total_value": 999991.29,
    "portfolio_return": -0.0009,
    "num_stocks": 24,
    "total_fees": 8.71
  }
}
```

## 📈 Performance Metrics

- **Correlation with Indices**: 98.07% (as demonstrated in original research)
- **Portfolio Optimization**: 24 optimally selected stocks
- **Risk Management**: Tracking error minimization
- **Currency Handling**: Automatic CAD/USD conversion
- **Fee Calculation**: Realistic brokerage fee modeling

## 🔬 Technical Stack

### Backend Technologies

- **Flask**: Web framework for API development
- **pandas & numpy**: Data manipulation and numerical computing
- **yfinance**: Real-time market data integration
- **matplotlib**: Data visualization and chart generation

### Frontend Technologies

- **React**: Component-based UI framework
- **Material-UI**: Modern design system and components
- **Recharts**: Interactive data visualization library
- **Axios**: HTTP client for API communication

### Data Sources

- **Yahoo Finance API**: Real-time stock prices and market data
- **S&P 500 Index**: ^GSPC ticker symbol
- **TSX 60 Index**: XIU.TO ticker symbol

## 👥 Team

**Team Number: 17**

| Team Member  | Role                                     |
| ------------ | ---------------------------------------- |
| **Jack**     | Data Analysis & Algorithm Development    |
| **Jennifer** | Portfolio Optimization & Risk Management |
| **Justus**   | Market Research & Validation             |
| **Precious** | Performance Analysis & Testing           |

## 🤖 AI Usage Disclosure

In accordance with academic integrity guidelines, we used AI assistance for:

- **Code Debugging**: Identifying and resolving issues in optimization functions
- **Code Optimization**: Improving readability and performance while maintaining requirements
- **CSV Export**: Implementing data export functionality for portfolio results

## 📄 License

This project was developed as an academic assignment for educational purposes. All market data is obtained through publicly available APIs and is used for educational analysis only.

## 🆘 Troubleshooting

### Common Issues

1. **Backend not starting:**

   - Ensure Python virtual environment is activated
   - Verify all dependencies are installed: `pip install -r requirements.txt`
   - Check that port 5001 is not in use

2. **Frontend connection issues:**

   - Ensure backend is running on port 5000
   - Check proxy configuration in `package.json`
   - Clear browser cache and restart development server

3. **Data fetching errors:**

   - Verify internet connection for Yahoo Finance API access
   - Check that ticker symbols are valid and properly formatted
   - Ensure CSV files have tickers in the first column

4. **Performance issues:**
   - Large ticker lists may take time to process
   - Consider reducing the number of stocks for faster analysis
   - Monitor network connection for real-time data fetching

### Support

For technical issues or questions about the implementation, please refer to the source code documentation and comments throughout the application files.

---

**MarketMatch** - Creating optimized portfolios that meet the market with precision and reliability.
