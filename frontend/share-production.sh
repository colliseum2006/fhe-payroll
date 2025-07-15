#!/bin/bash

echo "🚀 Share Production Build Locally"
echo "================================="

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok is not installed. Please install it first:"
    echo "   curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null"
    echo "   echo 'deb https://ngrok-agent.s3.amazonaws.com buster main' | sudo tee /etc/apt/sources.list.d/ngrok.list"
    echo "   sudo apt update && sudo apt install ngrok"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building production version..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Check if build directory exists
if [ ! -d "build" ]; then
    echo "❌ Build directory not found!"
    exit 1
fi

# Check if Python is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python is not installed. Please install Python 3."
    exit 1
fi

# Check if port 8000 is available
if curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo "⚠️  Port 8000 is already in use. Using port 8001..."
    PORT=8001
else
    PORT=8000
fi

echo ""
echo "🌐 Starting production server on port $PORT..."
echo "   This serves the optimized production build"
echo ""

# Start Python HTTP server
cd build
$PYTHON_CMD -m http.server $PORT &
SERVER_PID=$!

# Wait a bit for the server to start
sleep 3

# Check if server started successfully
if ! curl -s http://localhost:$PORT > /dev/null 2>&1; then
    echo "❌ Failed to start server on port $PORT"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo "✅ Production server running on http://localhost:$PORT"
echo ""

# Start ngrok tunnel
echo "🌍 Creating public tunnel with ngrok..."
echo "   This will create a public URL that anyone can access"
echo ""

ngrok http $PORT

echo ""
echo "🎉 Your production frontend is now shared!"
echo ""
echo "📱 Share these URLs with your friends:"
echo "   - Local: http://localhost:$PORT"
echo "   - Public: (check the ngrok output above)"
echo ""
echo "💡 Benefits of production build:"
echo "   - Faster loading times"
echo "   - Optimized for performance"
echo "   - Smaller file sizes"
echo "   - Better for sharing with friends"
echo ""
echo "🛑 To stop sharing:"
echo "   - Press Ctrl+C to stop ngrok"
echo "   - The server will stop automatically" 