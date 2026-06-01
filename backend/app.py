from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
import yfinance as yf
import matplotlib.pyplot as plt
import io
import base64
from datetime import datetime, timedelta
import traceback
import warnings
import os
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
from concurrent.futures import ThreadPoolExecutor, as_completed
from functools import lru_cache

warnings.filterwarnings('ignore')

# Get the absolute path to the build folder
# When running from backend/ directory, go up one level and into frontend/build
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
BUILD_FOLDER = os.path.join(BACKEND_DIR, '..', 'frontend', 'build')
BUILD_FOLDER = os.path.abspath(BUILD_FOLDER)

print(f"🔍 Backend directory: {BACKEND_DIR}")
print(f"📁 Looking for React build at: {BUILD_FOLDER}")
print(f"✓ Build folder exists: {os.path.exists(BUILD_FOLDER)}")

app = Flask(__name__, static_folder=BUILD_FOLDER, static_url_path='')
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
        "supports_credentials": False
    }
})

class MarketMatchAnalyzer:
    def __init__(self):
        # Training period: used to compute scores and select stocks (2021-2024)
        self.start_date = '2021-01-01'
        self.end_date = '2024-11-02'
        # Backtest period: held-out pre-2021 window to validate portfolio performance
        # Kept completely separate from training to avoid look-ahead bias
        self.backtest_start = '2018-01-01'
        self.backtest_end = '2020-12-31'
        self.market_value_weight = 1
        self.returns_weight = 0.001
        self.tracking_error_weight = 0.1
        self.total_market_value = 50578000000000
        # Cache for market data
        self._market_data_cache = None
        self._market_returns_cache = None
        
    def count_volume(self, ticker):
        """Calculate average volume - simplified for performance"""
        try:
            # Get recent 3 months of data for faster processing
            ticker_hist = ticker.history(period='3mo')
            if ticker_hist.empty or len(ticker_hist) < 10:
                return 0
            
            # Simple average volume over the period
            avg_volume = ticker_hist['Volume'].mean()
            return avg_volume if not np.isnan(avg_volume) else 0
            
        except Exception as e:
            print(f"Error calculating volume for {ticker.ticker}: {str(e)}")
            return 0
    
    def _check_single_ticker(self, ticker_symbol):
        """Check a single ticker - helper for parallel processing"""
        try:
            ticker = yf.Ticker(ticker_symbol)
            
            # Get basic info and recent history in one call
            info = ticker.info
            history = ticker.history(period='1mo')
            
            # Checking if it is delisted or has no recent data
            if history.empty or len(history) < 5:
                return (False, f"{ticker_symbol} - delisted or no recent data (got {len(history)} days)")
            
            # Check if the currency is in USD or CAD
            currency = info.get('currency', 'Unknown')
            if currency not in ['USD', 'CAD']:
                return (False, f"{ticker_symbol} - wrong currency ({currency})")
            
            # Quick volume check using recent average
            avg_volume = history['Volume'].mean()
            if avg_volume < 100000:
                return (False, f"{ticker_symbol} - low volume ({avg_volume:,.0f})")
            
            # If it passes all tests, keep it
            return (True, ticker_symbol)
            
        except Exception as e:
            return (False, f"{ticker_symbol} - error: {str(e)}")
    
    def remove_unwanted(self, tickers_list):
        """Filter out unwanted stocks - parallel processing version"""
        filtered_tickers = []
        removed_stocks = []
        
        print(f"🔍 Starting parallel filtering of {len(tickers_list)} tickers...")
        
        # Use ThreadPoolExecutor for parallel processing
        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_ticker = {executor.submit(self._check_single_ticker, ticker): ticker 
                              for ticker in tickers_list}
            
            for i, future in enumerate(as_completed(future_to_ticker)):
                if i % 5 == 0:
                    print(f"📊 Processed {i}/{len(tickers_list)} tickers...")
                
                passed, result = future.result()
                if passed:
                    filtered_tickers.append(result)
                    print(f"   ✅ {result} passed")
                else:
                    removed_stocks.append(result)
                    print(f"   ❌ {result}")
        
        print(f"\n✅ Filtering complete: {len(filtered_tickers)} accepted, {len(removed_stocks)} removed")
        return filtered_tickers, removed_stocks
    
    def get_market_data(self):
        """Get S&P 500 and TSX 60 data - cached version"""
        if self._market_data_cache is not None:
            print("📦 Using cached market data")
            return self._market_data_cache
            
        try:
            print("📥 Fetching market data (will be cached)...")
            # S&P 500
            sp500_ticker = yf.Ticker('^GSPC')
            sp500 = sp500_ticker.history(start=self.start_date, end=self.end_date, interval='1mo')[['Close']]
            sp500.index = pd.to_datetime(sp500.index).strftime('%Y-%m-%d')
            sp500_returns = sp500.ffill().pct_change().dropna()
            
            # TSX 60
            tsx_ticker = yf.Ticker('XIU.TO')
            tsx = tsx_ticker.history(start=self.start_date, end=self.end_date, interval='1mo')[['Close']]
            tsx.index = pd.to_datetime(tsx.index).strftime('%Y-%m-%d')
            tsx_returns = tsx.ffill().pct_change().dropna()
            
            # Combine
            combined = sp500_returns.join(tsx_returns, lsuffix='_SP500', rsuffix='_TSX')
            combined['Total_Returns'] = combined.mean(axis=1)
            
            # Cache it
            self._market_data_cache = (combined, sp500, tsx)
            self._market_returns_cache = combined['Total_Returns'].mean()
            
            return combined, sp500, tsx
        except Exception as e:
            raise Exception(f"Error getting market data: {str(e)}")
    
    def rate_stocks(self, tickers_list):
        """Rate stocks based on market cap, returns, and tracking error - optimized with bulk fetching"""
        # Use cached market returns if available
        if self._market_returns_cache is not None:
            market_returns = self._market_returns_cache
            print("📦 Using cached market returns")
        else:
            market_data, _, _ = self.get_market_data()
            market_returns = market_data['Total_Returns'].mean()
        
        ratings_data = []
        
        # Bulk fetch all stock data at once to reduce API calls
        print(f"📥 Bulk fetching price data for {len(tickers_list)} stocks...")
        try:
            bulk_prices = yf.download(
                tickers_list, 
                start=self.start_date, 
                end=self.end_date, 
                interval='1mo',
                auto_adjust=True,
                progress=False,
                group_by='ticker'
            )
        except Exception as e:
            print(f"Bulk download failed: {e}, falling back to individual fetches")
            bulk_prices = None
        
        for i, ticker_symbol in enumerate(tickers_list):
            # Minimal delay only if bulk fetch failed
            if bulk_prices is None and i > 0:
                time.sleep(0.15)
            
            try:
                # Try to use bulk data first
                if bulk_prices is not None:
                    if len(tickers_list) == 1:
                        stock_data = bulk_prices[['Close']].copy()
                    else:
                        try:
                            stock_data = bulk_prices[ticker_symbol][['Close']].copy()
                        except (KeyError, TypeError):
                            # Fallback to individual fetch
                            stock_data = yf.Ticker(ticker_symbol).history(
                                start=self.start_date, end=self.end_date, interval='1mo'
                            )[['Close']]
                else:
                    stock_data = yf.Ticker(ticker_symbol).history(
                        start=self.start_date, end=self.end_date, interval='1mo'
                    )[['Close']]
                
                if stock_data.empty:
                    continue
                
                stock_returns_df = stock_data.ffill().pct_change().dropna()
                
                # Get market cap (still needs individual call for info)
                ticker = yf.Ticker(ticker_symbol)
                market_cap = ticker.fast_info.get('marketCap', 0)
                market_value_score = market_cap / self.total_market_value if market_cap else 0
                
                # Returns score
                stock_returns = stock_returns_df['Close'].mean()
                returns_diff = abs(stock_returns - market_returns)
                returns_score = 1 / returns_diff if returns_diff > 0 else 0
                
                # Tracking error score
                tracking_error = (stock_returns_df['Close'] - market_returns).std()
                tracking_error_score = 1 / tracking_error if tracking_error > 0 else 0
                
                # Overall rating
                rating = (market_value_score * self.market_value_weight + 
                         returns_score * self.returns_weight + 
                         tracking_error_score * self.tracking_error_weight)
                
                ratings_data.append({
                    'Ticker': ticker_symbol,
                    'Market_Value_Score': market_value_score,
                    'Returns_Score': returns_score,
                    'Tracking_Error_Score': tracking_error_score,
                    'Rating': rating,
                    'Market_Cap': market_cap,
                    'Stock_Returns': stock_returns,
                    'Tracking_Error': tracking_error
                })
                
            except Exception as e:
                print(f"Error processing {ticker_symbol}: {str(e)}")
                continue
        
        df = pd.DataFrame(ratings_data)
        return df.sort_values(by='Rating', ascending=False) if not df.empty else df
    
    def calculate_weights(self, selected_stocks):
        """
        Calculate portfolio weights using Ridge Regression.

        Instead of hand-tuned coefficients, Ridge Regression learns the
        optimal weights that minimise tracking error against the blended
        index over the training period (2021-2024).

        Constraints applied post-regression:
        - Minimum weight : 1 / (2 * n)  — every stock contributes meaningfully
        - Maximum weight : 15%           — no single position dominates
        - Weights normalised to sum to 100%
        """
        import time

        if selected_stocks.empty:
            return selected_stocks

        tickers = selected_stocks['Ticker'].tolist()
        n = len(tickers)
        min_weight = 1.0 / (2 * n)
        max_weight = 0.15

        try:
            # ── Fetch monthly returns for selected stocks (training period) ──
            print(f"📥 Bulk fetching returns data for weight optimization...")
            
            # Try bulk fetch first
            try:
                bulk_data = yf.download(
                    tickers,
                    start=self.start_date,
                    end=self.end_date,
                    interval='1mo',
                    auto_adjust=True,
                    progress=False
                )['Close']
                
                if isinstance(bulk_data, pd.Series):
                    bulk_data = bulk_data.to_frame(tickers[0])
                
                returns_dict = {}
                for symbol in tickers:
                    if symbol in bulk_data.columns:
                        returns_dict[symbol] = bulk_data[symbol].ffill().pct_change().dropna()
            except Exception as e:
                print(f"Bulk fetch failed: {e}, using individual fetches")
                returns_dict = {}
                for i, symbol in enumerate(tickers):
                    if i > 0:
                        time.sleep(0.15)
                    try:
                        px = yf.Ticker(symbol).history(
                            start=self.start_date, end=self.end_date, interval='1mo'
                        )[['Close']]
                        if not px.empty:
                            returns_dict[symbol] = px['Close'].ffill().pct_change().dropna()
                    except Exception:
                        pass

            # ── Fetch blended index returns (training period) ────────────────
            sp500_ret = yf.Ticker('^GSPC').history(
                start=self.start_date, end=self.end_date, interval='1mo'
            )[['Close']].ffill().pct_change().dropna()['Close']

            tsx_ret = yf.Ticker('XIU.TO').history(
                start=self.start_date, end=self.end_date, interval='1mo'
            )[['Close']].ffill().pct_change().dropna()['Close']

            index_returns = ((sp500_ret + tsx_ret.reindex(sp500_ret.index).ffill()) / 2).dropna()

            # ── Build aligned returns matrix ─────────────────────────────────
            returns_df = pd.DataFrame(returns_dict)
            common_idx = returns_df.index.intersection(index_returns.index)

            if len(common_idx) < 6 or returns_df.empty:
                raise ValueError("Insufficient overlapping return data for Ridge")

            X = returns_df.loc[common_idx].fillna(0).values   # stock returns matrix
            y = index_returns.loc[common_idx].values           # index returns (target)

            # ── Fit Ridge Regression ─────────────────────────────────────────
            # Lower alpha allows more weight variation (less regularization)
            # alpha=0.1 provides balance between diversification and tracking
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)

            ridge = Ridge(alpha=0.1, fit_intercept=False)
            ridge.fit(X_scaled, y)

            raw_weights = ridge.coef_
            
            print(f"\n🔬 Ridge Regression Debug:")
            print(f"   Raw coefficients range: [{raw_weights.min():.6f}, {raw_weights.max():.6f}]")
            print(f"   Raw coefficients std: {raw_weights.std():.6f}")
            print(f"   Min weight constraint: {min_weight:.6f} ({min_weight*100:.2f}%)")
            print(f"   Max weight constraint: {max_weight:.6f} ({max_weight*100:.2f}%)")

            # ── Apply constraints ────────────────────────────────────────────
            # Clip negatives to zero first (no short selling)
            raw_weights = np.maximum(raw_weights, 0)
            
            # Normalize to sum to 1
            if raw_weights.sum() > 0:
                raw_weights = raw_weights / raw_weights.sum()
            else:
                # If all coefficients were negative, use equal weights
                raw_weights = np.full(n, 1.0 / n)
            
            print(f"   After normalization range: [{raw_weights.min():.6f}, {raw_weights.max():.6f}]")

            # Apply min/max constraints iteratively
            for iteration in range(10):
                # Enforce minimum
                below_min = raw_weights < min_weight
                if below_min.any():
                    deficit = (min_weight - raw_weights[below_min]).sum()
                    raw_weights[below_min] = min_weight
                    # Reduce others proportionally to make room
                    above_min = ~below_min
                    if above_min.any() and raw_weights[above_min].sum() > 0:
                        reduction_factor = (1.0 - below_min.sum() * min_weight) / raw_weights[above_min].sum()
                        raw_weights[above_min] *= reduction_factor
                
                # Enforce maximum
                above_max = raw_weights > max_weight
                if above_max.any():
                    raw_weights[above_max] = max_weight
                
                # Renormalize
                raw_weights = raw_weights / raw_weights.sum()
                
                # Check convergence
                if not below_min.any() and not above_max.any():
                    break

            print(f"   Final weights range: [{raw_weights.min():.6f}, {raw_weights.max():.6f}]")
            print(f"   Final weights std: {raw_weights.std():.6f}")
            print(f"   Sum: {raw_weights.sum():.6f}")

            df = selected_stocks.copy().reset_index(drop=True)
            df['Weight'] = raw_weights * 100
            df['weight_method'] = 'ridge_regression'
            
            # Print top 5 weights for debugging
            print(f"\n📊 Top 5 weights:")
            for i in range(min(5, len(df))):
                print(f"   {df.iloc[i]['Ticker']}: {df.iloc[i]['Weight']:.2f}%")
            
            return df

        except Exception as e:
            print(f"Ridge weight optimization failed ({e}), falling back to rating-based weights")
            # ── Fallback: original rating-proportional method ─────────────────
            df = selected_stocks.copy()
            total_rating = df['Rating'].sum()
            df['proportional_rating'] = df['Rating'] / total_rating
            df['Weight'] = min_weight

            # Vectorized weight distribution — no row-by-row iteration
            for _ in range(20):
                remaining_weight = 1.0 - df['Weight'].sum()
                if remaining_weight <= 0.001:
                    break
                total_proportional = df['proportional_rating'].sum()
                if total_proportional == 0:
                    break
                # Distribute remaining weight proportionally (vectorized)
                additional = df['proportional_rating'] / total_proportional * remaining_weight
                df['Weight'] = df['Weight'] + additional
                # Vectorized cap: zero out proportional_rating for capped stocks
                capped = df['Weight'] > max_weight
                df.loc[capped, 'Weight'] = max_weight
                df.loc[capped, 'proportional_rating'] = 0

            df['Weight'] = df['Weight'] * 100 / df['Weight'].sum()
            df['weight_method'] = 'fallback_rating'
            return df

    def backtest_portfolio(self, weighted_portfolio: pd.DataFrame, start_date: str = '2018-01-01', end_date: str = '2020-12-31') -> dict:
        """Compute a 3-year backtest of the weighted portfolio (monthly)."""
        try:
            if weighted_portfolio.empty:
                return {"error": "Empty portfolio for backtest"}

            # Get market indices
            sp500_ticker = yf.Ticker('^GSPC')
            tsx_ticker = yf.Ticker('XIU.TO')
            sp500 = sp500_ticker.history(start=start_date, end=end_date, interval='1mo')[['Close']]
            tsx = tsx_ticker.history(start=start_date, end=end_date, interval='1mo')[['Close']]
            
            # Remove timezone info to avoid tz-aware/tz-naive conflicts
            sp500.index = sp500.index.tz_localize(None)
            tsx.index = tsx.index.tz_localize(None)
            
            sp500 = sp500.ffill().dropna()
            tsx = tsx.ffill().dropna()

            # Normalize indices
            sp500_idx = sp500['Close'] / sp500['Close'].iloc[0]
            tsx_idx = tsx['Close'] / tsx['Close'].iloc[0]
            blended_idx = (sp500_idx.reindex(tsx_idx.index).ffill().dropna() + tsx_idx) / 2

            # CAD/USD exchange rate (monthly)
            fx = yf.Ticker('CADUSD=X').history(start=start_date, end=end_date, interval='1mo')[['Close']]
            fx.index = fx.index.tz_localize(None)
            fx = fx.ffill().dropna()

            # Build portfolio index
            portfolio_components = []
            weights_fraction = (weighted_portfolio[['Ticker', 'Weight']].copy())
            weights_fraction['Weight'] = weights_fraction['Weight'] / 100.0

            # Fetch all tickers at once using yf.download (vectorized bulk fetch)
            tickers_list = weights_fraction['Ticker'].tolist()
            try:
                bulk_px = yf.download(
                    tickers_list, start=start_date, end=end_date,
                    interval='1mo', auto_adjust=True, progress=False
                )['Close']
                if isinstance(bulk_px, pd.Series):
                    bulk_px = bulk_px.to_frame(tickers_list[0])
                # Remove timezone info
                bulk_px.index = bulk_px.index.tz_localize(None)
            except Exception:
                bulk_px = pd.DataFrame()

            for _, row in weights_fraction.iterrows():
                ticker = row['Ticker']
                weight = row['Weight']
                try:
                    # Use bulk data if available, fall back to individual fetch
                    if not bulk_px.empty and ticker in bulk_px.columns:
                        px_series = bulk_px[ticker].dropna()
                    else:
                        t = yf.Ticker(ticker)
                        px_data = t.history(start=start_date, end=end_date, interval='1mo')['Close'].dropna()
                        # Remove timezone info
                        px_data.index = px_data.index.tz_localize(None) if px_data.index.tz is not None else px_data.index
                        px_series = px_data
                    
                    if px_series.empty:
                        continue
                    
                    # Ensure px_series index is timezone-naive
                    if hasattr(px_series.index, 'tz') and px_series.index.tz is not None:
                        px_series.index = px_series.index.tz_localize(None)
                    
                    # Convert to CAD if USD
                    t_info = yf.Ticker(ticker)
                    currency = t_info.info.get('currency', 'USD')
                    if currency == 'USD':
                        joined = pd.DataFrame({'Close': px_series}).join(fx, how='inner', rsuffix='_FX')
                        if joined.empty:
                            continue
                        price_cad = joined['Close'] / joined['Close_FX']
                    else:
                        price_cad = px_series
                    norm = price_cad / price_cad.iloc[0]
                    portfolio_components.append(norm * weight)
                except Exception as e:
                    print(f"Backtest: error processing {ticker}: {e}")
                    continue

            if not portfolio_components:
                return {"error": "No valid components for backtest"}

            # Sum weighted components
            portfolio_index = portfolio_components[0]
            for comp in portfolio_components[1:]:
                portfolio_index = portfolio_index.reindex(comp.index).ffill()
                comp = comp.reindex(portfolio_index.index).ffill()
                portfolio_index = (portfolio_index.ffill() + comp.ffill())

            # Normalize portfolio index to start at 1
            portfolio_index = portfolio_index / portfolio_index.iloc[0]

            # Align blended and portfolio
            common_index = portfolio_index.index.intersection(blended_idx.index)
            portfolio_index = portfolio_index.loc[common_index]
            blended_idx = blended_idx.loc[common_index]

            # Compute returns and correlation
            portfolio_return = float((portfolio_index.iloc[-1] / portfolio_index.iloc[0] - 1) * 100)
            blended_return = float((blended_idx.iloc[-1] / blended_idx.iloc[0] - 1) * 100)
            correlation = float(np.corrcoef(portfolio_index.values, blended_idx.values)[0, 1])

            return {
                "dates": [d.strftime('%Y-%m-%d') if not isinstance(d, str) else d for d in common_index],
                "portfolio_index": [float(x) for x in portfolio_index.values],
                "blended_index": [float(x) for x in blended_idx.values],
                "portfolio_return_pct": round(portfolio_return, 4),
                "blended_return_pct": round(blended_return, 4),
                "correlation": round(correlation, 4)
            }
        except Exception as e:
            print(f"Backtest error: {e}")
            return {"error": str(e)}

    def calculate_portfolio_performance(self, portfolio_df, budget=1000000):
        """Calculate portfolio shares and performance - optimized"""
        start_date = '2024-11-22'
        end_date = '2024-12-02'
        
        # Get exchange rate
        exchange_ticker = yf.Ticker('CADUSD=X')
        exchange_data = exchange_ticker.history(start=start_date, end=end_date, interval='1d')
        exchange_rate = exchange_data.iloc[0]['Close'] if not exchange_data.empty else 1.35
        
        # Bulk fetch all prices at once — vectorized instead of one API call per stock
        tickers_list = portfolio_df['Ticker'].tolist()
        bulk_first_prices = {}
        
        try:
            print(f"📥 Bulk fetching current prices for {len(tickers_list)} stocks...")
            bulk_prices = yf.download(
                tickers_list, start=start_date, end=end_date,
                interval='1d', auto_adjust=True, progress=False
            )['Close']
            if isinstance(bulk_prices, pd.Series):
                bulk_prices = bulk_prices.to_frame(tickers_list[0])
            bulk_first_prices = bulk_prices.iloc[0].to_dict()
        except Exception as e:
            print(f"Bulk price fetch failed: {e}, will use individual fetches")

        portfolio_result = []
        total_fees = 0

        for _, row in portfolio_df.iterrows():
            try:
                ticker_sym = row['Ticker']
                ticker_obj = yf.Ticker(ticker_sym)

                # Use bulk price if available, else fall back to individual fetch
                if ticker_sym in bulk_first_prices and not pd.isna(bulk_first_prices[ticker_sym]):
                    price = float(bulk_first_prices[ticker_sym])
                else:
                    stock_data = ticker_obj.history(start=start_date, end=end_date, interval='1d')
                    if stock_data.empty:
                        continue
                    price = stock_data.iloc[0]['Close']

                currency = ticker_obj.info.get('currency', 'USD')
                weight = row['Weight'] / 100

                # Convert to CAD using vectorized operation
                price_cad = price * (1 / exchange_rate) if currency == 'USD' else price

                # Vectorized shares and fees calculation
                shares_expenditure = budget * weight
                raw_shares = shares_expenditure / price_cad

                if raw_shares > 3950:
                    shares = (shares_expenditure - 3.95) / price_cad
                    fees = 3.95
                else:
                    shares = shares_expenditure / (price_cad + 0.001)
                    fees = shares_expenditure - (shares * price_cad)

                total_fees += fees
                value = shares * price_cad
                
                portfolio_result.append({
                    'Ticker': row['Ticker'],
                    'Price': round(price_cad, 2),
                    'Currency': 'CAD',
                    'Shares': round(shares, 2),
                    'Value': round(value, 2),
                    'Weight': row['Weight'],
                    'Rating': row['Rating']
                })
                
            except Exception as e:
                print(f"Error calculating performance for {row['Ticker']}: {str(e)}")
                continue
        
        return pd.DataFrame(portfolio_result), total_fees

