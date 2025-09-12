#!/bin/bash

# EventLink Africa - Frontend Startup Script

echo "🎨 Starting EventLink Africa Frontend..."

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if frontend dependencies are installed
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo "🚀 Starting Next.js frontend..."
npm run dev
