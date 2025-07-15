#!/bin/bash

# FHE Payroll Frontend - Production Deployment Script

echo "🚀 Starting production deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file from .env.example"
        echo "📝 Please update the .env file with your actual values before deploying."
    else
        echo "❌ Error: .env.example not found. Please create a .env file manually."
        exit 1
    fi
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
    echo "🎉 Your application is ready for deployment!"
    echo ""
    echo "📁 Build files are in the 'build' directory"
    echo ""
    echo "🚀 Deployment options:"
    echo "1. Vercel: npx vercel --prod"
    echo "2. Netlify: npx netlify deploy --dir=build --prod"
    echo "3. GitHub Pages: npm run deploy"
    echo "4. Firebase: firebase deploy"
    echo ""
    echo "📋 Before deploying, make sure to:"
    echo "   - Update .env with correct contract address"
    echo "   - Verify RPC URL is correct"
    echo "   - Test wallet connection on Sepolia"
    echo "   - Ensure contract is deployed to Sepolia"
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi 