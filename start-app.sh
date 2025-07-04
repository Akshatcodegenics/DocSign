#!/bin/bash

# Start the SignFlow application - both server and client

echo "🚀 Starting SignFlow Application..."

# Kill any existing processes on our ports
echo "📋 Cleaning up existing processes..."
lsof -ti:9999 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "🔧 Starting backend server..."
cd server
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo "🌐 Starting frontend client..."
cd ../client
npm start &
CLIENT_PID=$!

echo "✅ Application started!"
echo "📋 Server running on: http://localhost:9999"
echo "🌐 Client running on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to handle cleanup
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $SERVER_PID 2>/dev/null || true
    kill $CLIENT_PID 2>/dev/null || true
    echo "✅ Services stopped"
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT

# Wait for both processes
wait
