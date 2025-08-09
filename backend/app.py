from flask import Flask, request, jsonify
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
warnings.filterwarnings('ignore')

app = Flask(__name__)
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
        self.start_date = '2021-01-01'
        self.end_date = '2024-11-02'
        self.market_value_weight = 1
        self.returns_weight = 0.001
        self.tracking_error_weight = 0.1
        self.total_market_value = 50578000000000
        
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
    
    def remove_unwanted(self, tickers_list):
        """Filter out unwanted stocks based on criteria - matches original notebook"""
        filtered_tickers = []
        removed_stocks = []
        
        print(f"🔍 Starting to filter {len(tickers_list)} tickers...")
        for i, ticker_symbol in enumerate(tickers_list):
            if i % 3 == 0:
                print(f"📊 Processing ticker {i+1}/{len(tickers_list)}: {ticker_symbol}")
            try:
                ticker = yf.Ticker(ticker_symbol)
                
                # Get basic info and recent history in one call
                info = ticker.info
                history = ticker.history(period='1mo')  # Just 1 month for speed
                
                # Checking if it is delisted or has no recent data
                if history.empty or len(history) < 5:
                    removed_stocks.append(f"{ticker_symbol} - delisted or no recent data")
                    continue
                
                # Check if the currency is in USD or CAD
                currency = info.get('currency', 'Unknown')
                if currency not in ['USD', 'CAD']:
                    removed_stocks.append(f"{ticker_symbol} - wrong currency ({currency})")
                    continue
                
                # Quick volume check using recent average
                avg_volume = history['Volume'].mean()
                if avg_volume < 100000:
                    removed_stocks.append(f"{ticker_symbol} - low volume ({avg_volume:,.0f})")
                    continue
                
                # If it passes all tests, keep it
                filtered_tickers.append(ticker_symbol)
                
            except Exception as e:
                removed_stocks.append(f"{ticker_symbol} - error: {str(e)}")
        
        return filtered_tickers, removed_stocks
    
    def get_market_data(self):
        """Get S&P 500 and TSX 60 data"""
        try:
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
            
            return combined, sp500, tsx
        except Exception as e:
            raise Exception(f"Error getting market data: {str(e)}")
    
    def rate_stocks(self, tickers_list):
        """Rate stocks based on market cap, returns, and tracking error"""
        market_data, _, _ = self.get_market_data()
        market_returns = market_data['Total_Returns'].mean()
        
        ratings_data = []
        
        for ticker_symbol in tickers_list:
            try:
                ticker = yf.Ticker(ticker_symbol)
                stock_data = ticker.history(start=self.start_date, end=self.end_date, interval='1mo')[['Close']]
                
                if stock_data.empty:
                    continue
                
                stock_returns_df = stock_data.ffill().pct_change().dropna()
                
                # Market value score
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
        """Calculate portfolio weights based on ratings"""
        if selected_stocks.empty:
            return selected_stocks
        
        n = len(selected_stocks)
        min_weight = 1 / (2 * n)
        max_weight = 0.15
        
        df = selected_stocks.copy()
        total_rating = df['Rating'].sum()
        df['proportional_rating'] = df['Rating'] / total_rating
        df['Weight'] = min_weight
        
        remaining_weight = 1 - df['Weight'].sum()
        
        while remaining_weight > 0.001:  # Small threshold to avoid infinite loops
            total_proportional = df['proportional_rating'].sum()
            if total_proportional == 0:
                break
                
            adjustment_factor = remaining_weight / total_proportional
            additional_weights = df['proportional_rating'] * adjustment_factor
            
            for i, (idx, row) in enumerate(df.iterrows()):
                new_weight = row['Weight'] + additional_weights.iloc[i]
                if new_weight > max_weight:
                    excess = new_weight - max_weight
                    df.at[idx, 'Weight'] = max_weight
                    df.at[idx, 'proportional_rating'] = 0  # Remove from further allocation
                    remaining_weight -= (additional_weights.iloc[i] - excess)
                else:
                    df.at[idx, 'Weight'] = new_weight
                    remaining_weight -= additional_weights.iloc[i]
            
            if df['proportional_rating'].sum() == 0:
                break
        
        # Normalize weights to sum to 100%
        df['Weight'] = df['Weight'] * 100 / df['Weight'].sum()
        
        return df

    def backtest_portfolio(self, weighted_portfolio: pd.DataFrame, start_date: str = '2021-01-01', end_date: str = '2024-11-02') -> dict:
        """Compute a 3-year backtest of the weighted portfolio (monthly)."""
        try:
            if weighted_portfolio.empty:
                return {"error": "Empty portfolio for backtest"}

            # Get market indices
            sp500_ticker = yf.Ticker('^GSPC')
            tsx_ticker = yf.Ticker('XIU.TO')
            sp500 = sp500_ticker.history(start=start_date, end=end_date, interval='1mo')[['Close']]
            tsx = tsx_ticker.history(start=start_date, end=end_date, interval='1mo')[['Close']]
            sp500 = sp500.ffill().dropna()
            tsx = tsx.ffill().dropna()

            # Normalize indices
            sp500_idx = sp500['Close'] / sp500['Close'].iloc[0]
            tsx_idx = tsx['Close'] / tsx['Close'].iloc[0]
            blended_idx = (sp500_idx.reindex(tsx_idx.index, method='ffill').dropna() + tsx_idx) / 2

            # CAD/USD exchange rate (monthly)
            fx = yf.Ticker('CADUSD=X').history(start=start_date, end=end_date, interval='1mo')[['Close']]
            fx = fx.ffill().dropna()

            # Build portfolio index
            portfolio_components = []
            weights_fraction = (weighted_portfolio[['Ticker', 'Weight']].copy())
            weights_fraction['Weight'] = weights_fraction['Weight'] / 100.0

            for _, row in weights_fraction.iterrows():
                ticker = row['Ticker']
                weight = row['Weight']
                try:
                    t = yf.Ticker(ticker)
                    px = t.history(start=start_date, end=end_date, interval='1mo')[['Close']]
                    if px.empty:
                        continue
                    px = px.ffill().dropna()
                    # Convert to CAD if USD
                    currency = t.info.get('currency', 'USD')
                    if currency == 'USD':
                        # Align fx and convert
                        joined = px.join(fx, how='inner', rsuffix='_FX')
                        if joined.empty:
                            continue
                        price_cad = joined['Close'] / joined['Close_FX']
                    else:
                        price_cad = px['Close']
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
                portfolio_index = portfolio_index.reindex(comp.index, method='ffill')
                comp = comp.reindex(portfolio_index.index, method='ffill')
                portfolio_index = (portfolio_index.fillna(method='ffill') + comp.fillna(method='ffill'))

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
        """Calculate portfolio shares and performance"""
        start_date = '2024-11-22'
        end_date = '2024-12-02'
        
        # Get exchange rate
        exchange_ticker = yf.Ticker('CADUSD=X')
        exchange_data = exchange_ticker.history(start=start_date, end=end_date, interval='1d')
        exchange_rate = exchange_data.iloc[0]['Close'] if not exchange_data.empty else 1.35
        
        portfolio_result = []
        total_fees = 0
        
        for _, row in portfolio_df.iterrows():
            try:
                ticker = yf.Ticker(row['Ticker'])
                stock_data = ticker.history(start=start_date, end=end_date, interval='1d')
                
                if stock_data.empty:
                    continue
                
                price = stock_data.iloc[0]['Close']
                currency = ticker.info.get('currency', 'USD')
                weight = row['Weight'] / 100
                
                # Convert to CAD
                if currency == 'USD':
                    price_cad = price * (1 / exchange_rate)
                else:
                    price_cad = price
                
                # Calculate shares
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
    return jsonify({"status": "healthy", "message": "MarketMatch API is running"})

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
        
        if not tickers:
            return jsonify({"error": "No tickers provided"}), 400
        
        # Step 1: Filter stocks
        filtered_tickers, removed_stocks = analyzer.remove_unwanted(tickers)
        
        if not filtered_tickers:
            return jsonify({"error": "No valid stocks after filtering"}), 400
        
        # Step 2: Rate stocks
        ratings_df = analyzer.rate_stocks(filtered_tickers)
        
        if ratings_df.empty:
            return jsonify({"error": "No stocks could be rated"}), 400
        
        # Step 3: Select top stocks
        selected_stocks = ratings_df.head(min(num_stocks, len(ratings_df)))
        
        # Step 4: Calculate weights
        weighted_portfolio = analyzer.calculate_weights(selected_stocks)
        
        # NEW: Backtest over 3 years
        backtest = analyzer.backtest_portfolio(weighted_portfolio, analyzer.start_date, analyzer.end_date)
        
        # Step 5: Calculate performance snapshot
        portfolio_result, total_fees = analyzer.calculate_portfolio_performance(weighted_portfolio, budget)
        
        # Step 6: Get market data for comparison
        market_data, sp500, tsx = analyzer.get_market_data()
        
        # Calculate portfolio vs market performance (snapshot)
        total_value = portfolio_result['Value'].sum() if not portfolio_result.empty else 0
        portfolio_return = ((total_value + total_fees - budget) / budget) * 100
        
        return jsonify({
            "portfolio": portfolio_result.to_dict('records'),
            "summary": {
                "total_value": round(total_value, 2),
                "total_fees": round(total_fees, 2),
                "final_value": round(total_value + total_fees, 2),
                "portfolio_return": round(portfolio_return, 4),
                "total_weight": round(portfolio_result['Weight'].sum(), 1) if not portfolio_result.empty else 0,
                "num_stocks": len(portfolio_result)
            },
            "filtering_results": {
                "removed_stocks": removed_stocks,
                "total_filtered": len(filtered_tickers),
                "total_removed": len(removed_stocks)
            },
            "backtest": backtest
        })
        
    except Exception as e:
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

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port) 