analyzer = MarketMatchAnalyzer()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "message": "MarketMatch API is running",
        "build_folder": BUILD_FOLDER,
        "build_exists": os.path.exists(BUILD_FOLDER),
        "build_files": os.listdir(BUILD_FOLDER) if os.path.exists(BUILD_FOLDER) else [],
        "cache_active": analyzer._market_data_cache is not None
    })

@app.route('/api/clear-cache', methods=['POST'])
def clear_cache():
    """Clear cached market data"""
    analyzer._market_data_cache = None
    analyzer._market_returns_cache = None
    return jsonify({"message": "Cache cleared successfully"})

@app.route('/api/test-cors', methods=['POST', 'OPTIONS'])
def test_cors():
    if request.method == 'OPTIONS':
        return jsonify({"message": "CORS preflight successful"})
    return jsonify({"message": "CORS POST successful", "received": request.get_json()})

@app.route('/api/filter-stocks', methods=['POST'])
def filter_stocks():
    try:
        data = request.get_json()
        tickers = data.get('tickers', [])
        
        if not tickers:
            return jsonify({"error": "No tickers provided"}), 400
        
        filtered_tickers, removed_stocks = analyzer.remove_unwanted(tickers)
        
        return jsonify({
            "filtered_tickers": filtered_tickers,
            "removed_stocks": removed_stocks,
            "total_filtered": len(filtered_tickers),
            "total_removed": len(removed_stocks)
        })
        
    except Exception as e:
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500

