#!/bin/bash

# Deploy script for Translation Administration System
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Starting deployment process..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure your environment variables."
    exit 1
fi

# Check if Docker is running
if ! docker ps >/dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

# Build the application
echo "📦 Building the application..."
npm run build

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t translation-admin:latest .

# Stop existing containers
echo "⏹️ Stopping existing containers..."
docker-compose down || true

# Start new containers
echo "▶️ Starting new containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo "🌐 Application is running at http://localhost:6300"
else
    echo "❌ Deployment failed!"
    echo "Check logs with: docker-compose logs"
    exit 1
fi

echo "🎉 Deployment completed successfully!