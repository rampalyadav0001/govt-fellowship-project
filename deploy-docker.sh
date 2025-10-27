#!/bin/bash

# MGNREGA Performance Tracker - Docker Deployment Script
# This script helps deploy your Dockerized application to various platforms

echo "🐳 MGNREGA Performance Tracker - Docker Deployment"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t mgnrega-tracker .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully"
else
    echo "❌ Docker build failed"
    exit 1
fi

# Test the container locally (optional)
echo "🧪 Testing container locally..."
docker run -d -p 5000:5000 --name mgnrega-test \
    -e NODE_ENV=production \
    -e DATA_GOV_API_KEY=test-key \
    mgnrega-tracker

sleep 10

# Check if container is running
if docker ps | grep -q mgnrega-test; then
    echo "✅ Container is running locally"
    
    # Test health endpoint
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        echo "✅ Health check passed"
    else
        echo "⚠️  Health check failed"
    fi
    
    # Clean up test container
    docker stop mgnrega-test
    docker rm mgnrega-test
else
    echo "❌ Container failed to start"
    exit 1
fi

echo ""
echo "🎉 Docker build and test completed successfully!"
echo ""
echo "📋 Next steps for deployment:"
echo "1. Push your code to GitHub"
echo "2. Choose a deployment platform:"
echo "   - Railway: https://railway.app"
echo "   - Render: https://render.com"
echo "   - DigitalOcean: https://cloud.digitalocean.com/apps"
echo "   - Google Cloud Run: https://console.cloud.google.com"
echo "   - AWS App Runner: https://console.aws.amazon.com/apprunner"
echo ""
echo "3. Connect your GitHub repository"
echo "4. Configure environment variables"
echo "5. Deploy!"
echo ""
echo "🔧 Environment variables needed:"
echo "   NODE_ENV=production"
echo "   DATA_GOV_API_KEY=your-api-key-here"
echo ""
echo "🌐 Your app will be available at the platform's provided URL"