@app.route('/api/rate-stocks', methods=['POST'])
def rate_stocks():
    try:
        data = request.get_json()
        tickers = data.get('tickers', [])
        
        if not tickers:
            return jsonify({"error": "No tickers provided"}), 400
        
        ratings_df = analyzer.rate_stocks(tickers)
        
        if ratings_df.empty:
            return jsonify({"error": "No valid stocks found for rating"}), 400
        
        return jsonify({
            "ratings": ratings_df.to_dict('records'),
            "total_stocks": len(ratings_df)
        })
        
    except Exception as e:
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500


@app.route('/api/optimize-portfolio', methods=['POST'])
def optimize_portfolio():
    try:
        data = request.get_json()
        tickers = data.get('tickers', [])
        num_stocks = data.get('num_stocks', 24)
        budget = data.get('budget', 1000000)
        skip_backtest = data.get('skip_backtest', False)  # New parameter
        skip_filtering = data.get('skip_filtering', False)  # New parameter
        
        if not tickers:
            return jsonify({"error": "No tickers provided"}), 400
        
        print(f"\n{'='*60}")
        print(f"PORTFOLIO OPTIMIZATION STARTED")
        print(f"Input: {len(tickers)} tickers, requesting {num_stocks} stocks")
        print(f"Skip filtering: {skip_filtering}, Skip backtest: {skip_backtest}")
        print(f"{'='*60}\n")
        
        # Step 1: Filter stocks (optional)
        if skip_filtering:
            print(f"\n⏭️  Skipping filtering (using all {len(tickers)} tickers)")
            filtered_tickers = tickers
            removed_stocks = []
        else:
            filtered_tickers, removed_stocks = analyzer.remove_unwanted(tickers)
            print(f"\n📋 Filtering Results:")
            print(f"   Accepted: {len(filtered_tickers)}")
            print(f"   Removed: {len(removed_stocks)}")
        
        if not filtered_tickers:
            return jsonify({"error": "No valid stocks after filtering"}), 400
        
        # Step 2: Rate stocks
        ratings_df = analyzer.rate_stocks(filtered_tickers)
        print(f"\n📊 Rating Results:")
        print(f"   Successfully rated: {len(ratings_df)} stocks")
        
        if ratings_df.empty:
            return jsonify({"error": "No stocks could be rated"}), 400
        
        # Step 3: Select top stocks by composite rating
        stocks_to_select = min(num_stocks, len(ratings_df))
        selected_stocks = ratings_df.head(stocks_to_select)
        print(f"\n✅ Selected top {len(selected_stocks)} stocks by rating")

        # Step 4: Ridge Regression weight optimization
        print(f"\n📐 Running Ridge Regression weight optimization...")
        weighted_portfolio = analyzer.calculate_weights(selected_stocks)
        print(f"   Weight method: {weighted_portfolio['weight_method'].iloc[0] if not weighted_portfolio.empty else 'unknown'}")
        
        # Step 5: Backtest (optional)
        if skip_backtest:
            print(f"\n⏭️  Skipping backtest (faster response)")
            backtest = {"skipped": True, "message": "Backtest skipped for faster results"}
        else:
            print(f"\n📈 Running backtest (this may take a moment)...")
            backtest = analyzer.backtest_portfolio(weighted_portfolio, analyzer.backtest_start, analyzer.backtest_end)
        
        # Step 6: Calculate performance snapshot
        portfolio_result, total_fees = analyzer.calculate_portfolio_performance(weighted_portfolio, budget)
        
        # Step 7: Get market data for comparison
        market_data, sp500, tsx = analyzer.get_market_data()
        
        # Calculate portfolio vs market performance (snapshot)
        total_value = portfolio_result['Value'].sum() if not portfolio_result.empty else 0
        portfolio_return = ((total_value + total_fees - budget) / budget) * 100
        
        print(f"\n{'='*60}")
        print(f"OPTIMIZATION COMPLETE")
        print(f"Final portfolio: {len(portfolio_result)} stocks")
        print(f"{'='*60}\n")
        
        return jsonify({
            "portfolio": portfolio_result.to_dict('records'),
            "summary": {
                "total_value": round(total_value, 2),
                "total_fees": round(total_fees, 2),
                "final_value": round(total_value + total_fees, 2),
                "portfolio_return": round(portfolio_return, 4),
                "total_weight": round(portfolio_result['Weight'].sum(), 1) if not portfolio_result.empty else 0,
                "num_stocks": len(portfolio_result),
                "requested_stocks": num_stocks,
                "stocks_after_filtering": len(filtered_tickers),
                "stocks_after_rating": len(ratings_df)
            },
            "filtering_results": {
                "removed_stocks": removed_stocks,
                "total_filtered": len(filtered_tickers),
                "total_removed": len(removed_stocks),
                "input_count": len(tickers),
                "skipped": skip_filtering
            },
            "backtest": backtest
        })
        
    except Exception as e:
        print(f"\n❌ OPTIMIZATION ERROR: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500

@app.route('/api/market-data', methods=['GET'])
def get_market_data():
    try:
        market_data, sp500, tsx = analyzer.get_market_data()
        
        # Calculate percentage changes
        sp500_start = sp500.iloc[0]['Close']
        sp500_end = sp500.iloc[-1]['Close']
        sp500_pct_change = ((sp500_end - sp500_start) / sp500_start) * 100
        
        tsx_start = tsx.iloc[0]['Close']
        tsx_end = tsx.iloc[-1]['Close']
        tsx_pct_change = ((tsx_end - tsx_start) / tsx_start) * 100
        
        avg_pct_change = (sp500_pct_change + tsx_pct_change) / 2
        
        return jsonify({
            "sp500_data": sp500.to_dict('index'),
            "tsx_data": tsx.to_dict('index'),
            "combined_returns": market_data['Total_Returns'].to_dict(),
            "performance": {
                "sp500_return": round(sp500_pct_change, 4),
                "tsx_return": round(tsx_pct_change, 4),
                "avg_return": round(avg_pct_change, 4)
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500

@app.route('/api/upload-csv', methods=['POST'])
def upload_csv():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Read CSV file
        df = pd.read_csv(file)
        
        # Extract tickers (assume first column contains tickers)
        tickers = df.iloc[:, 0].dropna().tolist()
        
        return jsonify({
            "tickers": tickers,
            "total_count": len(tickers),
            "message": f"Successfully loaded {len(tickers)} tickers from CSV"
        })
        
    except Exception as e:
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500

# Serve React App (only if build folder exists)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    try:
        # If build folder doesn't exist, return API info for root only
        if not os.path.exists(BUILD_FOLDER):
            if path == '':
                return jsonify({
                    "service": "MarketMatch API",
                    "status": "running",
                    "endpoints": [
                        "/api/health",
                        "/api/market-data",
                        "/api/optimize-portfolio",
                        "/api/upload-csv"
                    ]
                })
            else:
                # For non-root paths, return 404 if build doesn't exist
                return jsonify({"error": "Frontend build not available"}), 404
        
        # If path exists in build folder, serve it
        if path != "" and os.path.exists(os.path.join(BUILD_FOLDER, path)):
            return send_from_directory(BUILD_FOLDER, path)
        
        # Otherwise serve index.html for React Router
        index_path = os.path.join(BUILD_FOLDER, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(BUILD_FOLDER, 'index.html')
        else:
            return jsonify({
                "error": "index.html not found",
                "build_folder": BUILD_FOLDER
            }), 404
    except Exception as e:
        return jsonify({
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'True').lower() == 'true'
    
    # Production warning
    if not debug:
        print("\n" + "="*60)
        print("⚠️  RUNNING IN PRODUCTION MODE")
        print("="*60 + "\n")
    
    app.run(debug=debug, host='0.0.0.0', port=port)