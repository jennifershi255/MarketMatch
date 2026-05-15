#!/bin/bash

echo "🔨 Building MarketMatch..."

# Install backend dependencies
echo "📦 Installing Python dependencies..."
pip install -r backend/requirements.txt

# Build frontend
echo "🎨 Building React frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Build complete!"
