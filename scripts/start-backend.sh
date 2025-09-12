#!/bin/bash

# EventLink Africa - Backend Startup Script

echo "🔧 Starting EventLink Africa Backend..."

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if backend dependencies are installed
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Check if database is available (optional)
echo "🔍 Checking database connection..."
if ! nc -z localhost 5432 2>/dev/null; then
    echo "⚠️  Warning: PostgreSQL is not running on port 5432"
    echo "   You may need to start PostgreSQL or use Docker"
    echo "   Continuing anyway..."
fi

# Start backend
echo "🚀 Starting NestJS backend..."
npm run start:dev
