#!/bin/bash

echo "🚀 Confidential Payroll Frontend Deployment"
echo "=========================================="

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Ask user which platform to deploy to
echo ""
echo "Choose deployment platform:"
echo "1) Vercel (Recommended - Free)"
echo "2) Netlify (Free)"
echo "3) GitHub Pages (Free)"
echo "4) Firebase Hosting (Free)"
echo "5) Just build (no deploy)"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "📦 Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        netlify deploy --dir=build --prod
        ;;
    3)
        echo "🚀 Deploying to GitHub Pages..."
        if ! command -v gh-pages &> /dev/null; then
            echo "📦 Installing gh-pages..."
            npm install --save-dev gh-pages
        fi
        npm run deploy
        ;;
    4)
        echo "🚀 Deploying to Firebase..."
        if ! command -v firebase &> /dev/null; then
            echo "📦 Installing Firebase CLI..."
            npm install -g firebase-tools
        fi
        firebase init hosting
        firebase deploy
        ;;
    5)
        echo "✅ Build completed! Files are in the 'build' directory."
        echo "You can manually upload the 'build' folder to any hosting service."
        ;;
    *)
        echo "❌ Invalid choice!"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment completed!"
echo "Share the URL with your friends!" 