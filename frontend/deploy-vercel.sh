#!/bin/bash

# FHE Payroll Frontend - Vercel Deployment Script

echo "🚀 Deploying to Vercel..."
echo "=========================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if .env file exists and warn about environment variables
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found."
    echo "📝 Make sure to set environment variables in Vercel dashboard:"
    echo "   - REACT_APP_NETWORK=SEPOLIA"
    echo "   - REACT_APP_RPC_URL=https://sepolia.infura.io/v3/645b161c447c49d4bbed402076e9ad0b"
    echo "   - REACT_APP_CONTRACT_ADDRESS=0xf10574209A7c856887f672fAE3Eb3d5b34ED7C9c"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Deploying to Vercel..."
    echo ""
    echo "📋 Deployment options:"
    echo "1. Production deployment: vercel --prod"
    echo "2. Preview deployment: vercel"
    echo ""
    echo "🌐 After deployment, you'll get a URL like:"
    echo "   https://your-app.vercel.app"
    echo ""
    echo "📝 Remember to:"
    echo "   - Set environment variables in Vercel dashboard"
    echo "   - Test wallet connection on the live site"
    echo "   - Verify contract interactions work correctly"
    echo ""
    
    # Deploy to Vercel
    vercel --prod
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi 